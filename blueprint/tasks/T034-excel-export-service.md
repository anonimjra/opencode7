# T034: Layanan Ekspor Rekap Pengiriman ke File Excel (.xlsx) dengan ExcelJS

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T030`

---

## Deskripsi Task
Buat `lib/services/export-excel.ts`:
- Fungsi `exportShipmentsToExcel(shipments: Shipment[]): Promise<void>` menggunakan `exceljs`:
  - Membuat workbook dengan worksheet "Aether Cargo Manifest".
  - Header kolom bergaya enterprise: Navy Blue fill, teks putih tebal.
  - Kolom: Tracking No, B/L No, Shipper, Consignee, Origin, Destination, Incoterm, Status, Weight (Kg), Value (USD), ETA.
  - Auto-fit lebar kolom dan format mata uang/angka yang rapi.
  - Download otomatis ke browser user dengan nama file `Aether_Shipments_Manifest_[tanggal].xlsx`.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Fungsi ekspor ExcelJS menghasilkan file .xlsx yang valid
- [ ] Styling header dan auto-width kolom berfungsi
