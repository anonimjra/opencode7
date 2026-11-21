'use client';

import { useState } from 'react';
import { AlertOctagon, Navigation, Plus } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/ui/badge';
import { WarRoom } from '@/components/incidents/war-room';
import { RerouteSimulator } from '@/components/incidents/reroute-simulator';
import { DeclareIncidentModal } from '@/components/incidents/declare-incident-modal';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';

export default function IncidentsPage() {
  const incidents = useSupplyChainStore((state) => state.incidents);
  const alerts = useSupplyChainStore((state) => state.alerts);
  const [declareOpen, setDeclareOpen] = useState(false);

  const activeCount = incidents.filter((incident) => incident.status === 'active').length;
  const criticalAlerts = alerts.filter((alert) => alert.severity === 'critical' && !alert.isAcknowledged).length;

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#EF4444]/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#EF4444]/50 bg-[#EF4444]/10 text-[#EF4444]">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              Disruption War Room
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone={activeCount > 0 ? 'crimson' : 'emerald'} pulse={activeCount > 0} />
              {activeCount} active crises · {criticalAlerts} critical alerts
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setDeclareOpen(true)}>
          <Plus className="h-3.5 w-3.5" /> Declare Incident
        </Button>
      </header>

      <Panel
        title="Global Chokepoint Monitor"
        subtitle="5 strategic maritime chokepoints"
        icon={<AlertOctagon className="h-4 w-4" />}
      >
        <WarRoom />
      </Panel>

      <Panel
        title="Autonomous Reroute Simulator"
        subtitle="Suez vs Cape of Good Hope trade-off"
        icon={<Navigation className="h-4 w-4" />}
      >
        <RerouteSimulator />
      </Panel>

      <DeclareIncidentModal open={declareOpen} onClose={() => setDeclareOpen(false)} />
    </div>
  );
}
