'use client';

import { useState } from 'react';
import { Plus, Ship, Wrench, Clock } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/ui/badge';
import { FleetGrid } from '@/components/fleet/fleet-grid';
import { AddAssetModal } from '@/components/fleet/add-asset-modal';
import { DriverHosTracker } from '@/components/fleet/driver-hos-tracker';
import { MaintenanceScheduler } from '@/components/fleet/maintenance-scheduler';

export default function FleetPage() {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]">
            <Ship className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Fleet Telematics
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="emerald" />
              Multimodal asset command · ocean · air · ground
            </p>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Register Asset
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <FleetGrid />
        </div>
        <div className="space-y-3">
          <Panel
            title="Hours of Service"
            subtitle="Crew &amp; driver compliance"
            icon={<Clock className="h-4 w-4" />}
            bodyClassName="max-h-[360px] overflow-y-auto"
          >
            <DriverHosTracker />
          </Panel>
          <Panel
            title="Predictive Maintenance"
            subtitle="Component degradation"
            icon={<Wrench className="h-4 w-4" />}
            bodyClassName="max-h-[420px] overflow-y-auto"
          >
            <MaintenanceScheduler />
          </Panel>
        </div>
      </div>

      <AddAssetModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
