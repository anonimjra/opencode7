# T010: Layout Root Shell & Responsive Canvas Container

## Baca dulu
- `app/globals.css`
- `components/shell/sidebar.tsx`
- `components/shell/header.tsx`

## Depends on
- `T002`
- `T008`

---

## Deskripsi Task
Buat `app/layout.tsx` dan `components/shell/app-shell.tsx`:
- Konfigurasi metadata (title: 'Aether OS — Autonomous Supply Chain Control Tower').
- Membungkus halaman dengan `AppShell` yang berisi Sidebar di sisi kiri, Header di bagian atas, Main Content di tengah dengan scrollbar kustom, dan Persistent Status Bar di bawah.
- Responsif terhadap resolusi layar desktop besar (1440px - 1920px) maupun tablet.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] app/layout.tsx terkonfigurasi dengan metadata lengkap
- [ ] AppShell membungkus seluruh navigasi dan main content
