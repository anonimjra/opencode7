# T023: Pelacak Hours of Service (HOS) & Kepatuhan Istirahat Nahkoda/Pengemudi

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T021`

---

## Deskripsi Task
Buat `components/fleet/driver-hos-tracker.tsx`:
- Komponen kepatuhan regulasi waktu kerja nahkoda dan pengemudi truk (Hours of Service - HOS):
  - Maksimal 11 jam mengemudi per siklus 14 jam.
  - Progress bar waktu mengemudi aktif, sisa waktu wajib istirahat, peringatan pelanggaran kepatuhan (fatigue alert).

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Komponen HOS logger menghitung persentase waktu istirahat secara akurat
- [ ] Warning muncul jika mendekati batas jam kerja
