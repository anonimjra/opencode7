# T004: Helper Matematika & Algoritma Logistik Maritim

## Baca dulu
- `types/supply-chain.ts`
- `blueprint/05-CONVENTIONS.md`

## Depends on
- `T003`

---

## Deskripsi Task
Buat helper fungsi dan algoritma perhitungan presisi:
1. `lib/utils/formatters.ts`:
   - Format mata uang USD & IDR, format TEU, format knot & km/h, format koordinat Latitude/Longitude (DMS & Decimal), format tanggal maritim Zulu UTC.
2. `lib/utils/geo.ts`:
   - Rumus Haversine: jarak antara dua titik koordinat (dalam Nautical Miles 'nm' dan Kilometer 'km').
   - Rumus Bearing: menghitung sudut derajat heading kapal (0° - 360°).
3. `lib/utils/incoterms.ts`:
   - Matriks pembagian 11 aturan Incoterms 2020 (siapa bayar freight, asuransi, bea cukai impor, risiko peralihan kargo).
4. `lib/utils/telematics.ts`:
   - Formula Mean Kinetic Temperature (MKT) Arrhenius untuk kalkulasi degradasi suhu vaksin/farmasi.
   - Formula estimasi konsumsi bunker fuel kapal & kalkulasi emisi karbon CO2 per TEU-km.
   - Formula penalti demurrage & detention bertingkat.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Fungsi Haversine & Bearing menghasilkan kalkulasi akurat
- [ ] Formula MKT bekerja dengan benar
- [ ] Formatters mata uang dan koordinat teruji
