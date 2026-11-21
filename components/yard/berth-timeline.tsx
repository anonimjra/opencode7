'use client';

import { useMemo } from 'react';
import { Construction as Crane, Anchor, Gauge } from 'lucide-react';
import type { Vessel } from '@/types/supply-chain';

interface BerthTimelineProps {
  vessels: Vessel[];
}

interface CraneAssignment {
  id: string;
  vesselName: string;
  startHour: number;
  durationHours: number;
  moves: number;
  mph: number;
  color: string;
}

const CRANE_COLORS = ['#00F5FF', '#10B981', '#F59E0B', '#8B5CF6'];
const TARGET_MPH = 32;

export function BerthTimeline({ vessels }: BerthTimelineProps) {
  const assignments = useMemo<CraneAssignment[]>(() => {
    const oceanVessels = vessels.filter((vessel) => vessel.mode === 'ocean').slice(0, 8);
    const cranes: CraneAssignment[] = [];
    for (let craneIndex = 0; craneIndex < 4; craneIndex += 1) {
      const vessel = oceanVessels[craneIndex % Math.max(1, oceanVessels.length)];
      if (!vessel) continue;
      const startHour = craneIndex * 3 + 1;
      const durationHours = 6 + (craneIndex % 3) * 2;
      const mph = 26 + (craneIndex * 3 + 4) % 12;
      const moves = Math.round(mph * durationHours);
      cranes.push({
        id: `STS-0${craneIndex + 1}`,
        vesselName: vessel.name,
        startHour,
        durationHours,
        moves,
        mph,
        color: CRANE_COLORS[craneIndex],
      });
    }
    return cranes;
  }, [vessels]);

  const totalHours = 24;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
        <span className="flex items-center gap-1"><Crane className="h-3.5 w-3.5 text-[#00F5FF]" /> 4 × STS Crane</span>
        <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5 text-[#10B981]" /> Target {TARGET_MPH} MPH</span>
      </div>

      <div className="rounded-lg border border-[#1E2C42] bg-[#0D111A]/70 p-2.5">
        <div className="mb-1 flex justify-between font-mono text-[8px] text-[#94A3B8]">
          {Array.from({ length: 7 }, (_, index) => (
            <span key={index}>{(index * 4).toString().padStart(2, '0')}:00</span>
          ))}
        </div>
        <div className="space-y-1.5">
          {assignments.map((assignment) => {
            const optimum = assignment.mph >= TARGET_MPH;
            return (
              <div key={assignment.id} className="flex items-center gap-2">
                <span className="w-14 shrink-0 font-mono text-[9px] uppercase text-[#94A3B8]">{assignment.id}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-[#161F30]/60">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="absolute inset-y-0 w-px bg-[#1E2C42]/60"
                      style={{ left: `${(index / 6) * 100}%` }}
                    />
                  ))}
                  <div
                    className="absolute inset-y-0 flex items-center gap-1 rounded px-1.5"
                    style={{
                      left: `${(assignment.startHour / totalHours) * 100}%`,
                      width: `${(assignment.durationHours / totalHours) * 100}%`,
                      backgroundColor: `${assignment.color}33`,
                      borderLeft: `2px solid ${assignment.color}`,
                    }}
                  >
                    <Anchor className="h-2.5 w-2.5" style={{ color: assignment.color }} />
                    <span className="truncate font-mono text-[8px] text-[#F1F5F9]">{assignment.vesselName}</span>
                  </div>
                </div>
                <span
                  className="w-16 shrink-0 text-right font-mono text-[9px]"
                  style={{ color: optimum ? '#10B981' : '#F59E0B' }}
                >
                  {assignment.mph} MPH
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {assignments.map((assignment) => (
          <div key={`stat-${assignment.id}`} className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2">
            <div className="flex items-center justify-between font-mono text-[9px]">
              <span className="text-[#00F5FF]">{assignment.id}</span>
              <span style={{ color: assignment.mph >= TARGET_MPH ? '#10B981' : '#F59E0B' }}>
                {assignment.mph >= TARGET_MPH ? 'Optimal' : 'Below Target'}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[10px] text-[#F1F5F9]">{assignment.vesselName}</p>
            <div className="flex items-center justify-between font-mono text-[8px] text-[#94A3B8]">
              <span>{assignment.moves} moves</span>
              <span>{assignment.durationHours}h berth</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
