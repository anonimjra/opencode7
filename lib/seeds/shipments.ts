// lib/seeds/shipments.ts
// 64 international shipments with realistic cargo, ISO containers, and milestones.

import type {
  IncotermCode,
  Milestone,
  Shipment,
  ShipmentStatus,
  TransportMode,
} from '@/types/supply-chain';
import { SEED_PORTS } from './ports';
import { SEED_VESSELS } from './vessels';

interface CargoTemplate {
  description: string;
  hsCode: string;
  category: string;
  isColdChain: boolean;
  targetTempC?: number;
  unitValueUsd: number;
  estimatedWeightKgPerUnit: number;
  estimatedVolumeCbmPerUnit: number;
}

const CARGO_TEMPLATES: CargoTemplate[] = [
  {
    description: 'Microchips / Semiconductor Wafers',
    hsCode: '8542.31',
    category: 'Electronics',
    isColdChain: true,
    targetTempC: 20,
    unitValueUsd: 1_840_000,
    estimatedWeightKgPerUnit: 6400,
    estimatedVolumeCbmPerUnit: 18,
  },
  {
    description: 'Specialty Arabica Coffee Beans',
    hsCode: '0901.21',
    category: 'Agriculture',
    isColdChain: false,
    unitValueUsd: 186_000,
    estimatedWeightKgPerUnit: 22000,
    estimatedVolumeCbmPerUnit: 32,
  },
  {
    description: 'Teak Wood Luxury Furniture',
    hsCode: '9403.60',
    category: 'Furniture',
    isColdChain: false,
    unitValueUsd: 312_000,
    estimatedWeightKgPerUnit: 18400,
    estimatedVolumeCbmPerUnit: 58,
  },
  {
    description: 'Heavy Industrial Machinery',
    hsCode: '8479.89',
    category: 'Industrial',
    isColdChain: false,
    unitValueUsd: 920_000,
    estimatedWeightKgPerUnit: 46000,
    estimatedVolumeCbmPerUnit: 74,
  },
  {
    description: 'Pharmaceuticals / Ultra-low Vaccines',
    hsCode: '3002.20',
    category: 'Pharma',
    isColdChain: true,
    targetTempC: -20,
    unitValueUsd: 2_460_000,
    estimatedWeightKgPerUnit: 4200,
    estimatedVolumeCbmPerUnit: 14,
  },
  {
    description: 'Frozen Seafood (Tuna Loins)',
    hsCode: '0304.87',
    category: 'Seafood',
    isColdChain: true,
    targetTempC: -18,
    unitValueUsd: 268_000,
    estimatedWeightKgPerUnit: 24000,
    estimatedVolumeCbmPerUnit: 30,
  },
  {
    description: 'Fresh Beef Carcasses',
    hsCode: '0201.30',
    category: 'Meat',
    isColdChain: true,
    targetTempC: 2,
    unitValueUsd: 412_000,
    estimatedWeightKgPerUnit: 21000,
    estimatedVolumeCbmPerUnit: 33,
  },
  {
    description: 'Automotive EV Battery Packs',
    hsCode: '8507.60',
    category: 'Automotive',
    isColdChain: false,
    unitValueUsd: 1_120_000,
    estimatedWeightKgPerUnit: 30000,
    estimatedVolumeCbmPerUnit: 46,
  },
  {
    description: 'Cotton Textile Garments',
    hsCode: '6203.42',
    category: 'Apparel',
    isColdChain: false,
    unitValueUsd: 158_000,
    estimatedWeightKgPerUnit: 12500,
    estimatedVolumeCbmPerUnit: 62,
  },
  {
    description: 'Lithium-ion Cell Modules',
    hsCode: '8507.60',
    category: 'Electronics',
    isColdChain: false,
    unitValueUsd: 740_000,
    estimatedWeightKgPerUnit: 19000,
    estimatedVolumeCbmPerUnit: 27,
  },
  {
    description: 'Organic Palm Oil in Flexitanks',
    hsCode: '1511.10',
    category: 'Commodities',
    isColdChain: false,
    unitValueUsd: 224_000,
    estimatedWeightKgPerUnit: 33000,
    estimatedVolumeCbmPerUnit: 34,
  },
  {
    description: 'Insulated Vaccine Cold Boxes',
    hsCode: '3923.10',
    category: 'Pharma',
    isColdChain: true,
    targetTempC: 5,
    unitValueUsd: 990_000,
    estimatedWeightKgPerUnit: 5200,
    estimatedVolumeCbmPerUnit: 22,
  },
];

