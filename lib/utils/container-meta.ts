// lib/utils/container-meta.ts
// Shared display metadata for containers, IMDG hazard classes and yard blocks.

import type { IMDGHazardClass, PortNode } from '@/types/supply-chain';

export interface HazardMeta {
  short: string;
  label: string;
  color: string;
  description: string;
}

export const IMDG_META: Record<IMDGHazardClass, HazardMeta> = {
  '1_explosives': {
    short: '1',
    label: 'Class 1 — Explosives',
    color: '#EF4444',
    description: 'Mass explosion hazard. Strict segregation and exclusive storage required.',
  },
  '2_gases': {
    short: '2',
    label: 'Class 2 — Gases',
    color: '#F59E0B',
    description: 'Compressed, liquefied or dissolved gases. Ventilated segregation required.',
  },
  '3_flammable_liquids': {
    short: '3',
    label: 'Class 3 — Flammable Liquids',
    color: '#EF4444',
    description: 'Flammable liquids with flash points below 60°C. Fire suppression standby.',
  },
  '4_flammable_solids': {
    short: '4',
    label: 'Class 4 — Flammable Solids',
    color: '#F59E0B',
    description: 'Readily combustible solids, spontaneously combustible or water-reactive.',
  },
  '5_oxidizers': {
    short: '5',
    label: 'Class 5 — Oxidizers',
    color: '#F59E0B',
    description: 'Oxidizing substances and organic peroxides; may intensify combustion.',
  },
  '6_toxics': {
    short: '6',
    label: 'Class 6 — Toxic Substances',
    color: '#EF4444',
    description: 'Toxic or infectious substances. Restricted access and PPE required.',
  },
  '7_radioactive': {
    short: '7',
    label: 'Class 7 — Radioactive',
    color: '#8B5CF6',
    description: 'Radioactive material. Specialized shielding and clearance required.',
  },
  '8_corrosives': {
    short: '8',
    label: 'Class 8 — Corrosives',
    color: '#EF4444',
    description: 'Corrosive substances that damage skin, metals or cargo on contact.',
  },
  '9_miscellaneous': {
    short: '9',
    label: 'Class 9 — Miscellaneous',
    color: '#94A3B8',
    description: 'Miscellaneous dangerous goods presenting a transport risk.',
  },
  none: {
    short: '—',
    label: 'No Hazard',
    color: '#94A3B8',
    description: 'General dry cargo without IMDG classification.',
  },
};

export function blockColorPalette(portCode: string | undefined): string {
  const palette = [
    '#00F5FF', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444',
    '#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#F87171',
  ];
  if (!portCode) return '#1E2C42';
  let hash = 0;
  for (let index = 0; index < portCode.length; index += 1) {
    hash = (hash * 31 + portCode.charCodeAt(index)) % palette.length;
  }
  return palette[hash];
}

export function portCodeFromId(ports: PortNode[], id: string | undefined): string {
  if (!id) return '—';
  return ports.find((port) => port.id === id)?.code ?? '—';
}
