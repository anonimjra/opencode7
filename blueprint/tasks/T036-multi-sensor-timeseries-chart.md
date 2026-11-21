# T036: Grafik Dual-Axis Time-Series Recharts (Suhu °C, Kelembaban %, G-Shock)

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T035`

---

## Deskripsi Task
Buat `components/iot/multi-sensor-chart.tsx`:
- Visualisasi Recharts `ComposedChart` time-series 24 jam dengan dual-axis Y:
  - Axis Kiri (Y1): Suhu (°C) dengan garis kurva Cyan/Emerald.
  - Axis Kanan (Y2): Kelembaban (%) dengan garis Violet & G-Shock (G) dengan batang histogram.
  - Garis batas toleransi kritis (Threshold Reference Lines) warna merah putus-putus.
  - Interaksi tooltip yang menampilkan pembacaan tepat pada tiap jam.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Grafik dual-axis Recharts merender tren suhu dan kelembaban mulus
- [ ] Reference lines untuk ambang batas toleransi tampil tepat
