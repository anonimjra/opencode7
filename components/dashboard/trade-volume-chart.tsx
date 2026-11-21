'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { CyberTooltip } from '@/components/ui/chart-tooltip';
import { formatNumber } from '@/lib/utils/formatters';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface TradePoint {
  month: string;
  ocean: number;
  air: number;
  road: number;
}

export function TradeVolumeChart() {
  const shipments = useSupplyChainStore((state) => state.shipments);

  const data = useMemo<TradePoint[]>(() => {
    const oceanBase = shipments.filter((s) => s.mode === 'ocean').length * 2.4;
    const airBase = shipments.filter((s) => s.mode === 'air').length * 1.8;
    const roadBase = shipments.filter((s) => s.mode === 'road' || s.mode === 'rail').length * 2.1;

    return MONTHS.map((month, index) => {
      const seasonality = 1 + Math.sin((index / 12) * Math.PI * 2) * 0.18;
      const trend = 1 + index * 0.03;
      return {
        month,
        ocean: Math.round((38 + oceanBase) * seasonality * trend),
        air: Math.round((12 + airBase) * seasonality * trend * 0.9),
        road: Math.round((20 + roadBase) * seasonality * trend),
      };
    });
  }, [shipments]);

  const total = data.reduce((sum, point) => sum + point.ocean + point.air + point.road, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
        <span className="flex items-center gap-1 text-[#00F5FF]">
          <span className="h-2 w-2 rounded-full bg-[#00F5FF]" /> Ocean
        </span>
        <span className="flex items-center gap-1 text-[#8B5CF6]">
          <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Air
        </span>
        <span className="flex items-center gap-1 text-[#10B981]">
          <span className="h-2 w-2 rounded-full bg-[#10B981]" /> Road
        </span>
        <span className="ml-auto text-[#94A3B8]">{formatNumber(total)}k TEU YTD</span>
      </div>
      <div className="min-h-[180px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#00F5FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="airGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2C42" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1E2C42' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1E2C42' }}
              tickLine={false}
              width={44}
            />
            <Tooltip
              content={
                <CyberTooltip
                  labelPrefix=""
                  valueFormatter={(value) => `${formatNumber(Number(value))}k TEU`}
                />
              }
              cursor={{ stroke: '#00F5FF', strokeOpacity: 0.3 }}
            />
            <Area
              type="monotone"
              dataKey="ocean"
              name="Ocean Freight"
              stackId="1"
              stroke="#00F5FF"
              strokeWidth={1.5}
              fill="url(#oceanGrad)"
            />
            <Area
              type="monotone"
              dataKey="air"
              name="Air Cargo"
              stackId="1"
              stroke="#8B5CF6"
              strokeWidth={1.5}
              fill="url(#airGrad)"
            />
            <Area
              type="monotone"
              dataKey="road"
              name="Intermodal Road"
              stackId="1"
              stroke="#10B981"
              strokeWidth={1.5}
              fill="url(#roadGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
