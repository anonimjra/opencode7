// types/supply-chain.ts
// Centralized type contracts for the Aether OS control tower platform.

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

export type VesselStatus =
  | 'underway'
  | 'moored'
  | 'anchored'
  | 'maintenance'
  | 'diverted';

export type IncotermCode =
  | 'EXW'
  | 'FCA'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DPU'
  | 'DDP'
  | 'FAS'
  | 'FOB'
  | 'CFR'
  | 'CIF';

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

export type PortStatus = 'optimal' | 'congested' | 'severe_delay';

export interface PortNode {
  id: string;
  name: string;
  code: string;
  country: string;
  lat: number;
  lng: number;
  berths: number;
  avgWaitHours: number;
  status: PortStatus;
}

export type WaypointStatus = 'passed' | 'current' | 'upcoming';

export interface Waypoint {
  name: string;
  lat: number;
  lng: number;
  estimatedArrival: string;
  actualArrival?: string;
  status: WaypointStatus;
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

export type ContainerStatus = 'empty' | 'occupied' | 'reserved' | 'inspecting';

export interface ContainerSlot {
  id: string;
  block: string;
  bay: number;
  row: number;
  tier: number;
  containerNumber?: string;
  isoType?: string;
  cargoCategory?: string;
  isReefer: boolean;
  reeferSetTemp?: number;
  reeferActualTemp?: number;
  hazardClass: IMDGHazardClass;
  weightGrossTon?: number;
  destinationPortCode?: string;
  status: ContainerStatus;
  sealNumber?: string;
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

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertCategory =
  | 'weather'
  | 'customs'
  | 'telemetry_excursion'
  | 'congestion'
  | 'geopolitical';

export interface CriticalAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  message: string;
  relatedEntityId: string;
  timestamp: string;
  isAcknowledged: boolean;
}

export interface Milestone {
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  location: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  bolNumber: string;
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
  containers: string[];
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
  milestones: Milestone[];
}

export interface DisruptionIncident {
  id: string;
  title: string;
  category: AlertCategory;
  region: string;
  severity: AlertSeverity;
  chokepoint: string;
  lat: number;
  lng: number;
  description: string;
  status: 'active' | 'monitoring' | 'resolved';
  affectedVesselIds: string[];
  startDate: string;
  impactPercent: number;
}

export type RestStatus = 'driving' | 'on_duty' | 'sleeper' | 'off_duty' | 'violation';

export interface DriverHOS {
  id: string;
  driverName: string;
  vesselOrTruckId: string;
  role: 'captain' | 'pilot' | 'driver' | 'engineer';
  drivingHoursToday: number;
  maxDrivingHours: number;
  shiftHoursElapsed: number;
  maxShiftHours: number;
  restStatus: RestStatus;
  requiredRestHours: number;
}

export interface TariffCalculation {
  oceanBase: number;
  baf: number;
  caf: number;
  pss: number;
  thcOrigin: number;
  thcDestination: number;
  total: number;
}

export interface DemurrageTierDetail {
  tierLabel: string;
  days: number;
  ratePerDay: number;
  subtotal: number;
}

export interface DemurrageCalculation {
  portFreeDays: number;
  daysInPort: number;
  chargeableDays: number;
  tiers: DemurrageTierDetail[];
  tier1Fee: number;
  tier2Fee: number;
  totalPenalty: number;
  isOverdue: boolean;
}

export interface MaintenanceComponent {
  id: string;
  vesselId: string;
  componentName: string;
  healthPercent: number;
  daysToService: number;
  lastServiceDate: string;
  status: 'nominal' | 'watch' | 'critical';
}

export interface MaintenanceLog {
  id: string;
  vesselId: string;
  componentId: string;
  note: string;
  performedAt: string;
  technician: string;
}

export interface CustomsRiskResult {
  channel: 'green' | 'yellow' | 'red';
  riskScore: number;
  importDutyPercent: number;
  importDutyUsd: number;
  vatPercent: number;
  vatUsd: number;
  estimatedClearanceHours: number;
  recommendations: string[];
}

export type FleetFilter = 'all' | 'ocean' | 'air' | 'ground';

export interface ActiveFilters {
  shipmentStatus: ShipmentStatus | 'all';
  transportMode: TransportMode | 'all';
  incoterm: IncotermCode | 'all';
  fleetMode: FleetFilter;
  search: string;
}
