# T044: Simulator Pengalihan Rute Otonom (Komparasi Cape of Good Hope vs Suez)

## Baca dulu
- `lib/utils/geo.ts`
- `lib/utils/telematics.ts`

## Depends on
- `T043`

---

## Deskripsi Task
Buat `components/incidents/reroute-simulator.tsx`:
- Simulator komparasi pengalihan rute pelayaran Asia - Eropa:
  - Rute A (Standar via Terusan Suez): 8,400 nm, 24 hari transit, biaya tol kanal $400,000, risiko keamanan militer Tinggi.
  - Rute B (Pengalihan via Tanjung Harapan / Cape of Good Hope): 11,800 nm, 36 hari transit (+12 hari), tol kanal $0, konsumsi bunker fuel tambahan +$320,000, emisi CO2 +1,400 ton, risiko keamanan Nol.
  - Grafik perbandingan trade-off waktu tempuh vs biaya bahan bakar vs keselamatan kapal.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Simulator reroute menghitung selisih jarak, waktu, dan biaya bahan bakar
- [ ] Grafik komparasi trade-off ter-render jelas
