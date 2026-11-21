# T017: Ticker Umpan Peringatan Kritis & Insiden Operasional Maritim

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T008`
- `T009`

---

## Deskripsi Task
Buat `components/dashboard/critical-alerts-feed.tsx`:
- Feed panel peringatan realtime yang mengelompokkan insiden berdasarkan tingkat urgensi (Critical, Warning, Info).
- Menampilkan alert cuaca buruk, pembatasan alur pelayaran, anomali suhu reefer, dan keterlambatan izin kepabeanan.
- Tombol aksi "Acknowledge" (mengubah status alert menjadi diakui) dan tombol "View in War Room" untuk melompat ke investigasi krisis.
- Memainkan audio alarm beep saat ada alert bertipe 'critical'.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Alert feed memuat daftar peringatan aktif dari store
- [ ] Tombol acknowledge memperbarui state di Zustand
