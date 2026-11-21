'use client';

import { useMemo, useState } from 'react';
import { Wrench, CalendarClock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { pushToast } from '@/components/ui/toast-system';

function statusColor(status: 'nominal' | 'watch' | 'critical'): string {
  if (status === 'critical') return '#EF4444';
  if (status === 'watch') return '#F59E0B';
  return '#10B981';
}

export function MaintenanceScheduler() {
  const components = useSupplyChainStore((state) => state.maintenanceComponents);
  const vessels = useSupplyChainStore((state) => state.vessels);
  const logs = useSupplyChainStore((state) => state.maintenanceLogs);
  const addMaintenanceLog = useSupplyChainStore((state) => state.addMaintenanceLog);

  const oceanVessels = useMemo(
    () => vessels.filter((vessel) => vessel.mode === 'ocean'),
    [vessels],
  );
  const [selectedVesselId, setSelectedVesselId] = useState<string>(oceanVessels[0]?.id ?? '');
  const [note, setNote] = useState('');

  const vesselComponents = useMemo(
    () => components.filter((component) => component.vesselId === selectedVesselId),
    [components, selectedVesselId],
  );

  const vesselLogs = useMemo(
    () => logs.filter((log) => log.vesselId === selectedVesselId).slice(0, 5),
    [logs, selectedVesselId],
  );

  const handleLog = (componentId: string): void => {
    if (!note.trim()) {
      pushToast('Note required', 'Enter a maintenance note before logging.', 'warning');
      return;
    }
    addMaintenanceLog({
      id: `log-${Date.now()}`,
      vesselId: selectedVesselId,
      componentId,
      note: note.trim(),
      performedAt: new Date().toISOString(),
      technician: 'Aether Deck Ops',
    });
    pushToast('Maintenance logged', 'Component health restored +12%.', 'success');
    setNote('');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
          Vessel
          <select
            value={selectedVesselId}
            onChange={(event) => setSelectedVesselId(event.target.value)}
            className="rounded border border-[#1E2C42] bg-[#0D111A] px-2 py-1 font-mono text-[11px] text-[#F1F5F9] focus:border-[#00F5FF]/50 focus:outline-none"
          >
            {oceanVessels.map((vessel) => (
              <option key={vessel.id} value={vessel.id}>
                {vessel.name}
              </option>
            ))}
          </select>
        </label>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Maintenance note (e.g. turbine bearing replaced)…"
          className="h-7 flex-1 rounded border border-[#1E2C42] bg-[#0D111A] px-2 font-mono text-[11px] text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#00F5FF]/50 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        {vesselComponents.map((component) => {
          const color = statusColor(component.status);
          return (
            <div key={component.id} className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#F1F5F9]">
                  {component.status === 'critical' ? (
                    <AlertTriangle className="h-3.5 w-3.5" style={{ color }} />
                  ) : (
                    <Wrench className="h-3.5 w-3.5" style={{ color }} />
                  )}
                  {component.componentName}
                </span>
                <button
                  type="button"
                  onClick={() => handleLog(component.id)}
                  className="flex items-center gap-1 rounded border border-[#1E2C42] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#00F5FF] hover:border-[#00F5FF]/40"
                >
                  <CheckCircle2 className="h-2.5 w-2.5" /> Log
                </button>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0D111A]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${component.healthPercent}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}66` }}
                  />
                </div>
                <span className="w-9 text-right font-mono text-[10px]" style={{ color }}>
                  {component.healthPercent}%
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <CalendarClock className="h-2.5 w-2.5" /> Dry-dock in {component.daysToService}d
                </span>
                <span className="uppercase" style={{ color }}>
                  {component.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {vesselLogs.length > 0 ? (
        <div className="rounded-md border border-[#1E2C42] bg-[#0D111A]/60 p-2">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
            Recent Logs
          </p>
          <ul className="space-y-1">
            {vesselLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between text-[10px]">
                <span className="truncate text-[#F1F5F9]">{log.note}</span>
                <span className="ml-2 shrink-0 font-mono text-[8px] text-[#94A3B8]">
                  {new Date(log.performedAt).toLocaleTimeString('en-GB')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
