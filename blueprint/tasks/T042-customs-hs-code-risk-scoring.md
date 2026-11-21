# T042: Mesin Skoring Risiko Kepabeanan & Estimator Jalur Bea Cukai

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T039`

---

## Deskripsi Task
Buat `components/finance/customs-risk-engine.tsx`:
- Mesin audit kepabeanan untuk mendeteksi risiko pemeriksaan fisik kontainer:
  - Input HS Code (6-8 digit), Nilai Invoice Pabean (CIF), Negara Asal Kargo.
  - Skoring otomatis:
    - Jalur Hijau (Green Channel): Risiko rendah, rilis dokumen otomatis (< 4 jam).
    - Jalur Kuning (Yellow Channel): Verifikasi dokumen manual (24 jam).
    - Jalur Merah (Red Channel): Pemeriksaan fisik kontainer & x-ray scanner (48-72 jam).
  - Estimasi Bea Masuk (Import Duty %) dan Pajak Pertambahan Nilai (PPN 11%).

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Mesin skoring bea cukai mengklasifikasikan jalur hijau/kuning/merah
- [ ] Kalkulasi bea masuk dan pajak impor dihitung tepat