const SHIPPERS = [
  'Aether Semiconductor Corp',
  'Nusantara Agri Export',
  'Java Teak Industries',
  'Rhein Heavy Machinery GmbH',
  'Meridian Pharma Labs',
  'Pacific Blue Seafood Co',
  'Highland Beef Traders',
  'Volt Automotive Systems',
  'TexGlobal Apparel',
  'Sinopower Cell Tech',
  'Golden Palm Agri',
  'CryoLabs Medical',
];

const CONSIGNEES = [
  'Nordic Distribution AG',
  'Rotterdam Trade BV',
  'Pacific Rim Imports LLC',
  'Gulf Commercial Trading',
  'Tokyo Electronics Ltd',
  'London Pharma Supply',
  'Santos Logistics SA',
  'Shanghai Retail Group',
  'Seoul Auto Components',
  'Felixstowe Wholesale',
  'Los Angeles Freight Co',
  'Jakarta Retail Holdings',
];

const NOTIFY_PARTIES = [
  'Aether Global Logistics',
  'Oceanic Customs Brokers',
  'TransPacific Forwarding',
  'EuroPort Clearing',
  'Kaiyo Freight Services',
  'Atlantic Cargo Agents',
];

const INCOTERMS: IncotermCode[] = [
  'FOB',
  'CIF',
  'DDP',
  'EXW',
  'CFR',
  'FCA',
  'CPT',
  'DAP',
];

const STATUS_CYCLE: ShipmentStatus[] = [
  'at_sea',
  'delivered',
  'gate_in',
  'customs_hold',
  'customs_cleared',
  'out_for_delivery',
  'loaded',
  'at_sea',
  'exception',
  'booked',
  'delivered',
  'at_sea',
];

const MILESTONE_TEMPLATES: { title: string; description: string }[] = [
  { title: 'Booking Confirmed', description: 'Booking reference issued and space allocated.' },
  { title: 'Gate In Terminal', description: 'Container received at origin terminal gate.' },
  { title: 'Loaded on Vessel', description: 'Container loaded and lashed on board.' },
  { title: 'In Transit (At Sea)', description: 'Vessel departed and is underway.' },
  { title: 'Customs Cleared', description: 'Import customs released the shipment.' },
  { title: 'Out for Delivery', description: 'Cargo dispatched on final-mile leg.' },
  { title: 'Delivered', description: 'Cargo delivered to consignee and signed.' },
];

function padNumber(value: number, length: number): string {
  return String(value).padStart(length, '0');
}

function iso(daysOffset: number, hour = 8): string {
  const base = new Date('2024-05-01T08:00:00.000Z');
  const shifted = new Date(base.getTime() + daysOffset * 86_400_000 + hour * 3_600_000);
  return shifted.toISOString();
}

function containerPrefix(index: number): string {
  const prefixPool = ['MSKU', 'AETU', 'CMAU', 'EGHU', 'ONEU', 'COSU', 'HLCU', 'MSCU'];
  return prefixPool[index % prefixPool.length];
}

function isoContainerNumber(index: number, seq: number): string {
  const prefix = containerPrefix(index);
  const serial = padNumber(100000 + ((index * 37 + seq * 11) % 899999), 6);
  const checkDigit = (index + seq) % 10;
  return `${prefix}-${serial}-${checkDigit}`;
}

function containerCountForTemplate(template: CargoTemplate, index: number): number {
  const baseline = template.category === 'Electronics' || template.category === 'Pharma' ? 1 : 2;
  return baseline + (index % 2);
}

function buildMilestones(
  status: ShipmentStatus,
  originPortLabel: string,
  destPortLabel: string,
  baseDay: number,
): Milestone[] {
  const completionMap: Record<ShipmentStatus, number> = {
    draft: 0,
    booked: 1,
    gate_in: 2,
    loaded: 3,
    at_sea: 4,
    customs_hold: 4,
    customs_cleared: 5,
    out_for_delivery: 6,
    delivered: 7,
    exception: 4,
  };
  const completedCount = completionMap[status];
  return MILESTONE_TEMPLATES.map((template, index) => {
    const isCompleted = index < completedCount;
    const location =
      index <= 3 ? originPortLabel : index <= 5 ? destPortLabel : `${destPortLabel} · Consignee Gate`;
    return {
      title: template.title,
      description: template.description,
      timestamp: iso(baseDay + index * 2),
      isCompleted,
      location,
    };
  });
}

