'use client';

import { useMemo, useState } from 'react';
import { Box, MoveRight } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { pushToast } from '@/components/ui/toast-system';
import type { ContainerSlot } from '@/types/supply-chain';
import { IMDG_META } from '@/lib/utils/container-meta';

interface ContainerRelocateModalProps {
  open: boolean;
  sourceSlot: ContainerSlot | null;
  onClose: () => void;
}

export function ContainerRelocateModal({ open, sourceSlot, onClose }: ContainerRelocateModalProps) {
  const yardSlots = useSupplyChainStore((state) => state.yardSlots);
  const relocateContainer = useSupplyChainStore((state) => state.relocateContainer);
  const [targetId, setTargetId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const candidates = useMemo(() => {
    return yardSlots.filter((slot) => {
      if (!sourceSlot) return false;
      if (slot.id === sourceSlot.id) return false;
      if (slot.status !== 'empty' && slot.status !== 'reserved') return false;
      // IMDG rule: hazardous containers only allowed in Block C
      if (sourceSlot.hazardClass !== 'none' && slot.block !== 'C') return false;
      // Reefer rule: reefer containers only allowed in Block D
      if (sourceSlot.isReefer && slot.block !== 'D') return false;
      // Non-reefer should not occupy reefer block D
      if (!sourceSlot.isReefer && slot.block === 'D') return false;
      // Non-hazardous shouldn't be placed in dangerous goods block C
      if (sourceSlot.hazardClass === 'none' && slot.block === 'C') return false;
      return true;
    });
  }, [yardSlots, sourceSlot]);

  const validate = (): string | null => {
    if (!sourceSlot) return 'No source container selected.';
    if (!targetId) return 'Select a target slot.';
    const target = yardSlots.find((slot) => slot.id === targetId);
    if (!target) return 'Target slot not found.';
    if (target.status === 'occupied') return 'Target slot is already occupied.';
    if (sourceSlot.hazardClass !== 'none' && target.block !== 'C') {
      return 'IMDG hazard containers may only be stored in Block C.';
    }
    if (sourceSlot.isReefer && target.block !== 'D') {
      return 'Reefer containers require Block D with power outlets.';
    }
    return null;
  };

  const handleConfirm = (): void => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const success = relocateContainer(sourceSlot?.id ?? '', targetId);
    if (success) {
      pushToast('Container Relocated', `${sourceSlot?.containerNumber ?? 'Container'} moved to ${targetId}.`, 'success');
      setTargetId('');
      setError(null);
      onClose();
    } else {
      setError('Relocation failed — target may be occupied.');
    }
  };

  const groupedTargets = useMemo(() => {
    const groups: Record<string, ContainerSlot[]> = { A: [], B: [], C: [], D: [] };
    candidates.forEach((slot) => {
      groups[slot.block].push(slot);
    });
    return groups;
  }, [candidates]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Relocate Container"
      subtitle={sourceSlot ? `${sourceSlot.containerNumber ?? 'Container'} · ${sourceSlot.isoType ?? ''}` : undefined}
      icon={<Box className="h-5 w-5 text-[#00F5FF]" />}
      size="md"
      accent="cyan"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm} disabled={!targetId}>
            <MoveRight className="h-3.5 w-3.5" /> Confirm Relocation
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {sourceSlot ? (
          <div className="flex items-center gap-2 rounded-md border border-[#1E2C42] bg-[#161F30]/50 p-2.5 text-[11px]">
            <span className="font-mono text-[#00F5FF]">{sourceSlot.id}</span>
            <MoveRight className="h-3.5 w-3.5 text-[#94A3B8]" />
            <span className="font-mono text-[#F1F5F9]">{targetId || 'select target'}</span>
            <div className="ml-auto flex gap-1">
              {sourceSlot.isReefer ? <span className="rounded bg-[#8B5CF6]/20 px-1.5 py-0.5 font-mono text-[8px] text-[#8B5CF6]">REEFER</span> : null}
              {sourceSlot.hazardClass !== 'none' ? (
                <span className="rounded bg-[#EF4444]/20 px-1.5 py-0.5 font-mono text-[8px] text-[#EF4444]">
                  IMDG {IMDG_META[sourceSlot.hazardClass].short}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-xs text-[#EF4444]">
            {error}
          </div>
        ) : null}

        <div className="max-h-72 space-y-2 overflow-y-auto">
          {Object.entries(groupedTargets).map(([block, slots]) => {
            if (slots.length === 0) return null;
            return (
              <div key={block}>
                <p className="mb-1 font-mono text-[9px] uppercase tracking-wider text-[#94A3B8]">
                  Block {block} — {slots.length} available
                </p>
                <div className="flex flex-wrap gap-1">
                  {slots.slice(0, 40).map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => {
                        setTargetId(slot.id);
                        setError(null);
                      }}
                      className={`rounded border px-1.5 py-0.5 font-mono text-[9px] transition ${
                        targetId === slot.id
                          ? 'border-[#00F5FF]/60 bg-[#00F5FF]/15 text-[#00F5FF]'
                          : 'border-[#1E2C42] text-[#94A3B8] hover:border-[#00F5FF]/40 hover:text-[#F1F5F9]'
                      }`}
                    >
                      {slot.id}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] leading-snug text-[#94A3B8]">
          Rules enforced: IMDG hazardous containers are restricted to Block C. Reefer containers
          require Block D power outlets. Standard cargo cannot occupy restricted blocks.
        </p>
      </div>
    </Modal>
  );
}
