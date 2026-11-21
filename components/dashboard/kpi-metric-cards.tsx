'use client';

import { useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import {
  AlertOctagon,
  DollarSign,
  Ship,
  Timer,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { formatCompactUsd, formatPercent, formatTeuCompact } from '@/lib/utils/formatters';

interface SparkPoint {
  value: number;
}

function Sparkline({ data, color }: { data: SparkPoint[]; color: string }) {
  const gradientId = useMemo(
    () => `spark-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 7)}`,
    [color],
  );
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  accent: string;
  trend?: { value: string; positive: boolean };
  sparkData: SparkPoint[];
  danger?: boolean;
}

function KpiCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  trend,
  sparkData,
  danger = false,
}: KpiCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-[#1E2C42] bg-[#0D111A]/92 p-4 transition hover:border-[#00F5FF]/40 ${danger ? 'glow-crimson' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#94A3B8]">
            {title}
          </p>
          <p className="mt-1.5 font-mono text-2xl font-semibold text-[#F1F5F9]">{value}</p>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accent} ${danger ? 'blink-critical' : ''}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>
        {trend ? (
          <span
            className={`flex items-center gap-1 font-mono text-[10px] ${trend.positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}
          >
            {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        ) : null}
      </div>
      <div className="mt-1">
        <Sparkline data={sparkData} color={danger ? '#EF4444' : '#00F5FF'} />
      </div>
    </div>
  );
}

export function KpiMetricCards() {
  const vessels = useSupplyChainStore((state) => state.vessels);
  const shipments = useSupplyChainStore((state) => state.shipments);
  const alerts = useSupplyChainStore((state) => state.alerts);
  const incidents = useSupplyChainStore((state) => state.incidents);

  const metrics = useMemo(() => {
    const activeVessels = vessels.filter(
      (vessel) => vessel.status === 'underway' || vessel.status === 'diverted',
    );
    const totalCapacity = vessels.reduce((sum, vessel) => sum + vessel.capacityTEU, 0);
    const usedCapacity = vessels.reduce((sum, vessel) => sum + vessel.currentTEU, 0);
    const utilization = totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0;

    const inTransit = shipments.filter(
      (shipment) =>
        shipment.status === 'at_sea' ||
        shipment.status === 'loaded' ||
        shipment.status === 'out_for_delivery',
    );
    const totalCargoValue = shipments
      .filter((shipment) => shipment.status !== 'delivered')
      .reduce((sum, shipment) => sum + shipment.declaredValueUsd, 0);

    const delivered = shipments.filter((shipment) => shipment.status === 'delivered');
    const onTime = delivered.filter((shipment) => {
      if (!shipment.actualDeliveryDate) return false;
      return new Date(shipment.actualDeliveryDate) <= new Date(shipment.eta);
    });
    const onTimeRate = delivered.length > 0 ? (onTime.length / delivered.length) * 100 : 0;

    const criticalAlerts = alerts.filter(
      (alert) => alert.severity === 'critical' && !alert.isAcknowledged,
    );
    const activeIncidents = incidents.filter((incident) => incident.status === 'active');

    const makeSpark = (base: number, seed: number): SparkPoint[] =>
      Array.from({ length: 12 }, (_, index) => ({
        value: Math.max(
          1,
          base * (0.78 + Math.sin(index * 0.9 + seed) * 0.12 + Math.cos(index * 0.4 + seed) * 0.06),
        ),
      }));

    return {
      activeVesselCount: activeVessels.length,
      totalVessels: vessels.length,
      utilization,
      inTransitCount: inTransit.length,
      totalCargoValue,
      onTimeRate,
      criticalCount: criticalAlerts.length,
      incidentCount: activeIncidents.length,
      sparkVessels: makeSpark(activeVessels.length || 6, 1.2),
      sparkValue: makeSpark(totalCargoValue / 1_000_000 || 40, 2.4),
      sparkOnTime: makeSpark(onTimeRate || 90, 3.1),
      sparkCritical: makeSpark(criticalAlerts.length + 2, 4.7),
    };
  }, [vessels, shipments, alerts, incidents]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Active Vessels En-Route"
        value={`${metrics.activeVesselCount}`}
        subtitle={`${formatPercent(metrics.utilization)} TEU utilisation · ${metrics.totalVessels} assets`}
        icon={<Ship className="h-4 w-4 text-[#00F5FF]" />}
        accent="border-[#00F5FF]/40 text-[#00F5FF]"
        trend={{ value: '+3 vs yesterday', positive: true }}
        sparkData={metrics.sparkVessels}
      />
      <KpiCard
        title="Cargo Value In Transit"
        value={formatCompactUsd(metrics.totalCargoValue)}
        subtitle={`${metrics.inTransitCount} shipments actively moving`}
        icon={<DollarSign className="h-4 w-4 text-[#10B981]" />}
        accent="border-[#10B981]/40 text-[#10B981]"
        trend={{ value: '+6.2% MoM', positive: true }}
        sparkData={metrics.sparkValue}
      />
      <KpiCard
        title="On-Time Delivery Rate"
        value={formatPercent(metrics.onTimeRate)}
        subtitle="SLA adherence across delivered lanes"
        icon={<Timer className="h-4 w-4 text-[#F59E0B]" />}
        accent="border-[#F59E0B]/40 text-[#F59E0B]"
        trend={{
          value: metrics.onTimeRate >= 90 ? 'Nominal' : 'Watch',
          positive: metrics.onTimeRate >= 90,
        }}
        sparkData={metrics.sparkOnTime}
      />
      <KpiCard
        title="Active Critical Disruptions"
        value={`${metrics.criticalCount}`}
        subtitle={`${metrics.incidentCount} active incidents · ${formatTeuCompact(
          metrics.activeVesselCount * 1000,
        )} at risk`}
        icon={<AlertOctagon className="h-4 w-4 text-[#EF4444]" />}
        accent="border-[#EF4444]/40 text-[#EF4444]"
        trend={{ value: 'Elevated risk', positive: false }}
        sparkData={metrics.sparkCritical}
        danger
      />
    </div>
  );
}