function resolveStatus(index: number): ShipmentStatus {
  return STATUS_CYCLE[index % STATUS_CYCLE.length];
}

function resolveMode(index: number): TransportMode {
  const modes: TransportMode[] = ['ocean', 'ocean', 'ocean', 'air', 'road', 'ocean'];
  return modes[index % modes.length];
}

function pickVesselForMode(mode: TransportMode, index: number): string {
  const candidates = SEED_VESSELS.filter((vessel) => vessel.mode === mode);
  const pool = candidates.length > 0 ? candidates : SEED_VESSELS;
  return pool[index % pool.length].id;
}

function createShipment(index: number): Shipment {
  const template = CARGO_TEMPLATES[index % CARGO_TEMPLATES.length];
  const mode = resolveMode(index);
  const origin = SEED_PORTS[index % SEED_PORTS.length];
  const dest = SEED_PORTS[(index * 5 + 3) % SEED_PORTS.length];
  const safeDest = dest.id === origin.id ? SEED_PORTS[(index + 7) % SEED_PORTS.length] : dest;
  const status = resolveStatus(index);
  const vesselId = pickVesselForMode(mode, index);
  const incoterm = INCOTERMS[index % INCOTERMS.length];

  const containerQty = containerCountForTemplate(template, index);
  const containers: string[] = [];
  for (let seq = 0; seq < containerQty; seq += 1) {
    containers.push(isoContainerNumber(index, seq));
  }

  const weightKg = Math.round(
    template.estimatedWeightKgPerUnit * (0.85 + ((index % 7) * 0.05)),
  );
  const volumeCbm = Math.round(
    template.estimatedVolumeCbmPerUnit * (0.9 + ((index % 5) * 0.04)),
  );
  const declaredValueUsd = Math.round(
    template.unitValueUsd * (0.7 + ((index % 9) * 0.06)),
  );

  const shipperName = SHIPPERS[index % SHIPPERS.length];
  const consigneeName = CONSIGNEES[(index * 3) % CONSIGNEES.length];
  const notifyParty = NOTIFY_PARTIES[index % NOTIFY_PARTIES.length];

  const bookingDay = (index % 30) - 20;
  const departureDay = bookingDay + 3;
  const etaDay = departureDay + 12 + (index % 10);
  const delivered = status === 'delivered';

  return {
    id: `shp-${padNumber(index + 1, 3)}`,
    trackingNumber: `AETH-${padNumber(9000 + index * 13, 4)}-${padNumber(index + 7, 2)}`,
    bolNumber: index % 2 === 0 ? `AETH-BL-${padNumber(88000 + index, 5)}` : `OC7-SEA-${padNumber(9900 + index, 4)}`,
    shipperName,
    consigneeName,
    notifyParty,
    mode,
    vesselId,
    originPortId: origin.id,
    destPortId: safeDest.id,
    incoterm,
    cargoDescription: template.description,
    hsCode: template.hsCode,
    containers,
    weightKg,
    volumeCbm,
    declaredValueUsd,
    bookingDate: iso(bookingDay),
    departureDate: iso(departureDay),
    eta: iso(etaDay),
    actualDeliveryDate: delivered ? iso(etaDay + 1) : undefined,
    status,
    isColdChain: template.isColdChain,
    targetTempC: template.targetTempC,
    milestones: buildMilestones(
      status,
      `${origin.name} (${origin.code})`,
      `${safeDest.name} (${safeDest.code})`,
      departureDay,
    ),
  };
}

export const SEED_SHIPMENTS: Shipment[] = Array.from({ length: 64 }, (_, index) =>
  createShipment(index),
);

export const SHIPMENTS_BY_ID: Record<string, Shipment> = SEED_SHIPMENTS.reduce<
  Record<string, Shipment>
>((accumulator, shipment) => {
  accumulator[shipment.id] = shipment;
  return accumulator;
}, {});

export function getShipmentById(id: string): Shipment | undefined {
  return SHIPMENTS_BY_ID[id];
}
