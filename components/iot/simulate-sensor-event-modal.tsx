'use client';

import { useState } from 'react';
import { Thermometer, Zap, Snowflake } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { playAlarmBeep } from '@/lib/utils/sound-fx';
import { pushToast } from '@/components/ui/toast-system';

interface SimulateSensorEventModalProps {
  open: boolean;
  containerNumber: string;
  onClose: () => void;
}

type Scenario = 'compressor_failure' | 'container_drop' | 'door_tamper';

const SCENARIOS: { key: Scenario; label: string; description: string; tempSpike: number; shock: number; icon: React.ReactNode }[] = [
  {
    key: 'compressor_failure',
    label: 'Compressor Failure',
    description: 'Reefer compressor stops — temperature rises toward +8°C.',
    tempSpike: 28,
    shock: 0.2,
    icon: <Thermometer className="h-4 w-4" />,
  },
  {
    key: 'container_drop',
    label: 'Container Drop / Impact',
    description: 'Severe handling impact registers a 4.8G shock event.',
    tempSpike: 1.5,
    shock: 4.8,
    icon: <Zap className="h-4 w-4" />,
  },
  {
    key: 'door_tamper',
    label: 'Door Tamper Detection',
    description: 'Ambient light breach detected — possible door opening.',
    tempSpike: 6,
    shock: 0.6,
    icon: <Snowflake className="h-4 w-4" />,
  },
];

export function SimulateSensorEventModal({ open, containerNumber, onClose }: SimulateSensorEventModalProps) {
  const injectTelemetryAnomaly = useSupplyChainStore((state) => state.injectTelemetryAnomaly);
  const [scenario, setScenario] = useState<Scenario>('compressor_failure');

  const selected = SCENARIOS.find((item) => item.key === scenario) ?? SCENARIOS[0];

  const handleInject = (): void => {
    injectTelemetryAnomaly(containerNumber, selected.tempSpike, selected.shock);
    playAlarmBeep();
    pushToast(
      'Anomaly Injected',
      `${containerNumber}: ${selected.label} broadcast to War Room.`,
      'critical',
    );
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Simulate Sensor Anomaly"
      subtitle={containerNumber}
      icon={<Zap className="h-5 w-5 text-[#F59E0B]" />}
      size="md"
      accent="amber"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleInject}>
            <Zap className="h-3.5 w-3.5" /> Inject Anomaly
          </Button>
        </div>
      }
    >
      <div className="space-y-2">
        {SCENARIOS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setScenario(item.key)}
            className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
              scenario === item.key
                ? 'border-[#F59E0B]/50 bg-[#F59E0B]/10'
                : 'border-[#1E2C42] hover:border-[#F59E0B]/30'
            }`}
          >
            <span className={scenario === item.key ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}>
              {item.icon}
            </span>
            <span className="flex-1">
              <span className="block text-[12px] font-medium text-[#F1F5F9]">{item.label}</span>
              <span className="block text-[10px] text-[#94A3B8]">{item.description}</span>
              <span className="mt-1 flex gap-3 font-mono text-[9px] text-[#94A3B8]">
                <span>+{item.tempSpike.toFixed(1)}°C</span>
                <span>{item.shock.toFixed(1)} G shock</span>
              </span>
            </span>
          </button>
        ))}
        <p className="pt-1 text-[10px] leading-snug text-[#94A3B8]">
          Injecting an anomaly appends a sensor reading to the container history, plays the emergency
          alarm, and publishes a critical alert to the dashboard feed and War Room.
        </p>
      </div>
    </Modal>
  );
}
