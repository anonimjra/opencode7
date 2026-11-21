# T015: Peta Telematika Global Interaktif SVG Berbasis Rute & Radar Pulse

## Baca dulu
- `lib/store/use-supply-chain-store.ts`
- `types/supply-chain.ts`

## Depends on
- `T005`
- `T008`

---

## Deskripsi Task
Buat `components/dashboard/telematics-map.tsx`:
- Render peta dunia proyeksi silinder interaktif menggunakan elemen SVG murni (garis benua dan grid lintang/bujur berorientasi koordinat).
- Plot rute pelayaran maritim utama dunia (Asia - Eropa via Suez, Trans-Pasifik Shanghai - LA, Trans-Atlantik Rotterdam - Santos).
- Render titik pelabuhan utama dengan tooltip informatif saat di-hover (nama pelabuhan, waktu tunggu sandar).
- Render marker kapal aktif dengan animasi radar-pulse berdenyut:
  - Arah ikon rotasi sesuai heading derajat kapal.
  - Klik marker kapal untuk membuka Quick Inspection Drawer yang memuat data kecepatan knot, ETA, dan muatan TEU.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Peta SVG merender kontur dunia dan titik koordinat dengan tepat
- [ ] Marker kapal beranimasi pulse dan dapat diklik untuk inspect detail
