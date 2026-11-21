# T019: Gauge Indeks Kongesti Pelabuhan & Estimasi Antrean Sandar

## Baca dulu
- `lib/seeds/ports.ts`

## Depends on
- `T005`

---

## Deskripsi Task
Buat `components/dashboard/port-congestion-gauge.tsx`:
- Visualisasi perbandingan waktu antrean kapal di pelabuhan utama dunia (Rotterdam, Singapore, Shanghai, LA, Tanjung Priok).
- Menggunakan Recharts `BarChart` horizontal atau `RadarChart`:
  - Kategori status: Optimal (< 24 jam - Emerald), Moderat (24-72 jam - Amber), Kongesti Berat (> 72 jam - Crimson).
  - Rincian jumlah kapal yang sedang lego jangkar (at anchor) vs bersandar (at berth).

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Grafik kongesti pelabuhan ter-render dengan data akurat
- [ ] Indikator warna mencerminkan keparahan waktu antrean
