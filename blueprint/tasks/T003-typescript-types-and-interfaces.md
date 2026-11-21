# T003: Definisi Tipe TypeScript Global & Kontrak Entitas Logistik

## Baca dulu
- `blueprint/06-DATA-MODEL.md`

## Depends on
- `T001`

---

## Deskripsi Task
Buat file `types/supply-chain.ts` berisi seluruh interface dan tipe data logistik enterprise:
- TransportMode ('ocean' | 'air' | 'rail' | 'road')
- ShipmentStatus, VesselStatus, IncotermCode, IMDGHazardClass
- PortNode, Waypoint, Vessel
- ContainerSlot (block, bay, row, tier, hazardClass, isReefer, status)
- SensorTelemetryPoint (temperatureC, humidityPercent, shockG, ambientLightLux, batteryPercent)
- Shipment (trackingNumber, bolNumber, shipper, consignee, containers, telemetryHistory, milestones)
- CriticalAlert (severity, category, title, message, relatedEntityId)
- DriverHOS (driverName, vesselOrTruckId, drivingHoursToday, maxDrivingHours, restStatus)
- TariffCalculation (oceanBase, baf, caf, pss, total)
- DemurrageCalculation (portFreeDays, daysInPort, tier1Fee, tier2Fee, totalPenalty)

---

## Verifikasi
Jalankan perintah berikut di terminal:
```bash
npx tsc --noEmit
```

---

## Kriteria Selesai
- [ ] File types/supply-chain.ts terbuat lengkap
- [ ] Zero tipe any
- [ ] Ekspor seluruh tipe kontrak data model
