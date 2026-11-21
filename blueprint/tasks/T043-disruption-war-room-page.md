# T043: Pusat Komando Krisis & Pemantau Titik Chokepoint Maritim Global

## Baca dulu
- `app/incidents/page.tsx`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T007`
- `T008`

---

## Deskripsi Task
Buat `app/incidents/page.tsx` dan `components/incidents/war-room.tsx`:
- Halaman Situational War Room pemantau krisis logistik global:
  - Status 5 Chokepoint Maritim Dunia: Selat Malaka, Terusan Suez, Terusan Panama, Selat Hormuz, Bab-el-Mandeb.
  - Peta status ancaman geopolitik & cuaca ekstrem.
  - Daftar kapal yang terdampak langsung oleh krisis aktif.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman /incidents memuat pusat komando krisis
- [ ] Status chokepoint global tampil dengan indikator status
