'use client';

import { useMemo } from 'react';
import { Printer, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import type { PortNode, Shipment } from '@/types/supply-chain';
import { formatMaritimeDate, formatWeightKg, formatNumber } from '@/lib/utils/formatters';

interface BillOfLadingModalProps {
  shipment: Shipment | null;
  ports: PortNode[];
  onClose: () => void;
}

function Barcode({ value }: { value: string }) {
  const bars = useMemo(() => {
    let hash = 0;
    for (let index = 0; index < value.length; index += 1) {
      hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
    }
    const result: number[] = [];
    for (let index = 0; index < 48; index += 1) {
      hash = (hash * 1103515245 + 12345) >>> 0;
      result.push((hash % 4) + 1);
    }
    return result;
  }, [value]);

  let x = 0;
  return (
    <svg viewBox="0 0 200 40" className="h-10 w-48" aria-label={`Barcode ${value}`}>
      {bars.map((width, index) => {
        const rect = (
          <rect
            key={index}
            x={x}
            y={0}
            width={width}
            height={40}
            fill={index % 2 === 0 ? '#0D111A' : '#FFFFFF'}
          />
        );
        x += width;
        return rect;
      })}
    </svg>
  );
}

export function BillOfLadingModal({ shipment, ports, onClose }: BillOfLadingModalProps) {
  const origin = shipment ? ports.find((port) => port.id === shipment.originPortId) : undefined;
  const dest = shipment ? ports.find((port) => port.id === shipment.destPortId) : undefined;

  const totalWeight = shipment?.weightKg ?? 0;
  const totalVolume = shipment?.volumeCbm ?? 0;

  return (
    <Modal
      open={shipment !== null}
      onClose={onClose}
      title="Ocean Bill of Lading"
      subtitle={shipment ? `B/L ${shipment.bolNumber}` : undefined}
      icon={<FileText className="h-5 w-5 text-[#00F5FF]" />}
      size="xl"
      accent="cyan"
      footer={
        <div className="flex justify-end">
          <Button variant="primary" size="sm" onClick={() => window.print()} className="no-print">
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </Button>
        </div>
      }
    >
      {shipment ? (
        <div className="print-area space-y-3 rounded-lg border-2 border-[#1E2C42] bg-white p-5 text-[#0D111A]">
          <div className="flex items-start justify-between border-b-2 border-[#0A1F44] pb-3">
            <div>
              <h2 className="font-mono text-lg font-bold tracking-wide text-[#0A1F44]">
                AETHER GLOBAL MARITIME LINE
              </h2>
              <p className="text-[10px] text-[#0A1F44]">
                Ocean Carrier · 1 Aether Terminal Way · Global HQ
              </p>
              <p className="text-[10px] text-[#0A1F44]">
                Tel: +65 6000 0700 · ops@aethermaritime.example
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold tracking-widest text-[#0A1F44]">
                ORIGINAL BILL OF LADING
              </p>
              <div className="mt-1 flex justify-end">
                <Barcode value={shipment.bolNumber} />
              </div>
              <p className="font-mono text-[10px] text-[#0D111A]">B/L No: {shipment.bolNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Box title="Shipper">{shipment.shipperName}</Box>
            <Box title="Consignee">{shipment.consigneeName}</Box>
            <Box title="Notify Party">{shipment.notifyParty}</Box>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Box title="Pre-Carriage by">Aether Intermodal</Box>
            <Box title="Place of Receipt">{origin?.name ?? '—'}</Box>
            <Box title="Ocean Vessel / Voyage">
              {shipment.mode.toUpperCase()} · VOY-{shipment.trackingNumber.slice(-4)}
            </Box>
            <Box title="Port of Loading">
              {origin?.name ?? '—'} ({origin?.code ?? '—'})
            </Box>
            <Box title="Port of Discharge">
              {dest?.name ?? '—'} ({dest?.code ?? '—'})
            </Box>
            <Box title="Place of Delivery">{dest?.country ?? '—'}</Box>
          </div>

          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-[#0A1F44] text-white">
                <th className="border border-[#1E2C42] px-2 py-1 text-left">Container No</th>
                <th className="border border-[#1E2C42] px-2 py-1 text-left">Seal No</th>
                <th className="border border-[#1E2C42] px-2 py-1 text-left">Description of Goods</th>
                <th className="border border-[#1E2C42] px-2 py-1 text-right">Gross Weight</th>
                <th className="border border-[#1E2C42] px-2 py-1 text-right">Measurement</th>
              </tr>
            </thead>
            <tbody>
              {shipment.containers.map((container, index) => (
                <tr key={container}>
                  <td className="border border-[#1E2C42] px-2 py-1 font-mono">{container}</td>
                  <td className="border border-[#1E2C42] px-2 py-1 font-mono">
                    SL-{String(100000 + index * 137)}
                  </td>
                  <td className="border border-[#1E2C42] px-2 py-1">{shipment.cargoDescription}</td>
                  <td className="border border-[#1E2C42] px-2 py-1 text-right font-mono">
                    {formatWeightKg(Math.round(totalWeight / shipment.containers.length))}
                  </td>
                  <td className="border border-[#1E2C42] px-2 py-1 text-right font-mono">
                    {formatNumber(Math.round(totalVolume / shipment.containers.length))} CBM
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="border border-[#1E2C42] px-2 py-1" colSpan={3}>
                  TOTAL
                </td>
                <td className="border border-[#1E2C42] px-2 py-1 text-right font-mono">
                  {formatWeightKg(totalWeight)}
                </td>
                <td className="border border-[#1E2C42] px-2 py-1 text-right font-mono">
                  {formatNumber(totalVolume)} CBM
                </td>
              </tr>
            </tfoot>
          </table>

          <div className="grid grid-cols-2 gap-2">
            <Box title="Freight &amp; Charges">
              {shipment.incoterm} · PREPAID · HS {shipment.hsCode}
            </Box>
            <Box title="Shipped on Board">
              {formatMaritimeDate(shipment.departureDate)}
            </Box>
          </div>

          <div className="space-y-1 border-t border-[#1E2C42] pt-2 text-[8.5px] leading-snug text-[#0D111A]">
            <p>
              <strong>SHIPPED on board</strong> the vessel named above in apparent good order and
              condition (unless otherwise indicated) for carriage to the port of discharge or so near
              thereto as the vessel may safely get and be always afloat. This Bill of Lading is issued
              in the number stated, one of which being accomplished, the others to stand void.
            </p>
            <p>
              This shipment is subject to the terms and conditions of the Carrier&apos;s standard Bill
              of Lading, including the Hague-Visby Rules as incorporated herein. The Carrier shall not
              be liable for loss or damage arising from perils of the sea, act of God, or inherent vice
              of the goods.
            </p>
          </div>

          <div className="flex items-end justify-between pt-2">
            <div>
              <p className="text-[9px] uppercase tracking-wider text-[#0A1F44]">Signed for the Carrier</p>
              <p className="mt-4 border-t border-[#0D111A] pt-1 font-mono text-[10px]">AETHER GLOBAL MARITIME LINE</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 rotate-[-8deg] items-center justify-center rounded-full border-2 border-[#0A1F44] text-center">
                <span className="font-mono text-[7px] font-bold leading-tight text-[#0A1F44]">
                  ORIGINAL
                  <br />
                  NEGOTIABLE
                  <br />
                  AETHER-07
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-wider text-[#0A1F44]">Dated</p>
              <p className="mt-4 border-t border-[#0D111A] pt-1 font-mono text-[10px]">
                {formatMaritimeDate(shipment.bookingDate)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded border border-[#1E2C42] p-1.5">
      <p className="font-mono text-[8px] uppercase tracking-wider text-[#0A1F44]">{title}</p>
      <p className="text-[10px] font-medium text-[#0D111A]">{children}</p>
    </div>
  );
}
