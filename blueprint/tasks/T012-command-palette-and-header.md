# T012: Command Palette Global (Ctrl+K Quick Switcher) & Top Bar Action

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T010`

---

## Deskripsi Task
Buat `components/shell/header.tsx` dan `components/shell/command-palette.tsx`:
- Search Bar Global dengan shortcut `Cmd+K` / `Ctrl+K`.
- Modal Command Palette:
  - Pencarian instan terhadap nomor tracking shipment, nama kapal, atau kode pelabuhan.
  - Menampilkan hasil pencarian terkelompok (Shipments, Vessels, Ports) dan navigasi langsung ke item terpilih saat ditekan.
- Top Bar Actions: Tombol Toggle Audio Sonar Mute, Tombol Buka Booking Baru, dan Notifikasi Popover.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Command palette membuka saat Ctrl+K atau Cmd+K ditekan
- [ ] Hasil pencarian fuzzy menyaring shipment, vessel, dan port
