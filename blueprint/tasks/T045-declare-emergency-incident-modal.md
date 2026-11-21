# T045: Modal Deklarasi Insiden Darurat & Penyiaran Peringatan Armada

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T043`
- `T009`

---

## Deskripsi Task
Buat `components/incidents/declare-incident-modal.tsx`:
- Form deklarasi krisis baru oleh Crisis Director:
  - Judul Insiden, Kategori (Cuaca, Geopolitik, Mogok Kerja Pelabuhan, Gangguan Sistem), Wilayah Terdampak, Tingkat Keparahan (Kritis / Waspada), Protokol Tindakan Darurat.
  - Submit insiden akan otomatis menambahkan entri ke store, menyiarkan peringatan ke fleet table, dan membunyikan alarm audio.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Modal deklarasi insiden menambahkan data krisis baru ke store
- [ ] Peringatan darurat otomatis muncul di seluruh dashboard
