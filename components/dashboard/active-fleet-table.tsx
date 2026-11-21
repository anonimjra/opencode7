'use client';

import { useMemo, useState } from 'react';
import { Plane, Ship, Truck } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { Badge, StatusDot } from '@/components/ui/badge';
import { formatHeading, formatKnots } from '@/lib/utils/formatters';
import type { TransportMode, VesselStatus } from '@/types/supply-chain';

type ModeFilter = 'all' | 'ocean' | 'air' | 'road';

const MODE_ICON: Record<TransportMode, React.ReactNode> = {
  ocean: <Ship className="h-3.5 w-3.5" />,
  air: <Plane className="h-3.5 w-3.5" />,
  road: <Truck className="h-3.5 w-3.5" />,
  rail: <Truck className="h-3.5 w-3.5" />,
};

const STATUS_TONE: Record<VesselStatus, 'emerald' | 'amber' | 'crimson' | 'cyan' | 'violet'> = {
  underway: 'emerald',
  moored: 'cyan',
  anchored: 'amber',
  maintenance: 'violet',
  diverted: 'crimson',
};

export function ActiveFleetTable() {
  const vessels = useSupplyChainStore((state) => state.vessels);
  const ports = useSupplyChainStore((state) => state.ports);
  const selectVessel = useSupplyChainStore((state) => state.selectVessel);
  const selectedVesselId = useSupplyChainStore((state) => state.selectedVesselId);
  const [mode, setMode] = useState<ModeFilter>('all');

  const portCodeById = useMemo(() => {
    const map: Record<string, string> = {};
    ports.forEach((port) => {
      map[port.id] = port.code;
    });
    return map;
  }, [ports]);

  const filtered = useMemo(() => {
    return vessels.filter((vessel) => {
      if (mode === 'all') return true;
      if (mode === 'ocean') return vessel.mode === 'ocean';
      if (mode === 'air') return vessel.mode === 'air';
      return vessel.mode === 'road' || vessel.mode === 'rail';
    });
  }, [vessels, mode]);

  const tabs: { key: ModeFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'ocean', label: 'Ocean' },
    { key: 'air', label: 'Air' },
    { key: 'road', label: 'Ground' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key)}
            className={`rounded border px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
              mode === tab.key
                ? 'border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]'
                : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[10px] text-[#94A3B8]">
          {filtered.length} units
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#1E2C42] font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
              <th className="px-2 py-1.5">Fleet</th>
              <th className="px-2 py-1.5">Route</th>
              <th className="px-2 py-1.5 text-right">Speed</th>
              <th className="px-2 py-1.5 text-right">Hdg</th>
              <th className="px-2 py-1.5">Progress</th>
              <th className="px-2 py-1.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vessel) => {
              const isSelected = vessel.id === selectedVesselId;
              return (
                <tr
                  key={vessel.id}
                  onClick={() => selectVessel(vessel.id)}
                  className={`cursor-pointer border-b border-[#1E2C42]/50 transition ${
                    isSelected ? 'bg-[#00F5FF]/10' : 'hover:bg-[#161F30]/60'
                  }`}
                >
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#00F5FF]">{MODE_ICON[vessel.mode]}</span>
                      <div>
                        <p className="text-[11px] font-medium text-[#F1F5F9]">{vessel.name}</p>
                        <p className="font-mono text-[9px] text-[#94A3B8]">{vessel.callsign}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <span className="font-mono text-[10px] text-[#94A3B8]">
                      {portCodeById[vessel.originPortId] ?? '—'}
                      <span className="mx-1 text-[#1E2C42]">→</span>
                      <span className="text-[#F1F5F9]">{portCodeById[vessel.destPortId] ?? '—'}</span>
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-[10px] text-[#F1F5F9]">
                    {formatKnots(vessel.speedKnots)}
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-[10px] text-[#94A3B8]">
                    {formatHeading(vessel.headingDegrees)}
                  </td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-16 overflow-hidden rounded-full bg-[#161F30]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] to-[#10B981]"
                          style={{ width: `${vessel.routeProgressPercent}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] text-[#94A3B8]">
                        {vessel.routeProgressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <Badge tone={STATUS_TONE[vessel.status]}>
                      <StatusDot tone={STATUS_TONE[vessel.status]} pulse={vessel.status === 'underway'} />
                      {vessel.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
