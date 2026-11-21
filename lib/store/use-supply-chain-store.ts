// lib/store/use-supply-chain-store.ts
// Global reactive Zustand store with LocalStorage persistence.

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ActiveFilters,
  ContainerSlot,
  CriticalAlert,
  DisruptionIncident,
  DriverHOS,
  MaintenanceComponent,
  MaintenanceLog,
  PortNode,
  SensorTelemetryPoint,
  Shipment,
  ShipmentStatus,
  Vessel,
} from '@/types/supply-chain';
import { SEED_PORTS } from '@/lib/seeds/ports';
import { SEED_VESSELS } from '@/lib/seeds/vessels';
import { SEED_SHIPMENTS } from '@/lib/seeds/shipments';
import { buildYardSlots } from '@/lib/seeds/yard';
import { REEFER_SENSOR_PROFILES } from '@/lib/seeds/telemetry';
import { SEED_ALERTS, SEED_INCIDENTS } from '@/lib/seeds/incidents';
import { meanKineticTemperature } from '@/lib/utils/telematics';

export type SimulationSpeed = 1 | 5 | 10;

export interface ReeferTelemetryRecord {
  containerNumber: string;
  cargoType: string;
  targetTempC: number;
  history: SensorTelemetryPoint[];
}

export interface ActiveRoute {
  id: string;
  name: string;
  fromPortId: string;
  toPortId: string;
  color: string;
}

export interface SupplyChainState {
  ports: PortNode[];
  vessels: Vessel[];
  shipments: Shipment[];
  yardSlots: ContainerSlot[];
  incidents: DisruptionIncident[];
  alerts: CriticalAlert[];
  reeferTelemetry: ReeferTelemetryRecord[];
  driverHos: DriverHOS[];
  maintenanceComponents: MaintenanceComponent[];
  maintenanceLogs: MaintenanceLog[];
  selectedVesselId: string | null;
  selectedShipmentId: string | null;
  activeFilters: ActiveFilters;
  simulationSpeed: SimulationSpeed;
  audioMuted: boolean;
  lastRefreshAt: string;
}

export interface SupplyChainActions {
  addShipment: (shipment: Shipment) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
  advanceShipmentMilestone: (id: string) => void;
  updateVesselCoordinates: (id: string, lat: number, lng: number, speed: number) => void;
  addVessel: (vessel: Vessel) => void;
  relocateContainer: (sourceSlotId: string, targetSlotId: string) => boolean;
  acknowledgeAlert: (id: string) => void;
  declareIncident: (incident: CriticalAlert) => void;
  addIncident: (incident: DisruptionIncident) => void;
  selectVessel: (id: string | null) => void;
  selectShipment: (id: string | null) => void;
  setFilters: (partial: Partial<ActiveFilters>) => void;
  resetFilters: () => void;
  setSimulationSpeed: (speed: SimulationSpeed) => void;
  toggleAudioMute: () => void;
  injectTelemetryAnomaly: (
    containerNumber: string,
    temperatureSpike: number,
    shockG: number,
  ) => void;
  addMaintenanceLog: (log: MaintenanceLog) => void;
  resetToSeed: () => void;
}

export type SupplyChainStore = SupplyChainState & SupplyChainActions;

const STORAGE_KEY = 'aether-supply-chain-storage';

const DEFAULT_FILTERS: ActiveFilters = {
  shipmentStatus: 'all',
  transportMode: 'all',
  incoterm: 'all',
  fleetMode: 'all',
  search: '',
};

const MILESTONE_SEQUENCE: ShipmentStatus[] = [
  'booked',
  'gate_in',
  'loaded',
  'at_sea',
  'customs_cleared',
  'out_for_delivery',
  'delivered',
];

function buildSeedDriverHos(vessels: Vessel[]): DriverHOS[] {
  return vessels
    .filter((vessel) => vessel.mode === 'road' || vessel.mode === 'ocean')
    .slice(0, 12)
    .map((vessel, index): DriverHOS => {
      const drivingHours = Math.round((2.5 + ((index * 1.7) % 8.5)) * 10) / 10;
      const shift = Math.round((drivingHours + 3 + (index % 4)) * 10) / 10;
      const violation = drivingHours >= 10.5 || shift >= 13.5;
      return {
        id: `hos-${vessel.id}`,
        driverName: vessel.captainName,
        vesselOrTruckId: vessel.id,
        role: vessel.mode === 'ocean' ? 'captain' : 'driver',
        drivingHoursToday: drivingHours,
        maxDrivingHours: 11,
        shiftHoursElapsed: shift,
        maxShiftHours: 14,
        requiredRestHours: Math.max(0, Math.round((11 - drivingHours) * 10) / 10),
        restStatus: violation ? 'violation' : drivingHours > 8 ? 'on_duty' : 'driving',
      };
    });
}

