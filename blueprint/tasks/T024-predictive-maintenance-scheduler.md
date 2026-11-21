# T024: Penjadwal Pemeliharaan Prediktif & Indikator Degradasi Suku Cadang

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T021`

---

## Deskripsi Task
Buat `components/fleet/maintenance-scheduler.tsx`:
- Dashboard pemeliharaan prediktif armada:
  - Komponen: Main Engine Turbine, Aux Generators, Hull Bio-fouling Resistance, Rudder Hydraulics.
  - Estimasi hari hingga jadwal Dry-Dock berikutnya.
  - Form pencatatan log perawatan berkala.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Indikator degradasi komponen ter-render dengan progress bar dinamis
- [ ] Log perawatan tersimpan ke state
