'use client';

import { useState } from 'react';
import { Container, Plus } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/ui/badge';
import { ShipmentsTable } from '@/components/shipments/shipments-table';
import { MilestoneDrawer } from '@/components/shipments/milestone-drawer';
import { BillOfLadingModal } from '@/components/shipments/bill-of-lading-modal';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { useUiStore } from '@/lib/store/use-ui-store';
import type { Shipment } from '@/types/supply-chain';

export default function ShipmentsPage() {
  const ports = useSupplyChainStore((state) => state.ports);
  const shipments = useSupplyChainStore((state) => state.shipments);
  const openBookingWizard = useUiStore((state) => state.openBookingWizard);

  const [trackShipment, setTrackShipment] = useState<Shipment | null>(null);
  const [bolShipment, setBolShipment] = useState<Shipment | null>(null);

  const liveTrackShipment = trackShipment
    ? shipments.find((shipment) => shipment.id === trackShipment.id) ?? trackShipment
    : null;

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]">
            <Container className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Master Shipments
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="emerald" />
              {shipments.length} international bookings · BoL &amp; milestone tracking
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={openBookingWizard}>
          <Plus className="h-3.5 w-3.5" /> New Booking
        </Button>
      </header>

      <Panel
        title="Shipment Manifest"
        subtitle="Search · filter · sort · export"
        icon={<Container className="h-4 w-4" />}
      >
        <ShipmentsTable onTrack={setTrackShipment} onViewBol={setBolShipment} />
      </Panel>

      <MilestoneDrawer shipment={liveTrackShipment} onClose={() => setTrackShipment(null)} />
      <BillOfLadingModal
        shipment={bolShipment}
        ports={ports}
        onClose={() => setBolShipment(null)}
      />
    </div>
  );
}
