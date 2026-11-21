// lib/utils/telematics.ts
// Maritime and cold-chain scientific formulas.

import type {
  DemurrageCalculation,
  DemurrageTierDetail,
  SensorTelemetryPoint,
  TransportMode,
} from '@/types/supply-chain';

/** Universal gas constant in kJ/(mol·K). */
export const GAS_CONSTANT_KJ = 0.0083144;

/** Reference temperature for MKT (Kelvin = 25°C). */
export const MKT_REFERENCE_TEMP_K = 298.15;

/** Activation energy for pharmaceutical degradation, kJ/mol (83.144 kJ/mol). */
export const MKT_ACTIVATION_ENERGY_KJ = 83.144;

export function celsiusToKelvin(celsius: number): number {
  return celsius + 273.15;
}

export function kelvinToCelsius(kelvin: number): number {
  return kelvin - 273.15;
}

/**
 * Mean Kinetic Temperature (Haynes equation / Arrhenius form):
 *
 *   Tk = (ΔH/R) / -ln( (1/n) Σ exp(-ΔH / (R·Ti)) )
 *
 * @param temperaturesCelsius Array of temperature readings in °C.
 * @param activationEnergyKj  Activation energy ΔH in kJ/mol (default 83.144).
 * @returns MKT value in °C, or null if input is empty.
 */
export function meanKineticTemperature(
  temperaturesCelsius: number[],
  activationEnergyKj: number = MKT_ACTIVATION_ENERGY_KJ,
): number | null {
  const valid = temperaturesCelsius.filter((t) => Number.isFinite(t));
  if (valid.length === 0) return null;

  const sum = valid.reduce((accumulator, celsius) => {
    const kelvin = celsiusToKelvin(celsius);
    const exponent = -activationEnergyKj / (GAS_CONSTANT_KJ * kelvin);
    return accumulator + Math.exp(exponent);
  }, 0);

  const mean = sum / valid.length;
  const mktKelvin = -activationEnergyKj / (GAS_CONSTANT_KJ * Math.log(mean));
  return kelvinToCelsius(mktKelvin);
}

/**
 * Compute MKT directly from a telemetry time-series.
 */
export function computeMktFromTelemetry(
  history: SensorTelemetryPoint[],
): number | null {
  return meanKineticTemperature(history.map((point) => point.temperatureC));
}

export type ExcursionSeverity = 'safe' | 'watch' | 'excursion' | 'critical';

export function classifyMkt(
  mkt: number | null,
  safeMaxCelsius = 8,
  criticalMaxCelsius = 15,
): ExcursionSeverity {
  if (mkt === null) return 'safe';
  if (mkt <= safeMaxCelsius * 0.75) return 'safe';
  if (mkt <= safeMaxCelsius) return 'watch';
  if (mkt <= criticalMaxCelsius) return 'excursion';
  return 'critical';
}

/**
 * Arrhenius shelf-life degradation rate relative to reference temperature.
 * Returns a factor > 1 meaning faster degradation.
 */
export function arrheniusDegradationFactor(
  temperatureCelsius: number,
  referenceCelsius = 5,
  activationEnergyKj: number = MKT_ACTIVATION_ENERGY_KJ,
): number {
  const tKelvin = celsiusToKelvin(temperatureCelsius);
  const refKelvin = celsiusToKelvin(referenceCelsius);
  const exponent =
    (activationEnergyKj / GAS_CONSTANT_KJ) * (1 / refKelvin - 1 / tKelvin);
  return Math.exp(exponent);
}

/**
 * Estimated remaining shelf life as a percentage given an MKT and reference
 * shelf life in days at the reference temperature.
 */
export function estimateRemainingShelfLife(
  mkt: number | null,
  referenceCelsius = 5,
): number {
  if (mkt === null) return 100;
  const factor = arrheniusDegradationFactor(mkt, referenceCelsius);
  const consumedFraction = Math.min(1, factor / 4);
  const remaining = (1 - consumedFraction) * 100;
  return Math.max(0, Math.round(remaining * 10) / 10);
}

/** Marine fuel carbon factor (tonnes CO2 per tonne of fuel burned). */
export const MARINE_FUEL_CO2_FACTOR = 3.114;

