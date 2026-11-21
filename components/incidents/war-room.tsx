'use client';

import { useMemo, useState } from 'react';
import { AlertOctagon, MapPin, Ship, Waves, Wind } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { Badge, StatusDot } from '@/components/ui/badge';
import type { DisruptionIncident } from '@/types/supply-chain';
import { formatPercent, formatMaritimeDate } from '@/lib/utils/formatters';

interface Chokepoint {
  name: string;
  lat: number;
  lng: number;
  dailyValueUsd: number;
}

const CHOKEPOINTS: Chokepoint[] = [
  { name: 'Strait of Malacca', lat: 2.5, lng: 101.5, dailyValueUsd: 3_400_000_000 },
  { name: 'Suez Canal', lat: 30.5, lng: 32.55, dailyValueUsd: 2_800_000_000 },
  { name: 'Panama Canal', lat: 9.08, lng: -79.68, dailyValueUsd: 1_900_000_000 },
  { name: 'Strait of Hormuz', lat: 26.6, lng: 56.5, dailyValueUsd: 4_200_000_000 },
  { name: 'Bab-el-Mandeb', lat: 12.58, lng: 43.33, dailyValueUsd: 1_600_000_000 },
];

const SEVERITY_TONE: Record<string, 'crimson' | 'amber' | 'cyan'> = {
  critical: 'crimson',
  warning: 'amber',
  info: 'cyan',
};

export function WarRoom() {
  const incidents = useSupplyChainStore((state) => state.incidents);
  const vessels = useSupplyChainStore((state) => state.vessels);
  const [selectedChokepoint, setSelectedChokepoint] = useState<string | null>(null);

  const activeIncidents = useMemo(
    () => incidents.filter((incident) => incident.status !== 'resolved'),
    [incidents],
  );

  const chokepointStatus = useMemo(() => {
    return CHOKEPOINTS.map((chokepoint) => {
      const related = activeIncidents.filter(
        (incident) => incident.chokepoint === chokepoint.name,
      );
      const highest = related.reduce<'critical' | 'warning' | 'info' | null>((acc, incident) => {
        if (incident.severity === 'critical') return 'critical';
        if (incident.severity === 'warning' && acc !== 'critical') return 'warning';
        return acc ?? (incident.severity === 'info' ? 'info' : null);
      }, null);
      return { chokepoint, related, status: highest };
    });
  }, [activeIncidents]);

  const affectedVessels = useMemo(() => {
    const ids = new Set<string>();
    activeIncidents.forEach((incident) => {
      incident.affectedVesselIds.forEach((id) => ids.add(id));
    });
    return vessels.filter((vessel) => ids.has(vessel.id));
  }, [activeIncidents, vessels]);

  const displayIncidents = selectedChokepoint
    ? activeIncidents.filter((incident) => incident.chokepoint === selectedChokepoint)
    : activeIncidents;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {chokepointStatus.map(({ chokepoint, related, status }) => {
          const tone = status ? SEVERITY_TONE[status] : 'emerald';
          const isActive = selectedChokepoint === chokepoint.name;
          return (
            <button
              key={chokepoint.name}
              type="button"
              onClick={() =>
                setSelectedChokepoint(isActive ? null : chokepoint.name)
              }
              className={`rounded-lg border p-2.5 text-left transition ${
                isActive ? 'border-[#00F5FF]/50 bg-[#00F5FF]/5' : 'border-[#1E2C42] bg-[#0D111A]/70 hover:border-[#00F5FF]/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <Waves className={`h-3.5 w-3.5 ${status ? 'text-[#EF4444]' : 'text-[#10B981]'}`} />
                <StatusDot tone={tone} pulse={status === 'critical'} />
              </div>
              <p className="mt-1 text-[10px] font-medium text-[#F1F5F9]">{chokepoint.name}</p>
              <p className="font-mono text-[9px] text-[#94A3B8]">
                ${(chokepoint.dailyValueUsd / 1_000_000_000).toFixed(1)}B/day
              </p>
              <span className="mt-1 inline-block rounded px-1 py-0.5 font-mono text-[8px] uppercase" style={{ color: status === 'critical' ? '#EF4444' : status === 'warning' ? '#F59E0B' : '#10B981' }}>
                {status ? `${related.length} active` : 'Clear'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
            {displayIncidents.length} active disruption{displayIncidents.length === 1 ? '' : 's'}
            {selectedChokepoint ? ` · ${selectedChokepoint}` : ''}
          </p>
          {displayIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} vessels={vessels} />
          ))}
        </div>

        <div className="rounded-lg border border-[#1E2C42] bg-[#0D111A]/70 p-3">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#EF4444]">
            <Ship className="h-3.5 w-3.5" /> Affected Fleet ({affectedVessels.length})
          </p>
          <div className="space-y-1.5">
            {affectedVessels.map((vessel) => (
              <div key={vessel.id} className="flex items-center justify-between rounded border border-[#1E2C42]/60 bg-[#161F30]/40 px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Ship className="h-3 w-3 text-[#00F5FF]" />
                  <span className="text-[10px] text-[#F1F5F9]">{vessel.name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[9px] text-[#94A3B8]">
                  <MapPin className="h-2.5 w-2.5" />
                  {formatPercent((vessel.currentTEU / vessel.capacityTEU) * 100)}
                  <Badge tone={vessel.status === 'diverted' ? 'crimson' : 'emerald'}>{vessel.status}</Badge>
                </div>
              </div>
            ))}
            {affectedVessels.length === 0 ? (
              <p className="py-6 text-center font-mono text-[10px] text-[#94A3B8]">No vessels affected</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function IncidentCard({ incident, vessels }: { incident: DisruptionIncident; vessels: { id: string; name: string }[] }) {
  const affectedNames = vessels
    .filter((vessel) => incident.affectedVesselIds.includes(vessel.id))
    .map((vessel) => vessel.name);
  const Icon = incident.category === 'weather' ? Wind : incident.category === 'geopolitical' ? AlertOctagon : Waves;
  return (
    <div className="rounded-lg border border-[#1E2C42] border-l-2 bg-[#161F30]/40 p-2.5" style={{ borderLeftColor: incident.severity === 'critical' ? '#EF4444' : '#F59E0B' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" style={{ color: incident.severity === 'critical' ? '#EF4444' : '#F59E0B' }} />
          <p className="text-[11px] font-medium text-[#F1F5F9]">{incident.title}</p>
        </div>
        <Badge tone={SEVERITY_TONE[incident.severity]}>{incident.severity}</Badge>
      </div>
      <p className="mt-1 text-[10px] leading-snug text-[#94A3B8]">{incident.description}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[9px] text-[#94A3B8]">
        <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {incident.region}</span>
        <span>Impact {incident.impactPercent}%</span>
        <span>{formatMaritimeDate(incident.startDate)}</span>
        <span className="ml-auto truncate">{affectedNames.length} vessels</span>
      </div>
    </div>
  );
}
