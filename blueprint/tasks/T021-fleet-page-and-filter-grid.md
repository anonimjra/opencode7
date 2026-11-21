# T021: Halaman Daftar Armada & Filter Grid Multi-Moda

## Baca dulu
- `app/fleet/page.tsx`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T008`

---

## Deskripsi Task
Buat `app/fleet/page.tsx` dan `components/fleet/fleet-grid.tsx`:
- Tampilan kartu armada (fleet cards) berdesain radar maritim untuk 20 kapal, pesawat, dan truk.
- Filter tabs: 'All', 'Ocean Vessels', 'Air Cargo', 'Ground Fleet'.
- Informasi pada tiap kartu: Nama armada, Call sign, Kecepatan live knot, Konsumsi bahan bakar L/h, Muatan TEU %, Tombol Buka Telemetri Lengkap.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman /fleet menampilkan kartu armada dengan filtering
- [ ] Statistik muatan TEU dan kecepatan tampil tepat