/** Typical heavy fuel oil consumption rate in tonnes per day for an ocean vessel. */
export const DEFAULT_OCEAN_FUEL_TONNES_PER_DAY = 95;

/** Default emission factor in kg CO2 per TEU-km, by transport mode. */
export const EMISSION_FACTOR_KG_CO2_PER_TEU_KM: Record<TransportMode, number> = {
  ocean: 0.016,
  rail: 0.028,
  road: 0.062,
  air: 0.5,
};

/**
 * Bunker fuel consumption estimate.
 *
 * @param distanceNm Distance travelled in nautical miles.
 * @param speedKnots Cruising speed in knots.
 * @param fuelTonnesPerDay Daily fuel burn baseline.
 * @param additionalDays Extra days (e.g. reroute detour).
 * @returns Estimated fuel burned in tonnes.
 */
export function bunkerFuelConsumptionTonnes(
  distanceNm: number,
  speedKnots: number,
  fuelTonnesPerDay: number = DEFAULT_OCEAN_FUEL_TONNES_PER_DAY,
  additionalDays = 0,
): number {
  if (speedKnots <= 0) return 0;
  const travelDays = distanceNm / (speedKnots * 24) + additionalDays;
  return travelDays * fuelTonnesPerDay;
}

/**
 * CO2 emissions in tonnes derived from fuel burned (bunker fuel).
 */
export function co2EmissionsTonnes(fuelTonnes: number): number {
  return fuelTonnes * MARINE_FUEL_CO2_FACTOR;
}

/**
 * CO2 emissions per TEU-km.
 * Emisi = Jarak × Faktor Emisi Modal
 */
export function emissionsPerTeuKm(
  distanceKm: number,
  mode: TransportMode,
  teuCount = 1,
): number {
  const factor = EMISSION_FACTOR_KG_CO2_PER_TEU_KM[mode];
  return distanceKm * factor * teuCount;
}

/**
 * Fuel cost from tonnes of bunker fuel burned.
 */
export function bunkerFuelCostUsd(
  fuelTonnes: number,
  pricePerTonneUsd = 650,
): number {
  return fuelTonnes * pricePerTonneUsd;
}

export interface DemurrageTierConfig {
  tierLabel: string;
  fromDay: number;
  toDay: number | null;
  ratePerDay: number;
}

export const DEFAULT_DEMURRAGE_TIERS: DemurrageTierConfig[] = [
  { tierLabel: 'Tier 1 (Days 1-5)', fromDay: 1, toDay: 5, ratePerDay: 75 },
  { tierLabel: 'Tier 2 (Days 6-10)', fromDay: 6, toDay: 10, ratePerDay: 150 },
  { tierLabel: 'Tier 3 (Day 11+)', fromDay: 11, toDay: null, ratePerDay: 250 },
];

/**
 * Compute demurrage & detention penalty across progressive tiers.
 *
 * @param freeDays Number of free days granted before charges apply.
 * @param daysInPort Actual days the container has been held.
 */
export function calculateDemurrage(
  daysInPort: number,
  freeDays: number,
  tiers: DemurrageTierConfig[] = DEFAULT_DEMURRAGE_TIERS,
): DemurrageCalculation {
  const chargeableDays = Math.max(0, daysInPort - freeDays);
  const detail: DemurrageTierDetail[] = [];
  let tier1Fee = 0;
  let tier2Fee = 0;
  let totalPenalty = 0;

  for (const tier of tiers) {
    if (chargeableDays < tier.fromDay) continue;
    const upper = tier.toDay ?? chargeableDays;
    const daysInTier = Math.min(chargeableDays, upper) - tier.fromDay + 1;
    if (daysInTier <= 0) continue;

    const subtotal = daysInTier * tier.ratePerDay;
    detail.push({
      tierLabel: tier.tierLabel,
      days: daysInTier,
      ratePerDay: tier.ratePerDay,
      subtotal,
    });

    if (tier.fromDay === 1) tier1Fee += subtotal;
    else tier2Fee += subtotal;
    totalPenalty += subtotal;
  }

  return {
    portFreeDays: freeDays,
    daysInPort,
    chargeableDays,
    tiers: detail,
    tier1Fee,
    tier2Fee,
    totalPenalty,
    isOverdue: chargeableDays > 0,
  };
}
