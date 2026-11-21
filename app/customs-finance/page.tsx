'use client';

import { useState } from 'react';
import { Boxes, Calculator, Scale, ShieldCheck, Wallet } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { StatusDot } from '@/components/ui/badge';
import { IncotermsMatrix } from '@/components/finance/incoterms-matrix';
import { FreightRateCalculator } from '@/components/finance/freight-rate-calculator';
import { DemurrageCalculator } from '@/components/finance/demurrage-calculator';
import { CustomsRiskEngine } from '@/components/finance/customs-risk-engine';

const TABS = [
  { key: 'incoterms', label: 'Incoterms 2020', icon: <Scale className="h-3.5 w-3.5" /> },
  { key: 'freight', label: 'Freight Tariff', icon: <Calculator className="h-3.5 w-3.5" /> },
  { key: 'demurrage', label: 'Demurrage', icon: <Wallet className="h-3.5 w-3.5" /> },
  { key: 'customs', label: 'Customs Risk', icon: <ShieldCheck className="h-3.5 w-3.5" /> },
];

type TabKey = 'incoterms' | 'freight' | 'demurrage' | 'customs';

export default function CustomsFinancePage() {
  const [tab, setTab] = useState<TabKey>('incoterms');

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#F59E0B]">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Customs &amp; Finance
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="amber" />
              Incoterms · freight · demurrage · customs risk
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-md border border-[#1E2C42] bg-[#0D111A] p-0.5">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key as TabKey)}
              className={`flex items-center gap-1.5 rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                tab === item.key ? 'bg-[#F59E0B]/15 text-[#F59E0B]' : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title={TABS.find((item) => item.key === tab)?.label ?? 'Finance'}
          subtitle={tab === 'incoterms' ? 'Cost & risk responsibility matrix' : 'Live calculation engine'}
          icon={TABS.find((item) => item.key === tab)?.icon}
          className="xl:col-span-2"
        >
          {tab === 'incoterms' ? <IncotermsMatrix /> : null}
          {tab === 'freight' ? <FreightRateCalculator /> : null}
          {tab === 'demurrage' ? <DemurrageCalculator /> : null}
          {tab === 'customs' ? <CustomsRiskEngine /> : null}
        </Panel>

        <div className="space-y-3">
          <Panel
            title="Freight Tariff"
            subtitle="Quick quote engine"
            icon={<Calculator className="h-4 w-4" />}
          >
            <FreightRateCalculator />
          </Panel>
          <Panel
            title="Demurrage &amp; Detention"
            subtitle="Tiered penalty"
            icon={<Wallet className="h-4 w-4" />}
          >
            <DemurrageCalculator />
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <Panel
          title="Incoterms 2020 Reference"
          subtitle="Full 11-rule matrix"
          icon={<Scale className="h-4 w-4" />}
        >
          <IncotermsMatrix />
        </Panel>
        <Panel
          title="Customs Risk Engine"
          subtitle="Channel scoring &amp; duties"
          icon={<ShieldCheck className="h-4 w-4" />}
        >
          <CustomsRiskEngine />
        </Panel>
      </div>
    </div>
  );
}
