'use client';

import { useMemo, useState } from 'react';
import { Gauge, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { formatUsd, formatUsdPrecise, formatIdr } from '@/lib/utils/formatters';
import type { CustomsRiskResult } from '@/types/supply-chain';

const EXEMPT_ORIGINS = new Set(['singapore', 'japan', 'south korea', 'germany', 'netherlands', 'belgium']);
const HIGH_RISK_ORIGINS = new Set(['unknown', 'sanctioned']);

function classifyChannel(score: number): 'green' | 'yellow' | 'red' {
  if (score < 35) return 'green';
  if (score < 65) return 'yellow';
  return 'red';
}

export function CustomsRiskEngine() {
  const [hsCode, setHsCode] = useState('8542.31');
  const [cifValue, setCifValue] = useState('184000');
  const [origin, setOrigin] = useState('China');

  const result = useMemo<CustomsRiskResult>(() => {
    const normalizedHs = hsCode.replace(/\D/g, '');
    const value = Number(cifValue) || 0;
    let score = 20;

    // High-value electronics raise scrutiny
    if (normalizedHs.startsWith('85')) score += 18;
    if (normalizedHs.startsWith('30')) score += 14; // pharmaceuticals
    if (normalizedHs.startsWith('93')) score += 30; // arms
    if (normalizedHs.length < 6) score += 20;

    if (value > 500000) score += 20;
    else if (value > 100000) score += 10;

    const originLower = origin.toLowerCase();
    if (HIGH_RISK_ORIGINS.has(originLower)) score += 30;
    else if (!EXEMPT_ORIGINS.has(originLower)) score += 8;

    const clampedScore = Math.min(98, Math.max(5, score));
    const channel = classifyChannel(clampedScore);

    const baseDutyPercent = normalizedHs.startsWith('85') ? 0 : normalizedHs.startsWith('30') ? 5 : normalizedHs.startsWith('09') ? 8 : 10;
    const importDutyUsd = Math.round(value * (baseDutyPercent / 100));
    const vatPercent = 11;
    const vatUsd = Math.round((value + importDutyUsd) * (vatPercent / 100));

    const clearanceHours = channel === 'green' ? 4 : channel === 'yellow' ? 24 : 60;

    const recommendations: string[] = [];
    if (channel === 'green') {
      recommendations.push('Auto-release eligible — maintain digital document integrity.');
    } else if (channel === 'yellow') {
      recommendations.push('Ensure commercial invoice, packing list and HS classification are consistent.');
      recommendations.push('Pre-submit electronic manifest to avoid queue backlog.');
    } else {
      recommendations.push('Prepare for physical inspection and x-ray scanning (48-72h).');
      recommendations.push('Verify bonded warehouse readiness for extended hold.');
      recommendations.push('Engage licensed customs broker for tariff dispute support.');
    }

    return {
      channel,
      riskScore: clampedScore,
      importDutyPercent: baseDutyPercent,
      importDutyUsd,
      vatPercent,
      vatUsd,
      estimatedClearanceHours: clearanceHours,
      recommendations,
    };
  }, [hsCode, cifValue, origin]);

  const channelMeta = {
    green: { tone: '#10B981', label: 'Green Channel', desc: 'Automatic document release', icon: <ShieldCheck className="h-4 w-4" /> },
    yellow: { tone: '#F59E0B', label: 'Yellow Channel', desc: 'Manual document verification', icon: <ShieldQuestion className="h-4 w-4" /> },
    red: { tone: '#EF4444', label: 'Red Channel', desc: 'Physical inspection & X-ray scan', icon: <ShieldAlert className="h-4 w-4" /> },
  }[result.channel];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Field label="HS Code (6-8 digit)">
          <input value={hsCode} onChange={(event) => setHsCode(event.target.value)} className={inputClass} placeholder="8542.31" />
        </Field>
        <Field label="CIF Value (USD)">
          <input type="number" value={cifValue} onChange={(event) => setCifValue(event.target.value)} className={inputClass} placeholder="184000" />
        </Field>
        <Field label="Country of Origin" full>
          <select value={origin} onChange={(event) => setOrigin(event.target.value)} className={inputClass}>
            {['China', 'Singapore', 'Japan', 'South Korea', 'Germany', 'Netherlands', 'Belgium', 'Indonesia', 'Brazil', 'United States', 'unknown'].map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-lg border p-3" style={{ borderColor: `${channelMeta.tone}55`, backgroundColor: `${channelMeta.tone}11` }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-wider" style={{ color: channelMeta.tone }}>
            {channelMeta.icon}
            {channelMeta.label}
          </span>
          <span className="flex items-center gap-1 font-mono text-[11px] text-[#94A3B8]">
            <Gauge className="h-3.5 w-3.5" /> Score {result.riskScore}/100
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#0D111A]">
          <div className="h-full rounded-full" style={{ width: `${result.riskScore}%`, backgroundColor: channelMeta.tone }} />
        </div>
        <p className="mt-1.5 text-[10px] text-[#94A3B8]">
          {channelMeta.desc} · estimated clearance {result.estimatedClearanceHours}h
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2">
          <p className="font-mono text-[9px] uppercase text-[#94A3B8]">Import Duty ({result.importDutyPercent}%)</p>
          <p className="font-mono text-sm text-[#F59E0B]">{formatUsd(result.importDutyUsd)}</p>
        </div>
        <div className="rounded-md border border-[#1E2C42] bg-[#161F30]/40 p-2">
          <p className="font-mono text-[9px] uppercase text-[#94A3B8]">PPN / VAT ({result.vatPercent}%)</p>
          <p className="font-mono text-sm text-[#8B5CF6]">{formatUsd(result.vatUsd)}</p>
        </div>
      </div>

      <div className="rounded-md border border-[#1E2C42] bg-[#0D111A]/60 p-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#94A3B8]">Total Landed Tax Liability</span>
          <span className="font-mono text-[#F1F5F9]">{formatUsdPrecise(result.importDutyUsd + result.vatUsd)}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between text-[9px]">
          <span className="text-[#94A3B8]">≈ IDR</span>
          <span className="font-mono text-[#10B981]">{formatIdr(result.importDutyUsd + result.vatUsd)}</span>
        </div>
      </div>

      <div className="rounded-md border border-[#1E2C42] bg-[#0D111A]/60 p-2.5">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">Recommendations</p>
        <ul className="space-y-0.5">
          {result.recommendations.map((recommendation) => (
            <li key={recommendation} className="flex items-start gap-1 text-[10px] text-[#94A3B8]">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#00F5FF]" />
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
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
