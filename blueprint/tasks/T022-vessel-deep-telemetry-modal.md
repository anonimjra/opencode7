# T022: Modal Telemetri Mesin Kapal & Indikator Tekanan Ballast

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T021`

---

## Deskripsi Task
Buat `components/fleet/vessel-detail-modal.tsx`:
- Menampilkan rincian telemetri teknis kapal saat diklik:
  - Engine RPM Gauge, Propeller Pitch, Fuel Flow Rate (Liter/Jam), Ballast Water Tanks (Forward/Aft % balance).
  - Daftar kru & nahkoda, status izin pelayaran, riwayat koordinat waypoints yang telah dilalui.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Modal telemetri menampilkan rincian mesin kapal
- [ ] Animasi buka-tutup modal mulus dengan Framer Motion
