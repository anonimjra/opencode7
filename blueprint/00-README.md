# Blueprint: Aether OS (Enterprise Global Supply Chain & Control Tower)

Aether OS adalah platform komando logistik global, telematika armada maritim & kargo, perencana slot 2D terminal pelabuhan, pemantau IoT cold-chain, serta kalkulator tarif & bea cukai berbasis web enterprise modern.

---

## Struktur Folder Blueprint

```
blueprint/
├── 00-README.md                # Ikhtisar ini
├── 02-PROJECT-BRIEF.md         # Brief produk, target persona, dan value proposition
├── 03-ARCHITECTURE.md          # Arsitektur sistem, struktur folder Next.js, dan data flow
├── 04-TECH-STACK.md            # Daftar dependensi, library, dan tooling
├── 05-CONVENTIONS.md           # Standar penamaan, pola TypeScript strict, dan aturan coding
├── 06-DATA-MODEL.md            # Definisi entitas data lengkap & state contracts
├── 07-DESIGN-SYSTEM.md         # Token warna cyber-industrial, tipografi, dan gaya visual
├── PROGRESS.md                 # Checklist pelacak status 48 task (T001 - T048)
├── BLOCKERS.md                 # Catatan penanganan error otonom
├── 99-FINAL-CHECKLIST.md       # Audit kriteria sukses sebelum rilis
└── tasks/                      # 48 file spesifikasi task mandiri (T001 - T048)
```

---

## Petunjuk Eksekusi Otonom (Untuk Agen Opencode)

1. Baca `AGENTS.md` dan `blueprint/00-README.md`.
2. Kerjakan file di `blueprint/tasks/` secara berurutan: `T001` -> `T002` -> ... -> `T048`.
3. Setelah menyelesaikan satu task, jalankan verifikasi (`npm run build` atau `npx tsc --noEmit`).
4. Update `blueprint/PROGRESS.md`: ubah checklist `[ ]` menjadi `[x]`.
5. Lanjutkan ke task berikutnya tanpa bertanya atau berhenti.
