// lib/seeds/ports.ts
// 12 strategic world ports with real coordinates and operational metrics.

import type { PortNode } from '@/types/supply-chain';

export const SEED_PORTS: PortNode[] = [
  {
    id: 'port-sgsin',
    name: 'Port of Singapore',
    code: 'SGSIN',
    country: 'Singapore',
    lat: 1.2644,
    lng: 103.8402,
    berths: 58,
    avgWaitHours: 8,
    status: 'optimal',
  },
  {
    id: 'port-nlrtm',
    name: 'Port of Rotterdam',
    code: 'NLRTM',
    country: 'Netherlands',
    lat: 51.9492,
    lng: 4.1406,
    berths: 92,
    avgWaitHours: 30,
    status: 'congested',
  },
  {
    id: 'port-cnsha',
    name: 'Port of Shanghai',
    code: 'CNSHA',
    country: 'China',
    lat: 31.2304,
    lng: 121.4737,
    berths: 125,
    avgWaitHours: 42,
    status: 'congested',
  },
  {
    id: 'port-idjkt',
    name: 'Tanjung Priok (Jakarta)',
    code: 'IDJKT',
    country: 'Indonesia',
    lat: -6.1045,
    lng: 106.8862,
    berths: 36,
    avgWaitHours: 54,
    status: 'congested',
  },
  {
    id: 'port-uslax',
    name: 'Port of Los Angeles',
    code: 'USLAX',
    country: 'United States',
    lat: 33.7395,
    lng: -118.2611,
    berths: 270,
    avgWaitHours: 86,
    status: 'severe_delay',
  },
  {
    id: 'port-aejea',
    name: 'Jebel Ali (Dubai)',
    code: 'AEJEA',
    country: 'United Arab Emirates',
    lat: 25.0086,
    lng: 55.0612,
    berths: 51,
    avgWaitHours: 14,
    status: 'optimal',
  },
  {
    id: 'port-deham',
    name: 'Port of Hamburg',
    code: 'DEHAM',
    country: 'Germany',
    lat: 53.5359,
    lng: 9.9936,
    berths: 73,
    avgWaitHours: 26,
    status: 'congested',
  },
  {
    id: 'port-krpus',
    name: 'Port of Busan',
    code: 'KRPUS',
    country: 'South Korea',
    lat: 35.1017,
    lng: 129.0403,
    berths: 88,
    avgWaitHours: 18,
    status: 'optimal',
  },
  {
    id: 'port-bearn',
    name: 'Port of Antwerp-Bruges',
    code: 'BEANR',
    country: 'Belgium',
    lat: 51.2601,
    lng: 4.4025,
    berths: 70,
    avgWaitHours: 33,
    status: 'congested',
  },
  {
    id: 'port-jptyo',
    name: 'Port of Tokyo',
    code: 'JPTYO',
    country: 'Japan',
    lat: 35.6528,
    lng: 139.7816,
    berths: 34,
    avgWaitHours: 11,
    status: 'optimal',
  },
  {
    id: 'port-brssz',
    name: 'Port of Santos',
    code: 'BRSSZ',
    country: 'Brazil',
    lat: -23.9618,
    lng: -46.3322,
    berths: 62,
    avgWaitHours: 79,
    status: 'severe_delay',
  },
  {
    id: 'port-gbfxt',
    name: 'Port of Felixstowe',
    code: 'GBFXT',
    country: 'United Kingdom',
    lat: 51.9541,
    lng: 1.3035,
    berths: 29,
    avgWaitHours: 22,
    status: 'optimal',
  },
];

export const PORTS_BY_ID: Record<string, PortNode> = SEED_PORTS.reduce<
  Record<string, PortNode>
>((accumulator, port) => {
  accumulator[port.id] = port;
  return accumulator;
}, {});

export const PORTS_BY_CODE: Record<string, PortNode> = SEED_PORTS.reduce<
  Record<string, PortNode>
>((accumulator, port) => {
  accumulator[port.code] = port;
  return accumulator;
}, {});

export function getPortById(id: string): PortNode | undefined {
  return PORTS_BY_ID[id];
}

export function getPortByCode(code: string): PortNode | undefined {
  return PORTS_BY_CODE[code];
}
