'use client';

import { useMemo } from 'react';
import {
  Box,
  Container as ContainerIcon,
  Flame,
  Lock,
  Snowflake,
  Thermometer,
} from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, YAxis } from 'recharts';
import { Drawer } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import type { ContainerSlot, PortNode } from '@/types/supply-chain';
import { IMDG_META } from '@/lib/utils/container-meta';
import { buildTelemetryHistory } from '@/lib/seeds/telemetry';

interface ContainerDetailDrawerProps {
  slot: ContainerSlot | null;
  onClose: () => void;
  onRelocate: (slot: ContainerSlot) => void;
  ports: PortNode[];
}

export function ContainerDetailDrawer({ slot, onClose, onRelocate, ports }: ContainerDetailDrawerProps) {
  const hazard = slot ? IMDG_META[slot.hazardClass] : null;

  const reeferSeries = useMemo(() => {
    if (!slot || !slot.isReefer) return [];
    const seed =
      (slot.bay * 17 + slot.row * 7 + slot.tier * 3) + (slot.block.charCodeAt(0) || 65);
    return buildTelemetryHistory(slot.reeferSetTemp ?? 0, seed).map((point, index) => ({
      hour: index,
      temperature: point.temperatureC,
    }));
  }, [slot]);

  const tareWeight = slot?.isoType?.includes('20') ? 2.2 : 3.8;
  const grossWeight = slot?.weightGrossTon ?? 0;
  const payload = Math.max(0, grossWeight - tareWeight);

  return (
    <Drawer
      open={slot !== null}
      onClose={onClose}
      title={slot?.containerNumber ?? 'Empty Slot'}
      subtitle={slot ? `Block ${slot.block} · Bay ${slot.bay} · Row ${slot.row} · Tier ${slot.tier}` : undefined}
      icon={<ContainerIcon className="h-5 w-5 text-[#00F5FF]" />}
      accent={slot?.isReefer ? 'violet' : slot && slot.hazardClass !== 'none' ? 'crimson' : 'cyan'}
      width="lg"
      footer={
        slot && slot.status === 'occupied' ? (
          <button
            type="button"
            onClick={() => onRelocate(slot)}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/10 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF] hover:bg-[#00F5FF]/20"
          >
            <Box className="h-3.5 w-3.5" /> Relocate Container
          </button>
        ) : null
      }
    >
      {slot ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={slot.status === 'occupied' ? 'emerald' : slot.status === 'reserved' ? 'amber' : slot.status === 'inspecting' ? 'violet' : 'muted'}>
              {slot.status}
            </Badge>
            {slot.isoType ? <Badge tone="cyan">{slot.isoType}</Badge> : null}
            {slot.isReefer ? <Badge tone="violet"><Snowflake className="h-2.5 w-2.5" /> Reefer</Badge> : null}
            {slot.hazardClass !== 'none' ? (
              <Badge tone="crimson"><Flame className="h-2.5 w-2.5" /> IMDG {hazard?.short}</Badge>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Info label="ISO Container" value={slot.containerNumber ?? '—'} />
            <Info label="Cargo Category" value={slot.cargoCategory ?? '—'} />
            <Info label="Bolt Seal" value={slot.sealNumber ?? '—'} icon={<Lock className="h-3 w-3" />} />
            <Info label="Destination" value={slot.destinationPortCode ?? '—'} />
          </div>

          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              Weight Breakdown
            </p>
            <div className="space-y-1.5">
              <WeightRow label="Tare Weight" value={`${tareWeight.toFixed(1)} t`} percent={(tareWeight / Math.max(grossWeight, 1)) * 100} tone="#8B5CF6" />
              <WeightRow label="Gross Payload" value={`${payload.toFixed(1)} t`} percent={(payload / Math.max(grossWeight, 1)) * 100} tone="#00F5FF" />
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[#1E2C42] pt-2 font-mono text-[11px]">
              <span className="text-[#94A3B8]">Gross Weight</span>
              <span className="text-[#F1F5F9]">{grossWeight.toFixed(1)} t</span>
            </div>
          </div>

          {slot.hazardClass !== 'none' && hazard ? (
            <div className="rounded-lg border p-3" style={{ borderColor: `${hazard.color}55`, backgroundColor: `${hazard.color}11` }}>
              <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider" style={{ color: hazard.color }}>
                <Flame className="h-3.5 w-3.5" /> {hazard.label}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-[#94A3B8]">{hazard.description}</p>
              <ul className="mt-2 space-y-0.5 text-[10px] text-[#94A3B8]">
                <li>• Segregate from foodstuffs and Class 4 oxidizers</li>
                <li>• Fire watch standby at all times</li>
                <li>• Placard required on all four faces</li>
              </ul>
            </div>
          ) : null}

          {slot.isReefer ? (
            <div className="rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 p-3">
              <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8B5CF6]">
                <Snowflake className="h-3.5 w-3.5" /> Reefer Control
              </p>
              <div className="mb-2 flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  <Thermometer className="h-3 w-3" /> Target {(slot.reeferSetTemp ?? 0).toFixed(1)}°C
                </span>
                <span className="flex items-center gap-1 text-[#94A3B8]">
                  Actual <span className="font-mono text-[#8B5CF6]">{(slot.reeferActualTemp ?? 0).toFixed(1)}°C</span>
                </span>
              </div>
              <div className="h-20">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={reeferSeries} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                    <Line type="monotone" dataKey="temperature" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          <div className="rounded-lg border border-[#1E2C42] bg-[#0D111A]/60 p-2.5">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
              Slot Coordinates
            </p>
            <p className="font-mono text-[11px] text-[#F1F5F9]">
              BLOCK {slot.block} · BAY {slot.bay} · ROW {slot.row} · TIER {slot.tier}
            </p>
            <p className="mt-0.5 font-mono text-[9px] text-[#94A3B8]">
              Terminal: {ports[0]?.name ?? 'Aether Terminal'}
            </p>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2">
      <p className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
        {icon}
        {label}
      </p>
      <p className="font-mono text-[11px] text-[#F1F5F9]">{value}</p>
    </div>
  );
}

function WeightRow({ label, value, percent, tone }: { label: string; value: string; percent: number; tone: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between font-mono text-[9px]">
        <span className="text-[#94A3B8]">{label}</span>
        <span className="text-[#F1F5F9]">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#0D111A]">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, percent)}%`, backgroundColor: tone }} />
      </div>
    </div>
  );
}
