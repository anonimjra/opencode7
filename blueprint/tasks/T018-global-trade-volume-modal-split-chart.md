# T018: Grafik Recharts Volume Perdagangan Global & Distribusi Modal Angkutan

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T008`

---

## Deskripsi Task
Buat `components/dashboard/trade-volume-chart.tsx`:
- Grafik Recharts `AreaChart` atau `BarChart` bertingkat:
  - Sumbu X: Bulan / Kuartal.
  - Sumbu Y: Volume Kargo (Ribu TEU).
  - Tumpukan data: Ocean Freight (Cyan), Air Cargo (Violet), Intermodal Road (Emerald).
  - Custom Tooltip bergaya cyber-industrial gelap dengan rincian tonase dan persentase pangsa moda.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Grafik Recharts merender area chart bertingkat tanpa error
- [ ] Custom tooltip menampilkan detail data volume
