# T040: Kalkulator Estimasi Tarif Freight (Ocean Base, BAF, CAF, PSS)

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T039`

---

## Deskripsi Task
Buat `components/finance/freight-rate-calculator.tsx`:
- Kalkulator penawaran tarif freight kontainer:
  - Input: Pelabuhan Asal & Tujuan, Tipe Kontainer (20GP, 40HC, 40RF), Berat Kargo Ton, Pilihan Carrier.
  - Kalkulasi rincian komponen biaya:
    - Base Ocean Freight Rate.
    - Bunker Adjustment Factor (BAF) fluktuasi bahan bakar.
    - Currency Adjustment Factor (CAF).
    - Peak Season Surcharge (PSS).
    - Terminal Handling Charges (THC) Asal & Tujuan.
  - Total penawaran instan dalam USD & IDR dengan tombol "Copy Quotation".

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Kalkulator tarif freight menghitung seluruh surcharge dengan benar
- [ ] Hasil kalkulasi responsif terhadap perubahan input
