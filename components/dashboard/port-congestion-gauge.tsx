'use client';

import { useMemo } from 'react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import type { PortNode } from '@/types/supply-chain';

const FEATURED_CODES = ['NLRTM', 'SGSIN', 'CNSHA', 'USLAX', 'IDJKT', 'BRSSZ'];

function statusFor(waitHours: number): { tone: string; label: string } {
  if (waitHours < 24) return { tone: '#10B981', label: 'Optimal' };
  if (waitHours <= 72) return { tone: '#F59E0B', label: 'Moderate' };
  return { tone: '#EF4444', label: 'Severe' };
}

export function PortCongestionGauge() {
  const ports = useSupplyChainStore((state) => state.ports);

  const featured = useMemo(() => {
    const selected = FEATURED_CODES.map((code) => ports.find((port) => port.code === code)).filter(
      (port): port is PortNode => Boolean(port),
    );
    return selected.sort((a, b) => b.avgWaitHours - a.avgWaitHours);
  }, [ports]);

  const maxWait = Math.max(...featured.map((port) => port.avgWaitHours), 90);

  const anchoredByPort = useMemo(() => {
    const map: Record<string, number> = {};
    featured.forEach((port, index) => {
      map[port.code] = Math.max(2, Math.round(port.avgWaitHours / 12) + (index % 3));
    });
    return map;
  }, [featured]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider">
        <span className="flex items-center gap-1 text-[#10B981]"><span className="h-2 w-2 rounded-full bg-[#10B981]" /> &lt;24h</span>
        <span className="flex items-center gap-1 text-[#F59E0B]"><span className="h-2 w-2 rounded-full bg-[#F59E0B]" /> 24-72h</span>
        <span className="flex items-center gap-1 text-[#EF4444]"><span className="h-2 w-2 rounded-full bg-[#EF4444]" /> &gt;72h</span>
      </div>
      <div className="flex-1 space-y-2.5">
        {featured.map((port) => {
          const { tone, label } = statusFor(port.avgWaitHours);
          const widthPercent = Math.min(100, (port.avgWaitHours / maxWait) * 100);
          const anchored = anchoredByPort[port.code] ?? 0;
          const atBerth = Math.max(1, port.berths - anchored - 2);
          return (
            <div key={port.id}>
              <div className="mb-1 flex items-center justify-between font-mono text-[10px]">
                <span className="text-[#F1F5F9]">
                  {port.code} <span className="text-[#94A3B8]">· {port.avgWaitHours}h</span>
                </span>
                <span style={{ color: tone }} className="uppercase">
                  {label}
                </span>
              </div>
              <div className="relative h-2 overflow-hidden rounded-full bg-[#161F30]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${widthPercent}%`, backgroundColor: tone, boxShadow: `0 0 8px ${tone}66` }}
                />
              </div>
              <div className="mt-0.5 flex items-center justify-between font-mono text-[8px] text-[#94A3B8]">
                <span>⚓ {anchored} at anchor</span>
                <span>⬛ {atBerth} at berth</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
