# T028: Timeline Alokasi Crane Quayside (STS) & Turnaround Sandar

## Baca dulu
- `types/supply-chain.ts`

## Depends on
- `T026`

---

## Deskripsi Task
Buat `components/yard/berth-timeline.tsx`:
- Visualisasi jadwal operasional Ship-to-Shore (STS) Crane di dermaga:
  - 4 Crane STS (STS-01 sampai STS-04).
  - Metrik Moves Per Hour (MPH) crane (target 32 MPH).
  - Timeline Gantt chart waktu sandar kapal vs jadwal muat/bongkar kontainer.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Timeline STS crane ter-render dengan indikator jadwal sandar kapal
- [ ] Metrik MPH crane tampil akurat
