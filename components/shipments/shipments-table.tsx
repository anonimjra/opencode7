'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  MapPin,
  Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { pushToast } from '@/components/ui/toast-system';
import { exportShipmentsToExcel } from '@/lib/services/export-excel';
import { SHIPMENT_STATUS_META } from '@/lib/utils/shipment-meta';
import {
  formatUsd,
  formatWeightKg,
  formatMaritimeDate,
} from '@/lib/utils/formatters';
import type {
  IncotermCode,
  PortNode,
  Shipment,
  ShipmentStatus,
  TransportMode,
} from '@/types/supply-chain';

type SortKey = 'bookingDate' | 'declaredValueUsd' | 'weightKg';

interface ShipmentsTableProps {
  onTrack: (shipment: Shipment) => void;
  onViewBol: (shipment: Shipment) => void;
}

const PAGE_SIZE = 10;

const STATUS_OPTIONS: (ShipmentStatus | 'all')[] = [
  'all',
  'at_sea',
  'gate_in',
  'customs_hold',
  'delivered',
  'exception',
  'out_for_delivery',
];

const MODE_OPTIONS: (TransportMode | 'all')[] = ['all', 'ocean', 'air', 'road', 'rail'];
const INCOTERM_OPTIONS: (IncotermCode | 'all')[] = ['all', 'FOB', 'CIF', 'DDP', 'EXW', 'CFR'];

