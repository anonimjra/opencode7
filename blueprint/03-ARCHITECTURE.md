# 03. Arsitektur Sistem: Aether OS

## 1. Paradigma: Local-First Enterprise Client-Side Architecture
Aether OS dibangun dengan arsitektur **Zero-Backend Dependency (Local-First)** yang sepenuhnya berjalan di browser menggunakan Next.js 15 App Router. Semua data diinisialisasi dari mock seed data yang komprehensif dan disimpan secara reaktif di `localStorage` melalui Zustand store.

## 2. Struktur Direktori Proyek

```
opencode7/
├── app/
│   ├── layout.tsx                   # Root layout, HTML head, theme provider
│   ├── globals.css                  # Tailwind v4 import & custom glow utilities
│   ├── page.tsx                     # Master Control Tower Dashboard (Overview)
│   ├── fleet/
│   │   └── page.tsx                 # Armada Kapal, Pesawat & Truk Telematika
│   ├── yard/
│   │   └── page.tsx                 # 2D Terminal Yard Slot Matrix & Crane Scheduler
│   ├── shipments/
│   │   └── page.tsx                 # Master Shipments Table, Wizard & BoL
│   ├── iot-telemetry/
│   │   └── page.tsx                 # Cold-Chain Sensor Telemetry Lab & MKT
│   ├── customs-finance/
│   │   └── page.tsx                 # Incoterms 2020 Matrix & Demurrage Calculator
│   ├── incidents/
│   │   └── page.tsx                 # Disruption War Room & Reroute Simulator
│   ├── loading.tsx                  # Global cyber-radar loading skeleton
│   └── not-found.tsx                # Cyber radar 404 page
├── components/
│   ├── shell/                       # Sidebar, Header, Command Palette, Status Bar
│   ├── dashboard/                   # Peta telematika SVG, kartu KPI, radar fleet, alert ticker
│   ├── fleet/                       # Grid armada, modal telemetri mesin, HOS tracker
│   ├── yard/                        # 2D grid yard slotting, drawer kontainer, berth timeline
│   ├── shipments/                   # Tabel pengiriman, booking wizard, modal BoL
│   ├── iot/                         # Grafik dual-axis Recharts, kalkulator MKT, simulator
│   ├── finance/                     # Matriks Incoterms, kalkulator tarif, kalkulator demurrage
│   ├── incidents/                   # Dashboard krisis, reroute simulator, modal deklarasi
│   └── ui/                          # Button, Modal, Drawer, Tooltip, Toast, Badge
├── lib/
│   ├── store/
│   │   └── use-supply-chain-store.ts# Zustand store utama dengan persistensi LocalStorage
│   ├── seeds/
│   │   ├── ports.ts                 # 12 pelabuhan utama dunia
│   │   ├── vessels.ts               # 20 kapal, pesawat & truk kargo
│   │   ├── shipments.ts             # 60+ pengiriman internasional
│   │   ├── yard.ts                  # Layout 2D slot kontainer terminal
│   │   ├── telemetry.ts             # Data sensor IoT cold-chain berkala
│   │   └── incidents.ts             # Daftar krisis geopolitik & cuaca
│   ├── utils/
│   │   ├── formatters.ts            # Mata uang, berat TEU, kecepatan knot, koordinat DMS
│   │   ├── geo.ts                   # Rumus jarak Haversine & sudut bearing navigasi
│   │   ├── incoterms.ts             # Logika pembagian biaya Incoterms
│   │   ├── telematics.ts            # Formula MKT Arrhenius, konsumsi bunker fuel, emisi CO2
│   │   └── sound-fx.ts              # Web Audio API synthesizer sonar & alarm
│   └── services/
│       └── export-excel.ts          # Layanan ekspor file Excel (.xlsx) dengan ExcelJS
├── types/
│   └── supply-chain.ts              # Definisi interface TypeScript terpusat
├── public/
│   └── .nojekyll                    # File bypass Jekyll untuk GitHub Pages
├── next.config.ts                   # Konfigurasi SSG export & basePath
├── package.json
└── tsconfig.json
```
