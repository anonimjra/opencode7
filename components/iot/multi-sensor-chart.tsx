'use client';

import { useMemo } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SensorTelemetryPoint } from '@/types/supply-chain';
import { CyberTooltip } from '@/components/ui/chart-tooltip';
import { formatNumber } from '@/lib/utils/formatters';

interface MultiSensorChartProps {
  history: SensorTelemetryPoint[];
  targetTempC: number;
}

export function MultiSensorChart({ history, targetTempC }: MultiSensorChartProps) {
  const data = useMemo(
    () =>
      history.map((point) => ({
        time: new Date(point.timestamp).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temperature: point.temperatureC,
        humidity: point.humidityPercent,
        shock: point.shockG,
      })),
    [history],
  );

  const thresholds = useMemo(() => {
    const amplitude = Math.abs(targetTempC) > 10 ? 3 : 2.5;
    return {
      upper: Math.round(targetTempC + amplitude * 1.6),
      lower: Math.round(targetTempC - amplitude * 1.6),
    };
  }, [targetTempC]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 flex flex-wrap items-center gap-3 font-mono text-[9px] uppercase tracking-wider">
        <span className="flex items-center gap-1 text-[#00F5FF]"><span className="h-2 w-2 rounded-full bg-[#00F5FF]" /> Temp °C</span>
        <span className="flex items-center gap-1 text-[#8B5CF6]"><span className="h-2 w-2 rounded-full bg-[#8B5CF6]" /> Humidity %</span>
        <span className="flex items-center gap-1 text-[#F59E0B]"><span className="h-2 w-2 rounded-sm bg-[#F59E0B]" /> Shock G</span>
        <span className="flex items-center gap-1 text-[#EF4444]"><span className="h-0.5 w-3 bg-[#EF4444]" /> Threshold</span>
      </div>
      <div className="min-h-[220px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2C42" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1E2C42' }}
              tickLine={false}
              interval={Math.max(1, Math.floor(data.length / 8))}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1E2C42' }}
              tickLine={false}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fill: '#94A3B8', fontSize: 9, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#1E2C42' }}
              tickLine={false}
              width={30}
            />
            <Tooltip
              content={
                <CyberTooltip
                  valueFormatter={(value, name) => {
                    if (name === 'Humidity') return `${formatNumber(Number(value))}%`;
                    if (name === 'Shock') return `${Number(value).toFixed(1)} G`;
                    return `${Number(value).toFixed(1)}°C`;
                  }}
                />
              }
              cursor={{ stroke: '#00F5FF', strokeOpacity: 0.25 }}
            />
            <ReferenceLine yAxisId="left" y={thresholds.upper} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.7} />
            <ReferenceLine yAxisId="left" y={thresholds.lower} stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.7} />
            <ReferenceLine yAxisId="left" y={targetTempC} stroke="#10B981" strokeDasharray="2 2" strokeOpacity={0.6} />
            <Bar yAxisId="left" dataKey="shock" name="Shock" fill="#F59E0B" opacity={0.35} barSize={6} radius={[1, 1, 0, 0]} />
            <Line yAxisId="left" type="monotone" dataKey="temperature" name="Temperature" stroke="#00F5FF" strokeWidth={1.8} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="humidity" name="Humidity" stroke="#8B5CF6" strokeWidth={1.4} dot={false} strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
