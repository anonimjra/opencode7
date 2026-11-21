# T025: Modal Registrasi Unit Armada / Kendaraan Kargo Baru

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T021`

---

## Deskripsi Task
Buat `components/fleet/add-asset-modal.tsx`:
- Form modal untuk menambahkan armada baru ke dalam sistem:
  - Input: Nama Kapal/Armada, Moda (Laut/Udara/Darat), IMO/MMSI, Kapasitas Maksimal TEU, Pelabuhan Pangkalan (Home Port).
  - Validasi input wajib.
  - Setelah disubmit, armada baru langsung muncul di store Zustand dan peta telematika.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Form registrasi armada berfungsi dan menambahkan data baru ke store
- [ ] Validasi form mencegah submission data kosong
