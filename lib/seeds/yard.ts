// lib/seeds/yard.ts
// 4 blocks × 6 bays × 4 rows × 3 tiers = 288 container yard slots.

import type {
  ContainerSlot,
  IMDGHazardClass,
  PortNode,
} from '@/types/supply-chain';
import { SEED_PORTS } from './ports';

export const YARD_BLOCKS = ['A', 'B', 'C', 'D'] as const;
export const YARD_BAYS = 6;
export const YARD_ROWS = 4;
export const YARD_TIERS = 3;

export const YARD_BLOCK_INFO: Record<string, { label: string; purpose: string }> = {
  A: { label: 'Block A', purpose: 'General Export Cargo' },
  B: { label: 'Block B', purpose: 'General Import Cargo' },
  C: { label: 'Block C', purpose: 'Dangerous Goods (IMDG)' },
  D: { label: 'Block D', purpose: 'Cold-Chain Reefer' },
};

const ISO_TYPES = ['40HC', '20GP', '40GP', '40RF', '20RF'];
const CARGO_CATEGORIES = [
  'Electronics',
  'Textiles',
  'Machinery',
  'Agriculture',
  'Pharma',
  'Seafood',
  'Automotive',
  'Chemicals',
];

const DESTINATION_CODES: string[] = SEED_PORTS.map((port: PortNode) => port.code);

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hazardForBlock(block: string, seed: number): IMDGHazardClass {
  if (block === 'C') {
    const pool: IMDGHazardClass[] = ['3_flammable_liquids', '5_oxidizers', '8_corrosives'];
    return pool[Math.floor(pseudoRandom(seed) * pool.length)];
  }
  return 'none';
}

function slotId(block: string, bay: number, row: number, tier: number): string {
  return `${block}-${bay}-${row}-${tier}`;
}

function buildSlot(
  block: string,
  bay: number,
  row: number,
  tier: number,
  index: number,
): ContainerSlot {
  const seed = index + 1;
  const random = pseudoRandom(seed);
  const occupancyRoll = pseudoRandom(seed * 1.7);
  const isReeferBlock = block === 'D';
  const isHazardBlock = block === 'C';

  // Bottom tiers are most likely occupied; higher tiers progressively less so.
  const tierThreshold = tier === 1 ? 0.22 : tier === 2 ? 0.5 : 0.75;
  const isOccupied = occupancyRoll > tierThreshold;

  if (!isOccupied) {
    const isReserved = pseudoRandom(seed * 3.3) > 0.85;
    const isInspecting = !isReserved && pseudoRandom(seed * 4.1) > 0.92;
    return {
      id: slotId(block, bay, row, tier),
      block,
      bay,
      row,
      tier,
      isReefer: false,
      hazardClass: 'none',
      status: isReserved ? 'reserved' : isInspecting ? 'inspecting' : 'empty',
    };
  }

  const isoType = isReeferBlock
    ? random > 0.4
      ? '40RF'
      : '20RF'
    : ISO_TYPES[Math.floor(random * 3)];
  const reeferSetTemp = isReeferBlock ? -20 + Math.round(pseudoRandom(seed * 5.5) * 26) : undefined;
  const reeferActualTemp =
    isReeferBlock && reeferSetTemp !== undefined
      ? reeferSetTemp + (pseudoRandom(seed * 6.7) * 1.6 - 0.8)
      : undefined;
  const prefix = ['MSKU', 'AETU', 'CMAU', 'EGHU', 'ONEU'][Math.floor(pseudoRandom(seed * 7.9) * 5)];
  const serial = String(100000 + Math.floor(pseudoRandom(seed * 8.3) * 899999));
  const checkDigit = Math.floor(pseudoRandom(seed * 9.1) * 10);

  return {
    id: slotId(block, bay, row, tier),
    block,
    bay,
    row,
    tier,
    containerNumber: `${prefix}-${serial}-${checkDigit}`,
    isoType,
    cargoCategory:
      CARGO_CATEGORIES[Math.floor(pseudoRandom(seed * 2.2) * CARGO_CATEGORIES.length)],
    isReefer: isReeferBlock,
    reeferSetTemp,
    reeferActualTemp,
    hazardClass: isHazardBlock ? hazardForBlock(block, seed) : 'none',
    weightGrossTon: Math.round((8 + pseudoRandom(seed * 4.4) * 24) * 10) / 10,
    destinationPortCode: DESTINATION_CODES[Math.floor(pseudoRandom(seed * 3.9) * DESTINATION_CODES.length)],
    status: 'occupied',
    sealNumber: `SL-${String(100000 + Math.floor(pseudoRandom(seed * 5.1) * 899999))}`,
  };
}

export function buildYardSlots(): ContainerSlot[] {
  const slots: ContainerSlot[] = [];
  let index = 0;
  for (const block of YARD_BLOCKS) {
    for (let bay = 1; bay <= YARD_BAYS; bay += 1) {
      for (let row = 1; row <= YARD_ROWS; row += 1) {
        for (let tier = 1; tier <= YARD_TIERS; tier += 1) {
          slots.push(buildSlot(block, bay, row, tier, index));
          index += 1;
        }
      }
    }
  }
  return slots;
}

export const SEED_YARD_SLOTS: ContainerSlot[] = buildYardSlots();

export function getSlotsByBlock(slots: ContainerSlot[], block: string): ContainerSlot[] {
  return slots.filter((slot) => slot.block === block);
}

export function isSlotCompatible(slot: ContainerSlot, hazardClass: IMDGHazardClass): boolean {
  if (hazardClass !== 'none') {
    return slot.block === 'C';
  }
  return true;
}

export function isReeferCompatible(slot: ContainerSlot, isReefer: boolean): boolean {
  if (isReefer) {
    return slot.block === 'D';
  }
  return slot.block !== 'D';
}
