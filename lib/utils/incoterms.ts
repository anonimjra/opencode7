// lib/utils/incoterms.ts
// Incoterms 2020 responsibility matrix and risk transfer logic.

import type { IncotermCode } from '@/types/supply-chain';

export type TransportScope = 'any' | 'sea';

export interface IncotermRule {
  code: IncotermCode;
  name: string;
  scope: TransportScope;
  riskTransferPoint: string;
  sellerPaysFreight: boolean;
  sellerPaysInsurance: boolean;
  sellerPaysExportCustoms: boolean;
  sellerPaysImportCustoms: boolean;
  sellerPaysUnloading: boolean;
  description: string;
}

/**
 * Responsibility stages used to render the 7-step obligation diagram.
 */
export interface IncotermStage {
  key: string;
  label: string;
}

export const INCOTERM_STAGES: IncotermStage[] = [
  { key: 'factory', label: 'Factory Loading' },
  { key: 'inland_origin', label: 'Inland Origin' },
  { key: 'export_customs', label: 'Export Customs' },
  { key: 'origin_terminal', label: 'Origin Terminal' },
  { key: 'main_carriage', label: 'Main Carriage' },
  { key: 'import_customs', label: 'Import Customs' },
  { key: 'final_delivery', label: 'Final Delivery' },
];

/**
 * Seller responsibility per stage for each incoterm.
 * true = seller bears cost/risk at that stage.
 */
export const INCOTERM_SELLER_STAGES: Record<IncotermCode, boolean[]> = {
  EXW: [false, false, false, false, false, false, false],
  FCA: [true, true, true, false, false, false, false],
  CPT: [true, true, true, true, true, false, false],
  CIP: [true, true, true, true, true, false, false],
  DAP: [true, true, true, true, true, false, true],
  DPU: [true, true, true, true, true, false, true],
  DDP: [true, true, true, true, true, true, true],
  FAS: [true, true, true, false, false, false, false],
  FOB: [true, true, true, true, false, false, false],
  CFR: [true, true, true, true, true, false, false],
  CIF: [true, true, true, true, true, false, false],
};

export const INCOTERM_RULES: Record<IncotermCode, IncotermRule> = {
  EXW: {
    code: 'EXW',
    name: 'Ex Works',
    scope: 'any',
    riskTransferPoint: 'At seller premises (goods made available)',
    sellerPaysFreight: false,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: false,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Seller makes goods available at own premises. Buyer bears all costs and risks of moving goods to destination.',
  },
  FCA: {
    code: 'FCA',
    name: 'Free Carrier',
    scope: 'any',
    riskTransferPoint: 'When goods handed to carrier nominated by buyer',
    sellerPaysFreight: false,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Seller delivers goods cleared for export to the carrier nominated by the buyer at the named place.',
  },
  CPT: {
    code: 'CPT',
    name: 'Carriage Paid To',
    scope: 'any',
    riskTransferPoint: 'When goods handed to first carrier',
    sellerPaysFreight: true,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Seller pays carriage to the named destination. Risk transfers to buyer once goods are handed to the first carrier.',
  },
  CIP: {
    code: 'CIP',
    name: 'Carriage and Insurance Paid To',
    scope: 'any',
    riskTransferPoint: 'When goods handed to first carrier',
    sellerPaysFreight: true,
    sellerPaysInsurance: true,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Like CPT, but seller also contracts for insurance covering buyer’s risk (All Risks, Clause A).',
  },
  DAP: {
    code: 'DAP',
    name: 'Delivered At Place',
    scope: 'any',
    riskTransferPoint: 'At named place of destination, ready for unloading',
    sellerPaysFreight: true,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Seller delivers goods at the buyer’s disposal at the named place, ready for unloading. Buyer clears import.',
  },
  DPU: {
    code: 'DPU',
    name: 'Delivered at Place Unloaded',
    scope: 'any',
    riskTransferPoint: 'After unloading at named destination',
    sellerPaysFreight: true,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: true,
    description:
      'Seller delivers and unloads goods at the named place. The only Incoterm where seller must unload.',
  },
  DDP: {
    code: 'DDP',
    name: 'Delivered Duty Paid',
    scope: 'any',
    riskTransferPoint: 'At named destination, cleared for import',
    sellerPaysFreight: true,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: true,
    sellerPaysUnloading: false,
    description:
      'Seller bears all costs and risks including import duties and taxes to the named destination.',
  },
  FAS: {
    code: 'FAS',
    name: 'Free Alongside Ship',
    scope: 'sea',
    riskTransferPoint: 'When goods placed alongside the vessel at origin port',
    sellerPaysFreight: false,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Sea-only. Seller delivers goods alongside the vessel nominated by the buyer at the named port of shipment.',
  },
  FOB: {
    code: 'FOB',
    name: 'Free On Board',
    scope: 'sea',
    riskTransferPoint: 'When goods are on board the vessel at origin port',
    sellerPaysFreight: false,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Sea-only. Seller delivers goods on board the vessel nominated by the buyer at the named port of shipment.',
  },
  CFR: {
    code: 'CFR',
    name: 'Cost and Freight',
    scope: 'sea',
    riskTransferPoint: 'When goods are on board the vessel at origin port',
    sellerPaysFreight: true,
    sellerPaysInsurance: false,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Sea-only. Seller pays cost and freight to the destination port, but risk transfers at loading on board.',
  },
  CIF: {
    code: 'CIF',
    name: 'Cost, Insurance and Freight',
    scope: 'sea',
    riskTransferPoint: 'When goods are on board the vessel at origin port',
    sellerPaysFreight: true,
    sellerPaysInsurance: true,
    sellerPaysExportCustoms: true,
    sellerPaysImportCustoms: false,
    sellerPaysUnloading: false,
    description:
      'Sea-only. Like CFR, but seller also provides minimum insurance cover (Clause C) to the destination port.',
  },
};

export const ALL_INCOTERMS: IncotermCode[] = [
  'EXW',
  'FCA',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
  'FAS',
  'FOB',
  'CFR',
  'CIF',
];

export const ANY_MODE_INCOTERMS: IncotermCode[] = [
  'EXW',
  'FCA',
  'CPT',
  'CIP',
  'DAP',
  'DPU',
  'DDP',
];

export const SEA_MODE_INCOTERMS: IncotermCode[] = ['FAS', 'FOB', 'CFR', 'CIF'];

export function getIncotermRule(code: IncotermCode): IncotermRule {
  return INCOTERM_RULES[code];
}

export function isValidIncotermForMode(
  code: IncotermCode,
  isSeaMode: boolean,
): boolean {
  const rule = INCOTERM_RULES[code];
  if (rule.scope === 'any') return true;
  return isSeaMode;
}

export function getSellerStages(code: IncotermCode): boolean[] {
  return INCOTERM_SELLER_STAGES[code];
}

export function describeResponsibility(code: IncotermCode): {
  freightPayer: 'seller' | 'buyer';
  insurancePayer: 'seller' | 'buyer';
  importCustomsPayer: 'seller' | 'buyer';
} {
  const rule = INCOTERM_RULES[code];
  return {
    freightPayer: rule.sellerPaysFreight ? 'seller' : 'buyer',
    insurancePayer: rule.sellerPaysInsurance ? 'seller' : 'buyer',
    importCustomsPayer: rule.sellerPaysImportCustoms ? 'seller' : 'buyer',
  };
}
