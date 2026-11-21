// lib/seeds/incidents.ts
// Six real-world maritime disruption scenarios.

import type { CriticalAlert, DisruptionIncident } from '@/types/supply-chain';

export const SEED_INCIDENTS: DisruptionIncident[] = [
  {
    id: 'inc-red-sea',
    title: 'Red Sea / Bab-el-Mandeb Security Crisis',
    category: 'geopolitical',
    region: 'Middle East · Red Sea',
    severity: 'critical',
    chokepoint: 'Bab-el-Mandeb',
    lat: 12.5833,
    lng: 43.3333,
    description:
      'Militant attacks on commercial shipping force major carriers to divert around the Cape of Good Hope, adding 10-14 transit days.',
    status: 'active',
    affectedVesselIds: ['vsl-yangming-sunrise', 'vsl-msc-atlantis', 'vsl-aether-horizon'],
    startDate: '2024-05-18T00:00:00.000Z',
    impactPercent: 34,
  },
  {
    id: 'inc-panama-drought',
    title: 'Panama Canal Drought Transit Restriction',
    category: 'weather',
    region: 'Central America · Panama Canal',
    severity: 'critical',
    chokepoint: 'Panama Canal',
    lat: 9.08,
    lng: -79.68,
    description:
      'El Niño-driven drought lowers Gatun Lake levels, cutting daily transit slots and forcing draft limits on neo-Panamax vessels.',
    status: 'active',
    affectedVesselIds: ['vsl-hapag-neptune', 'vsl-one-empress'],
    startDate: '2024-04-02T00:00:00.000Z',
    impactPercent: 27,
  },
  {
    id: 'inc-typhoon-malakas',
    title: 'Typhoon Malakas Pacific Alert',
    category: 'weather',
    region: 'West Pacific · Philippine Sea',
    severity: 'warning',
    chokepoint: 'Malacca Strait',
    lat: 18.4,
    lng: 132.5,
    description:
      'Super typhoon Malakas intensifies across the West Pacific, prompting route deviations and port closures in the Philippines and Taiwan.',
    status: 'monitoring',
    affectedVesselIds: ['vsl-evergreen-apex', 'vsl-pacific-voyager', 'air-aether-skyloader-3'],
    startDate: '2024-06-08T00:00:00.000Z',
    impactPercent: 18,
  },
  {
    id: 'inc-lax-strike',
    title: 'Port of Los Angeles Crane Labor Strike',
    category: 'congestion',
    region: 'North America · US West Coast',
    severity: 'critical',
    chokepoint: 'Trans-Pacific',
    lat: 33.7395,
    lng: -118.2611,
    description:
      'Crane operator strike halts STS operations at USLAX, cascading into a multi-day vessel queue and inland rail backlog.',
    status: 'active',
    affectedVesselIds: ['vsl-one-empress', 'vsl-pacific-voyager', 'air-aether-skyloader-1'],
    startDate: '2024-06-01T00:00:00.000Z',
    impactPercent: 41,
  },
  {
    id: 'inc-priok-outage',
    title: 'Tanjung Priok Customs System Outage',
    category: 'customs',
    region: 'Southeast Asia · Indonesia',
    severity: 'warning',
    chokepoint: 'Malacca Strait',
    lat: -6.1045,
    lng: 106.8862,
    description:
      'National customs IT system outage delays import clearance at Tanjung Priok, extending container dwell time beyond free days.',
    status: 'monitoring',
    affectedVesselIds: ['vsl-cosco-dragon', 'road-aether-hauler-delta'],
    startDate: '2024-06-05T00:00:00.000Z',
    impactPercent: 22,
  },
  {
    id: 'inc-rotterdam-congestion',
    title: 'Rotterdam Berth Congestion',
    category: 'congestion',
    region: 'Europe · North Sea',
    severity: 'warning',
    chokepoint: 'Suez Canal',
    lat: 51.9492,
    lng: 4.1406,
    description:
      'Backlog from Red Sea diversions overwhelms Rotterdam berth capacity, driving average waiting times above 30 hours.',
    status: 'active',
    affectedVesselIds: ['vsl-aether-horizon', 'vsl-nordic-glacier', 'vsl-andes-star'],
    startDate: '2024-05-25T00:00:00.000Z',
    impactPercent: 29,
  },
];

export const SEED_ALERTS: CriticalAlert[] = [
  {
    id: 'alert-001',
    severity: 'critical',
    category: 'geopolitical',
    title: 'Bab-el-Mandeb Transit Advisory',
    message:
      'Aether Horizon advised to divert around Cape of Good Hope due to active Red Sea security threat.',
    relatedEntityId: 'vsl-aether-horizon',
    timestamp: '2024-06-10T04:22:00.000Z',
    isAcknowledged: false,
  },
  {
    id: 'alert-002',
    severity: 'critical',
    category: 'telemetry_excursion',
    title: 'Reefer Temperature Excursion',
    message:
      'Container CMAU-778301-1 temperature spiked 6.4°C above set-point — potential cold-chain breach.',
    relatedEntityId: 'CMAU-778301-1',
    timestamp: '2024-06-10T05:41:00.000Z',
    isAcknowledged: false,
  },
  {
    id: 'alert-003',
    severity: 'warning',
    category: 'congestion',
    title: 'USLAX Vessel Queue Building',
    message:
      'Port of Los Angeles reports 14 vessels at anchor with 86h average wait due to crane labor action.',
    relatedEntityId: 'port-uslax',
    timestamp: '2024-06-10T03:15:00.000Z',
    isAcknowledged: false,
  },
  {
    id: 'alert-004',
    severity: 'warning',
    category: 'customs',
    title: 'Tanjung Priok Clearance Delay',
    message:
      'Customs system outage triggers manual clearance; expect 24-48h document verification backlog.',
    relatedEntityId: 'port-idjkt',
    timestamp: '2024-06-10T02:05:00.000Z',
    isAcknowledged: false,
  },
  {
    id: 'alert-005',
    severity: 'critical',
    category: 'weather',
    title: 'Typhoon Malakas Route Deviation',
    message:
      'Super typhoon forces west-bound vessels to deviate south of the Philippine Sea shipping lanes.',
    relatedEntityId: 'vsl-evergreen-apex',
    timestamp: '2024-06-10T01:48:00.000Z',
    isAcknowledged: false,
  },
  {
    id: 'alert-006',
    severity: 'info',
    category: 'congestion',
    title: 'Rotterdam Berth Backlog Normalizing',
    message:
      'Rotterdam average wait time trending down from 38h to 30h as diverted vessels re-sequence.',
    relatedEntityId: 'port-nlrtm',
    timestamp: '2024-06-09T22:30:00.000Z',
    isAcknowledged: true,
  },
  {
    id: 'alert-007',
    severity: 'warning',
    category: 'telemetry_excursion',
    title: 'Sensor Battery Low — ONEU-221930-4',
    message:
      'Reefer sensor battery dropped to 41%. Schedule sensor replacement at next port call.',
    relatedEntityId: 'ONEU-221930-4',
    timestamp: '2024-06-09T20:12:00.000Z',
    isAcknowledged: false,
  },
];
