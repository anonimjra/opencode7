# T002: Konfigurasi Tailwind CSS v4, Token Tema Cyber-Industrial & Glow Utilities

## Baca dulu
- `blueprint/07-DESIGN-SYSTEM.md`

## Depends on
- `T001`

---

## Deskripsi Task
Konfigurasi Tailwind CSS v4 di `app/globals.css` menggunakan `@import "tailwindcss";`.
Definisikan utility warna kustom tema Deep Obsidian Cyber-Industrial:
- Background: #07090E, Card: #0D111A, Surface Elevated: #161F30, Border: #1E2C42
- Aksen Neon: Cyan #00F5FF, Emerald #10B981, Amber #F59E0B, Crimson #EF4444, Violet #8B5CF6
- Animasi kustom: radar-pulse, scanline shimmer, custom cyber scrollbar.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] globals.css memuat @import 'tailwindcss'
- [ ] Variabel/token warna dark cyber-industrial tersedia
- [ ] Animasi radar pulse dan glow utility terdefinisi
