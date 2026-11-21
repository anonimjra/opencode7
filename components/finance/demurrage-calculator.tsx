'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, Clock, Wallet } from 'lucide-react';
import { calculateDemurrage } from '@/lib/utils/telematics';
import { formatUsd, formatUsdPrecise } from '@/lib/utils/formatters';

export function DemurrageCalculator() {
  const [daysInPort, setDaysInPort] = useState('9');
  const [freeDays, setFreeDays] = useState('5');

  const result = useMemo(
    () => calculateDemurrage(Number(daysInPort) || 0, Number(freeDays) || 0),
    [daysInPort, freeDays],
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Free Days Granted">
          <input
            type="number"
            value={freeDays}
            onChange={(event) => setFreeDays(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Actual Days in Port">
          <input
            type="number"
            value={daysInPort}
            onChange={(event) => setDaysInPort(event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-1.5 rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-2.5 text-center">
        <div>
          <p className="font-mono text-[8px] uppercase text-[#94A3B8]">Free Days</p>
          <p className="font-mono text-sm text-[#10B981]">{result.portFreeDays}</p>
        </div>
        <div>
          <p className="font-mono text-[8px] uppercase text-[#94A3B8]">Days In Port</p>
          <p className="font-mono text-sm text-[#F1F5F9]">{result.daysInPort}</p>
        </div>
        <div>
          <p className="font-mono text-[8px] uppercase text-[#94A3B8]">Chargeable</p>
          <p className="font-mono text-sm text-[#EF4444]">{result.chargeableDays}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#00F5FF]">Progressive Tiers</p>
        {result.tiers.length === 0 ? (
          <div className="rounded-md border border-[#10B981]/40 bg-[#10B981]/10 px-2.5 py-2 text-[11px] text-[#10B981]">
            No demurrage — container within free-days window.
          </div>
        ) : (
          result.tiers.map((tier) => (
            <div key={tier.tierLabel} className="flex items-center justify-between rounded-md border border-[#1E2C42] bg-[#161F30]/40 px-2.5 py-1.5">
              <div>
                <p className="text-[10px] text-[#F1F5F9]">{tier.tierLabel}</p>
                <p className="font-mono text-[9px] text-[#94A3B8]">{tier.days} days × {formatUsd(tier.ratePerDay)}</p>
              </div>
              <span className="font-mono text-[11px] text-[#F59E0B]">{formatUsd(tier.subtotal)}</span>
            </div>
          ))
        )}
      </div>

      <div className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#EF4444]">
            <Wallet className="h-3.5 w-3.5" /> Total Penalty
          </span>
          <span className="font-mono text-lg font-semibold text-[#EF4444]">{formatUsdPrecise(result.totalPenalty)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[9px] text-[#94A3B8]">
          <span>Tier 1 (1-5d): {formatUsd(result.tier1Fee)}</span>
          <span>Tier 2+ (6d+): {formatUsd(result.tier2Fee)}</span>
        </div>
      </div>

      {result.isOverdue ? (
        <div className="flex items-start gap-2 rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/10 p-2">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#F59E0B]" />
          <p className="text-[10px] leading-snug text-[#F59E0B]">
            Free days exhausted. Return the container immediately to avoid escalating Tier 3 charges.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-md border border-[#10B981]/40 bg-[#10B981]/10 p-2">
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#10B981]" />
          <p className="text-[10px] leading-snug text-[#10B981]">
            Within free-days allocation. No detention charges apply.
          </p>
        </div>
      )}
    </div>
  );
}

const inputClass =
  'h-8 w-full rounded-md border border-[#1E2C42] bg-[#0D111A] px-2 font-mono text-[11px] text-[#F1F5F9] focus:border-[#00F5FF]/50 focus:outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">{label}</span>
      {children}
    </label>
  );
}
