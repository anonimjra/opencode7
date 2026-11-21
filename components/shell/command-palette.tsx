'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Anchor, Container, Search, Ship } from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { useUiStore } from '@/lib/store/use-ui-store';

type ResultKind = 'shipment' | 'vessel' | 'port';

interface SearchResult {
  id: string;
  kind: ResultKind;
  title: string;
  subtitle: string;
  href: string;
  queryTargetId: string;
}

const KIND_META: Record<ResultKind, { label: string; tone: string; icon: React.ReactNode }> = {
  shipment: {
    label: 'Shipments',
    tone: 'text-[#00F5FF]',
    icon: <Container className="h-3.5 w-3.5" />,
  },
  vessel: {
    label: 'Vessels',
    tone: 'text-[#10B981]',
    icon: <Ship className="h-3.5 w-3.5" />,
  },
  port: {
    label: 'Ports',
    tone: 'text-[#8B5CF6]',
    icon: <Anchor className="h-3.5 w-3.5" />,
  },
};

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return true;
  if (t.includes(q)) return true;
  let index = 0;
  for (const char of q) {
    index = t.indexOf(char, index);
    if (index === -1) return false;
    index += 1;
  }
  return true;
}

export function CommandPalette() {
  const router = useRouter();
  const open = useUiStore((state) => state.commandPaletteOpen);
  const setOpen = useUiStore((state) => state.setCommandPaletteOpen);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const shipments = useSupplyChainStore((state) => state.shipments);
  const vessels = useSupplyChainStore((state) => state.vessels);
  const ports = useSupplyChainStore((state) => state.ports);
  const selectShipment = useSupplyChainStore((state) => state.selectShipment);
  const selectVessel = useSupplyChainStore((state) => state.selectVessel);

  const allResults = useMemo<SearchResult[]>(() => {
    const shipmentResults: SearchResult[] = shipments.map((shipment) => ({
      id: `shipment-${shipment.id}`,
      kind: 'shipment',
      title: shipment.trackingNumber,
      subtitle: `${shipment.cargoDescription} · ${shipment.bolNumber}`,
      href: '/shipments',
      queryTargetId: shipment.id,
    }));
    const vesselResults: SearchResult[] = vessels.map((vessel) => ({
      id: `vessel-${vessel.id}`,
      kind: 'vessel',
      title: vessel.name,
      subtitle: `${vessel.mode.toUpperCase()} · ${vessel.callsign} · ${vessel.speedKnots.toFixed(1)} kn`,
      href: '/fleet',
      queryTargetId: vessel.id,
    }));
    const portResults: SearchResult[] = ports.map((port) => ({
      id: `port-${port.id}`,
      kind: 'port',
      title: `${port.name} (${port.code})`,
      subtitle: `${port.country} · Wait ${port.avgWaitHours}h · ${port.berths} berths`,
      href: '/',
      queryTargetId: port.id,
    }));
    return [...shipmentResults, ...vesselResults, ...portResults];
  }, [shipments, vessels, ports]);

  const filtered = useMemo<SearchResult[]>(() => {
    if (!query.trim()) {
      return allResults.filter((item) => item.kind !== 'shipment').slice(0, 8);
    }
    return allResults
      .filter((item) => fuzzyMatch(query, `${item.title} ${item.subtitle}`))
      .slice(0, 20);
  }, [allResults, query]);

  const grouped = useMemo(() => {
    const groups: Record<ResultKind, SearchResult[]> = {
      shipment: [],
      vessel: [],
      port: [],
    };
    filtered.forEach((item) => groups[item.kind].push(item));
    return groups;
  }, [filtered]);

  const flatResults = useMemo(() => {
    const ordered: SearchResult[] = [];
    (['shipment', 'vessel', 'port'] as ResultKind[]).forEach((kind) => {
      ordered.push(...grouped[kind]);
    });
    return ordered;
  }, [grouped]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      const handle = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(handle);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!useUiStore.getState().commandPaletteOpen);
        return;
      }
      if (!useUiStore.getState().commandPaletteOpen) return;
      if (event.key === 'Escape') {
        setOpen(false);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, flatResults.length - 1));
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const target = flatResults[activeIndex];
        if (target) {
          if (target.kind === 'shipment') selectShipment(target.queryTargetId);
          if (target.kind === 'vessel') selectVessel(target.queryTargetId);
          setOpen(false);
          router.push(target.href);
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [flatResults, activeIndex, router, selectShipment, selectVessel, setOpen]);

  const handleSelect = (result: SearchResult): void => {
    if (result.kind === 'shipment') selectShipment(result.queryTargetId);
    if (result.kind === 'vessel') selectVessel(result.queryTargetId);
    setOpen(false);
    router.push(result.href);
  };

  let runningIndex = -1;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[130] flex items-start justify-center pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#07090E]/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-[#00F5FF]/40 bg-[#0D111A] shadow-2xl glow-cyan"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 border-b border-[#1E2C42] px-4 py-3">
              <Search className="h-4 w-4 text-[#00F5FF]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tracking number, vessel name, or port code…"
                className="flex-1 bg-transparent font-mono text-sm text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none"
              />
              <kbd className="rounded border border-[#1E2C42] bg-[#161F30] px-1.5 py-0.5 font-mono text-[10px] text-[#94A3B8]">
                ESC
              </kbd>
            </div>

            <div className="max-h-[56vh] overflow-y-auto p-2">
              {flatResults.length === 0 ? (
                <p className="px-3 py-8 text-center font-mono text-xs text-[#94A3B8]">
                  NO SIGNAL MATCHES — refine your query
                </p>
              ) : (
                (['shipment', 'vessel', 'port'] as ResultKind[]).map((kind) => {
                  const items = grouped[kind];
                  if (items.length === 0) return null;
                  return (
                    <div key={kind} className="mb-2">
                      <p className="px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]">
                        {KIND_META[kind].label}
                      </p>
                      {items.map((item) => {
                        runningIndex += 1;
                        const isActive = runningIndex === activeIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onMouseEnter={() => setActiveIndex(flatResults.indexOf(item))}
                            onClick={() => handleSelect(item)}
                            className={`flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left transition ${
                              isActive ? 'bg-[#00F5FF]/10' : 'hover:bg-[#161F30]'
                            }`}
                          >
                            <span className={KIND_META[kind].tone}>{KIND_META[kind].icon}</span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-mono text-xs text-[#F1F5F9]">
                                {item.title}
                              </span>
                              <span className="block truncate text-[11px] text-[#94A3B8]">
                                {item.subtitle}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 border-t border-[#1E2C42] bg-[#161F30]/50 px-4 py-2 font-mono text-[10px] text-[#94A3B8]">
              <span><kbd className="rounded bg-[#0D111A] px-1">↑↓</kbd> navigate</span>
              <span><kbd className="rounded bg-[#0D111A] px-1">↵</kbd> select</span>
              <span><kbd className="rounded bg-[#0D111A] px-1">Ctrl+K</kbd> toggle</span>
              <span className="ml-auto">{flatResults.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
