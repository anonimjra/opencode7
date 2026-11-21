'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, Gauge, Satellite, Wifi } from 'lucide-react';
import { useSupplyChainStore, type SimulationSpeed } from '@/lib/store/use-supply-chain-store';
import { formatWibClock, formatZuluClock } from '@/lib/utils/formatters';

const SIM_SPEEDS: SimulationSpeed[] = [1, 5, 10];

export function StatusTicker() {
  const [now, setNow] = useState<Date | null>(null);
  const simulationSpeed = useSupplyChainStore((state) => state.simulationSpeed);
  const setSimulationSpeed = useSupplyChainStore((state) => state.setSimulationSpeed);
  const vessels = useSupplyChainStore((state) => state.vessels);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const tickerMessages = useMemo(() => {
    return vessels.slice(0, 12).map((vessel) => {
      const statusLabel = vessel.status.toUpperCase();
      return `[${statusLabel}] ${vessel.name} ${vessel.speedKnots.toFixed(1)}kn HDG ${Math.round(
        vessel.headingDegrees,
      )}° · ${vessel.mode.toUpperCase()} · TEU ${vessel.currentTEU}/${vessel.capacityTEU}`;
    });
  }, [vessels]);

  const duplicated = [...tickerMessages, ...tickerMessages];

  return (
    <footer className="app-status-bar flex h-9 shrink-0 items-center gap-4 border-t border-[#1E2C42] bg-[#0D111A] px-3 font-mono text-[11px] text-[#94A3B8]">
      <div className="flex shrink-0 items-center gap-2 border-r border-[#1E2C42] pr-3">
        <Activity className="h-3.5 w-3.5 text-[#10B981]" />
        <span className="text-[#10B981]">ONLINE</span>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-r border-[#1E2C42] pr-3 tabular-nums">
        <span className="text-[#00F5FF] text-glow-cyan">
          UTC {now ? formatZuluClock(now) : '--:--:--'}
        </span>
        <span className="text-[#1E2C42]">|</span>
        <span className="text-[#94A3B8]">WIB {now ? formatWibClock(now) : '--:--:--'}</span>
      </div>

      <div className="hidden shrink-0 items-center gap-2 border-r border-[#1E2C42] pr-3 md:flex">
        <Satellite className="h-3.5 w-3.5 text-[#8B5CF6]" />
        <span className="text-[#8B5CF6]">INMARSAT/STARLINK</span>
        <span className="text-[#10B981]">99.98%</span>
        <Wifi className="h-3 w-3 text-[#94A3B8]" />
        <span>42ms</span>
      </div>

      <div className="relative flex-1 overflow-hidden whitespace-nowrap">
        <div className="marquee-track">
          {duplicated.map((message, index) => (
            <span key={`${message}-${index}`} className="mr-8 inline-flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#00F5FF]" />
              {message}
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-l border-[#1E2C42] pl-3">
        <Gauge className="h-3.5 w-3.5 text-[#F59E0B]" />
        <span className="mr-1 text-[#94A3B8]">SIM</span>
        {SIM_SPEEDS.map((speed) => (
          <button
            key={speed}
            type="button"
            onClick={() => setSimulationSpeed(speed)}
            className={`rounded px-1.5 py-0.5 text-[10px] transition ${
              simulationSpeed === speed
                ? 'bg-[#F59E0B]/20 text-[#F59E0B] glow-amber'
                : 'text-[#94A3B8] hover:bg-[#161F30] hover:text-[#F1F5F9]'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </footer>
  );
}
