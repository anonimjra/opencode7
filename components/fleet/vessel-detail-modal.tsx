'use client';

import { useMemo } from 'react';
import { Anchor, Droplets, Fuel, Gauge, Settings2, User, Waves } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import type { PortNode, Vessel } from '@/types/supply-chain';
import {
  formatHeading,
  formatKnots,
  formatSpeedBoth,
  formatTeuCompact,
  formatNumber,
  formatMaritimeDate,
} from '@/lib/utils/formatters';

interface VesselDetailModalProps {
  vessel: Vessel | null;
  originPort?: PortNode;
  destPort?: PortNode;
  onClose: () => void;
}

export function VesselDetailModal({ vessel, originPort, destPort, onClose }: VesselDetailModalProps) {
  const telemetry = useMemo(() => {
    if (!vessel) return null;
    const rpmPercent = Math.min(100, (vessel.engineRPM / 110) * 100);
    const propellerPitch = Math.round(60 + (vessel.speedKnots / 25) * 30);
    const forwardBallast = Math.round(48 + Math.sin(vessel.headingDegrees) * 8);
    const aftBallast = 100 - forwardBallast;
    return { rpmPercent, propellerPitch, forwardBallast, aftBallast };
  }, [vessel]);

  if (!vessel) {
    return (
      <Modal open={false} onClose={onClose} title="Vessel">
        <div />
      </Modal>
    );
  }

  const crew = [
    { name: vessel.captainName, role: 'Master / Captain', status: 'On Watch' },
    { name: 'Chief Eng. Viktor Petrov', role: 'Chief Engineer', status: 'Below Deck' },
    { name: 'First Off. Maria Santos', role: 'First Officer', status: 'Bridge' },
    { name: 'Bosun Kwame Asante', role: 'Deck Foreman', status: 'Deck Ops' },
  ];

  return (
    <Modal
      open={vessel !== null}
      onClose={onClose}
      title={vessel.name}
      subtitle={`${vessel.mode.toUpperCase()} · ${vessel.callsign} · ${vessel.imo}`}
      icon={<Settings2 className="h-5 w-5 text-[#00F5FF]" />}
      size="lg"
      accent="cyan"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={vessel.status === 'diverted' ? 'crimson' : vessel.status === 'underway' ? 'emerald' : 'amber'}>
            {vessel.status}
          </Badge>
          <Badge tone="cyan">{vessel.mode}</Badge>
          <Badge tone="violet">MMSI {vessel.mmsi}</Badge>
          <span className="ml-auto font-mono text-[10px] text-[#94A3B8]">
            Updated {formatMaritimeDate(vessel.lastUpdated)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <GaugeCard icon={<Gauge className="h-4 w-4" />} label="Engine RPM" value={`${vessel.engineRPM}`} sub={`${telemetry?.rpmPercent.toFixed(0)}% load`} />
          <GaugeCard icon={<Settings2 className="h-4 w-4" />} label="Propeller Pitch" value={`${telemetry?.propellerPitch}%`} sub="CPP" />
          <GaugeCard icon={<Fuel className="h-4 w-4" />} label="Fuel Flow" value={`${formatNumber(vessel.fuelConsumptionLPerHr)} L/h`} sub="MGO/HFO" />
          <GaugeCard icon={<Waves className="h-4 w-4" />} label="Speed" value={formatKnots(vessel.speedKnots)} sub={formatSpeedBoth(vessel.speedKnots)} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
              <Droplets className="h-3.5 w-3.5" /> Ballast Water Tanks
            </p>
            <div className="space-y-2">
              <BallastBar label="Forward Trim" percent={telemetry?.forwardBallast ?? 50} tone="#00F5FF" />
              <BallastBar label="Aft Trim" percent={telemetry?.aftBallast ?? 50} tone="#10B981" />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
              <span>Ballast balance</span>
              <span className="text-[#F1F5F9]">
                {telemetry ? Math.abs(telemetry.forwardBallast - 50) < 10 ? 'Balanced' : 'Trim Needed' : '—'}
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
              <Gauge className="h-3.5 w-3.5" /> Engine RPM Gauge
            </p>
            <RpmGauge percent={telemetry?.rpmPercent ?? 0} rpm={vessel.engineRPM} />
          </div>
        </div>

        <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
          <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
            <Anchor className="h-3.5 w-3.5" /> Voyage &amp; Cargo
          </p>
          <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
            <Detail label="Origin" value={originPort ? `${originPort.name} (${originPort.code})` : '—'} />
            <Detail label="Destination" value={destPort ? `${destPort.name} (${destPort.code})` : '—'} />
            <Detail label="Heading" value={formatHeading(vessel.headingDegrees)} />
            <Detail label="Route Progress" value={`${vessel.routeProgressPercent}%`} />
            <Detail label="Cargo Loaded" value={formatTeuCompact(vessel.currentTEU)} />
            <Detail label="Total Capacity" value={formatTeuCompact(vessel.capacityTEU)} />
            <Detail label="CO₂ Emissions" value={`${formatNumber(vessel.co2EmissionsTon)} t`} />
            <Detail label="Voyage Status" value={vessel.status} />
          </dl>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
              <User className="h-3.5 w-3.5" /> Crew Manifest
            </p>
            <ul className="space-y-1.5">
              {crew.map((member) => (
                <li key={member.name} className="flex items-center justify-between text-[11px]">
                  <div>
                    <p className="text-[#F1F5F9]">{member.name}</p>
                    <p className="text-[9px] text-[#94A3B8]">{member.role}</p>
                  </div>
                  <span className="rounded bg-[#0D111A] px-1.5 py-0.5 font-mono text-[9px] text-[#10B981]">
                    {member.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
              Waypoint History
            </p>
            <ol className="space-y-1.5">
              {vessel.waypoints.map((waypoint) => (
                <li key={`${waypoint.name}-${waypoint.estimatedArrival}`} className="flex items-center gap-2 text-[11px]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      waypoint.status === 'passed'
                        ? 'bg-[#10B981]'
                        : waypoint.status === 'current'
                          ? 'bg-[#00F5FF] pulse-dot'
                          : 'bg-[#1E2C42]'
                    }`}
                  />
                  <span className={waypoint.status === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#F1F5F9]'}>
                    {waypoint.name}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-[#94A3B8]">
                    {formatMaritimeDate(waypoint.actualArrival ?? waypoint.estimatedArrival)}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function GaugeCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-2.5">
      <div className="flex items-center gap-1.5 text-[#00F5FF]">
        {icon}
        <span className="font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">{label}</span>
      </div>
      <p className="mt-1 font-mono text-sm text-[#F1F5F9]">{value}</p>
      <p className="text-[9px] text-[#94A3B8]">{sub}</p>
    </div>
  );
}

function BallastBar({ label, percent, tone }: { label: string; percent: number; tone: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between font-mono text-[9px]">
        <span className="text-[#94A3B8]">{label}</span>
        <span className="text-[#F1F5F9]">{percent}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#0D111A]">
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: tone, boxShadow: `0 0 8px ${tone}66` }}
        />
      </div>
    </div>
  );
}

function RpmGauge({ percent, rpm }: { percent: number; rpm: number }) {
  const radius = 40;
  const circumference = Math.PI * radius;
  const dash = (percent / 100) * circumference;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 56" className="h-20 w-40">
        <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#0D111A" strokeWidth={8} strokeLinecap="round" />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          stroke="#00F5FF"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,245,255,0.6))' }}
        />
      </svg>
      <p className="-mt-3 font-mono text-lg text-[#00F5FF] text-glow-cyan">{rpm}</p>
      <p className="font-mono text-[9px] uppercase text-[#94A3B8]">RPM</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase text-[#94A3B8]">{label}</dt>
      <dd className="font-mono text-[11px] text-[#F1F5F9]">{value}</dd>
    </div>
  );
}
