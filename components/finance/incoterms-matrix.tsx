'use client';

import { useState } from 'react';
import { Check, X, ShieldQuestion, Ship, Package } from 'lucide-react';
import {
  ALL_INCOTERMS,
  INCOTERM_STAGES,
  INCOTERM_RULES,
  INCOTERM_SELLER_STAGES,
  describeResponsibility,
} from '@/lib/utils/incoterms';
import { Badge } from '@/components/ui/badge';
import type { IncotermCode } from '@/types/supply-chain';

export function IncotermsMatrix() {
  const [selected, setSelected] = useState<IncotermCode>('CIF');
  const rule = INCOTERM_RULES[selected];
  const stages = INCOTERM_SELLER_STAGES[selected];
  const responsibility = describeResponsibility(selected);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {ALL_INCOTERMS.map((code) => {
          const isSelected = code === selected;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setSelected(code)}
              className={`rounded border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider transition ${
                isSelected
                  ? 'border-[#00F5FF]/60 bg-[#00F5FF]/15 text-[#00F5FF] glow-cyan'
                  : 'border-[#1E2C42] text-[#94A3B8] hover:border-[#00F5FF]/30 hover:text-[#F1F5F9]'
              }`}
            >
              {code}
            </button>
          );
        })}
      </div>

      <div className="rounded-lg border border-[#00F5FF]/30 bg-[#00F5FF]/5 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold text-[#00F5FF]">{rule.code}</span>
          <span className="text-[13px] text-[#F1F5F9]">{rule.name}</span>
          <Badge tone={rule.scope === 'sea' ? 'violet' : 'cyan'}>
            {rule.scope === 'sea' ? (
              <><Ship className="h-2.5 w-2.5" /> Sea Only</>
            ) : (
              <><Package className="h-2.5 w-2.5" /> Any Mode</>
            )}
          </Badge>
        </div>
        <p className="mt-1 text-[11px] leading-snug text-[#94A3B8]">{rule.description}</p>
        <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[#F59E0B]">
          <ShieldQuestion className="h-3 w-3" /> Risk transfers: {rule.riskTransferPoint}
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#1E2C42]">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr className="border-b border-[#1E2C42] bg-[#161F30]/60">
              <th className="px-2 py-1.5 text-left font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
                Obligation Stage
              </th>
              <th className="px-2 py-1.5 text-center font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
                Responsible Party
              </th>
            </tr>
          </thead>
          <tbody>
            {INCOTERM_STAGES.map((stage, index) => {
              const sellerPays = stages[index] ?? false;
              return (
                <tr key={stage.key} className="border-b border-[#1E2C42]/50">
                  <td className="px-2 py-1.5 text-[#F1F5F9]">{stage.label}</td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center justify-center">
                      <span
                        className={`flex items-center gap-1 rounded px-2 py-0.5 font-mono text-[9px] uppercase ${
                          sellerPays
                            ? 'bg-[#10B981]/15 text-[#10B981]'
                            : 'bg-[#EF4444]/15 text-[#EF4444]'
                        }`}
                      >
                        {sellerPays ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                        {sellerPays ? 'Seller' : 'Buyer'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <ObligationCard label="Freight" party={responsibility.freightPayer} />
        <ObligationCard label="Insurance" party={responsibility.insurancePayer} />
        <ObligationCard label="Import Customs" party={responsibility.importCustomsPayer} />
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#1E2C42]">
        <table className="w-full border-collapse text-[9px]">
          <thead>
            <tr className="border-b border-[#1E2C42] bg-[#161F30]/60 font-mono uppercase tracking-wider text-[#94A3B8]">
              <th className="px-1.5 py-1 text-left">Code</th>
              {INCOTERM_STAGES.map((stage) => (
                <th key={stage.key} className="px-1 py-1 text-center">{stage.label.split(' ')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALL_INCOTERMS.map((code) => (
              <tr key={code} className={`border-b border-[#1E2C42]/40 ${code === selected ? 'bg-[#00F5FF]/5' : ''}`}>
                <td className="px-1.5 py-1 font-mono font-semibold text-[#00F5FF]">{code}</td>
                {INCOTERM_SELLER_STAGES[code].map((sellerPays, index) => (
                  <td key={`${code}-${index}`} className="px-1 py-1 text-center">
                    <span className={sellerPays ? 'text-[#10B981]' : 'text-[#EF4444]'}>
                      {sellerPays ? '●' : '○'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ObligationCard({ label, party }: { label: string; party: 'seller' | 'buyer' }) {
  const isSeller = party === 'seller';
  return (
    <div className={`rounded-md border p-2 text-center ${isSeller ? 'border-[#10B981]/40 bg-[#10B981]/10' : 'border-[#EF4444]/40 bg-[#EF4444]/10'}`}>
      <p className="font-mono text-[8px] uppercase tracking-wider text-[#94A3B8]">{label}</p>
      <p className={`font-mono text-[11px] font-semibold uppercase ${isSeller ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
        {party}
      </p>
    </div>
  );
}