const MAINTENANCE_COMPONENTS = [
  'Main Engine Turbine',
  'Aux Generators',
  'Hull Bio-fouling Resistance',
  'Rudder Hydraulics',
];

function buildSeedMaintenance(vessels: Vessel[]): MaintenanceComponent[] {
  const components: MaintenanceComponent[] = [];
  vessels
    .filter((vessel) => vessel.mode === 'ocean')
    .forEach((vessel, vesselIndex) => {
      MAINTENANCE_COMPONENTS.forEach((componentName, componentIndex) => {
        const health = Math.max(38, 96 - ((vesselIndex * 7 + componentIndex * 11) % 58));
        const days = Math.max(4, 60 - ((vesselIndex * 5 + componentIndex * 9) % 56));
        components.push({
          id: `mnt-${vessel.id}-${componentIndex}`,
          vesselId: vessel.id,
          componentName,
          healthPercent: health,
          daysToService: days,
          lastServiceDate: new Date(
            Date.now() - ((vesselIndex * 3 + componentIndex) % 90) * 86_400_000,
          ).toISOString(),
          status: health < 55 ? 'critical' : health < 75 ? 'watch' : 'nominal',
        });
      });
    });
  return components;
}

function buildSeedReeferTelemetry(): ReeferTelemetryRecord[] {
  return REEFER_SENSOR_PROFILES.map((profile) => ({
    containerNumber: profile.containerNumber,
    cargoType: profile.cargoType,
    targetTempC: profile.targetTempC,
    history: profile.history,
  }));
}

function buildInitialState(): SupplyChainState {
  const vessels = SEED_VESSELS.map((vessel) => ({ ...vessel }));
  return {
    ports: SEED_PORTS.map((port) => ({ ...port })),
    vessels,
    shipments: SEED_SHIPMENTS.map((shipment) => ({ ...shipment })),
    yardSlots: buildYardSlots(),
    incidents: SEED_INCIDENTS.map((incident) => ({ ...incident })),
    alerts: SEED_ALERTS.map((alert) => ({ ...alert })),
    reeferTelemetry: buildSeedReeferTelemetry(),
    driverHos: buildSeedDriverHos(vessels),
    maintenanceComponents: buildSeedMaintenance(vessels),
    maintenanceLogs: [],
    selectedVesselId: null,
    selectedShipmentId: null,
    activeFilters: { ...DEFAULT_FILTERS },
    simulationSpeed: 1,
    audioMuted: false,
    lastRefreshAt: new Date().toISOString(),
  };
}

function nextMilestoneStatus(current: ShipmentStatus): ShipmentStatus {
  const index = MILESTONE_SEQUENCE.indexOf(current);
  if (index === -1 || index >= MILESTONE_SEQUENCE.length - 1) {
    return current;
  }
  return MILESTONE_SEQUENCE[index + 1];
}

