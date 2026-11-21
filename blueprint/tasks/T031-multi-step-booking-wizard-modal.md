# T031: Wizard Pemesanan Booking Pengiriman Baru 4-Tahap & Efek Confetti

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T030`

---

## Deskripsi Task
Buat `components/shipments/booking-wizard-modal.tsx`:
- Wizard 4 Langkah Pemesanan Kargo Baru:
  1. Langkah 1: Kargo & Spesifikasi (Deskripsi barang, HS Code, Berat kg, Volume CBM, Suhu Reefer jika cold-chain).
  2. Langkah 2: Rute & Pelabuhan (Pilih Pelabuhan Asal, Pelabuhan Tujuan, Moda Transportasi).
  3. Langkah 3: Pihak Terlibat & Incoterm (Shipper, Consignee, Notify Party, Aturan Incoterm 2020).
  4. Langkah 4: Tinjauan Biaya & Terbitkan Booking (Kalkulasi estimasi freight, tombol Submit Booking).
- Saat booking berhasil disubmit:
  - Buat data Shipment baru dan simpan ke Zustand store.
  - Picu efek selebrasi kembang api konfeti dengan `canvas-confetti`.
  - Mainkan suara sukses `playSuccessChime()`.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Wizard 4 tahap memvalidasi form di setiap langkah
- [ ] Data shipment baru masuk ke store dan memicu animasi canvas-confetti
