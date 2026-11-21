'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  Anchor,
  Compass,
  Gauge,
  Navigation,
  Ship,
  X,
} from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { Drawer } from '@/components/ui/drawer';
import { Badge, StatusDot } from '@/components/ui/badge';
import type { PortNode, Vessel } from '@/types/supply-chain';
import {
  formatKnots,
  formatKmh,
  formatCoordinate,
  formatTeuCompact,
  formatHeading,
  formatRelativeTime,
} from '@/lib/utils/formatters';

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 500;

/** Convert lng/lat into an equirectangular SVG coordinate. */
function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng + 180) / 360) * MAP_WIDTH;
  const y = ((90 - lat) / 180) * MAP_HEIGHT;
  return { x, y };
}

/**
 * Simplified low-poly continent outlines expressed in [lat, lng] vertices.
 * These are intentionally coarse for a stylized mission-control radar view.
 */
const CONTINENT_PATHS: number[][][] = [
  // North America
  [
    [71, -156], [70, -130], [60, -125], [55, -130], [48, -125], [40, -124],
    [32, -117], [23, -110], [18, -96], [21, -88], [25, -82], [30, -81],
    [35, -76], [42, -70], [47, -66], [52, -60], [58, -65], [64, -78],
    [70, -95], [72, -120],
  ],
  // Central America
  [
    [18, -96], [14, -92], [9, -85], [8, -80], [9, -78], [13, -83], [16, -88], [20, -90],
  ],
  // South America
  [
    [12, -72], [8, -77], [0, -80], [-6, -81], [-18, -70], [-30, -71], [-42, -73],
    [-54, -68], [-52, -58], [-38, -58], [-24, -47], [-12, -38], [-5, -35],
    [2, -50], [8, -60], [11, -68],
  ],
  // Greenland
  [[83, -40], [80, -20], [70, -22], [64, -42], [70, -55], [78, -60]],
  // Europe
  [
    [71, 25], [66, 12], [58, 8], [54, 10], [50, 0], [46, -5], [40, -9], [37, -1],
    [40, 18], [37, 27], [42, 30], [48, 30], [55, 40], [68, 40],
  ],
  // Africa
  [
    [35, -6], [30, -10], [20, -17], [10, -16], [4, -8], [-5, 9], [-18, 12],
    [-34, 18], [-30, 32], [-20, 40], [-10, 40], [2, 43], [12, 43], [22, 32],
    [32, 30], [35, 10],
  ],
  // Asia
  [
    [72, 60], [70, 100], [66, 140], [58, 160], [48, 142], [40, 130], [35, 122],
    [30, 122], [22, 115], [10, 105], [8, 98], [15, 95], [22, 90], [25, 78],
    [30, 70], [35, 60], [45, 50], [55, 60], [65, 60],
  ],
  // India subcontinent
  [[24, 70], [20, 72], [10, 77], [8, 80], [15, 82], [22, 88], [26, 88], [26, 78]],
  // Australia
  [[-12, 130], [-14, 142], [-22, 153], [-32, 150], [-38, 145], [-35, 118], [-22, 114], [-15, 122]],
  // Japan
  [[45, 141], [41, 140], [35, 139], [33, 132], [31, 130], [34, 136], [40, 141]],
  // Indonesia archipelago
  [[5, 96], [1, 104], [-2, 106], [-6, 106], [-8, 116], [-6, 120], [0, 120], [2, 110], [5, 100]],
  // UK / Ireland
  [[58, -5], [54, -2], [51, 1], [50, -5], [54, -8]],
  // Madagascar
  [[-12, 49], [-18, 47], [-25, 45], [-22, 48], [-16, 50]],
  // Antarctica hint
  [[-70, -60], [-70, 60], [-80, 60], [-82, -60]],
];

interface RouteDefinition {
  name: string;
  color: string;
  points: [number, number][];
}

