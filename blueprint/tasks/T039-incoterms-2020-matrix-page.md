# T039: Matriks Interaktif 11 Aturan Incoterms 2020 & Pembagian Biaya/Risiko

## Baca dulu
- `app/customs-finance/page.tsx`
- `lib/utils/incoterms.ts`

## Depends on
- `T004`

---

## Deskripsi Task
Buat `app/customs-finance/page.tsx` dan `components/finance/incoterms-matrix.tsx`:
- Matriks interaktif untuk seluruh 11 aturan Incoterms 2020:
  - EXW, FCA, CPT, CIP, DAP, DPU, DDP (Segala Moda).
  - FAS, FOB, CFR, CIF (Hanya Moda Laut & Perairan).
  - Diagram visual tanggung jawab: Titik pemuatan pabrik, pengangkutan darat asal, bea cukai ekspor, terminal pelabuhan muat, pengangkutan utama laut/udara, bea cukai impor, pengantaran akhir pembeli.
  - Pemilih aturan interaktif yang menyorot batas peralihan risiko (Risk Transfer Point) dan kewajiban pembayaran asuransi.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Halaman /customs-finance merender tabel matriks 11 Incoterms 2020
- [ ] Interaksi pilihan Incoterm menyorot peralihan biaya dan risiko
