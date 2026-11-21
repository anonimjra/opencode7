# 05. Konvensi Koding & Arsitektur Kode

1. **TypeScript Strict Rule**:
   - Dilarang keras memakai tipe `any`. Gunakan interface atau generics terdefinisi dari `types/supply-chain.ts`.
   - Objek yang berpotensi `undefined` harus ditangani dengan optional chaining `?.` atau nullish coalescing `??`.

2. **Tailwind CSS v4 Standard**:
   - Gunakan sintaks Tailwind CSS v4 modern (`@import "tailwindcss";` di `app/globals.css`).
   - Warna custom menggunakan utility Tailwind atau CSS variables kustom (`bg-[#07090E]`, `text-[#00F5FF]`, `border-[#1E2C42]`).

3. **Komponen Client vs Server**:
   - Karena proyek ini diekspor secara statis (`output: 'export'`) dan sarat dengan interaktivitas (`localStorage`, state, event handlers, canvas, charts), tambahkan directive `'use client'` di awal berkas komponen dan halaman yang membutuhkan client API.

4. **Kelengkapan Kode (Zero Truncation)**:
   - Jangan pernah meninggalkan placeholder seperti `// TODO: implement later` atau memotong implementasi. Tulis seluruh fungsi, switch-case, dan styling secara utuh.

5. **Ketelitian Formula Matematika**:
   - Gunakan formula standar maritim/logistik nyata:
     - Jarak Haversine: $d = 2R rcsin\left(\sqrt{\sin^2(\Delta \phi/2) + \cos \phi_1 \cos \phi_2 \sin^2(\Delta \lambda/2)}ight)$
     - Mean Kinetic Temperature (MKT): $T_k = rac{\Delta H / R}{-\ln \left(rac{1}{n} \sum_{i=1}^n e^{-\Delta H / (R T_i)}ight)}$
     - Emisi $CO_2$ per TEU-km: $	ext{Emisi} = 	ext{Jarak} 	imes 	ext{Faktor Emisi Modal}$
