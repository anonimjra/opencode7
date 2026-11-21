# T038: Modal Simulator Anomali Suhu & Guncangan Sensor Darurat

## Baca dulu
- `lib/store/use-supply-chain-store.ts`

## Depends on
- `T035`
- `T009`

---

## Deskripsi Task
Buat `components/iot/simulate-sensor-event-modal.tsx`:
- Modal kontrol uji coba untuk menyimulasikan kegagalan pendingin reefer (Kompresor mati, Suhu melonjak ke +8°C) atau insiden kontainer jatuh (Shock 4.8G).
- Tombol "Inject Anomaly":
  - Memperbarui data sensor kontainer di store secara seketika.
  - Memainkan suara alarm bahaya `playAlarmBeep()`.
  - Menerbitkan Critical Alert baru di dashboard dan War Room.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Simulator sensor memicu alert darurat secara realtime
- [ ] Audio alarm terdengar dan state store terupdate
