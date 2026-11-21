# T008: Store Global Zustand Reaktif & LocalStorage Synchronizer

## Baca dulu
- `types/supply-chain.ts`
- `lib/seeds/ports.ts`
- `lib/seeds/vessels.ts`
- `lib/seeds/shipments.ts`
- `lib/seeds/yard.ts`
- `lib/seeds/incidents.ts`

## Depends on
- `T007`

---

## Deskripsi Task
Buat `lib/store/use-supply-chain-store.ts` menggunakan Zustand dengan middleware `persist`:
- State: `ports`, `vessels`, `shipments`, `yardSlots`, `incidents`, `alerts`, `selectedVesselId`, `selectedShipmentId`, `activeFilters`, `simulationSpeed`.
- Actions:
  - `addShipment(shipment: Shipment): void`
  - `updateShipmentStatus(id: string, status: ShipmentStatus): void`
  - `updateVesselCoordinates(id: string, lat: number, lng: number, speed: number): void`
  - `relocateContainer(sourceSlot: string, targetSlot: string): void`
  - `acknowledgeAlert(id: string): void`
  - `declareIncident(incident: CriticalAlert): void`
  - `resetToSeed(): void` (mengembalikan state ke data awal jika di-reset user)
- Key LocalStorage: `aether-supply-chain-storage`.

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] Zustand store mengimplementasikan persist middleware
- [ ] Fungsi CRUD shipment dan relokasi kontainer berjalan reaktif
- [ ] Fungsi resetToSeed() mengembalikan data awal
