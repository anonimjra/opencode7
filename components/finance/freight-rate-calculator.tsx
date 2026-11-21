'use client';

import { useMemo, useState } from 'react';
import { Calculator, Copy, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { pushToast } from '@/components/ui/toast-system';
import { formatUsd, formatUsdPrecise, formatIdr, formatNumber } from '@/lib/utils/formatters';
import type { TariffCalculation } from '@/types/supply-chain';

type ContainerType = '20GP' | '40HC' | '40RF';

const CONTAINER_TYPES: { value: ContainerType; label: string; baseRate: number; thcOrigin: number; thcDest: number }[] = [
  { value: '20GP', label: "20' GP", baseRate: 1450, thcOrigin: 180, thcDest: 220 },
  { value: '40HC', label: "40' HC", baseRate: 2250, thcOrigin: 260, thcDest: 310 },
  { value: '40RF', label: "40' RF (Reefer)", baseRate: 3850, thcOrigin: 420, thcDest: 480 },
];

const CARRIERS = [
  { value: 'aether', label: 'Aether Global Maritime', bafFactor: 1.0 },
  { value: 'maersk', label: 'Maersk Line', bafFactor: 1.08 },
  { value: 'msc', label: 'MSC', bafFactor: 1.05 },
  { value: 'cosco', label: 'COSCO Shipping', bafFactor: 0.97 },
];

export function FreightRateCalculator() {
  const ports = useSupplyChainStore((state) => state.ports);
  const [origin, setOrigin] = useState(ports[0]?.id ?? '');
  const [destination, setDestination] = useState(ports[1]?.id ?? '');
  const [containerType, setContainerType] = useState<ContainerType>('40HC');
  const [weightTon, setWeightTon] = useState('18');
  const [carrier, setCarrier] = useState('aether');

  const calculation = useMemo<TariffCalculation>(() => {
    const typeMeta = CONTAINER_TYPES.find((item) => item.value === containerType) ?? CONTAINER_TYPES[0];
    const carrierMeta = CARRIERS.find((item) => item.value === carrier) ?? CARRIERS[0];
    const weight = Number(weightTon) || 0;

    const originPort = ports.find((port) => port.id === origin);
    const destPort = ports.find((port) => port.id === destination);
    const congestionMultiplier =
      1 +
      ((originPort?.avgWaitHours ?? 0) + (destPort?.avgWaitHours ?? 0)) / 400 +
      (originPort?.status === 'severe_delay' || destPort?.status === 'severe_delay' ? 0.08 : 0);

    const oceanBase = Math.round(typeMeta.baseRate * congestionMultiplier);
    const baf = Math.round(oceanBase * 0.22 * carrierMeta.bafFactor);
    const caf = Math.round(oceanBase * 0.065);
    const pss = Math.round(oceanBase * 0.14);
    const overweightSurcharge = weight > 20 ? Math.round((weight - 20) * 42) : 0;
    const thcOrigin = typeMeta.thcOrigin;
    const thcDestination = typeMeta.thcDest;
    const total = oceanBase + baf + caf + pss + overweightSurcharge + thcOrigin + thcDestination;

    return {
      oceanBase,
      baf,
      caf,
      pss,
      thcOrigin,
      thcDestination,
      total,
    };
  }, [ports, origin, destination, containerType, weightTon, carrier]);

  const overweightSurcharge = useMemo(() => {
    const weight = Number(weightTon) || 0;
    return weight > 20 ? Math.round((weight - 20) * 42) : 0;
  }, [weightTon]);

  const handleCopy = async (): Promise<void> => {
    const originCode = ports.find((port) => port.id === origin)?.code ?? origin;
    const destCode = ports.find((port) => port.id === destination)?.code ?? destination;
    const text = [
      'AETHER OS FREIGHT QUOTATION',
      `Route: ${originCode} → ${destCode}`,
      `Container: ${containerType}`,
      `Carrier: ${CARRIERS.find((item) => item.value === carrier)?.label ?? carrier}`,
      `Weight: ${weightTon} t`,
      '---',
      `Ocean Base: ${formatUsd(calculation.oceanBase)}`,
      `BAF: ${formatUsd(calculation.baf)}`,
      `CAF: ${formatUsd(calculation.caf)}`,
      `PSS: ${formatUsd(calculation.pss)}`,
      overweightSurcharge > 0 ? `Overweight: ${formatUsd(overweightSurcharge)}` : '',
      `THC Origin: ${formatUsd(calculation.thcOrigin)}`,
      `THC Destination: ${formatUsd(calculation.thcDestination)}`,
      '---',
      `TOTAL: ${formatUsdPrecise(calculation.total + overweightSurcharge)}`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(text);
      pushToast('Quotation Copied', 'Freight quotation copied to clipboard.', 'success');
    } catch {
      pushToast('Copy Failed', 'Clipboard access is unavailable.', 'warning');
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Origin Port">
          <select value={origin} onChange={(event) => setOrigin(event.target.value)} className={inputClass}>
            {ports.map((port) => (
              <option key={port.id} value={port.id}>{port.code} — {port.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Destination Port">
          <select value={destination} onChange={(event) => setDestination(event.target.value)} className={inputClass}>
            {ports.map((port) => (
              <option key={port.id} value={port.id}>{port.code} — {port.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Container Type">
          <select value={containerType} onChange={(event) => setContainerType(event.target.value as ContainerType)} className={inputClass}>
            {CONTAINER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Cargo Weight (t)">
          <input type="number" value={weightTon} onChange={(event) => setWeightTon(event.target.value)} className={inputClass} />
        </Field>
        <Field label="Carrier" full>
          <select value={carrier} onChange={(event) => setCarrier(event.target.value)} className={inputClass}>
            {CARRIERS.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-3">
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">
          <Calculator className="h-3.5 w-3.5" /> Cost Breakdown
        </p>
        <div className="space-y-1">
          <CostRow label="Ocean Base Freight" value={formatUsd(calculation.oceanBase)} />
          <CostRow label="Bunker Adjustment (BAF)" value={formatUsd(calculation.baf)} />
          <CostRow label="Currency Adjustment (CAF)" value={formatUsd(calculation.caf)} />
          <CostRow label="Peak Season (PSS)" value={formatUsd(calculation.pss)} />
          <CostRow label="Terminal Handling (THC) Origin" value={formatUsd(calculation.thcOrigin)} />
          <CostRow label="Terminal Handling (THC) Destination" value={formatUsd(calculation.thcDestination)} />
          {overweightSurcharge > 0 ? (
            <CostRow label={`Overweight Surcharge (${formatNumber(Number(weightTon))} t)`} value={formatUsd(overweightSurcharge)} tone="#F59E0B" />
          ) : null}
        </div>
        <div className="mt-2 space-y-0.5 border-t border-[#1E2C42] pt-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8]">Total Quote (USD)</span>
            <span className="font-mono text-lg font-semibold text-[#00F5FF] text-glow-cyan">
              {formatUsdPrecise(calculation.total + overweightSurcharge)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">≈ IDR</span>
            <span className="font-mono text-xs text-[#10B981]">{formatIdr(calculation.total + overweightSurcharge)}</span>
          </div>
        </div>
      </div>

      <Button variant="primary" size="sm" onClick={handleCopy} className="w-full">
        <Copy className="h-3.5 w-3.5" /> Copy Quotation
      </Button>
      <p className="flex items-center gap-1 text-[9px] text-[#94A3B8]">
        <Ship className="h-2.5 w-2.5" />
        Rates include congestion adjustment based on live port wait-time indices.
      </p>
    </div>
  );
}

const inputClass =
  'h-8 w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-2 font-mono text-[11px] text-[#F1F5F9] focus:border-[#00F5FF]/50 focus:outline-none';

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? 'col-span-2' : ''}`}>
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">{label}</span>
      {children}
    </label>
  );
}

function CostRow({ label, value, tone = '#F1F5F9' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-[#94A3B8]">{label}</span>
      <span className="font-mono" style={{ color: tone }}>{value}</span>
    </div>
  );
}
