# T046: Halaman Error Boundary, Cyber Radar 404 & Loading Skeleton Global

## Baca dulu
- `app/globals.css`

## Depends on
- `T002`
- `T010`

---

## Deskripsi Task
Buat komponen ketahanan dan fallback error:
1. `app/not-found.tsx`: Halaman 404 bertema Cyber Radar "SIGNAL LOST - SECTOR OUT OF REACH" dengan koordinat acak dan tombol kembali ke Mission Control.
2. `app/loading.tsx`: Loading screen global dengan radar sweep animasi dan progress bar telemetri.
3. `components/ui/error-boundary.tsx`: Komponen pelindung React Error Boundary untuk menangani error tak terduga tanpa merusak seluruh aplikasi.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman 404 dan loading screen terkonfigurasi dengan gaya cyber-industrial
- [ ] Error boundary mencegah aplikasi crash total
