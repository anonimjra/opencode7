# Aether OS — Global Autonomous Supply Chain, Maritime Telematics & Port Yard Control Tower

Aether OS is an enterprise-grade **logistics command platform** delivered as a fully client-side,
local-first Next.js 15 web application. It unifies ocean/air/ground fleet telematics, a 2D port
container-yard slotting planner, IoT cold-chain sensor monitoring, Incoterms & customs finance
calculators, and a geopolitical **disruption war room** — all within a dark *cyber-industrial
mission control* interface.

> **Zero-backend architecture.** Every module runs entirely in the browser. Data is seeded from
> comprehensive mock datasets and persisted reactively to `localStorage` through a Zustand store.

---

## Table of Contents

1. [Live Modules](#live-modules)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Core Mathematics](#core-mathematics)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [GitHub Pages Deployment](#github-pages-deployment)
8. [Design System](#design-system)
9. [Data Persistence & Reset](#data-persistence--reset)

---

## Live Modules

Aether OS ships **7 interactive mission modules**, each mounted under the persistent control-tower
shell (sidebar + header + live Zulu clock status bar).

| Route | Module | Highlights |
| :--- | :--- | :--- |
| `/` | **Mission Control Tower** | Executive KPI cards with sparklines, interactive SVG world telematics map (radar-pulse vessel markers + click-to-inspect drawer), active fleet radar table, critical alerts feed with audio alarm, global trade-volume area chart, port congestion gauges. |
| `/fleet` | **Fleet Telematics** | 20 multimodal assets (ocean / air / road) with mode filter tabs, deep engine telemetry modal (RPM gauge, ballast water tanks, propeller pitch), Hours-of-Service compliance tracker, predictive maintenance scheduler, and new-asset registration. |
| `/yard` | **Terminal Yard 2D** | 288-slot Bay / Row / Tier container matrix across 4 blocks (Export, Import, IMDG, Reefer), interactive container inspector drawer, STS crane berth timeline, and IMDG/reefer-aware relocation simulator. |
| `/shipments` | **Master Shipments** | 64 international shipments with live search, multi-filter, column sorting, pagination, digital **Bill of Lading** generator with print isolation, 7-step milestone stepper, and one-click **ExcelJS** manifest export. |
| `/iot-telemetry` | **IoT Cold-Chain Lab** | Live reefer container grid, dual-axis Recharts time-series (temperature / humidity / G-shock), Arrhenius **Mean Kinetic Temperature** spoilage risk calculator, and a sensor-anomaly injection simulator. |
| `/customs-finance` | **Customs & Finance** | Interactive 11-rule **Incoterms 2020** responsibility matrix, freight tariff calculator (Ocean Base / BAF / CAF / PSS / THC), tiered demurrage & detention calculator, and a customs risk-scoring engine (green / yellow / red channel). |
| `/incidents` | **Disruption War Room** | Global chokepoint monitor (Malacca, Suez, Panama, Hormuz, Bab-el-Mandeb), autonomous reroute simulator comparing Suez vs Cape of Good Hope, and an emergency incident declaration modal. |

Plus a cyber-radar **404**, a global **loading skeleton**, and both React **error boundaries**
(component-level and route-level) for zero-crash resilience.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| Framework | **Next.js 15** (App Router) · static export (`output: 'export'`) |
| Language | **TypeScript** (strict, zero `any`) |
| Styling | **Tailwind CSS v4** (`@import "tailwindcss";`) |
| Icons | **Lucide React** |
| Charts | **Recharts** (Area, Line, Bar, Composed, Sparkline) |
| Animation | **Framer Motion** |
| State | **Zustand** with `persist` → `localStorage` |
| Excel | **ExcelJS** (dynamic import / code-split) |
| Confetti | **Canvas-Confetti** |
| Audio | **Web Audio API** (native synthesizer, no media files) |

---

## Architecture

Aether OS follows a **Local-First Enterprise Client-Side Architecture**:

```
Browser
 ├─ Next.js 15 App Router (SSG static export)
 ├─ Zustand store ── persist ──▶ localStorage ("aether-supply-chain-storage")
 ├─ Mock seed datasets (ports, vessels, shipments, yard, telemetry, incidents)
 └─ Pure utility engines (geo / telematics / incoterms / formatters)
```

Because the project is fully static (`output: 'export'`), every interactive module is a **client
component** (`'use client'`). No server runtime, database, or API is required — the entire platform
can be served from any static file host (including GitHub Pages).

---

## Core Mathematics

The platform implements real maritime and pharmaceutical formulas (see `lib/utils/`).

### Haversine Great-Circle Distance — `lib/utils/geo.ts`

$$
d = 2R \arcsin\!\left(\sqrt{\sin^2\!\left(\tfrac{\Delta\phi}{2}\right) + \cos\phi_1 \cos\phi_2 \sin^2\!\left(\tfrac{\Delta\lambda}{2}\right)}\right)
$$

Returns nautical miles or kilometers. `initialBearing()` yields the forward azimuth (heading) 0–360°.

### Mean Kinetic Temperature (Arrhenius) — `lib/utils/telematics.ts`

$$
T_k = \frac{\Delta H / R}{-\ln\!\left(\frac{1}{n}\sum_{i=1}^{n} e^{-\Delta H / (R\,T_i)}\right)}
$$

- $\Delta H = 83.144\ \text{kJ/mol}$, $R = 0.0083144\ \text{kJ/(mol·K)}$
- $T_i$ in Kelvin; output in °C. Used by the MKT spoilage-risk card and WHO/FDA classification.

### Bunker Fuel & CO₂ Emissions — `lib/utils/telematics.ts`

- Fuel tonnes = `(distance_nm / (speed_kn × 24) + extra_days) × daily_burn`
- CO₂ tonnes = `fuel_tonnes × 3.114` (marine fuel carbon factor)
- Per-TEU-km: `Emisi = Jarak × Faktor Emisi Modal` (mode-specific kg CO₂ / TEU-km)

### Tiered Demurrage & Detention — `lib/utils/telematics.ts`

Progressive tiers after free-days: **Days 1–5 @ $75/day**, **Days 6–10 @ $150/day**,
**Day 11+ @ $250/day**. Consumed by the `DemurrageCalculator` component.

### Incoterms 2020 — `lib/utils/incoterms.ts`

Encodes seller/buyer responsibility across the 7 obligation stages for all 11 rules
(EXW, FCA, CPT, CIP, DAP, DPU, DDP, FAS, FOB, CFR, CIF), including sea-only vs any-mode scope.

---

## Project Structure

```
opencode7/
├── app/
│   ├── layout.tsx              # Root shell + metadata
│   ├── globals.css             # Tailwind v4 + cyber-industrial tokens
│   ├── page.tsx                # Mission Control Tower
│   ├── fleet/ yard/ shipments/ iot-telemetry/ customs-finance/ incidents/
│   ├── loading.tsx             # Radar loading skeleton
│   ├── not-found.tsx           # Cyber 404
│   └── error.tsx               # Route error boundary
├── components/
│   ├── shell/                  # AppShell, Sidebar, Header, CommandPalette, StatusTicker
│   ├── dashboard/              # KPI cards, telematics map, fleet table, alerts, charts
│   ├── fleet/ yard/ shipments/ iot/ finance/ incidents/
│   └── ui/                     # Button, Modal, Drawer, Badge, Panel, Toast, ErrorBoundary
├── lib/
│   ├── store/                  # Zustand store + UI store
│   ├── seeds/                  # ports, vessels, shipments, yard, telemetry, incidents
│   ├── utils/                  # geo, telematics, incoterms, formatters, sound-fx
│   └── services/export-excel.ts
├── types/supply-chain.ts       # Centralized type contracts
├── public/.nojekyll
├── next.config.ts              # output: 'export', basePath: '/opencode7'
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** (tested on Node 24)
- npm 10+

### Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000/opencode7> (the app runs under the `/opencode7` base path).

### Production build & static export

```bash
npm run build
```

The fully static site is emitted to `out/` (including `out/index.html`, all sub-routes, and
`out/.nojekyll`). Preview it with any static server, e.g.:

```bash
npx serve out
```

### Type-checking

```bash
npx tsc --noEmit
```

---

## GitHub Pages Deployment

The project is pre-configured for GitHub Pages hosting at the `/opencode7` sub-path:

- `next.config.ts` → `output: 'export'`, `basePath: '/opencode7'`, `images.unoptimized: true`
- `public/.nojekyll` ensures the `_next/` asset directory is not ignored by Jekyll.

### One-command deploy

```bash
npm run deploy
```

This runs `next build` and publishes `out/` to the `gh-pages` branch via `gh-pages` (with
`--dotfiles` so `.nojekyll` is preserved).

Then in **GitHub → Settings → Pages**, set the source to the `gh-pages` branch.

---

## Design System

Deep Obsidian Cyber-Industrial Mission Control, defined in `app/globals.css` via Tailwind v4 `@theme`:

| Token | Hex | Usage |
| :--- | :--- | :--- |
| Obsidian Canvas | `#07090E` | Root background |
| Surface Dark | `#0D111A` | Cards & panels |
| Elevated Charcoal | `#161F30` | Headers, hover, inputs |
| Border Gridline | `#1E2C42` | Borders & grid lines |
| Electric Cyan | `#00F5FF` | Primary / radar / active |
| Emerald Marine | `#10B981` | Optimal / stable |
| Amber Warning | `#F59E0B` | Caution / delay |
| Crimson Hazard | `#EF4444` | Critical / exception |
| Violet IoT | `#8B5CF6` | Cold-chain / reefer |

Includes radar-pulse, radar-sweep, scanline-shimmer, marquee, and cyber-glow utilities, plus a
thin custom scrollbar.

---

## Data Persistence & Reset

- All state lives in a Zustand store persisted to `localStorage` key **`aether-supply-chain-storage`**.
- Shipment bookings, container relocations, alerts acknowledgements, sensor anomalies, and new fleet
  assets survive page reloads.
- Use the **Reset State to Seed** button in the sidebar footer to restore the original seed datasets
  (`resetToSeed()`).

---

## Verification Checklist

- ✅ `npx tsc --noEmit` — 0 errors, 0 `any`
- ✅ `npm run build` — static export succeeds, `out/` contains all 7 routes + 404 + `.nojekyll`
- ✅ 7 interactive sub-pages functional
- ✅ Booking wizard persists to `localStorage` and fires canvas-confetti
- ✅ ExcelJS manifest export downloads a `.xlsx`
- ✅ SVG telematics map & 2D yard grid open modals/drawers on click

---

_© Aether Global Maritime Line — Autonomous Supply Chain Control Tower._
