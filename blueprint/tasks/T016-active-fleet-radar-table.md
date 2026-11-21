# T016: Tabel Radar Armada Aktif & Status Kecepatan/Heading Kapal

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T008`

---

## Deskripsi Task
Buat `components/dashboard/active-fleet-table.tsx`:
- Tabel berdensitas tinggi yang menampilkan kapal dan pesawat kargo yang sedang beroperasi:
  - Kolom: Nama Armada, Moda (Ikon Kapal/Pesawat/Truk), Asal -> Tujuan, Kecepatan (Knot), Heading (°), Progres Rute (Progress Bar), Estimasi Tiba (ETA), Status (Underway / Anchored / Diverted).
  - Filter cepat berdasarkan moda transportasi.
  - Klik baris tabel untuk menyorot armada di peta atau membuka detail.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Tabel menampilkan armada secara dinamis
- [ ] Progress bar dan status badge ter-render dengan warna sesuai
