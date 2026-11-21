# T007: Kompilasi Mock Seed Grid Yard 2D & Telemetri Sensor IoT Cold-Chain

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T003`

---

## Deskripsi Task
Buat dataset:
1. `lib/seeds/yard.ts`:
   - Matriks 2D lapangan penumpukan kontainer (Yard): 4 Blok ('A', 'B', 'C', 'D'), masing-masing memiliki 6 Bay, 4 Row, dan 3 Tier (Total 288 slot penumpukan).
   - Dilengkapi slot occupied, slot kosong, kontainer berbahaya (IMDG Class 3, 5, 8), dan slot reefer berpendingin aktif.
2. `lib/seeds/telemetry.ts`:
   - Data historis sensor IoT cold-chain 24 jam terakhir untuk kontainer berpendingin: suhu (°C), kelembaban (%), G-force shock, dan indikator tampering cahaya.
3. `lib/seeds/incidents.ts`:
   - 6 insiden disrupsi nyata: Red Sea / Bab-el-Mandeb Security Crisis, Panama Canal Drought Transit Restriction, Typhoon Malakas Pacific Alert, Port of Los Angeles Crane Labor Strike, Tanjung Priok Customs System Outage, Rotterdam Berth Congestion.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] lib/seeds/yard.ts memuat representasi 288 slot kontainer lengkap
- [ ] lib/seeds/telemetry.ts memuat time-series data sensor 24 jam
- [ ] lib/seeds/incidents.ts memuat 6 krisis operasional terstruktur
