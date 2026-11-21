'use client';

import { useMemo, useState } from 'react';
import { Boxes, Flame, Snowflake } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import type { ContainerSlot } from '@/types/supply-chain';
import { IMDG_META, blockColorPalette } from '@/lib/utils/container-meta';

const ACTIVE_BLOCKS = ['A', 'B', 'C', 'D'] as const;

const BLOCK_META: Record<string, { label: string; tone: string; purpose: string }> = {
  A: { label: 'Block A', tone: '#00F5FF', purpose: 'General Export' },
  B: { label: 'Block B', tone: '#10B981', purpose: 'General Import' },
  C: { label: 'Block C', tone: '#EF4444', purpose: 'Dangerous Goods (IMDG)' },
  D: { label: 'Block D', tone: '#8B5CF6', purpose: 'Cold-Chain Reefer' },
};

interface YardGridProps {
  onSelectSlot: (slot: ContainerSlot) => void;
  searchQuery?: string;
  filterHazard?: boolean;
  filterReefer?: boolean;
}

export function YardGrid({ onSelectSlot, searchQuery = '', filterHazard = false, filterReefer = false }: YardGridProps) {
  const yardSlots = useSupplyChainStore((state) => state.yardSlots);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredSlots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return yardSlots.map((slot) => {
      const matchesSearch =
        !query ||
        (slot.containerNumber?.toLowerCase().includes(query) ?? false) ||
        (slot.cargoCategory?.toLowerCase().includes(query) ?? false) ||
        (slot.destinationPortCode?.toLowerCase().includes(query) ?? false);
      return { slot, dimmed: !matchesSearch };
    });
  }, [yardSlots, searchQuery]);

  const byBlock = useMemo(() => {
    const grouped: Record<string, { slot: ContainerSlot; dimmed: boolean }[]> = { A: [], B: [], C: [], D: [] };
    filteredSlots.forEach((entry) => {
      if (grouped[entry.slot.block]) {
        grouped[entry.slot.block].push(entry);
      }
    });
    return grouped;
  }, [filteredSlots]);

  const stats = useMemo(() => {
    const occupied = yardSlots.filter((slot) => slot.status === 'occupied').length;
    const reefer = yardSlots.filter((slot) => slot.isReefer && slot.status === 'occupied').length;
    const hazard = yardSlots.filter((slot) => slot.hazardClass !== 'none' && slot.status === 'occupied').length;
    return { occupied, total: yardSlots.length, reefer, hazard };
  }, [yardSlots]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
        <span className="flex items-center gap-1"><Boxes className="h-3 w-3 text-[#00F5FF]" /> {stats.occupied}/{stats.total} occupied</span>
        <span className="flex items-center gap-1"><Snowflake className="h-3 w-3 text-[#8B5CF6]" /> {stats.reefer} reefer</span>
        <span className="flex items-center gap-1"><Flame className="h-3 w-3 text-[#EF4444]" /> {stats.hazard} hazard</span>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {ACTIVE_BLOCKS.map((block) => {
          const meta = BLOCK_META[block];
          const entries = byBlock[block].sort((a, b) => {
            if (a.slot.bay !== b.slot.bay) return a.slot.bay - b.slot.bay;
            if (a.slot.row !== b.slot.row) return a.slot.row - b.slot.row;
            return a.slot.tier - b.slot.tier;
          });
          // Group by bay -> row -> tiers stacked vertically
          const baySet = Array.from(new Set(entries.map((entry) => entry.slot.bay))).sort((a, b) => a - b);
          return (
            <div key={block} className="rounded-lg border border-[#1E2C42] bg-[#0D111A]/70 p-2.5" style={{ borderColor: `${meta.tone}33` }}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.tone }} />
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F1F5F9]">{meta.label}</span>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-wide text-[#94A3B8]">{meta.purpose}</span>
              </div>

              <div className="hide-scrollbar overflow-x-auto">
                <div className="flex gap-2">
                  {baySet.map((bay) => {
                    const bayEntries = entries.filter((entry) => entry.slot.bay === bay);
                    const rowSet = Array.from(new Set(bayEntries.map((entry) => entry.slot.row))).sort((a, b) => a - b);
                    return (
                      <div key={bay} className="flex flex-col gap-1">
                        <p className="text-center font-mono text-[8px] uppercase text-[#94A3B8]">B{bay}</p>
                        <div className="flex gap-1">
                          {rowSet.map((row) => {
                            const tiers = bayEntries
                              .filter((entry) => entry.slot.row === row)
                              .sort((a, b) => b.slot.tier - a.slot.tier);
                            return (
                              <div key={row} className="flex flex-col gap-0.5">
                                {tiers.map(({ slot, dimmed }) => (
                                  <SlotCell
                                    key={slot.id}
                                    slot={slot}
                                    dimmed={dimmed}
                                    hovered={hoveredId === slot.id}
                                    hiddenByFilter={
                                      (filterHazard && slot.hazardClass === 'none') ||
                                      (filterReefer && !slot.isReefer)
                                    }
                                    onHover={setHoveredId}
                                    onSelect={onSelectSlot}
                                  />
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SlotCell({
  slot,
  dimmed,
  hovered,
  hiddenByFilter,
  onHover,
  onSelect,
}: {
  slot: ContainerSlot;
  dimmed: boolean;
  hovered: boolean;
  hiddenByFilter: boolean;
  onHover: (id: string | null) => void;
  onSelect: (slot: ContainerSlot) => void;
}) {
  const isOccupied = slot.status === 'occupied';
  const color = slot.isReefer
    ? '#8B5CF6'
    : slot.hazardClass !== 'none'
      ? IMDG_META[slot.hazardClass].color
      : isOccupied
        ? blockColorPalette(slot.destinationPortCode)
        : '#1E2C42';

  return (
    <button
      type="button"
      onClick={() => onSelect(slot)}
      onMouseEnter={() => onHover(slot.id)}
      onMouseLeave={() => onHover(null)}
      title={
        isOccupied
          ? `${slot.containerNumber ?? ''} · ${slot.isoType ?? ''} · ${slot.cargoCategory ?? ''}`
          : `Empty · ${slot.status}`
      }
      className={`relative flex h-6 w-6 items-center justify-center rounded-sm border text-[7px] transition ${
        hiddenByFilter ? 'opacity-15' : dimmed ? 'opacity-30' : 'opacity-100'
      } ${hovered ? 'scale-110 z-10' : ''}`}
      style={{
        backgroundColor: isOccupied ? `${color}${slot.status === 'occupied' ? 'cc' : '55'}` : 'transparent',
        borderColor: isOccupied || slot.status !== 'empty' ? color : '#1E2C42',
        boxShadow: hovered ? `0 0 8px ${color}` : 'none',
      }}
    >
      {slot.isReefer && isOccupied ? (
        <Snowflake className="h-2.5 w-2.5" style={{ color: '#0D111A' }} />
      ) : slot.hazardClass !== 'none' && isOccupied ? (
        <Flame className="h-2.5 w-2.5" style={{ color: '#0D111A' }} />
      ) : slot.status === 'reserved' ? (
        <span className="text-[6px] font-bold" style={{ color }}>R</span>
      ) : slot.status === 'inspecting' ? (
        <span className="text-[6px] font-bold" style={{ color }}>I</span>
      ) : null}
      {hovered ? (
        <span className="absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-[#1E2C42] bg-[#0D111A] px-1.5 py-0.5 font-mono text-[8px] text-[#F1F5F9]">
          {slot.id} {isOccupied ? slot.containerNumber : slot.status}
        </span>
      ) : null}
    </button>
  );
}
