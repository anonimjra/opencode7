# T009: Sistem Umpan Balik Audio-Visual (Web Audio API Synthesizer & Cyber Toast)

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T002`

---

## Deskripsi Task
1. Buat `lib/utils/sound-fx.ts`:
   - Menggunakan Web Audio API native browser (AudioContext) tanpa file audio eksternal.
   - Fungsi `playSonarPing()`: nada frekuensi 880Hz dengan decay eksponensial (suara radar kapal).
   - Fungsi `playAlarmBeep()`: nada ganda bergantian 1200Hz - 900Hz untuk peringatan darurat / alert kritis.
   - Fungsi `playSuccessChime()`: arpeggio 3-nada menyenangkan untuk notifikasi booking berhasil.
2. Buat `components/ui/toast-system.tsx`:
   - Komponen toast bergaya cyber-industrial dengan warna border dinamis sesuai severity (cyan, emerald, amber, crimson).

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Web Audio API synthesizer berfungsi tanpa error server-side rendering (cek typeof window !== 'undefined')
- [ ] Toast component mendukung auto-dismiss dan dismiss manual