export function ShipmentsTable({ onTrack, onViewBol }: ShipmentsTableProps) {
  const shipments = useSupplyChainStore((state) => state.shipments);
  const ports = useSupplyChainStore((state) => state.ports);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ShipmentStatus | 'all'>('all');
  const [mode, setMode] = useState<TransportMode | 'all'>('all');
  const [incoterm, setIncoterm] = useState<IncotermCode | 'all'>('all');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>('bookingDate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [exporting, setExporting] = useState(false);

  const portCode = useMemo(() => {
    const map: Record<string, string> = {};
    ports.forEach((port: PortNode) => {
      map[port.id] = port.code;
    });
    return map;
  }, [ports]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return shipments.filter((shipment) => {
      if (status !== 'all' && shipment.status !== status) return false;
      if (mode !== 'all' && shipment.mode !== mode) return false;
      if (incoterm !== 'all' && shipment.incoterm !== incoterm) return false;
      if (!query) return true;
      return (
        shipment.trackingNumber.toLowerCase().includes(query) ||
        shipment.bolNumber.toLowerCase().includes(query) ||
        shipment.shipperName.toLowerCase().includes(query) ||
        shipment.consigneeName.toLowerCase().includes(query) ||
        shipment.cargoDescription.toLowerCase().includes(query)
      );
    });
  }, [shipments, search, status, mode, incoterm]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let compare = 0;
      if (sortKey === 'bookingDate') {
        compare = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
      } else if (sortKey === 'declaredValueUsd') {
        compare = a.declaredValueUsd - b.declaredValueUsd;
      } else {
        compare = a.weightKg - b.weightKg;
      }
      return sortDir === 'asc' ? compare : -compare;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const toggleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const handleExport = async (): Promise<void> => {
    setExporting(true);
    try {
      await exportShipmentsToExcel(sorted, ports);
      pushToast('Excel Exported', `${sorted.length} shipments written to manifest.`, 'success');
    } catch {
      pushToast('Export Failed', 'Unable to generate the Excel file.', 'critical');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md border border-[#1E2C42] bg-[#0D111A] px-2">
          <Search className="h-3.5 w-3.5 text-[#94A3B8]" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search tracking, B/L, shipper, consignee…"
            className="h-8 w-56 bg-transparent font-mono text-[11px] text-[#F1F5F9] placeholder:text-[#94A3B8] focus:outline-none"
          />
        </div>
        <Select value={status} onChange={(value) => { setStatus(value as ShipmentStatus | 'all'); setPage(1); }} options={STATUS_OPTIONS} label="Status" />
        <Select value={mode} onChange={(value) => { setMode(value as TransportMode | 'all'); setPage(1); }} options={MODE_OPTIONS} label="Mode" />
        <Select value={incoterm} onChange={(value) => { setIncoterm(value as IncotermCode | 'all'); setPage(1); }} options={INCOTERM_OPTIONS} label="Incoterm" />
        <Button variant="success" size="sm" onClick={handleExport} disabled={exporting} className="ml-auto">
          <Download className="h-3.5 w-3.5" /> {exporting ? 'Exporting…' : 'Export Excel'}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#1E2C42]">
        <table className="w-full border-collapse text-left text-[11px]">
          <thead>
            <tr className="border-b border-[#1E2C42] bg-[#161F30]/60 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
              <th className="px-2 py-2">Tracking / B/L</th>
              <th className="px-2 py-2">Cargo</th>
              <th className="px-2 py-2">Route</th>
              <th className="px-2 py-2">Incoterm</th>
              <th className="px-2 py-2">
                <button type="button" onClick={() => toggleSort('weightKg')} className="flex items-center gap-1 hover:text-[#F1F5F9]">
                  Weight {sortKey === 'weightKg' ? (sortDir === 'asc' ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />) : null}
                </button>
              </th>
              <th className="px-2 py-2">
                <button type="button" onClick={() => toggleSort('declaredValueUsd')} className="flex items-center gap-1 hover:text-[#F1F5F9]">
                  Value {sortKey === 'declaredValueUsd' ? (sortDir === 'asc' ? <ArrowUp className="h-2.5 w-2.5" /> : <ArrowDown className="h-2.5 w-2.5" />) : null}
                </button>
              </th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">ETA</th>
              <th className="px-2 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((shipment) => {
              const meta = SHIPMENT_STATUS_META[shipment.status];
              return (
                <tr key={shipment.id} className="border-b border-[#1E2C42]/50 transition hover:bg-[#161F30]/50">
                  <td className="px-2 py-1.5">
                    <p className="font-mono text-[11px] text-[#00F5FF]">{shipment.trackingNumber}</p>
                    <p className="font-mono text-[9px] text-[#94A3B8]">{shipment.bolNumber}</p>
                  </td>
                  <td className="px-2 py-1.5">
                    <p className="max-w-[180px] truncate text-[#F1F5F9]">{shipment.cargoDescription}</p>
                    <p className="font-mono text-[9px] uppercase text-[#94A3B8]">{shipment.mode} · {shipment.containers.length} ctr</p>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10px]">
                    <span className="text-[#10B981]">{portCode[shipment.originPortId]}</span>
                    <span className="mx-1 text-[#1E2C42]">→</span>
                    <span className="text-[#00F5FF]">{portCode[shipment.destPortId]}</span>
                  </td>
                  <td className="px-2 py-1.5">
                    <Badge tone="violet">{shipment.incoterm}</Badge>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[10px] text-[#F1F5F9]">{formatWeightKg(shipment.weightKg)}</td>
                  <td className="px-2 py-1.5 font-mono text-[10px] text-[#10B981]">{formatUsd(shipment.declaredValueUsd)}</td>
                  <td className="px-2 py-1.5">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </td>
                  <td className="px-2 py-1.5 font-mono text-[9px] text-[#94A3B8]">{formatMaritimeDate(shipment.eta)}</td>
                  <td className="px-2 py-1.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onTrack(shipment)}
                        title="Track milestone"
                        className="rounded border border-[#1E2C42] p-1 text-[#00F5FF] hover:border-[#00F5FF]/40"
                      >
                        <MapPin className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onViewBol(shipment)}
                        title="View Bill of Lading"
                        className="rounded border border-[#1E2C42] p-1 text-[#8B5CF6] hover:border-[#8B5CF6]/40"
                      >
                        <FileText className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
        <span>{sorted.length} shipments · page {safePage}/{pageCount}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={safePage <= 1}
            className="rounded border border-[#1E2C42] p-1 disabled:opacity-30 hover:border-[#00F5FF]/40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={safePage >= pageCount}
            className="rounded border border-[#1E2C42] p-1 disabled:opacity-30 hover:border-[#00F5FF]/40"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <label className="flex items-center gap-1 rounded-md border border-[#1E2C42] bg-[#0D111A] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-transparent text-[#F1F5F9] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#0D111A]">
            {option === 'all' ? 'All' : option}
          </option>
        ))}
      </select>
    </label>
  );
}
