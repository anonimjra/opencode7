// lib/seeds/telemetry.ts
// IoT cold-chain sensor history (24h) for reefer containers.

import type { SensorTelemetryPoint } from '@/types/supply-chain';

export interface ReeferSensorProfile {
  containerNumber: string;
  cargoType: string;
  targetTempC: number;
  sensorBatteryPercent: number;
  history: SensorTelemetryPoint[];
}

function pseudoRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Build a 24-hour hourly telemetry series ending "now".
 *
 * @param targetTempC Target reefer set-point.
 * @param seed Deterministic seed for reproducible noise.
 * @param excursion At which relative hour (0-23) an excursion begins, if any.
 */
export function buildTelemetryHistory(
  targetTempC: number,
  seed: number,
  excursion: number | null = null,
): SensorTelemetryPoint[] {
  const points: SensorTelemetryPoint[] = [];
  const now = Date.now();
  const amplitude = Math.abs(targetTempC) > 10 ? 0.9 : 0.55;

  for (let hourIndex = 23; hourIndex >= 0; hourIndex -= 1) {
    const timestamp = new Date(now - hourIndex * 3_600_000).toISOString();
    const noise = (pseudoRandom(seed + hourIndex) - 0.5) * 2 * amplitude;
    const drift = Math.sin((hourIndex / 24) * Math.PI * 2) * (amplitude * 0.6);
    let temperatureC = targetTempC + noise + drift;

    const relativeHour = 23 - hourIndex;
    const inExcursion = excursion !== null && relativeHour >= excursion;
    if (inExcursion) {
      const spikeHours = relativeHour - excursion;
      const spike = Math.min(spikeHours * 1.8, 28);
      temperatureC = targetTempC + spike + noise;
    }

    const humidityPercent = Math.round(
      Math.max(35, Math.min(85, 62 + (pseudoRandom(seed * 1.3 + hourIndex) - 0.5) * 14)),
    );
    const shockG =
      inExcursion && relativeHour === excursion
        ? Math.round((3.6 + pseudoRandom(seed * 2.1) * 1.6) * 10) / 10
        : Math.round((0.1 + pseudoRandom(seed * 2.7 + hourIndex) * 0.4) * 10) / 10;
    const ambientLightLux = Math.round(120 + pseudoRandom(seed * 3.3 + hourIndex) * 60);
    const batteryPercent = Math.max(
      20,
      Math.round(96 - relativeHour * 0.18 - pseudoRandom(seed * 4.1) * 2),
    );
    const deviation = Math.abs(temperatureC - targetTempC);
    const isExcursion = inExcursion && deviation > Math.abs(targetTempC) * 0.35 + 3;

    points.push({
      timestamp,
      temperatureC: Math.round(temperatureC * 10) / 10,
      humidityPercent,
      shockG,
      ambientLightLux,
      batteryPercent,
      isExcursion,
    });
  }

  return points;
}

export const SEED_REEfer_PROFILES: ReeferSensorProfile[] = [
  {
    containerNumber: 'AETU-441028-3',
    cargoType: 'Ultra-low Vaccines',
    targetTempC: -20,
    sensorBatteryPercent: 92,
    history: buildTelemetryHistory(-20, 11),
  },
  {
    containerNumber: 'MSKU-552194-0',
    cargoType: 'Insulin Cold Chain',
    targetTempC: 5,
    sensorBatteryPercent: 88,
    history: buildTelemetryHistory(5, 23),
  },
  {
    containerNumber: 'CMAU-778301-1',
    cargoType: 'Frozen Tuna Loins',
    targetTempC: -18,
    sensorBatteryPercent: 81,
    history: buildTelemetryHistory(-18, 37, 18),
  },
  {
    containerNumber: 'EGHU-331072-6',
    cargoType: 'Fresh Beef Carcasses',
    targetTempC: 2,
    sensorBatteryPercent: 76,
    history: buildTelemetryHistory(2, 51),
  },
  {
    containerNumber: 'ONEU-221930-4',
    cargoType: 'mRNA Therapeutics',
    targetTempC: -20,
    sensorBatteryPercent: 95,
    history: buildTelemetryHistory(-20, 67, 14),
  },
  {
    containerNumber: 'COSU-883412-9',
    cargoType: 'Organic Dairy',
    targetTempC: 4,
    sensorBatteryPercent: 69,
    history: buildTelemetryHistory(4, 83),
  },
  {
    containerNumber: 'HLCU-920771-2',
    cargoType: 'Vaccine Cold Boxes',
    targetTempC: 5,
    sensorBatteryPercent: 84,
    history: buildTelemetryHistory(5, 97),
  },
  {
    containerNumber: 'MSCU-110004-8',
    cargoType: 'Frozen Shrimp',
    targetTempC: -18,
    sensorBatteryPercent: 73,
    history: buildTelemetryHistory(-18, 113),
  },
];

export const REEFER_SENSOR_PROFILES: ReeferSensorProfile[] = SEED_REEfer_PROFILES;
