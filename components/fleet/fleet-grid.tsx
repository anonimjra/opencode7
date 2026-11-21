'use client';

import { useMemo, useState } from 'react';
import { Activity, Fuel, Gauge, Plane, Ship, Truck } from 'lucide-react';
import { Badge, StatusDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { VesselDetailModal } from './vessel-detail-modal';
import { formatKnots, formatKmh, formatNumber, formatTeuCompact } from '@/lib/utils/formatters';
import type { TransportMode, Vessel, VesselStatus } from '@/types/supply-chain';

type FleetTab = 'all' | 'ocean' | 'air' | 'ground';

const MODE_ICON: Record<TransportMode, React.ReactNode> = {
  ocean: <Ship className="h-4 w-4" />,
  air: <Plane className="h-4 w-4" />,
  road: <Truck className="h-4 w-4" />,
  rail: <Truck className="h-4 w-4" />,
};

const STATUS_TONE: Record<VesselStatus, 'emerald' | 'cyan' | 'amber' | 'crimson' | 'violet'> = {
  underway: 'emerald',
  moored: 'cyan',
  anchored: 'amber',
  maintenance: 'violet',
  diverted: 'crimson',
};

const TABS: { key: FleetTab; label: string }[] = [
  { key: 'all', label: 'All Assets' },
  { key: 'ocean', label: 'Ocean Vessels' },
  { key: 'air', label: 'Air Cargo' },
  { key: 'ground', label: 'Ground Fleet' },
];

export function FleetGrid() {
  const vessels = useSupplyChainStore((state) => state.vessels);
  const ports = useSupplyChainStore((state) => state.ports);
  const [tab, setTab] = useState<FleetTab>('all');
  const [activeVessel, setActiveVessel] = useState<Vessel | null>(null);

  const portCode = useMemo(() => {
    const map: Record<string, string> = {};
    ports.forEach((port) => {
      map[port.id] = port.code;
    });
    return map;
  }, [ports]);

  const filtered = useMemo(() => {
    return vessels.filter((vessel) => {
      if (tab === 'all') return true;
      if (tab === 'ocean') return vessel.mode === 'ocean';
      if (tab === 'air') return vessel.mode === 'air';
      return vessel.mode === 'road' || vessel.mode === 'rail';
    });
  }, [vessels, tab]);

  const originPort = activeVessel
    ? ports.find((port) => port.id === activeVessel.originPortId)
    : undefined;
  const destPort = activeVessel
    ? ports.find((port) => port.id === activeVessel.destPortId)
    : undefined;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-1.5">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
              tab === item.key
                ? 'border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF] glow-cyan'
                : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
          {filtered.length} assets
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((vessel) => {
          const loadPercent =
            vessel.capacityTEU > 0 ? (vessel.currentTEU / vessel.capacityTEU) * 100 : 0;
          return (
            <div
              key={vessel.id}
              className="group relative overflow-hidden rounded-xl border border-[#1E2C42] bg-[#0D111A]/92 p-3.5 transition hover:border-[#00F5FF]/40 hover:shadow-[0_0_20px_rgba(0,245,255,0.12)]"
            >
              <div className="radar-sweep pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#00F5FF]/10 opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF]">
                    {MODE_ICON[vessel.mode]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#F1F5F9]">{vessel.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
                      {vessel.callsign} · {vessel.mode}
                    </p>
                  </div>
                </div>
                <Badge tone={STATUS_TONE[vessel.status]}>
                  <StatusDot tone={STATUS_TONE[vessel.status]} pulse={vessel.status === 'underway'} />
                  {vessel.status}
                </Badge>
              </div>

              <div className="mt-2.5 flex items-center gap-1 font-mono text-[10px] text-[#94A3B8]">
                <span className="text-[#10B981]">{portCode[vessel.originPortId] ?? '—'}</span>
                <span className="text-[#1E2C42]">→</span>
                <span className="text-[#00F5FF]">{portCode[vessel.destPortId] ?? '—'}</span>
              </div>

              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <Metric icon={<Gauge className="h-3 w-3" />} label="Speed" value={formatKnots(vessel.speedKnots)} sub={formatKmh(vessel.speedKnots)} />
                <Metric icon={<Fuel className="h-3 w-3" />} label="Fuel" value={`${formatNumber(vessel.fuelConsumptionLPerHr)} L/h`} sub="consumption" />
              </div>

              <div className="mt-2.5">
                <div className="mb-1 flex items-center justify-between font-mono text-[9px] uppercase">
                  <span className="text-[#94A3B8]">Cargo Load</span>
                  <span className="text-[#F1F5F9]">
                    {formatTeuCompact(vessel.currentTEU)} / {formatTeuCompact(vessel.capacityTEU)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#161F30]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] to-[#10B981]"
                    style={{ width: `${Math.min(100, loadPercent)}%` }}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setActiveVessel(vessel)}
              >
                <Activity className="h-3.5 w-3.5" /> Open Full Telemetry
              </Button>
            </div>
          );
        })}
      </div>

      <VesselDetailModal
        vessel={activeVessel}
        originPort={originPort}
        destPort={destPort}
        onClose={() => setActiveVessel(null)}
      />
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-1.5">
      <div className="flex items-center gap-1 text-[#00F5FF]">
        {icon}
        <span className="font-mono text-[8px] uppercase text-[#94A3B8]">{label}</span>
      </div>
      <p className="font-mono text-[11px] text-[#F1F5F9]">{value}</p>
      <p className="text-[8px] text-[#94A3B8]">{sub}</p>
    </div>
  );
}
