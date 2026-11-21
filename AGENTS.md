# AGENTS.md

Petunjuk kerja otomatis untuk `opencode` (autonomous coding agent) pada proyek **Aether OS - Global Autonomous Supply Chain, Maritime Telematics & Port Yard Control Tower** di direktori `opencode7`.

---

## 1. Mode Kerja Otonom (Autonomous Mission Execution)

- Kerjakan seluruh task di `blueprint/tasks/` secara berurutan mulai dari `T001` hingga `T048` selesai tanpa meminta konfirmasi user.
- **Sebelum mulai task:**
  1. Baca berkas task target (`blueprint/tasks/TXXX-...md`).
  2. Baca semua berkas yang dirujuk pada bagian **"Baca dulu"**.
  3. Cek dependensi pada bagian **"Depends on"**; pastikan task prasyarat sudah terselesaikan.
- **Saat mengeksekusi:**
  1. Tulis kode secara 100% lengkap tanpa placeholder, tanpa komentar `// TODO`, dan tanpa pemotongan kode.
  2. Terapkan standar TypeScript strict (`noImplicitAny`, type-safe interfaces).
  3. Pastikan estetika visual mencerminkan visual Dark Cyber-Industrial Mission Control (`#07090E`, `#0D111A`, `#161F30`, `#00F5FF`, `#10B981`, `#F59E0B`, `#EF4444`, `#8B5CF6`) sesuai `blueprint/07-DESIGN-SYSTEM.md`.
  4. Gunakan Tailwind CSS v4 (`@import "tailwindcss";`) di `app/globals.css`.
- **Setelah selesai tiap task:**
  1. Jalankan perintah yang tertulis di bagian **"Verifikasi"** (contoh: `npm run build` atau `npx tsc --noEmit`).
  2. Pastikan semua checklist di **"Kriteria selesai"** terpenuhi.
  3. Update berkas `blueprint/PROGRESS.md`: ubah status `[ ]` menjadi `[x]`.
  4. Lakukan git commit dengan pesan terstruktur: `git commit -m "TXXX: [judul task]"`.

---

## 2. Penanganan Hambatan (Blocker Protocol)

- **Jangan berhenti dan jangan menunggu konfirmasi manusia.**
- Jika terjadi error build, dependensi, atau penulisan kode:
  1. Catat error di `blueprint/BLOCKERS.md` beserta timestamp.
  2. Lakukan self-healing/troubleshooting langsung (baca pesan error compiler/bundler, perbaiki tipe, pasang missing packages).
  3. Verifikasi ulang hingga error tuntas.
  4. Hapus entri di `blueprint/BLOCKERS.md` dan commit perbaikan.

---

## 3. Komitmen Stack & Standar Kualitas

- **Framework**: Next.js 15 (App Router), React 19, TypeScript strict.
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";`), Lucide React icons, Framer Motion animations.
- **Data & Charts**: Recharts, ExcelJS, Canvas-Confetti.
- **State & Local-First**: Zustand dengan persistensi `localStorage` (`aether-supply-chain-storage`), dilengkapi fungsi `resetToSeed()`.
- **GitHub Pages Static Export**: `output: 'export'`, `basePath: '/opencode7'`, `images: { unoptimized: true }`, sertakan file `public/.nojekyll` dan `out/.nojekyll`.
- **Performa & Zero-Crash**: Seluruh komponen interaktif (peta SVG telematics, 2D yard grid, kalkulator, modal booking, charts) harus bebas dari crash dan zero warning saat build SSG.
