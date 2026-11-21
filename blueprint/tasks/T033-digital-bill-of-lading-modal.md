# T033: Generator Digital Bill of Lading (BoL) Standar Maritim & Mode Cetak

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T030`

---

## Deskripsi Task
Buat `components/shipments/bill-of-lading-modal.tsx`:
- Tampilan dokumen resmi maritim Ocean Bill of Lading (B/L):
  - Header: Nama Carrier "AETHER GLOBAL MARITIME LINE", Nomor B/L, Barcode visual SVG.
  - Kotak Shipper, Consignee, Notify Party.
  - Rincian Pre-Carriage, Ocean Vessel & Voyage No, Port of Loading, Port of Discharge.
  - Tabel Container No, Seal No, Deskripsi Barang, Gross Weight, Measurement.
  - Klausul hukum standar maritim internasional dan stempel digital "ORIGINAL NEGOTIABLE".
  - Tombol "Print / Save PDF" dengan CSS `@media print` terisolasi agar dokumen tercetak bersih tanpa elemen UI web.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Modal Bill of Lading meniru format dokumen maritim standar internasional
- [ ] Gaya @media print terpasang untuk pencetakan bersih
