# T013: Status Bar Sistem Real-Time & Jam Zulu UTC

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T010`

---

## Deskripsi Task
Buat `components/shell/status-ticker.tsx`:
- Letak di bottom bar aplikasi.
- Menampilkan:
  - Jam Zulu / UTC maritim live dengan detik berjalan (misal: `UTC 12:44:02Z` | `WIB 19:44:02`).
  - Indikator Status Satelit Maritim (Inmarsat / Starlink Maritime: 99.98% Uplink, Latency 42ms).
  - Ticker teks berjalan (marquee) yang menampilkan update pergerakan armada terbaru.
  - Tombol indikator simulasi kecepatan (1x, 5x, 10x).

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Jam UTC maritim berjalan realtime tanpa memory leak (pembersihan interval di useEffect)
- [ ] Status bar terpasang rapi di bottom dock
