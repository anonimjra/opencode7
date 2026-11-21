// lib/utils/formatters.ts
// Formatting helpers for currency, capacity, speed, coordinates and maritime time.

const USD_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const USD_FORMATTER_CENTS = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const IDR_FORMATTER = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const KM_PER_NAUTICAL_MILE = 1.852;
export const DEFAULT_IDR_PER_USD = 16350;

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  return USD_FORMATTER.format(value);
}

export function formatUsdPrecise(value: number): string {
  if (!Number.isFinite(value)) return '$0.00';
  return USD_FORMATTER_CENTS.format(value);
}

export function formatCompactUsd(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return formatUsd(value);
}

export function formatIdr(valueUsd: number, rate: number = DEFAULT_IDR_PER_USD): string {
  if (!Number.isFinite(valueUsd)) return 'Rp0';
  return IDR_FORMATTER.format(valueUsd * rate);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  if (!Number.isFinite(value)) return '0';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

export function formatPercent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatTeu(value: number): string {
  if (!Number.isFinite(value)) return '0 TEU';
  return `${NUMBER_FORMATTER.format(Math.round(value))} TEU`;
}

export function formatTeuCompact(value: number): string {
  if (!Number.isFinite(value)) return '0 TEU';
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k TEU`;
  }
  return `${Math.round(value)} TEU`;
}

export function knotsToKmh(knots: number): number {
  return knots * KM_PER_NAUTICAL_MILE;
}

export function formatKnots(knots: number): string {
  return `${knots.toFixed(1)} kn`;
}

export function formatKmh(knots: number): string {
  return `${knotsToKmh(knots).toFixed(1)} km/h`;
}

export function formatSpeedBoth(knots: number): string {
  return `${formatKnots(knots)} / ${formatKmh(knots)}`;
}

/**
 * Format a decimal degree value into DMS (Degrees, Minutes, Seconds).
 */
export function toDms(value: number, isLatitude: boolean): string {
  const direction = isLatitude
    ? value >= 0
      ? 'N'
      : 'S'
    : value >= 0
      ? 'E'
      : 'W';
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  const pad = (n: number, size = 2): string => String(n).padStart(size, '0');
  return `${pad(degrees)}°${pad(minutes)}'${seconds.toFixed(1).padStart(4, '0')}"${direction}`;
}

export function formatCoordinate(lat: number, lng: number): string {
  return `${toDms(lat, true)} ${toDms(lng, false)}`;
}

export function formatDecimalCoordinate(lat: number, lng: number): string {
  return `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
}

/**
 * Format a date as maritime Zulu (UTC) time.
 * Example: `2024-06-12 12:44:02Z`
 */
export function formatZulu(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '——';
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate(),
  )} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}Z`;
}

export function formatZuluClock(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(
    date.getUTCSeconds(),
  )}Z`;
}

/**
 * Format local Western Indonesian Time (WIB = UTC+7).
 */
export function formatWibClock(date: Date): string {
  const wibMs = date.getTime() + 7 * 60 * 60 * 1000;
  const wib = new Date(wibMs);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${pad(wib.getUTCHours())}:${pad(wib.getUTCMinutes())}:${pad(wib.getUTCSeconds())}`;
}

export function formatMaritimeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '——';
  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];
  return `${String(d.getUTCDate()).padStart(2, '0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatShortDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '——';
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${monthsShort[d.getUTCMonth()]} ${pad(d.getUTCDate())}, ${pad(
    d.getUTCHours(),
  )}:${pad(d.getUTCMinutes())}Z`;
}

const monthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMinutes = Math.round((Date.now() - d.getTime()) / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const hours = Math.round(diffMinutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function formatHours(hours: number): string {
  if (!Number.isFinite(hours)) return '0h';
  if (hours < 24) return `${hours.toFixed(1)}h`;
  const days = Math.floor(hours / 24);
  const remaining = hours % 24;
  return `${days}d ${remaining.toFixed(0)}h`;
}

export function formatWeightKg(kg: number): string {
  if (!Number.isFinite(kg)) return '0 kg';
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  return `${NUMBER_FORMATTER.format(Math.round(kg))} kg`;
}

export function formatHeading(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const cardinalPoints = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return `${normalized.toFixed(0)}° ${cardinalPoints[index]}`;
}
