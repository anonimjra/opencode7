# T032: Drawer Pelacak Milestone Perjalanan Pengiriman Interaktif

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T030`

---

## Deskripsi Task
Buat `components/shipments/milestone-drawer.tsx`:
- Drawer samping yang menampilkan vertical stepper riwayat perjalanan kargo:
  - 7 Titik Milestone: Booking Confirmed -> Gate In Terminal -> Loaded on Vessel -> In Transit (At Sea) -> Customs Cleared -> Out for Delivery -> Delivered.
  - Waktu stempel, lokasi fisik, dan indikator centang hijau untuk tahap yang sudah selesai.
  - Tombol aksi simulasi: "Advance to Next Milestone" untuk menguji update status.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Vertical stepper menampilkan milestone kargo dengan jelas
- [ ] Tombol advance milestone memperbarui status di store
