# T011: Sidebar Navigasi Telematika dengan Status Pulse & Jam Zulu UTC

## Baca dulu
- `types/supply-chain.ts`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T010`

---

## Deskripsi Task
Buat `components/shell/sidebar.tsx`:
- Brand Logo: "AETHER-07" dengan ikon radar berputar dan badge "OPS TOWER ACTIVE".
- Menu Navigasi dengan icon Lucide React:
  - Overview / Control Tower (`/`)
  - Fleet Telematics (`/fleet`)
  - Terminal Yard 2D (`/yard`)
  - Master Shipments (`/shipments`)
  - IoT Cold-Chain Lab (`/iot-telemetry`)
  - Customs & Finance (`/customs-finance`)
  - Disruption War Room (`/incidents`)
- Badge penghitung dinamis (contoh: jumlah alert aktif di War Room, jumlah kargo cold-chain).
- Tombol Reset State to Seed di bagian footer sidebar dengan dialog konfirmasi.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Sidebar menampilkan seluruh rute dengan penanda link aktif
- [ ] Badge jumlah alert terintegrasi dengan store Zustand
- [ ] Tombol reset to seed tersedia
