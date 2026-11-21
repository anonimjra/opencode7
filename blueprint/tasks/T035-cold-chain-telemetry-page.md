# T035: Laboratorium Pemantau Suhu Kontainer Reefer Live

## Baca dulu
- `app/iot-telemetry/page.tsx`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T007`
- `T008`

---

## Deskripsi Task
Buat `app/iot-telemetry/page.tsx` dan `components/iot/telemetry-overview.tsx`:
- Halaman monitoring khusus kargo rantai dingin (Cold-Chain Reefer Containers):
  - Daftar kontainer berpendingin aktif (produk farmasi, vaksin, seafood, daging segar).
  - Status kartu: Suhu aktual vs Suhu target (misal: `-20.2°C` / Target `-20.0°C`), Kelembaban %, Status Baterai Sensor %, Indikator Kestabilan Suhu.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman /iot-telemetry menampilkan daftar kontainer reefer
- [ ] Status anomali suhu tersorot dengan warna peringatan
