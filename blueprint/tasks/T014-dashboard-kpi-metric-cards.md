# T014: Kartu Metrik Eksekutif KPI dengan Sparkline Recharts

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T008`

---

## Deskripsi Task
Buat `components/dashboard/kpi-metric-cards.tsx`:
- 4 Kartu KPI Eksekutif dengan gaya cyber-industrial:
  1. Active Vessels En-Route: Jumlah kapal laut/pesawat aktif, persentase kapasitas TEU terisi, sparkline mini tren pergerakan.
  2. Total Cargo Value in Transit: Nilai kargo dalam USD (misal: `$142.8M`), tren deviasi vs bulan lalu.
  3. On-Time Delivery Rate: Persentase ketepatan waktu tiba (misal: `94.2%`), badge indikator hijau/kuning.
  4. Active Critical Disruptions: Jumlah insiden dan anomali suhu aktif dengan warna badge merah crimson berkedip.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Komponen KPI cards terintegrasi dengan store
- [ ] Sparkline Recharts mini ter-render mulus di setiap kartu
