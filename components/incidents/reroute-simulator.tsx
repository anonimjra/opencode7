'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Navigation, ShieldAlert, ShieldCheck, Clock, Fuel } from 'lucide-react';
import { bunkerFuelCostUsd, bunkerFuelConsumptionTonnes, co2EmissionsTonnes } from '@/lib/utils/telematics';
import { formatUsd, formatNumber } from '@/lib/utils/formatters';

interface RouteComparison {
  id: 'suez' | 'cape';
  name: string;
  distanceNm: number;
  transitDays: number;
  canalTollUsd: number;
  fuelTonnes: number;
  fuelCostUsd: number;
  co2Tonnes: number;
  securityRisk: 'High' | 'Low' | 'Zero';
  color: string;
}

export function RerouteSimulator() {
  const [speedKnots, setSpeedKnots] = useState(15);
  const [fuelPrice, setFuelPrice] = useState(650);

  const routes = useMemo<RouteComparison[]>(() => {
    const suezDistance = 8400;
    const capeDistance = 11800;

    const buildRoute = (
      id: 'suez' | 'cape',
      name: string,
      distanceNm: number,
      canalTollUsd: number,
      securityRisk: RouteComparison['securityRisk'],
      color: string,
    ): RouteComparison => {
      const transitDays = distanceNm / (speedKnots * 24);
      const fuelTonnes = bunkerFuelConsumptionTonnes(distanceNm, speedKnots);
      const fuelCostUsd = bunkerFuelCostUsd(fuelTonnes, fuelPrice);
      return {
        id,
        name,
        distanceNm,
        transitDays: Math.round(transitDays * 10) / 10,
        canalTollUsd,
        fuelTonnes: Math.round(fuelTonnes),
        fuelCostUsd,
        co2Tonnes: Math.round(co2EmissionsTonnes(fuelTonnes)),
        securityRisk,
        color,
      };
    };

    return [
      buildRoute('suez', 'Via Suez Canal', suezDistance, 400_000, 'High', '#F59E0B'),
      buildRoute('cape', 'Via Cape of Good Hope', capeDistance, 0, 'Zero', '#10B981'),
    ];
  }, [speedKnots, fuelPrice]);

  const [suez, cape] = routes;

  const chartData = [
    { metric: 'Distance (nm)', Suez: suez.distanceNm, Cape: cape.distanceNm },
    { metric: 'Transit (days)', Suez: Math.round(suez.transitDays), Cape: Math.round(cape.transitDays) },
    { metric: 'Fuel (t)', Suez: suez.fuelTonnes, Cape: cape.fuelTonnes },
    { metric: 'CO₂ (t)', Suez: suez.co2Tonnes, Cape: cape.co2Tonnes },
    { metric: 'Cost ($K)', Suez: Math.round((suez.fuelCostUsd + suez.canalTollUsd) / 1000), Cape: Math.round((cape.fuelCostUsd + cape.canalTollUsd) / 1000) },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
            <Navigation className="h-2.5 w-2.5" /> Vessel Speed ({speedKnots} kn)
          </span>
          <input
            type="range"
            min={10}
            max={22}
            value={speedKnots}
            onChange={(event) => setSpeedKnots(Number(event.target.value))}
            className="w-full accent-[#00F5FF]"
          />
        </label>
        <label className="block">
          <span className="mb-1 flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
            <Fuel className="h-2.5 w-2.5" /> Fuel ${fuelPrice}/t
          </span>
          <input
            type="range"
            min={450}
            max={900}
            step={10}
            value={fuelPrice}
            onChange={(event) => setFuelPrice(Number(event.target.value))}
            className="w-full accent-[#F59E0B]"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {routes.map((route) => (
          <div
            key={route.id}
            className="rounded-lg border p-2.5"
            style={{ borderColor: `${route.color}55`, backgroundColor: `${route.color}0d` }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase" style={{ color: route.color }}>
                {route.name}
              </span>
              {route.securityRisk === 'Zero' ? (
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              ) : (
                <ShieldAlert className="h-3.5 w-3.5 text-[#F59E0B]" />
              )}
            </div>
            <div className="mt-1.5 space-y-0.5 font-mono text-[9px]">
              <Row label="Distance" value={`${formatNumber(route.distanceNm)} nm`} />
              <Row label="Transit" value={`${route.transitDays} days`} />
              <Row label="Canal Toll" value={formatUsd(route.canalTollUsd)} />
              <Row label="Bunker Fuel" value={`${formatNumber(route.fuelTonnes)} t`} />
              <Row label="Fuel Cost" value={formatUsd(route.fuelCostUsd)} />
              <Row label="CO₂" value={`${formatNumber(route.co2Tonnes)} t`} />
              <Row label="Security" value={route.securityRisk} highlight={route.securityRisk === 'Zero' ? '#10B981' : '#EF4444'} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-2.5">
        <Delta icon={<Navigation className="h-3 w-3" />} label="Δ Distance" value={`+${formatNumber(cape.distanceNm - suez.distanceNm)} nm`} />
        <Delta icon={<Clock className="h-3 w-3" />} label="Δ Transit" value={`+${(cape.transitDays - suez.transitDays).toFixed(1)} d`} />
        <Delta icon={<Fuel className="h-3 w-3" />} label="Δ Fuel Cost" value={formatUsd(cape.fuelCostUsd - suez.fuelCostUsd)} />
      </div>

      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2C42" opacity={0.5} vertical={false} />
            <XAxis dataKey="metric" tick={{ fill: '#94A3B8', fontSize: 8, fontFamily: 'monospace' }} axisLine={{ stroke: '#1E2C42' }} tickLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 8, fontFamily: 'monospace' }} axisLine={{ stroke: '#1E2C42' }} tickLine={false} width={36} />
            <Tooltip
              cursor={{ fill: '#00F5FF10' }}
              contentStyle={{ backgroundColor: '#0D111A', border: '1px solid #00F5FF66', borderRadius: 8, fontSize: 10, fontFamily: 'monospace' }}
              labelStyle={{ color: '#94A3B8' }}
            />
            <Legend wrapperStyle={{ fontSize: 9, fontFamily: 'monospace' }} />
            <Bar dataKey="Suez" fill="#F59E0B" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Cape" fill="#10B981" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#94A3B8]">{label}</span>
      <span style={{ color: highlight ?? '#F1F5F9' }}>{value}</span>
    </div>
  );
}

function Delta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="text-center">
      <span className="flex items-center justify-center gap-1 font-mono text-[8px] uppercase text-[#94A3B8]">
        {icon} {label}
      </span>
      <p className="font-mono text-[11px] text-[#F59E0B]">{value}</p>
    </div>
  );
}
