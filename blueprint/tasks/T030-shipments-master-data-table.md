# T030: Tabel Master Pengiriman Internasional dengan Multi-Filter & Search

## Baca dulu
- `app/shipments/page.tsx`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T006`
- `T008`

---

## Deskripsi Task
Buat `app/shipments/page.tsx` dan `components/shipments/shipments-table.tsx`:
- Tabel master 60+ pengiriman kargo internasional:
  - Fitur pencarian instan (tracking number, consignee, shipper, nomor BoL).
  - Filter dropdown: Status (At Sea, Gate In, Customs Hold, Delivered), Moda (Ocean, Air, Road), Incoterm (FOB, CIF, DDP).
  - Pagination (10 item per halaman) dengan sorting kolom (tanggal, nilai kargo, berat).
  - Tombol aksi: Lacak Milestone, Lihat Bill of Lading, Ekspor Excel.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Tabel menampilkan 60+ shipment dengan filter dinamis dan pagination
- [ ] Pencarian dan sorting kolom berjalan lancar
