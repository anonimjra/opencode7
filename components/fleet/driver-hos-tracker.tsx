'use client';

import { useMemo } from 'react';
import { AlertTriangle, Clock, Truck, Coffee } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import type { DriverHOS } from '@/types/supply-chain';

function statusMeta(hos: DriverHOS): { tone: string; label: string } {
  if (hos.drivingHoursToday >= hos.maxDrivingHours || hos.shiftHoursElapsed >= hos.maxShiftHours) {
    return { tone: '#EF4444', label: 'Violation' };
  }
  if (hos.drivingHoursToday >= hos.maxDrivingHours * 0.85) {
    return { tone: '#F59E0B', label: 'Near Limit' };
  }
  return { tone: '#10B981', label: 'Compliant' };
}

export function DriverHosTracker() {
  const driverHos = useSupplyChainStore((state) => state.driverHos);
  const vessels = useSupplyChainStore((state) => state.vessels);

  const nameById = useMemo(() => {
    const map: Record<string, string> = {};
    vessels.forEach((vessel) => {
      map[vessel.id] = vessel.name;
    });
    return map;
  }, [vessels]);

  const violations = driverHos.filter(
    (hos) => hos.drivingHoursToday >= hos.maxDrivingHours || hos.shiftHoursElapsed >= hos.maxShiftHours,
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider">
        <span className="flex items-center gap-1 text-[#94A3B8]">
          <Clock className="h-3.5 w-3.5" /> 11h driving / 14h shift
        </span>
        <span className={`ml-auto flex items-center gap-1 ${violations > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
          {violations > 0 ? <AlertTriangle className="h-3.5 w-3.5" /> : <Coffee className="h-3.5 w-3.5" />}
          {violations} fatigue alert{violations === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-2.5">
        {driverHos.slice(0, 8).map((hos) => {
          const meta = statusMeta(hos);
          const drivePercent = Math.min(100, (hos.drivingHoursToday / hos.maxDrivingHours) * 100);
          const shiftPercent = Math.min(100, (hos.shiftHoursElapsed / hos.maxShiftHours) * 100);
          return (
            <div key={hos.id} className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#00F5FF]" />
                  <p className="text-[11px] font-medium text-[#F1F5F9]">{hos.driverName}</p>
                  <span className="font-mono text-[9px] uppercase text-[#94A3B8]">{hos.role}</span>
                </div>
                <span className="font-mono text-[9px] uppercase" style={{ color: meta.tone }}>
                  {meta.label}
                </span>
              </div>
              <p className="mt-0.5 font-mono text-[9px] text-[#94A3B8]">
                {nameById[hos.vesselOrTruckId] ?? hos.vesselOrTruckId}
              </p>
              <div className="mt-1.5 space-y-1">
                <HosBar label="Driving" percent={drivePercent} value={`${hos.drivingHoursToday.toFixed(1)}h`} tone={meta.tone} />
                <HosBar label="Shift" percent={shiftPercent} value={`${hos.shiftHoursElapsed.toFixed(1)}h`} tone="#8B5CF6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HosBar({
  label,
  percent,
  value,
  tone,
}: {
  label: string;
  percent: number;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 font-mono text-[9px] uppercase text-[#94A3B8]">{label}</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#0D111A]">
        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: tone }} />
      </div>
      <span className="w-10 text-right font-mono text-[9px] text-[#F1F5F9]">{value}</span>
    </div>
  );
}
