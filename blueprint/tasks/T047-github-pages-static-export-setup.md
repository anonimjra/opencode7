# T047: Konfigurasi GitHub Pages Static Export & Penanganan .nojekyll

## Baca dulu
- `next.config.ts`

## Depends on
- `T001`

---

## Deskripsi Task
Buat dan sesuaikan konfigurasi deploy statis:
1. `next.config.ts`:
   - `output: 'export'`
   - `basePath: '/opencode7'`
   - `images: { unoptimized: true }`
2. Pastikan file `public/.nojekyll` dan generator `out/.nojekyll` tersedia agar folder berawalan underscore (`_next`) tidak diabaikan oleh GitHub Pages.
3. Tambahkan script deployment di `package.json`:
   `"deploy": "next build && npx --yes gh-pages -d out -b gh-pages --dotfiles"`

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npm run build
```

---

## Kriteria Selesai
- [ ] next.config.ts memiliki konfigurasi output export
- [ ] Folder public/.nojekyll tersedia
- [ ] Build menghasilkan out/ tanpa error
