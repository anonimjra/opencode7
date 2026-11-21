'use client';

import { useMemo } from 'react';
import { Battery, Droplets, Snowflake, Thermometer, Zap } from 'lucide-react';
import { useSupplyChainStore, type ReeferTelemetryRecord } from '@/lib/store/use-supply-chain-store';

interface TelemetryOverviewProps {
  selectedContainer: string | null;
  onSelect: (containerNumber: string) => void;
}

function stability(record: ReeferTelemetryRecord): { tone: string; label: string } {
  const last = record.history[record.history.length - 1];
  if (!last) return { tone: '#94A3B8', label: 'No Data' };
  const deviation = Math.abs(last.temperatureC - record.targetTempC);
  const excursions = record.history.filter((point) => point.isExcursion).length;
  if (excursions > 0 || deviation > 5) return { tone: '#EF4444', label: 'Anomaly' };
  if (deviation > 2) return { tone: '#F59E0B', label: 'Unstable' };
  return { tone: '#10B981', label: 'Stable' };
}

export function TelemetryOverview({ selectedContainer, onSelect }: TelemetryOverviewProps) {
  const reeferTelemetry = useSupplyChainStore((state) => state.reeferTelemetry);

  const cards = useMemo(() => {
    return reeferTelemetry.map((record) => {
      const last = record.history[record.history.length - 1];
      const stab = stability(record);
      const excursions = record.history.filter((point) => point.isExcursion).length;
      return { record, last, stab, excursions };
    });
  }, [reeferTelemetry]);

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {cards.map(({ record, last, stab, excursions }) => {
        const isActive = record.containerNumber === selectedContainer;
        return (
          <button
            key={record.containerNumber}
            type="button"
            onClick={() => onSelect(record.containerNumber)}
            className={`rounded-lg border p-3 text-left transition ${
              isActive
                ? 'border-[#00F5FF]/50 bg-[#00F5FF]/5 glow-cyan'
                : 'border-[#1E2C42] bg-[#0D111A]/70 hover:border-[#00F5FF]/30'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Snowflake className="h-4 w-4 text-[#8B5CF6]" />
                <div>
                  <p className="font-mono text-[11px] text-[#F1F5F9]">{record.containerNumber}</p>
                  <p className="text-[9px] uppercase tracking-wide text-[#94A3B8]">{record.cargoType}</p>
                </div>
              </div>
              <span className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase" style={{ color: stab.tone, backgroundColor: `${stab.tone}1a` }}>
                {stab.label}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-1.5">
              <div className="rounded bg-[#161F30]/60 p-1.5">
                <p className="flex items-center gap-1 font-mono text-[8px] uppercase text-[#94A3B8]">
                  <Thermometer className="h-2.5 w-2.5" /> Temp
                </p>
                <p className="font-mono text-[11px]" style={{ color: stab.tone }}>
                  {last?.temperatureC.toFixed(1) ?? '—'}°C
                </p>
                <p className="font-mono text-[8px] text-[#94A3B8]">tgt {record.targetTempC}°C</p>
              </div>
              <div className="rounded bg-[#161F30]/60 p-1.5">
                <p className="flex items-center gap-1 font-mono text-[8px] uppercase text-[#94A3B8]">
                  <Droplets className="h-2.5 w-2.5" /> Humid
                </p>
                <p className="font-mono text-[11px] text-[#8B5CF6]">{last?.humidityPercent ?? '—'}%</p>
                <p className="font-mono text-[8px] text-[#94A3B8]">{record.history.length} pts</p>
              </div>
              <div className="rounded bg-[#161F30]/60 p-1.5">
                <p className="flex items-center gap-1 font-mono text-[8px] uppercase text-[#94A3B8]">
                  <Battery className="h-2.5 w-2.5" /> Batt
                </p>
                <p className="font-mono text-[11px] text-[#10B981]">{last?.batteryPercent ?? '—'}%</p>
                <p className="flex items-center gap-0.5 font-mono text-[8px] text-[#94A3B8]">
                  <Zap className="h-2 w-2" /> {excursions} exc
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