export const useSupplyChainStore = create<SupplyChainStore>()(
  persist(
    (set, get) => ({
      ...buildInitialState(),

      addShipment: (shipment) =>
        set((state) => ({
          shipments: [shipment, ...state.shipments],
          lastRefreshAt: new Date().toISOString(),
        })),

      updateShipmentStatus: (id, status) =>
        set((state) => ({
          shipments: state.shipments.map((shipment) =>
            shipment.id === id ? { ...shipment, status } : shipment,
          ),
        })),

      advanceShipmentMilestone: (id) =>
        set((state) => ({
          shipments: state.shipments.map((shipment) => {
            if (shipment.id !== id) return shipment;
            const nextStatus = nextMilestoneStatus(shipment.status);
            const milestones = shipment.milestones.map((milestone, index) => {
              const completedCount = MILESTONE_SEQUENCE.indexOf(nextStatus) + 1;
              return {
                ...milestone,
                isCompleted: index < completedCount ? true : milestone.isCompleted,
                timestamp:
                  index === completedCount - 1
                    ? new Date().toISOString()
                    : milestone.timestamp,
              };
            });
            return {
              ...shipment,
              status: nextStatus,
              actualDeliveryDate:
                nextStatus === 'delivered' ? new Date().toISOString() : shipment.actualDeliveryDate,
              milestones,
            };
          }),
        })),

      updateVesselCoordinates: (id, lat, lng, speed) =>
        set((state) => ({
          vessels: state.vessels.map((vessel) =>
            vessel.id === id
              ? {
                  ...vessel,
                  lat,
                  lng,
                  speedKnots: speed,
                  lastUpdated: new Date().toISOString(),
                }
              : vessel,
          ),
        })),

      addVessel: (vessel) =>
        set((state) => ({
          vessels: [vessel, ...state.vessels],
          driverHos: [
            {
              id: `hos-${vessel.id}`,
              driverName: vessel.captainName,
              vesselOrTruckId: vessel.id,
              role: vessel.mode === 'ocean' ? 'captain' : vessel.mode === 'air' ? 'pilot' : 'driver',
              drivingHoursToday: 0,
              maxDrivingHours: 11,
              shiftHoursElapsed: 0,
              maxShiftHours: 14,
              requiredRestHours: 11,
              restStatus: 'off_duty',
            },
            ...state.driverHos,
          ],
        })),

      relocateContainer: (sourceSlotId, targetSlotId) => {
        const state = get();
        const source = state.yardSlots.find((slot) => slot.id === sourceSlotId);
        const target = state.yardSlots.find((slot) => slot.id === targetSlotId);
        if (!source || !target || !source.containerNumber) return false;
        if (target.status === 'occupied') return false;

        const movingPayload: ContainerSlot = {
          ...target,
          containerNumber: source.containerNumber,
          isoType: source.isoType,
          cargoCategory: source.cargoCategory,
          isReefer: source.isReefer,
          reeferSetTemp: source.isReefer ? source.reeferSetTemp ?? target.reeferSetTemp : undefined,
          reeferActualTemp: source.isReefer ? source.reeferActualTemp : undefined,
          hazardClass: source.hazardClass,
          weightGrossTon: source.weightGrossTon,
          destinationPortCode: source.destinationPortCode,
          sealNumber: source.sealNumber,
          status: 'occupied',
        };

        const emptiedSource: ContainerSlot = {
          ...source,
          containerNumber: undefined,
          isoType: undefined,
          cargoCategory: undefined,
          isReefer: false,
          reeferSetTemp: undefined,
          reeferActualTemp: undefined,
          hazardClass: 'none',
          weightGrossTon: undefined,
          destinationPortCode: undefined,
          sealNumber: undefined,
          status: 'empty',
        };

        set({
          yardSlots: state.yardSlots.map((slot) => {
            if (slot.id === sourceSlotId) return emptiedSource;
            if (slot.id === targetSlotId) return movingPayload;
            return slot;
          }),
        });
        return true;
      },

      acknowledgeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, isAcknowledged: true } : alert,
          ),
        })),

      declareIncident: (incident) =>
        set((state) => ({
          alerts: [incident, ...state.alerts],
          lastRefreshAt: new Date().toISOString(),
        })),

      addIncident: (incident) =>
        set((state) => ({
          incidents: [incident, ...state.incidents],
        })),

      selectVessel: (id) => set({ selectedVesselId: id }),

      selectShipment: (id) => set({ selectedShipmentId: id }),

      setFilters: (partial) =>
        set((state) => ({
          activeFilters: { ...state.activeFilters, ...partial },
        })),

      resetFilters: () => set({ activeFilters: { ...DEFAULT_FILTERS } }),

      setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),

      toggleAudioMute: () => set((state) => ({ audioMuted: !state.audioMuted })),

      injectTelemetryAnomaly: (containerNumber, temperatureSpike, shockG) =>
        set((state) => {
          const now = new Date().toISOString();
          const updatedTelemetry = state.reeferTelemetry.map((record) => {
            if (record.containerNumber !== containerNumber) return record;
            const last = record.history[record.history.length - 1];
            const spikePoint: SensorTelemetryPoint = {
              timestamp: now,
              temperatureC: Math.round((record.targetTempC + temperatureSpike) * 10) / 10,
              humidityPercent: Math.min(96, (last?.humidityPercent ?? 60) + 12),
              shockG,
              ambientLightLux: (last?.ambientLightLux ?? 120) + 40,
              batteryPercent: last?.batteryPercent ?? 80,
              isExcursion: true,
            };
            return { ...record, history: [...record.history, spikePoint] };
          });

          const record = updatedTelemetry.find((item) => item.containerNumber === containerNumber);
          const mkt = record ? meanKineticTemperature(record.history.map((p) => p.temperatureC)) : null;

          const alert: CriticalAlert = {
            id: `alert-${Date.now()}`,
            severity: 'critical',
            category: 'telemetry_excursion',
            title: `Sensor Anomaly Injected — ${containerNumber}`,
            message: `Simulated excursion: +${temperatureSpike.toFixed(
              1,
            )}°C and ${shockG.toFixed(1)}G shock. Estimated MKT ${mkt?.toFixed(1) ?? '—'}°C.`,
            relatedEntityId: containerNumber,
            timestamp: now,
            isAcknowledged: false,
          };

          return {
            reeferTelemetry: updatedTelemetry,
            alerts: [alert, ...state.alerts],
          };
        }),

      addMaintenanceLog: (log) =>
        set((state) => ({
          maintenanceLogs: [log, ...state.maintenanceLogs],
          maintenanceComponents: state.maintenanceComponents.map((component) =>
            component.id === log.componentId
              ? {
                  ...component,
                  healthPercent: Math.min(100, component.healthPercent + 12),
                  lastServiceDate: new Date().toISOString(),
                  status: component.healthPercent + 12 >= 75 ? 'nominal' : 'watch',
                }
              : component,
          ),
        })),

      resetToSeed: () => set({ ...buildInitialState() }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
);
