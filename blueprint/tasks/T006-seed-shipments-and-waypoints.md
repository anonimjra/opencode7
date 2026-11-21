# T006: Kompilasi Mock Seed 60+ Pengiriman Internasional & Titik Rute

## Baca dulu
- `types/supply-chain.ts`
- `lib/seeds/ports.ts`
- `lib/seeds/vessels.ts`

## Depends on
- `T005`

---

## Deskripsi Task
Buat `lib/seeds/shipments.ts` yang berisi minimal 60 pengiriman kargo internasional:
- Variasi status: 'at_sea', 'in_transit', 'gate_in', 'customs_hold', 'delivered', 'exception'.
- Kargo beraneka ragam: Microchips / Semiconductor (Cold-chain), Kopi Arabika Specialty, Furnitur Jati, Mesin Industri Berat, Farmasi / Vaksin (Ultra-low cold chain).
- Nomor Bill of Lading (BoL) unik berformat maritim internasional (contoh: `AETH-BL-88214`, `OC7-SEA-9901`).
- Dilengkapi daftar kontainer ISO 6346 (contoh: `MSKU-982134-2`, `AETU-110293-8`), bobot kilogram, volume CBM, nilai deklarasi USD, dan history milestone perjalanan.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Terdapat 60+ entri shipment dengan data konsisten
- [ ] Setiap shipment terhubung ke port valid dan armada terdaftar
