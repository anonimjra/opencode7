'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertOctagon,
  Boxes,
  Container,
  LayoutDashboard,
  Radar,
  RotateCcw,
  Ship,
  Snowflake,
  Warehouse,
} from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';

interface NavItem {
  href: string;
  label: string;
  code: string;
  icon: React.ReactNode;
  badgeKey?: 'alerts' | 'coldChain';
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Overview', code: 'CT', icon: <LayoutDashboard className="h-4 w-4" /> },
  { href: '/fleet', label: 'Fleet Telematics', code: 'FT', icon: <Ship className="h-4 w-4" /> },
  { href: '/yard', label: 'Terminal Yard 2D', code: 'YD', icon: <Warehouse className="h-4 w-4" /> },
  { href: '/shipments', label: 'Master Shipments', code: 'MS', icon: <Container className="h-4 w-4" /> },
  { href: '/iot-telemetry', label: 'IoT Cold-Chain Lab', code: 'IOT', icon: <Snowflake className="h-4 w-4" />, badgeKey: 'coldChain' },
  { href: '/customs-finance', label: 'Customs & Finance', code: 'CF', icon: <Boxes className="h-4 w-4" /> },
  { href: '/incidents', label: 'Disruption War Room', code: 'WR', icon: <AlertOctagon className="h-4 w-4" />, badgeKey: 'alerts' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const activeAlertCount = useSupplyChainStore(
    (state) => state.alerts.filter((alert) => !alert.isAcknowledged).length,
  );
  const coldChainCount = useSupplyChainStore(
    (state) => state.reeferTelemetry.length,
  );
  const resetToSeed = useSupplyChainStore((state) => state.resetToSeed);

  const badgeValue = (item: NavItem): number | null => {
    if (item.badgeKey === 'alerts') return activeAlertCount;
    if (item.badgeKey === 'coldChain') return coldChainCount;
    return null;
  };

  const handleReset = (): void => {
    resetToSeed();
    setConfirmReset(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((value) => !value)}
        className="fixed left-3 top-3 z-[60] rounded-md border border-[#1E2C42] bg-[#0D111A] p-2 text-[#00F5FF] lg:hidden"
        aria-label="Toggle navigation"
      >
        <Radar className="h-5 w-5" />
      </button>

      <aside
        className={`app-sidebar fixed inset-y-0 left-0 z-[55] flex w-60 flex-col border-r border-[#1E2C42] bg-[#0D111A] transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 border-b border-[#1E2C42] px-4 py-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-[#00F5FF]/40 bg-[#00F5FF]/10">
            <Radar className="absolute h-9 w-9 text-[#00F5FF]/20 radar-sweep" />
            <Radar className="h-5 w-5 text-[#00F5FF]" />
          </div>
          <div>
            <p className="font-mono text-sm font-bold tracking-widest text-[#00F5FF] text-glow-cyan">
              AETHER-07
            </p>
            <span className="inline-flex items-center gap-1 rounded border border-[#10B981]/40 bg-[#10B981]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[#10B981]">
              <span className="h-1 w-1 rounded-full bg-[#10B981] pulse-dot" />
              OPS TOWER ACTIVE
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]">
            Mission Modules
          </p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const badge = badgeValue(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`group flex items-center gap-2.5 rounded-md px-3 py-2 text-xs transition ${
                      isActive
                        ? 'border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF] glow-cyan'
                        : 'border border-transparent text-[#94A3B8] hover:bg-[#161F30] hover:text-[#F1F5F9]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#00F5FF]' : 'text-[#94A3B8] group-hover:text-[#00F5FF]'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                    {badge !== null && badge > 0 ? (
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${
                          item.badgeKey === 'alerts'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                        }`}
                      >
                        {badge}
                      </span>
                    ) : (
                      <span className="font-mono text-[9px] text-[#1E2C42] group-hover:text-[#94A3B8]">
                        {item.code}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[#1E2C42] p-3">
          {confirmReset ? (
            <div className="space-y-2 rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 p-2">
              <p className="text-[10px] leading-snug text-[#EF4444]">
                Reset seluruh state ke data seed? Tindakan ini menghapus perubahan lokal.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded bg-[#EF4444]/20 py-1 font-mono text-[10px] uppercase text-[#EF4444] hover:bg-[#EF4444]/30"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 rounded bg-[#161F30] py-1 font-mono text-[10px] uppercase text-[#94A3B8] hover:text-[#F1F5F9]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-[#1E2C42] bg-[#161F30]/60 py-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] transition hover:border-[#EF4444]/40 hover:text-[#EF4444]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset State to Seed
            </button>
          )}
        </div>
      </aside>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-[50] bg-[#07090E]/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      ) : null}
    </>
  );
}
