'use client';

import { useState } from 'react';
import { Plus, Ship } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { pushToast } from '@/components/ui/toast-system';
import type { TransportMode, Vessel } from '@/types/supply-chain';

interface AddAssetModalProps {
  open: boolean;
  onClose: () => void;
}

const MODES: { value: TransportMode; label: string }[] = [
  { value: 'ocean', label: 'Ocean Vessel' },
  { value: 'air', label: 'Air Cargo' },
  { value: 'road', label: 'Ground Truck' },
  { value: 'rail', label: 'Rail Intermodal' },
];

export function AddAssetModal({ open, onClose }: AddAssetModalProps) {
  const addVessel = useSupplyChainStore((state) => state.addVessel);
  const ports = useSupplyChainStore((state) => state.ports);

  const [name, setName] = useState('');
  const [mode, setMode] = useState<TransportMode>('ocean');
  const [imo, setImo] = useState('');
  const [capacity, setCapacity] = useState('');
  const [homePort, setHomePort] = useState('');
  const [captain, setCaptain] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = (): void => {
    setName('');
    setMode('ocean');
    setImo('');
    setCapacity('');
    setHomePort('');
    setCaptain('');
    setError(null);
  };

  const handleSubmit = (): void => {
    if (!name.trim()) {
      setError('Asset name is required.');
      return;
    }
    if (!imo.trim()) {
      setError('IMO / registration number is required.');
      return;
    }
    if (!(Number(capacity) > 0)) {
      setError('Capacity must be greater than zero.');
      return;
    }
    if (!homePort) {
      setError('Select a home port.');
      return;
    }
    if (!captain.trim()) {
      setError('Captain / operator name is required.');
      return;
    }

    const homePortNode = ports.find((port) => port.id === homePort);
    const callsign = `AE${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const mmsi = String(200000000 + Math.floor(Math.random() * 700000000));
    const dest = ports[(ports.findIndex((p) => p.id === homePort) + 3) % ports.length];

    const vessel: Vessel = {
      id: `vsl-new-${Date.now()}`,
      name: name.trim(),
      callsign,
      mmsi,
      imo: imo.trim(),
      mode,
      capacityTEU: Number(capacity),
      currentTEU: 0,
      speedKnots: 0,
      headingDegrees: 0,
      lat: homePortNode?.lat ?? 0,
      lng: homePortNode?.lng ?? 0,
      originPortId: homePort,
      destPortId: dest?.id ?? homePort,
      routeProgressPercent: 0,
      status: 'moored',
      engineRPM: 0,
      fuelConsumptionLPerHr: 0,
      co2EmissionsTon: 0,
      waypoints: [
        {
          name: homePortNode?.name ?? 'Home Port',
          lat: homePortNode?.lat ?? 0,
          lng: homePortNode?.lng ?? 0,
          estimatedArrival: new Date().toISOString(),
          status: 'current',
        },
      ],
      captainName: captain.trim(),
      lastUpdated: new Date().toISOString(),
    };

    addVessel(vessel);
    pushToast('Asset Registered', `${vessel.name} added to the fleet.`, 'success');
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Register New Fleet Asset"
      subtitle="Add vessel, aircraft or cargo vehicle"
      icon={<Ship className="h-5 w-5 text-[#00F5FF]" />}
      size="md"
      accent="cyan"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            <Plus className="h-3.5 w-3.5" /> Register Asset
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {error ? (
          <div className="sm:col-span-2 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#EF4444]">
            {error}
          </div>
        ) : null}
        <Field label="Asset Name" full>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Aether Meridian" className={inputClass} />
        </Field>
        <Field label="Transport Mode" full>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase ${
                  mode === option.value
                    ? 'border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]'
                    : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="IMO / Registration">
          <input value={imo} onChange={(event) => setImo(event.target.value)} placeholder="IMO 9900123" className={inputClass} />
        </Field>
        <Field label="Max Capacity (TEU)">
          <input type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} placeholder="18000" className={inputClass} />
        </Field>
        <Field label="Home Port">
          <select value={homePort} onChange={(event) => setHomePort(event.target.value)} className={inputClass}>
            <option value="">Select home port…</option>
            {ports.map((port) => (
              <option key={port.id} value={port.id}>
                {port.code} — {port.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Captain / Operator">
          <input value={captain} onChange={(event) => setCaptain(event.target.value)} placeholder="Capt. Jane Doe" className={inputClass} />
        </Field>
      </div>
    </Modal>
  );
}

const inputClass =
  'h-9 w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-3 font-mono text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#00F5FF]/50 focus:outline-none';

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">{label}</span>
      {children}
    </label>
  );
}
