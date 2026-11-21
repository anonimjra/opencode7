# T037: Kartu Kalkulator Risiko Pembusukan Kargo Farmasi (MKT)

## Baca dulu
- `lib/utils/telematics.ts`

## Depends on
- `T035`

---

## Deskripsi Task
Buat `components/iot/temperature-excursion-card.tsx`:
- Kalkulator ilmiah berbasis Mean Kinetic Temperature (MKT):
  - Menghitung suhu kinetik rata-rata dari deret pembacaan log suhu menggunakan konstanta energi aktivasi panas $(\Delta H = 83.144 	ext{ kJ/mol})$.
  - Menghitung kalkulasi sisa masa simpan (Shelf-life degradation rate).
  - Menampilkan rekomendasi inspeksi lab karantina jika MKT melebihi ambang batas aman.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Kalkulasi MKT menghasilkan angka sesuai standar farmasi WHO/FDA
- [ ] Kartu memberikan evaluasi risiko pembusukan produk
