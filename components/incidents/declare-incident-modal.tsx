'use client';

import { useState } from 'react';
import { AlertOctagon } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { playAlarmBeep } from '@/lib/utils/sound-fx';
import { pushToast } from '@/components/ui/toast-system';
import type {
  AlertCategory,
  AlertSeverity,
  CriticalAlert,
  DisruptionIncident,
} from '@/types/supply-chain';

interface DeclareIncidentModalProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES: { value: AlertCategory; label: string }[] = [
  { value: 'weather', label: 'Extreme Weather' },
  { value: 'geopolitical', label: 'Geopolitical' },
  { value: 'congestion', label: 'Port Strike / Congestion' },
  { value: 'customs', label: 'Customs System Fault' },
  { value: 'telemetry_excursion', label: 'Reefer Fault' },
];

const CHOKEPOINTS = [
  'Strait of Malacca',
  'Suez Canal',
  'Panama Canal',
  'Strait of Hormuz',
  'Bab-el-Mandeb',
];

const SEVERITIES: { value: AlertSeverity; label: string }[] = [
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

export function DeclareIncidentModal({ open, onClose }: DeclareIncidentModalProps) {
  const declareIncident = useSupplyChainStore((state) => state.declareIncident);
  const addIncident = useSupplyChainStore((state) => state.addIncident);
  const vessels = useSupplyChainStore((state) => state.vessels);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AlertCategory>('weather');
  const [region, setRegion] = useState('');
  const [chokepoint, setChokepoint] = useState(CHOKEPOINTS[0]);
  const [severity, setSeverity] = useState<AlertSeverity>('critical');
  const [protocol, setProtocol] = useState('');
  const [error, setError] = useState<string | null>(null);

  const reset = (): void => {
    setTitle('');
    setCategory('weather');
    setRegion('');
    setChokepoint(CHOKEPOINTS[0]);
    setSeverity('critical');
    setProtocol('');
    setError(null);
  };

  const handleSubmit = (): void => {
    if (!title.trim()) {
      setError('Incident title is required.');
      return;
    }
    if (!region.trim()) {
      setError('Affected region is required.');
      return;
    }
    if (!protocol.trim()) {
      setError('Emergency protocol description is required.');
      return;
    }

    const now = new Date().toISOString();
    const affectedVesselIds = vessels
      .filter((vessel) => vessel.status === 'underway' || vessel.status === 'diverted')
      .slice(0, 4)
      .map((vessel) => vessel.id);

    const incident: DisruptionIncident = {
      id: `inc-user-${Date.now()}`,
      title: title.trim(),
      category,
      region: region.trim(),
      severity,
      chokepoint,
      lat: 0,
      lng: 0,
      description: protocol.trim(),
      status: 'active',
      affectedVesselIds,
      startDate: now,
      impactPercent: severity === 'critical' ? 38 : severity === 'warning' ? 20 : 8,
    };

    const alert: CriticalAlert = {
      id: `alert-incident-${Date.now()}`,
      severity,
      category,
      title: `DECLARED: ${title.trim()}`,
      message: `${region.trim()} · ${protocol.trim()}`,
      relatedEntityId: incident.id,
      timestamp: now,
      isAcknowledged: false,
    };

    addIncident(incident);
    declareIncident(alert);
    playAlarmBeep();
    pushToast('Incident Declared', 'Emergency broadcast dispatched to all fleet units.', severity === 'critical' ? 'critical' : 'warning');
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Declare Emergency Incident"
      subtitle="Crisis Director broadcast"
      icon={<AlertOctagon className="h-5 w-5 text-[#EF4444]" />}
      size="md"
      accent="crimson"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={handleSubmit}>
            <AlertOctagon className="h-3.5 w-3.5" /> Broadcast Incident
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {error ? (
          <div className="sm:col-span-2 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#EF4444]">{error}</div>
        ) : null}
        <Field label="Incident Title" full>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Gulf Storm Transit Closure" className={inputClass} />
        </Field>
        <Field label="Category">
          <select value={category} onChange={(event) => setCategory(event.target.value as AlertCategory)} className={inputClass}>
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Severity">
          <select value={severity} onChange={(event) => setSeverity(event.target.value as AlertSeverity)} className={inputClass}>
            {SEVERITIES.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Affected Region">
          <input value={region} onChange={(event) => setRegion(event.target.value)} placeholder="e.g. Gulf of Aden" className={inputClass} />
        </Field>
        <Field label="Chokepoint">
          <select value={chokepoint} onChange={(event) => setChokepoint(event.target.value)} className={inputClass}>
            {CHOKEPOINTS.map((point) => (
              <option key={point} value={point}>{point}</option>
            ))}
          </select>
        </Field>
        <Field label="Emergency Protocol" full>
          <textarea
            value={protocol}
            onChange={(event) => setProtocol(event.target.value)}
            rows={3}
            placeholder="Describe the emergency action protocol…"
            className="w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-3 py-2 font-mono text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#EF4444]/50 focus:outline-none"
          />
        </Field>
      </div>
    </Modal>
  );
}

const inputClass =
  'h-9 w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-3 font-mono text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#EF4444]/50 focus:outline-none';

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">{label}</span>
      {children}
    </label>
  );
}
