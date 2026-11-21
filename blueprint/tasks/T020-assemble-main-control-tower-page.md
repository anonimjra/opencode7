# T020: Assembler Halaman Dashboard Utama Kontrol Tower

## Baca dulu
- `app/page.tsx`
- `components/dashboard/kpi-metric-cards.tsx`
- `components/dashboard/telematics-map.tsx`
- `components/dashboard/active-fleet-table.tsx`
- `components/dashboard/critical-alerts-feed.tsx`
- `components/dashboard/trade-volume-chart.tsx`
- `components/dashboard/port-congestion-gauge.tsx`

## Depends on
- `T014`
- `T015`
- `T016`
- `T017`
- `T018`
- `T019`

---

## Deskripsi Task
Rakit `app/page.tsx` menyatukan seluruh modul kontrol tower ke dalam tata letak mission control:
- Grid responsif: Baris atas KPI Cards, Kolom tengah Peta Telematika SVG berdampingan dengan Critical Alerts Feed, Baris bawah Tabel Armada berdampingan dengan Grafik Volume & Kongesti.
- Header halaman dengan judul "MISSION CONTROL TOWER", status uplink sistem, dan filter global waktu.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npm run build atau npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman app/page.tsx terkompilasi bersih tanpa error
- [ ] Layout tertata seimbang dan responsif pada layar desktop
