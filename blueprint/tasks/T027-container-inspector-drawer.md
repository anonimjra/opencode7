# T027: Drawer Inspektur Detail Kontainer & Label Bahaya IMDG Class

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T026`

---

## Deskripsi Task
Buat `components/yard/container-detail-drawer.tsx`:
- Drawer samping yang menampilkan informasi lengkap kontainer terpilih:
  - Nomor ISO Kontainer (misal: `MSKU-882194-0`), Tipe (20GP, 40HC, 40RF).
  - Tare Weight vs Gross Payload Weight, Nomor Segel Pengaman (Bolt Seal).
  - Status IMDG: Class 3 (Flammable Liquids), lembar data keselamatan penanganan.
  - Kontrol Reefer: Suhu target, suhu aktual, grafik suhu singkat.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Drawer menampilkan data kontainer secara detail dan type-safe
- [ ] Indikator IMDG Class dan Reefer ditampilkan jelas
