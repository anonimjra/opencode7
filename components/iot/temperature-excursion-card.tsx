'use client';

import { useMemo } from 'react';
import { FlaskConical, ShieldAlert, ShieldCheck, Thermometer } from 'lucide-react';
import type { SensorTelemetryPoint } from '@/types/supply-chain';
import {
  classifyMkt,
  computeMktFromTelemetry,
  estimateRemainingShelfLife,
} from '@/lib/utils/telematics';
import { Badge } from '@/components/ui/badge';

interface TemperatureExcursionCardProps {
  history: SensorTelemetryPoint[];
  targetTempC: number;
  cargoType: string;
}

export function TemperatureExcursionCard({ history, targetTempC, cargoType }: TemperatureExcursionCardProps) {
  const analysis = useMemo(() => {
    const mkt = computeMktFromTelemetry(history);
    const severity = classifyMkt(mkt);
    const shelfLife = estimateRemainingShelfLife(mkt);
    const excursions = history.filter((point) => point.isExcursion).length;
    const maxShock = history.reduce((max, point) => Math.max(max, point.shockG), 0);
    const avgHumidity =
      history.length > 0
        ? history.reduce((sum, point) => sum + point.humidityPercent, 0) / history.length
        : 0;
    return { mkt, severity, shelfLife, excursions, maxShock, avgHumidity };
  }, [history]);

  const severityMeta = {
    safe: { tone: '#10B981', label: 'Within Specification', icon: <ShieldCheck className="h-4 w-4" /> },
    watch: { tone: '#F59E0B', label: 'Monitor Closely', icon: <Thermometer className="h-4 w-4" /> },
    excursion: { tone: '#F59E0B', label: 'Excursion Detected', icon: <ShieldAlert className="h-4 w-4" /> },
    critical: { tone: '#EF4444', label: 'Critical Excursion', icon: <ShieldAlert className="h-4 w-4" /> },
  }[analysis.severity];

  const requiresLab = analysis.mkt !== null && analysis.mkt > 8;

  return (
    <div className="space-y-3">
      <div
        className="rounded-lg border p-3"
        style={{ borderColor: `${severityMeta.tone}55`, backgroundColor: `${severityMeta.tone}11` }}
      >
        <div className="flex items-center gap-2" style={{ color: severityMeta.tone }}>
          {severityMeta.icon}
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider">
            {severityMeta.label}
          </span>
          <Badge tone={analysis.severity === 'safe' ? 'emerald' : analysis.severity === 'critical' ? 'crimson' : 'amber'}>
            {cargoType}
          </Badge>
        </div>
        <div className="mt-2 flex items-end gap-2">
          <span className="font-mono text-3xl font-bold" style={{ color: severityMeta.tone }}>
            {analysis.mkt !== null ? analysis.mkt.toFixed(1) : '—'}
          </span>
          <span className="mb-1 font-mono text-xs text-[#94A3B8]">°C MKT</span>
        </div>
        <p className="text-[10px] text-[#94A3B8]">
          Mean Kinetic Temperature (Arrhenius, ΔH = 83.144 kJ/mol) · target {targetTempC.toFixed(1)}°C
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Metric label="Shelf-Life Remaining" value={`${analysis.shelfLife}%`} tone={analysis.shelfLife > 70 ? '#10B981' : analysis.shelfLife > 40 ? '#F59E0B' : '#EF4444'} />
        <Metric label="Excursion Points" value={`${analysis.excursions}`} tone={analysis.excursions > 0 ? '#EF4444' : '#10B981'} />
        <Metric label="Peak Shock" value={`${analysis.maxShock.toFixed(1)} G`} tone={analysis.maxShock > 3 ? '#F59E0B' : '#10B981'} />
        <Metric label="Avg Humidity" value={`${analysis.avgHumidity.toFixed(0)}%`} tone="#8B5CF6" />
      </div>

      {requiresLab ? (
        <div className="flex items-start gap-2 rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-2.5">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-[#EF4444]" />
          <p className="text-[11px] leading-snug text-[#EF4444]">
            MKT exceeds the 8°C pharmaceutical safety threshold. Recommend quarantine-lab inspection and
            potency assay before release to market.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-lg border border-[#10B981]/40 bg-[#10B981]/10 p-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
          <p className="text-[11px] leading-snug text-[#10B981]">
            MKT within WHO/FDA acceptable range. No quarantine-lab inspection required at this time.
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2">
      <p className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">{label}</p>
      <p className="font-mono text-sm" style={{ color: tone }}>
        {value}
      </p>
    </div>
  );
}
