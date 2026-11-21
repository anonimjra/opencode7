# T029: Simulator Pemindahan & Relokasi Kontainer dari Lapangan ke Kapal

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T026`
- `T027`

---

## Deskripsi Task
Buat `components/yard/container-relocate-modal.tsx`:
- Form interaktif untuk memindahkan kontainer dari satu slot yard ke slot lain atau ke bay kapal:
  - Pilih slot asal -> pilih slot tujuan.
  - Validasi aturan: Kontainer berbahaya (IMDG) hanya boleh diletakkan di Blok C, kontainer reefer harus di Blok D yang memiliki colokan listrik.
  - Update state yardSlots di store secara realtime setelah relokasi berhasil.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Simulator relokasi memvalidasi kompatibilitas slot reefer/IMDG
- [ ] State yardSlots terupdate seketika
