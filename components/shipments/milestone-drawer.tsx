'use client';

import { CheckCircle2, Circle, MapPin, SkipForward } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import type { Shipment } from '@/types/supply-chain';
import { SHIPMENT_STATUS_META } from '@/lib/utils/shipment-meta';
import { formatZulu, formatWeightKg, formatUsd } from '@/lib/utils/formatters';
import { pushToast } from '@/components/ui/toast-system';

interface MilestoneDrawerProps {
  shipment: Shipment | null;
  onClose: () => void;
}

export function MilestoneDrawer({ shipment, onClose }: MilestoneDrawerProps) {
  const advanceShipmentMilestone = useSupplyChainStore((state) => state.advanceShipmentMilestone);

  const handleAdvance = (): void => {
    if (!shipment) return;
    advanceShipmentMilestone(shipment.id);
    pushToast('Milestone Advanced', `${shipment.trackingNumber} progression updated.`, 'success');
  };

  const statusMeta = shipment ? SHIPMENT_STATUS_META[shipment.status] : null;

  return (
    <Drawer
      open={shipment !== null}
      onClose={onClose}
      title={shipment?.trackingNumber ?? 'Shipment'}
      subtitle={shipment ? `${shipment.cargoDescription}` : undefined}
      icon={<MapPin className="h-5 w-5 text-[#00F5FF]" />}
      accent="cyan"
      width="lg"
      footer={
        shipment ? (
          <button
            type="button"
            onClick={handleAdvance}
            disabled={shipment.status === 'delivered'}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/10 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF] hover:bg-[#00F5FF]/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SkipForward className="h-3.5 w-3.5" /> Advance to Next Milestone
          </button>
        ) : null
      }
    >
      {shipment ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {statusMeta ? <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge> : null}
            <Badge tone="cyan">{shipment.mode}</Badge>
            <Badge tone="violet">{shipment.incoterm}</Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#1E2C42] bg-[#161F30]/50 p-2.5 text-center">
            <div>
              <p className="font-mono text-[9px] uppercase text-[#94A3B8]">Weight</p>
              <p className="font-mono text-[11px] text-[#F1F5F9]">{formatWeightKg(shipment.weightKg)}</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase text-[#94A3B8]">Volume</p>
              <p className="font-mono text-[11px] text-[#F1F5F9]">{shipment.volumeCbm} CBM</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase text-[#94A3B8]">Value</p>
              <p className="font-mono text-[11px] text-[#F1F5F9]">{formatUsd(shipment.declaredValueUsd)}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              Journey Milestones
            </p>
            <ol className="relative space-y-3 border-l border-[#1E2C42] pl-5">
              {shipment.milestones.map((milestone) => (
                <li key={`${milestone.title}-${milestone.timestamp}`} className="relative">
                  <span className="absolute -left-[27px] top-0.5">
                    {milestone.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
                    ) : (
                      <Circle className="h-4 w-4 text-[#1E2C42]" />
                    )}
                  </span>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-[12px] font-medium ${milestone.isCompleted ? 'text-[#F1F5F9]' : 'text-[#94A3B8]'}`}>
                        {milestone.title}
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">{milestone.description}</p>
                      <p className="mt-0.5 flex items-center gap-1 font-mono text-[9px] text-[#94A3B8]">
                        <MapPin className="h-2.5 w-2.5" /> {milestone.location}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[9px] text-[#94A3B8]">
                      {formatZulu(milestone.timestamp)}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border border-[#1E2C42] bg-[#0D111A]/60 p-2.5">
            <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
              Containers ({shipment.containers.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {shipment.containers.map((container) => (
                <span key={container} className="rounded bg-[#161F30] px-1.5 py-0.5 font-mono text-[9px] text-[#00F5FF]">
                  {container}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