const MAJOR_ROUTES: RouteDefinition[] = [
  {
    name: 'Asia-Europe via Suez',
    color: '#00F5FF',
    points: [
      [1.26, 103.84],
      [3.5, 99.5],
      [6.13, 92.65],
      [12.8, 45.0],
      [30.5, 32.55],
      [36.1, -6.8],
      [51.95, 4.14],
    ],
  },
  {
    name: 'Trans-Pacific Shanghai-LA',
    color: '#10B981',
    points: [
      [31.23, 121.47],
      [35.0, 160.0],
      [40.0, -170.0],
      [35.0, -140.0],
      [33.74, -118.26],
    ],
  },
  {
    name: 'Trans-Atlantic Rotterdam-Santos',
    color: '#8B5CF6',
    points: [
      [51.95, 4.14],
      [44.0, -18.0],
      [10.0, -30.0],
      [-14.0, -32.0],
      [-23.96, -46.33],
    ],
  },
];

const PORT_STATUS_TONE: Record<PortNode['status'], 'emerald' | 'amber' | 'crimson'> = {
  optimal: 'emerald',
  congested: 'amber',
  severe_delay: 'crimson',
};

function routePath(points: [number, number][]): string {
  return points
    .map(([lat, lng], index) => {
      const { x, y } = project(lat, lng);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function continentPath(vertices: number[][]): string {
  return vertices
    .map(([lat, lng], index) => {
      const { x, y } = project(lat, lng);
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ') + ' Z';
}

export function TelematicsMap() {
  const ports = useSupplyChainStore((state) => state.ports);
  const vessels = useSupplyChainStore((state) => state.vessels);
  const selectedVesselId = useSupplyChainStore((state) => state.selectedVesselId);
  const selectVessel = useSupplyChainStore((state) => state.selectVessel);

  const [hoveredPort, setHoveredPort] = useState<PortNode | null>(null);
  const [hoverTooltipPos, setHoverTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const selectedVessel = useMemo(
    () => vessels.find((vessel) => vessel.id === selectedVesselId) ?? null,
    [vessels, selectedVesselId],
  );

  const vesselMarkers = useMemo(
    () =>
      vessels
        .filter((vessel) => vessel.mode === 'ocean' || vessel.mode === 'air')
        .map((vessel) => {
          const { x, y } = project(vessel.lat, vessel.lng);
          return { vessel, x, y };
        }),
    [vessels],
  );

  const originPort = selectedVessel
    ? ports.find((port) => port.id === selectedVessel.originPortId)
    : undefined;
  const destPort = selectedVessel
    ? ports.find((port) => port.id === selectedVessel.destPortId)
    : undefined;

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-lg border border-[#1E2C42] bg-[#07090E]">
        <div className="grid-overlay absolute inset-0 opacity-40" />
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="relative h-full w-full"
          role="img"
          aria-label="Global maritime telematics map"
        >
          <defs>
            <radialGradient id="ocean-glow" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0D111A" />
              <stop offset="100%" stopColor="#07090E" />
            </radialGradient>
            <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#ocean-glow)" />

          {/* Latitude / longitude grid */}
          {Array.from({ length: 13 }, (_, index) => (index + 1) * 35.7).map((x) => (
            <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={MAP_HEIGHT} stroke="#1E2C42" strokeWidth={0.5} opacity={0.5} />
          ))}
          {Array.from({ length: 9 }, (_, index) => (index + 1) * 50).map((y) => (
            <line key={`h-${y}`} x1={0} y1={y} x2={MAP_WIDTH} y2={y} stroke="#1E2C42" strokeWidth={0.5} opacity={0.5} />
          ))}
          <line x1={0} y1={MAP_HEIGHT / 2} x2={MAP_WIDTH} y2={MAP_HEIGHT / 2} stroke="#00F5FF" strokeWidth={0.6} strokeDasharray="6 6" opacity={0.3} />

          {/* Continents */}
          {CONTINENT_PATHS.map((vertices, index) => (
            <path
              key={`continent-${index}`}
              d={continentPath(vertices)}
              fill="#161F30"
              stroke="#2A3D5C"
              strokeWidth={0.8}
              opacity={0.92}
            />
          ))}

          {/* Shipping routes */}
          {MAJOR_ROUTES.map((route) => (
            <path
              key={route.name}
              d={routePath(route.points)}
              fill="none"
              stroke={route.color}
              strokeWidth={1.1}
              strokeDasharray="4 4"
              opacity={0.55}
            />
          ))}

          {/* Port nodes */}
          {ports.map((port) => {
            const { x, y } = project(port.lat, port.lng);
            const tone =
              port.status === 'optimal'
                ? '#10B981'
                : port.status === 'congested'
                  ? '#F59E0B'
                  : '#EF4444';
            return (
              <g
                key={port.id}
                transform={`translate(${x}, ${y})`}
                onMouseEnter={() => {
                  setHoveredPort(port);
                  setHoverTooltipPos({ x, y });
                }}
                onMouseLeave={() => {
                  setHoveredPort(null);
                  setHoverTooltipPos(null);
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle r={6} fill={tone} opacity={0.18} />
                <circle r={2.6} fill={tone} stroke="#07090E" strokeWidth={0.8} />
                <text x={5} y={-4} fontSize={7} fill="#94A3B8" fontFamily="monospace">
                  {port.code}
                </text>
              </g>
            );
          })}

          {/* Vessel markers */}
          {vesselMarkers.map(({ vessel, x, y }) => {
            const isSelected = vessel.id === selectedVesselId;
            const isAir = vessel.mode === 'air';
            const color = isAir ? '#8B5CF6' : vessel.status === 'diverted' ? '#EF4444' : '#00F5FF';
            return (
              <g
                key={vessel.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => selectVessel(vessel.id)}
                style={{ cursor: 'pointer' }}
              >
                <circle r={4} fill={color} opacity={0.4} className="radar-pulse" />
                <g transform={`rotate(${vessel.headingDegrees})`} filter="url(#marker-glow)">
                  <path d="M0,-5 L3.4,3 L0,1.4 L-3.4,3 Z" fill={color} stroke="#07090E" strokeWidth={0.5} />
                </g>
                {isSelected ? (
                  <circle r={7} fill="none" stroke="#00F5FF" strokeWidth={1} opacity={0.9} />
                ) : null}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip for ports */}
        {hoveredPort && hoverTooltipPos ? (
          <div
            className="pointer-events-none absolute z-20 w-48 rounded-lg border border-[#00F5FF]/40 bg-[#0D111A]/96 p-2 shadow-xl backdrop-blur-md"
            style={{
              left: `${(hoverTooltipPos.x / MAP_WIDTH) * 100}%`,
              top: `${(hoverTooltipPos.y / MAP_HEIGHT) * 100}%`,
              transform: 'translate(-50%, calc(-100% - 10px))',
            }}
          >
            <p className="font-mono text-[11px] font-semibold text-[#F1F5F9]">{hoveredPort.name}</p>
            <p className="text-[10px] text-[#94A3B8]">{hoveredPort.country} · {hoveredPort.code}</p>
            <div className="mt-1 flex items-center justify-between text-[10px]">
              <span className="text-[#94A3B8]">Wait</span>
              <span className="font-mono text-[#F1F5F9]">{hoveredPort.avgWaitHours}h</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#94A3B8]">Berths</span>
              <span className="font-mono text-[#F1F5F9]">{hoveredPort.berths}</span>
            </div>
            <div className="mt-1">
              <Badge tone={PORT_STATUS_TONE[hoveredPort.status]}>{hoveredPort.status.replace('_', ' ')}</Badge>
            </div>
          </div>
        ) : null}

        {/* Legend */}
        <div className="pointer-events-none absolute bottom-2 left-2 flex flex-wrap gap-3 rounded-md border border-[#1E2C42] bg-[#0D111A]/85 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wide text-[#94A3B8]">
          <span className="flex items-center gap-1"><StatusDot tone="cyan" /> Vessel</span>
          <span className="flex items-center gap-1"><StatusDot tone="emerald" /> Optimal</span>
          <span className="flex items-center gap-1"><StatusDot tone="amber" /> Congested</span>
          <span className="flex items-center gap-1"><StatusDot tone="crimson" /> Severe</span>
          <span className="flex items-center gap-1"><StatusDot tone="violet" /> Air</span>
        </div>
      </div>

      <VesselInspectionDrawer
        vessel={selectedVessel}
        originPort={originPort}
        destPort={destPort}
        onClose={() => selectVessel(null)}
      />
    </div>
  );
}

function VesselInspectionDrawer({
  vessel,
  originPort,
  destPort,
  onClose,
}: {
  vessel: Vessel | null;
  originPort: PortNode | undefined;
  destPort: PortNode | undefined;
  onClose: () => void;
}) {
  return (
    <Drawer
      open={vessel !== null}
      onClose={onClose}
      title={vessel?.name ?? 'Vessel'}
      subtitle={vessel ? `${vessel.mode.toUpperCase()} · ${vessel.callsign}` : undefined}
      icon={<Ship className="h-5 w-5 text-[#00F5FF]" />}
      accent="cyan"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#1E2C42] py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] hover:text-[#F1F5F9]"
        >
          <X className="h-3.5 w-3.5" /> Close Inspection
        </button>
      }
    >
      {vessel ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge tone={vessel.status === 'diverted' ? 'crimson' : vessel.status === 'underway' ? 'emerald' : 'amber'}>
              {vessel.status}
            </Badge>
            <Badge tone="cyan">{vessel.mode}</Badge>
            <span className="ml-auto font-mono text-[10px] text-[#94A3B8]">
              {formatRelativeTime(vessel.lastUpdated)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat icon={<Gauge className="h-3.5 w-3.5" />} label="Speed" value={formatKnots(vessel.speedKnots)} sub={formatKmh(vessel.speedKnots)} />
            <Stat icon={<Compass className="h-3.5 w-3.5" />} label="Heading" value={formatHeading(vessel.headingDegrees)} sub={`${Math.round(vessel.headingDegrees)}°`} />
            <Stat icon={<Navigation className="h-3.5 w-3.5" />} label="Route Progress" value={`${vessel.routeProgressPercent}%`} sub="of voyage" />
            <Stat icon={<Activity className="h-3.5 w-3.5" />} label="Cargo TEU" value={formatTeuCompact(vessel.currentTEU)} sub={`of ${formatTeuCompact(vessel.capacityTEU)}`} />
          </div>

          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              Voyage Route
            </p>
            <div className="flex items-center gap-2 text-xs">
              <Anchor className="h-3.5 w-3.5 text-[#10B981]" />
              <span className="font-mono text-[#F1F5F9]">{originPort?.code ?? '—'}</span>
              <span className="flex-1 border-t border-dashed border-[#1E2C42]" />
              <span className="font-mono text-[#00F5FF]">
                {formatCoordinate(vessel.lat, vessel.lng)}
              </span>
              <span className="flex-1 border-t border-dashed border-[#1E2C42]" />
              <Anchor className="h-3.5 w-3.5 text-[#00F5FF]" />
              <span className="font-mono text-[#F1F5F9]">{destPort?.code ?? '—'}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              Waypoints
            </p>
            <ol className="space-y-1.5">
              {vessel.waypoints.map((waypoint) => (
                <li key={`${waypoint.name}-${waypoint.estimatedArrival}`} className="flex items-center gap-2 text-[11px]">
                  <StatusDot
                    tone={
                      waypoint.status === 'passed'
                        ? 'emerald'
                        : waypoint.status === 'current'
                          ? 'cyan'
                          : 'muted'
                    }
                    pulse={waypoint.status === 'current'}
                  />
                  <span className={waypoint.status === 'upcoming' ? 'text-[#94A3B8]' : 'text-[#F1F5F9]'}>
                    {waypoint.name}
                  </span>
                  <span className="ml-auto font-mono text-[9px] text-[#94A3B8]">
                    {new Date(waypoint.estimatedArrival).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}

function Stat({
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
