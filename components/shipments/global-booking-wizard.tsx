'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  MapPin,
  Package,
  PartyPopper,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useUiStore } from '@/lib/store/use-ui-store';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { playSuccessChime } from '@/lib/utils/sound-fx';
import { pushToast } from '@/components/ui/toast-system';
import { formatUsd, formatNumber } from '@/lib/utils/formatters';
import { getIncotermRule, ANY_MODE_INCOTERMS, SEA_MODE_INCOTERMS } from '@/lib/utils/incoterms';
import type {
  IncotermCode,
  Milestone,
  Shipment,
  TransportMode,
} from '@/types/supply-chain';

const STEPS = [
  { id: 1, label: 'Cargo Spec', icon: <Package className="h-3.5 w-3.5" /> },
  { id: 2, label: 'Route & Mode', icon: <MapPin className="h-3.5 w-3.5" /> },
  { id: 3, label: 'Parties & Incoterm', icon: <FileText className="h-3.5 w-3.5" /> },
  { id: 4, label: 'Review & Book', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
];

const TRANSPORT_MODES: { value: TransportMode; label: string }[] = [
  { value: 'ocean', label: 'Ocean Freight' },
  { value: 'air', label: 'Air Cargo' },
  { value: 'rail', label: 'Rail Intermodal' },
  { value: 'road', label: 'Road Haulage' },
];

interface WizardForm {
  cargoDescription: string;
  hsCode: string;
  weightKg: string;
  volumeCbm: string;
  isColdChain: boolean;
  targetTempC: string;
  originPortId: string;
  destPortId: string;
  mode: TransportMode;
  shipperName: string;
  consigneeName: string;
  notifyParty: string;
  incoterm: IncotermCode;
  declaredValueUsd: string;
}

const EMPTY_FORM: WizardForm = {
  cargoDescription: '',
  hsCode: '',
  weightKg: '',
  volumeCbm: '',
  isColdChain: false,
  targetTempC: '',
  originPortId: '',
  destPortId: '',
  mode: 'ocean',
  shipperName: '',
  consigneeName: '',
  notifyParty: '',
  incoterm: 'FOB',
  declaredValueUsd: '',
};

const MILESTONE_TITLES = [
  'Booking Confirmed',
  'Gate In Terminal',
  'Loaded on Vessel',
  'In Transit (At Sea)',
  'Customs Cleared',
  'Out for Delivery',
  'Delivered',
];

export function GlobalBookingWizard() {
  const open = useUiStore((state) => state.bookingWizardOpen);
  const close = useUiStore((state) => state.closeBookingWizard);
  const ports = useSupplyChainStore((state) => state.ports);
  const addShipment = useSupplyChainStore((state) => state.addShipment);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<WizardForm>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const availableIncoterms = useMemo<IncotermCode[]>(
    () => (form.mode === 'ocean' ? [...ANY_MODE_INCOTERMS, ...SEA_MODE_INCOTERMS] : ANY_MODE_INCOTERMS),
    [form.mode],
  );

  const freightEstimate = useMemo(() => {
    const weight = Number(form.weightKg) || 0;
    const volume = Number(form.volumeCbm) || 0;
    const baseByMode: Record<TransportMode, number> = {
      ocean: 1850,
      air: 4200,
      rail: 2900,
      road: 1400,
    };
    const base = baseByMode[form.mode];
    const surcharge = weight * 0.08 + volume * 22;
    const coldChainFee = form.isColdChain ? 950 : 0;
    return Math.round(base + surcharge + coldChainFee);
  }, [form]);

  const update = <K extends keyof WizardForm>(key: K, value: WizardForm[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const validateStep = (currentStep: number): string | null => {
    if (currentStep === 1) {
      if (!form.cargoDescription.trim()) return 'Cargo description is required.';
      if (!/^\d{4,10}(\.\d{1,4})?$/.test(form.hsCode.trim())) return 'Enter a valid HS Code (6-8 digits).';
      if (!(Number(form.weightKg) > 0)) return 'Weight must be greater than zero.';
      if (!(Number(form.volumeCbm) > 0)) return 'Volume must be greater than zero.';
      if (form.isColdChain && form.targetTempC.trim() === '') return 'Set a target reefer temperature.';
    }
    if (currentStep === 2) {
      if (!form.originPortId) return 'Select an origin port.';
      if (!form.destPortId) return 'Select a destination port.';
      if (form.originPortId === form.destPortId) return 'Origin and destination must differ.';
    }
    if (currentStep === 3) {
      if (!form.shipperName.trim()) return 'Shipper name is required.';
      if (!form.consigneeName.trim()) return 'Consignee name is required.';
      if (!form.notifyParty.trim()) return 'Notify party is required.';
    }
    if (currentStep === 4 && !(Number(form.declaredValueUsd) > 0)) {
      return 'Declared cargo value must be greater than zero.';
    }
    return null;
  };

  const handleNext = (): void => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = (): void => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (): void => {
    const validationError = validateStep(4);
    if (validationError) {
      setError(validationError);
      return;
    }

    const now = new Date();
    const eta = new Date(now.getTime() + 14 * 86_400_000);
    const sequence = Math.floor(Math.random() * 9000) + 1000;
    const milestones: Milestone[] = MILESTONE_TITLES.map((title, index) => ({
      title,
      description:
        index === 0 ? 'Booking reference issued and space allocated.' : 'Pending progression.',
      timestamp: now.toISOString(),
      isCompleted: index === 0,
      location: index < 4 ? 'Origin Terminal' : 'Destination Terminal',
    }));

    const shipment: Shipment = {
      id: `shp-new-${Date.now()}`,
      trackingNumber: `AETH-${sequence}-${String(Math.floor(Math.random() * 90) + 10)}`,
      bolNumber: `AETH-BL-${sequence}`,
      shipperName: form.shipperName.trim(),
      consigneeName: form.consigneeName.trim(),
      notifyParty: form.notifyParty.trim(),
      mode: form.mode,
      vesselId: useSupplyChainStore.getState().vessels[0]?.id ?? 'vsl-aether-horizon',
      originPortId: form.originPortId,
      destPortId: form.destPortId,
      incoterm: form.incoterm,
      cargoDescription: form.cargoDescription.trim(),
      hsCode: form.hsCode.trim(),
      containers: [`AETU-${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 9)}`],
      weightKg: Number(form.weightKg),
      volumeCbm: Number(form.volumeCbm),
      declaredValueUsd: Number(form.declaredValueUsd),
      bookingDate: now.toISOString(),
      departureDate: now.toISOString(),
      eta: eta.toISOString(),
      status: 'booked',
      isColdChain: form.isColdChain,
      targetTempC: form.isColdChain ? Number(form.targetTempC) : undefined,
      milestones,
    };

    addShipment(shipment);
    playSuccessChime();
    pushToast(
      'Booking Confirmed',
      `Shipment ${shipment.trackingNumber} booked successfully.`,
      'success',
    );

    void confetti({
      particleCount: 160,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
      disableForReducedMotion: true,
    });

    setForm(EMPTY_FORM);
    setStep(1);
    setError(null);
    close();
  };

  const incotermRule = getIncotermRule(form.incoterm);

  return (
    <Modal
      open={open}
      onClose={close}
      title="New Shipment Booking"
      subtitle="4-stage cargo booking wizard"
      icon={<PartyPopper className="h-5 w-5 text-[#00F5FF]" />}
      size="lg"
      footer={
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack} disabled={step === 1}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
            Step {step} / 4
          </span>
          {step < 4 ? (
            <Button variant="primary" size="sm" onClick={handleNext}>
              Next <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={handleSubmit}>
              <CheckCircle2 className="h-3.5 w-3.5" /> Submit Booking
            </Button>
          )}
        </div>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        {STEPS.map((item) => (
          <div
            key={item.id}
            className={`flex flex-1 items-center gap-1.5 rounded-md border px-2 py-1.5 ${
              step === item.id
                ? 'border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]'
                : step > item.id
                  ? 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981]'
                  : 'border-[#1E2C42] text-[#94A3B8]'
            }`}
          >
            {step > item.id ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.icon}
            <span className="hidden font-mono text-[10px] uppercase tracking-wide sm:inline">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {error ? (
        <div className="mb-3 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#EF4444]">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Cargo Description" full>
            <input
              value={form.cargoDescription}
              onChange={(event) => update('cargoDescription', event.target.value)}
              placeholder="e.g. Semiconductor Wafers"
              className={inputClass}
            />
          </Field>
          <Field label="HS Code">
            <input
              value={form.hsCode}
              onChange={(event) => update('hsCode', event.target.value)}
              placeholder="8542.31"
              className={inputClass}
            />
          </Field>
          <Field label="Weight (kg)">
            <input
              type="number"
              value={form.weightKg}
              onChange={(event) => update('weightKg', event.target.value)}
              placeholder="6400"
              className={inputClass}
            />
          </Field>
          <Field label="Volume (CBM)">
            <input
              type="number"
              value={form.volumeCbm}
              onChange={(event) => update('volumeCbm', event.target.value)}
              placeholder="18"
              className={inputClass}
            />
          </Field>
          <Field label="Cold-Chain Reefer">
            <button
              type="button"
              onClick={() => update('isColdChain', !form.isColdChain)}
              className={`flex h-9 w-full items-center justify-between rounded-md border px-3 font-mono text-xs uppercase ${
                form.isColdChain
                  ? 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  : 'border-[#1E2C42] text-[#94A3B8]'
              }`}
            >
              {form.isColdChain ? 'Reefer Enabled' : 'Dry Container'}
              <span className={`h-2 w-2 rounded-full ${form.isColdChain ? 'bg-[#8B5CF6]' : 'bg-[#94A3B8]'}`} />
            </button>
          </Field>
          {form.isColdChain ? (
            <Field label="Target Temperature (°C)">
              <input
                type="number"
                value={form.targetTempC}
                onChange={(event) => update('targetTempC', event.target.value)}
                placeholder="-20"
                className={inputClass}
              />
            </Field>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Origin Port">
            <select
              value={form.originPortId}
              onChange={(event) => update('originPortId', event.target.value)}
              className={inputClass}
            >
              <option value="">Select origin…</option>
              {ports.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.code} — {port.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Destination Port">
            <select
              value={form.destPortId}
              onChange={(event) => update('destPortId', event.target.value)}
              className={inputClass}
            >
              <option value="">Select destination…</option>
              {ports.map((port) => (
                <option key={port.id} value={port.id}>
                  {port.code} — {port.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Transport Mode" full>
            <div className="grid grid-cols-2 gap-2">
              {TRANSPORT_MODES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    update('mode', option.value);
                    if (option.value !== 'ocean' && ['FAS', 'FOB', 'CFR', 'CIF'].includes(form.incoterm)) {
                      update('incoterm', 'FCA');
                    }
                  }}
                  className={`rounded-md border px-3 py-2 font-mono text-xs uppercase ${
                    form.mode === option.value
                      ? 'border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]'
                      : 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Field>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Shipper">
            <input
              value={form.shipperName}
              onChange={(event) => update('shipperName', event.target.value)}
              placeholder="Exporter Co."
              className={inputClass}
            />
          </Field>
          <Field label="Consignee">
            <input
              value={form.consigneeName}
              onChange={(event) => update('consigneeName', event.target.value)}
              placeholder="Importer Co."
              className={inputClass}
            />
          </Field>
          <Field label="Notify Party" full>
            <input
              value={form.notifyParty}
              onChange={(event) => update('notifyParty', event.target.value)}
              placeholder="Notify party"
              className={inputClass}
            />
          </Field>
          <Field label="Incoterm 2020" full>
            <select
              value={form.incoterm}
              onChange={(event) => update('incoterm', event.target.value as IncotermCode)}
              className={inputClass}
            >
              {availableIncoterms.map((code) => (
                <option key={code} value={code}>
                  {code} — {getIncotermRule(code).name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[11px] text-[#94A3B8]">{incotermRule.description}</p>
          </Field>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3">
          <Field label="Declared Cargo Value (USD)">
            <input
              type="number"
              value={form.declaredValueUsd}
              onChange={(event) => update('declaredValueUsd', event.target.value)}
              placeholder="1840000"
              className={inputClass}
            />
          </Field>
          <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              Booking Summary
            </p>
            <dl className="grid grid-cols-2 gap-y-1.5 text-xs">
              <SummaryRow label="Cargo" value={form.cargoDescription || '—'} />
              <SummaryRow label="HS Code" value={form.hsCode || '—'} />
              <SummaryRow label="Weight" value={`${formatNumber(Number(form.weightKg) || 0)} kg`} />
              <SummaryRow label="Volume" value={`${formatNumber(Number(form.volumeCbm) || 0)} CBM`} />
              <SummaryRow label="Mode" value={form.mode.toUpperCase()} />
              <SummaryRow label="Incoterm" value={form.incoterm} />
              <SummaryRow
                label="Origin"
                value={ports.find((port) => port.id === form.originPortId)?.code ?? '—'}
              />
              <SummaryRow
                label="Destination"
                value={ports.find((port) => port.id === form.destPortId)?.code ?? '—'}
              />
            </dl>
            <div className="mt-3 flex items-center justify-between border-t border-[#1E2C42] pt-3">
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                Estimated Freight
              </span>
              <span className="font-mono text-lg text-[#00F5FF] text-glow-cyan">
                {formatUsd(freightEstimate)}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

const inputClass =
  'h-9 w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-3 font-mono text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] focus:border-[#00F5FF]/50 focus:outline-none';

function Field({
  label,
  children,
  full = false,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? 'md:col-span-2' : ''}`}>
      <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
        {label}
      </span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 pr-3">
      <dt className="text-[#94A3B8]">{label}</dt>
      <dd className="truncate font-mono text-[#F1F5F9]">{value}</dd>
    </div>
  );
}
