'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  Radar,
  Ship,
  Signal,
  TrendingUp,
} from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { StatusDot } from '@/components/ui/badge';
import { KpiMetricCards } from '@/components/dashboard/kpi-metric-cards';
import { TelematicsMap } from '@/components/dashboard/telematics-map';
import { ActiveFleetTable } from '@/components/dashboard/active-fleet-table';
import { CriticalAlertsFeed } from '@/components/dashboard/critical-alerts-feed';
import { TradeVolumeChart } from '@/components/dashboard/trade-volume-chart';
import { PortCongestionGauge } from '@/components/dashboard/port-congestion-gauge';
import { formatZuluClock } from '@/lib/utils/formatters';

const TIME_FILTERS = ['Live', '24H', '7D', '30D', 'QTD'];

export default function ControlTowerPage() {
  const [now, setNow] = useState<Date | null>(null);
  const [timeFilter, setTimeFilter] = useState('Live');

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] via-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#00F5FF]/40 bg-[#00F5FF]/10">
            <Radar className="absolute h-8 w-8 text-[#00F5FF]/20 radar-sweep" />
            <Radar className="h-5 w-5 text-[#00F5FF]" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Mission Control Tower
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="emerald" />
              Global uplink stable
              <span className="text-[#1E2C42]">|</span>
              <span className="text-[#00F5FF]">UTC {now ? formatZuluClock(now) : '--:--:--'}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-[#1E2C42] bg-[#0D111A] p-0.5">
          {TIME_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTimeFilter(filter)}
              className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                timeFilter === filter
                  ? 'bg-[#00F5FF]/15 text-[#00F5FF]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <KpiMetricCards />

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Global Telematics Radar"
          subtitle="Live maritime &amp; air cargo positions"
          icon={<Signal className="h-4 w-4" />}
          className="xl:col-span-2"
          bodyClassName="min-h-[360px]"
        >
          <div className="h-[360px]">
            <TelematicsMap />
          </div>
        </Panel>

        <Panel
          title="Critical Alerts Feed"
          subtitle="Real-time operational incidents"
          icon={<Bell className="h-4 w-4" />}
          bodyClassName="h-[360px]"
        >
          <CriticalAlertsFeed />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Active Fleet Radar"
          subtitle="Vessel, air &amp; ground telematics"
          icon={<Ship className="h-4 w-4" />}
          className="xl:col-span-2"
          bodyClassName="max-h-[320px] overflow-y-auto"
        >
          <ActiveFleetTable />
        </Panel>

        <div className="grid grid-cols-1 gap-3">
          <Panel
            title="Port Congestion Index"
            subtitle="Anchorage wait times"
            icon={<Activity className="h-4 w-4" />}
            bodyClassName="min-h-[150px]"
          >
            <PortCongestionGauge />
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Global Trade Volume"
          subtitle="Modal split — thousand TEU"
          icon={<BarChart3 className="h-4 w-4" />}
          className="xl:col-span-2"
          bodyClassName="h-[240px]"
        >
          <TradeVolumeChart />
        </Panel>

        <Panel
          title="Network Throughput"
          subtitle="Utilisation snapshot"
          icon={<TrendingUp className="h-4 w-4" />}
          bodyClassName="space-y-2.5"
        >
          <ThroughputBars />
        </Panel>
      </div>
    </div>
  );
}

function ThroughputBars() {
  const metrics = [
    { label: 'Ocean Lanes', value: 88, tone: '#00F5FF' },
    { label: 'Air Corridors', value: 72, tone: '#8B5CF6' },
    { label: 'Road Intermodal', value: 64, tone: '#10B981' },
    { label: 'Rail Freight', value: 51, tone: '#F59E0B' },
    { label: 'Customs Throughput', value: 79, tone: '#00F5FF' },
  ];
  return (
    <div className="space-y-3">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <div className="mb-1 flex items-center justify-between font-mono text-[10px]">
            <span className="text-[#94A3B8]">{metric.label}</span>
            <span className="text-[#F1F5F9]">{metric.value}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[#161F30]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${metric.value}%`,
                backgroundColor: metric.tone,
                boxShadow: `0 0 8px ${metric.tone}66`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
