# T005: Kompilasi Mock Seed 12 Pelabuhan Strategis Dunia & 20 Armada Multimodal

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T003`

---

## Deskripsi Task
Buat dataset realistis:
1. `lib/seeds/ports.ts`:
   - 12 Pelabuhan utama: Singapore (SGSIN), Rotterdam (NLRTM), Shanghai (CNSHA), Tanjung Priok (IDJKT), Los Angeles (USLAX), Dubai / Jebel Ali (AEJEA), Hamburg (DEHAM), Busan (KRPUS), Antwerp (BEANR), Tokyo (JPTYO), Santos (BRSSZ), Felixstowe (GBFXT).
   - Data koordinat lat/lng presisi, jumlah berth, avg wait time, status kongesti.
2. `lib/seeds/vessels.ts`:
   - 20 Armada kargo multimodal: 12 kapal kontainer samudra (e.g. Aether Horizon, Maersk Titan, Evergreen Apex), 4 pesawat kargo udara Boeing 777F (e.g. Aether SkyLoader 1), dan 4 truk trailer elektrik (e.g. Aether Hauler Alpha).
   - Data lengkap: IMO, MMSI, Callsign, kapasitas TEU, kecepatan knot, heading derajat, koordinat live, rute waypoints, konsumsi bahan bakar, dan nama nahkoda/pilot.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] lib/seeds/ports.ts berisi 12 pelabuhan lengkap dengan lat/lng nyata
- [ ] lib/seeds/vessels.ts memuat 20 armada multimodal dengan rute waypoints
