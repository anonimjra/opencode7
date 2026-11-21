// lib/utils/shipment-meta.ts
// Shared display metadata for shipment statuses.

import type { ShipmentStatus } from '@/types/supply-chain';

export type StatusTone = 'cyan' | 'emerald' | 'amber' | 'crimson' | 'violet' | 'muted';

export interface ShipmentStatusMeta {
  label: string;
  tone: StatusTone;
}

export const SHIPMENT_STATUS_META: Record<ShipmentStatus, ShipmentStatusMeta> = {
  draft: { label: 'Draft', tone: 'muted' },
  booked: { label: 'Booked', tone: 'cyan' },
  gate_in: { label: 'Gate In', tone: 'violet' },
  loaded: { label: 'Loaded', tone: 'cyan' },
  at_sea: { label: 'At Sea', tone: 'emerald' },
  customs_hold: { label: 'Customs Hold', tone: 'crimson' },
  customs_cleared: { label: 'Customs Cleared', tone: 'emerald' },
  out_for_delivery: { label: 'Out for Delivery', tone: 'amber' },
  delivered: { label: 'Delivered', tone: 'emerald' },
  exception: { label: 'Exception', tone: 'crimson' },
};

export const SHIPMENT_STATUS_ORDER: ShipmentStatus[] = [
  'draft',
  'booked',
  'gate_in',
  'loaded',
  'at_sea',
  'customs_hold',
  'customs_cleared',
  'out_for_delivery',
  'delivered',
  'exception',
];
