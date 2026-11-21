# T041: Kalkulator Denda Penyimpanan Pelabuhan (Demurrage & Detention Tiers)

## Baca dulu
- `lib/utils/telematics.ts`

## Depends on
- `T039`

---

## Deskripsi Task
Buat `components/finance/demurrage-calculator.tsx`:
- Kalkulator denda keterlambatan pengembalian kontainer ke terminal pelabuhan (Demurrage & Detention):
  - Input: Hari Masuk Kontainer, Jatah Free Days (misal 5 hari gratis), Hari Aktual Pengambilan/Pengembalian.
  - Perhitungan denda bertingkat:
    - Hari 1-5 setelah free days: $75 / hari.
    - Hari 6-10 setelah free days: $150 / hari.
    - Hari 11+ ke atas: $250 / hari.
  - Menampilkan total akumulasi denda penalti dan peringatan jika melewati batas free days.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Kalkulasi denda demurrage bertingkat menghitung penalti akurat
- [ ] Peringatan free days habis muncul jika hari melebihi batas
