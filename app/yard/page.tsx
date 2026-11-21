'use client';

import { useState } from 'react';
import { Boxes, Search, Snowflake, Flame, Construction as Crane } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { StatusDot } from '@/components/ui/badge';
import { YardGrid } from '@/components/yard/yard-grid';
import { ContainerDetailDrawer } from '@/components/yard/container-detail-drawer';
import { ContainerRelocateModal } from '@/components/yard/container-relocate-modal';
import { BerthTimeline } from '@/components/yard/berth-timeline';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import type { ContainerSlot } from '@/types/supply-chain';

export default function YardPage() {
  const ports = useSupplyChainStore((state) => state.ports);
  const vessels = useSupplyChainStore((state) => state.vessels);

  const [selectedSlot, setSelectedSlot] = useState<ContainerSlot | null>(null);
  const [relocateSlot, setRelocateSlot] = useState<ContainerSlot | null>(null);
  const [search, setSearch] = useState('');
  const [filterHazard, setFilterHazard] = useState(false);
  const [filterReefer, setFilterReefer] = useState(false);

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Terminal Yard 2D
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="emerald" />
              Bay / Row / Tier slotting planner · 288 slots
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md border border-[#1E2C42] bg-[#0D111A] px-2">
            <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search container / port…"
              className="h-8 w-44 bg-transparent font-mono text-[11px] text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterHazard((value) => !value)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
              filterHazard ? 'border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444]' : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Flame className="h-3 w-3" /> IMDG
          </button>
          <button
            type="button"
            onClick={() => setFilterReefer((value) => !value)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider transition ${
              filterReefer ? 'border-[#8B5CF6]/50 bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Snowflake className="h-3 w-3" /> Reefer
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Container Yard Matrix"
          subtitle="Click any slot to inspect"
          icon={<Boxes className="h-4 w-4" />}
          className="xl:col-span-2"
        >
          <YardGrid
            onSelectSlot={setSelectedSlot}
            searchQuery={search}
            filterHazard={filterHazard}
            filterReefer={filterReefer}
          />
        </Panel>

        <Panel
          title="STS Crane &amp; Berth Timeline"
          subtitle="Quayside operations schedule"
          icon={<Crane className="h-4 w-4" />}
        >
          <BerthTimeline vessels={vessels} />
        </Panel>
      </div>

      <ContainerDetailDrawer
        slot={selectedSlot}
        ports={ports}
        onClose={() => setSelectedSlot(null)}
        onRelocate={(slot) => {
          setRelocateSlot(slot);
        }}
      />
      <ContainerRelocateModal
        open={relocateSlot !== null}
        sourceSlot={relocateSlot}
        onClose={() => {
          setRelocateSlot(null);
          setSelectedSlot(null);
        }}
      />
    </div>
  );
}
