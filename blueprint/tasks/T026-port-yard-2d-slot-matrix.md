# T026: Visual Matriks 2D Terminal Yard Kontainer Interaktif (Bay/Row/Tier)

## Baca dulu
- `app/yard/page.tsx`
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T007`
- `T008`

---

## Deskripsi Task
Buat `app/yard/page.tsx` dan `components/yard/yard-grid.tsx`:
- Render 2D Grid penumpukan kontainer pelabuhan (Container Terminal Yard):
  - 4 Blok Yard ('A' Ekspor Umum, 'B' Impor Umum, 'C' Dangerous Goods IMDG, 'D' Cold-Chain Reefer).
  - Tiap blok menampilkan matriks 6 Bay x 4 Row x 3 Tier slot kontainer.
  - Visualisasi slot: Kode warna kontainer berdasarkan pelabuhan tujuan, badge petir untuk reefer, badge api untuk barang berbahaya (IMDG).
  - Klik slot untuk membuka Drawer Inspektur Kontainer.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Grid 2D yard merender 288 slot dengan tata letak rapi
- [ ] Slot kontainer dapat di-hover dan diklik untuk membuka detail
