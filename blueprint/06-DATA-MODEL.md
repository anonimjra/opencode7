# 06. Data Model & Schema Kontrak

```typescript
// types/supply-chain.ts

export type TransportMode = 'ocean' | 'air' | 'rail' | 'road';

export type ShipmentStatus = 
  | 'draft' 
  | 'booked' 
  | 'gate_in' 
  | 'loaded' 
  | 'at_sea' 
  | 'customs_hold' 
  | 'customs_cleared' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'exception';

export type VesselStatus = 'underway' | 'moored' | 'anchored' | 'maintenance' | 'diverted';

export type IncotermCode = 
  | 'EXW' | 'FCA' | 'CPT' | 'CIP' | 'DAP' | 'DPU' | 'DDP' 
  | 'FAS' | 'FOB' | 'CFR' | 'CIF';

export type IMDGHazardClass = 
  | '1_explosives' 
  | '2_gases' 
  | '3_flammable_liquids' 
  | '4_flammable_solids' 
  | '5_oxidizers' 
  | '6_toxics' 
  | '7_radioactive' 
  | '8_corrosives' 
  | '9_miscellaneous' 
  | 'none';

export interface PortNode {
  id: string;
  name: string;
  code: string; // e.g. SGSIN, NLRTM, CNSHA, IDJKT
  country: string;
  lat: number;
  lng: number;
  berths: number;
  avgWaitHours: number;
  status: 'optimal' | 'congested' | 'severe_delay';
}

export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  estimatedArrival: string;
  actualArrival?: string;
  status: 'passed' | 'current' | 'upcoming';
}

export interface Vessel {
  id: string;
  name: string;
  callsign: string;
  mmsi: string;
  imo: string;
  mode: TransportMode;
  capacityTEU: number;
  currentTEU: number;
  speedKnots: number;
  headingDegrees: number;
  lat: number;
  lng: number;
  originPortId: string;
  destPortId: string;
  routeProgressPercent: number;
  status: VesselStatus;
  engineRPM: number;
  fuelConsumptionLPerHr: number;
  co2EmissionsTon: number;
  waypoints: Waypoint[];
  captainName: string;
  lastUpdated: string;
}

export interface ContainerSlot {
  block: string; // e.g. "A", "B", "C", "D"
  bay: number;   // 1 - 6
  row: number;   // 1 - 4
  tier: number;  // 1 - 3
  containerNumber?: string;
  isoType?: string; // e.g. "40HC", "20GP", "40RF" (reefer)
  cargoCategory?: string;
  isReefer: boolean;
  reeferSetTemp?: number; // in Celsius
  hazardClass: IMDGHazardClass;
  weightGrossTon?: number;
  destinationPortCode?: string;
  status: 'empty' | 'occupied' | 'reserved' | 'inspecting';
}

export interface SensorTelemetryPoint {
  timestamp: string;
  temperatureC: number;
  humidityPercent: number;
  shockG: number;
  ambientLightLux: number;
  batteryPercent: number;
  isExcursion: boolean;
}

export interface Shipment {
  id: string;
  trackingNumber: string; // e.g. "AETH-9824-71"
  bolNumber: string;      // Bill of Lading
  shipperName: string;
  consigneeName: string;
  notifyParty: string;
  mode: TransportMode;
  vesselId: string;
  originPortId: string;
  destPortId: string;
  incoterm: IncotermCode;
  cargoDescription: string;
  hsCode: string;
  containers: string[];   // Container Numbers
  weightKg: number;
  volumeCbm: number;
  declaredValueUsd: number;
  bookingDate: string;
  departureDate: string;
  eta: string;
  actualDeliveryDate?: string;
  status: ShipmentStatus;
  isColdChain: boolean;
  targetTempC?: number;
  telemetryHistory?: SensorTelemetryPoint[];
  milestones: {
    title: string;
    description: string;
    timestamp: string;
    isCompleted: boolean;
    location: string;
  }[];
}

export interface CriticalAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'weather' | 'customs' | 'telemetry_excursion' | 'congestion' | 'geopolitical';
  title: string;
  message: string;
  relatedEntityId: string;
  timestamp: string;
  isAcknowledged: boolean;
}
```
