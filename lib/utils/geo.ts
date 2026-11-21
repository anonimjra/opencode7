// lib/utils/geo.ts
// Geospatial helpers: Haversine distance, initial bearing, and interpolation.

export const EARTH_RADIUS_KM = 6371.0088;
export const EARTH_RADIUS_NM = 3440.065;
export const KM_PER_NM = 1.852;

export interface GeoPoint {
  lat: number;
  lng: number;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export type DistanceUnit = 'nm' | 'km';

/**
 * Haversine great-circle distance between two coordinates.
 * d = 2R·arcsin(√(sin²(Δφ/2) + cosφ1·cosφ2·sin²(Δλ/2)))
 */
export function haversineDistance(
  pointA: GeoPoint,
  pointB: GeoPoint,
  unit: DistanceUnit = 'nm',
): number {
  const phi1 = toRadians(pointA.lat);
  const phi2 = toRadians(pointB.lat);
  const deltaPhi = toRadians(pointB.lat - pointA.lat);
  const deltaLambda = toRadians(pointB.lng - pointA.lng);

  const sinPhi = Math.sin(deltaPhi / 2);
  const sinLambda = Math.sin(deltaLambda / 2);

  const a =
    sinPhi * sinPhi +
    Math.cos(phi1) * Math.cos(phi2) * sinLambda * sinLambda;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const radius = unit === 'km' ? EARTH_RADIUS_KM : EARTH_RADIUS_NM;
  return radius * c;
}

/**
 * Initial bearing (forward azimuth) from point A to point B.
 * Returns degrees in the range 0-360.
 */
export function initialBearing(pointA: GeoPoint, pointB: GeoPoint): number {
  const phi1 = toRadians(pointA.lat);
  const phi2 = toRadians(pointB.lat);
  const lambda1 = toRadians(pointA.lng);
  const lambda2 = toRadians(pointB.lng);

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);

  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

/**
 * Linear interpolation between two points at fraction t (0..1).
 * Suitable for visual route progress on a projected map.
 */
export function interpolatePosition(
  pointA: GeoPoint,
  pointB: GeoPoint,
  t: number,
): GeoPoint {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    lat: pointA.lat + (pointB.lat - pointA.lat) * clamped,
    lng: pointA.lng + (pointB.lng - pointA.lng) * clamped,
  };
}

/**
 * Midpoint along a great circle approximation (slerp-free linear is adequate
 * for short segments; this uses the spherical midpoint formula for accuracy).
 */
export function greatCircleMidpoint(
  pointA: GeoPoint,
  pointB: GeoPoint,
): GeoPoint {
  const phi1 = toRadians(pointA.lat);
  const phi2 = toRadians(pointB.lat);
  const lambda1 = toRadians(pointA.lng);
  const lambda2 = toRadians(pointB.lng);

  const x = (Math.cos(phi1) * Math.cos(lambda1) + Math.cos(phi2) * Math.cos(lambda2)) / 2;
  const y = (Math.cos(phi1) * Math.sin(lambda1) + Math.cos(phi2) * Math.sin(lambda2)) / 2;
  const z = (Math.sin(phi1) + Math.sin(phi2)) / 2;

  const lng = Math.atan2(y, x);
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));

  return { lat: toDegrees(lat), lng: toDegrees(lng) };
}

/**
 * Convert nautical miles into transit hours given a speed in knots.
 */
export function transitHours(distanceNm: number, speedKnots: number): number {
  if (speedKnots <= 0) return 0;
  return distanceNm / speedKnots;
}

/**
 * Approximate ETA date given a departure date and transit hours.
 */
export function estimateEta(departure: Date, hours: number): Date {
  return new Date(departure.getTime() + hours * 60 * 60 * 1000);
}
