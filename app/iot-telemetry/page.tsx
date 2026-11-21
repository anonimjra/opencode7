'use client';

import { useEffect, useMemo, useState } from 'react';
import { Snowflake, Zap, Radio, Thermometer } from 'lucide-react';
import { Panel } from '@/components/ui/panel';
import { Button } from '@/components/ui/button';
import { StatusDot } from '@/components/ui/badge';
import { TelemetryOverview } from '@/components/iot/telemetry-overview';
import { MultiSensorChart } from '@/components/iot/multi-sensor-chart';
import { TemperatureExcursionCard } from '@/components/iot/temperature-excursion-card';
import { SimulateSensorEventModal } from '@/components/iot/simulate-sensor-event-modal';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { formatZulu } from '@/lib/utils/formatters';

export default function IotTelemetryPage() {
  const reeferTelemetry = useSupplyChainStore((state) => state.reeferTelemetry);
  const [selected, setSelected] = useState<string | null>(null);
  const [simulateOpen, setSimulateOpen] = useState(false);

  useEffect(() => {
    if (!selected && reeferTelemetry.length > 0) {
      setSelected(reeferTelemetry[0].containerNumber);
    }
  }, [selected, reeferTelemetry]);

  const activeRecord = useMemo(
    () => reeferTelemetry.find((record) => record.containerNumber === selected) ?? reeferTelemetry[0] ?? null,
    [reeferTelemetry, selected],
  );

  return (
    <div className="space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E2C42] bg-gradient-to-r from-[#0D111A] to-[#161F30]/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#8B5CF6]">
            <Snowflake className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-mono text-base font-bold uppercase tracking-[0.14em] text-[#F1F5F9]">
              IoT Cold-Chain Lab
            </h1>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
              <StatusDot tone="violet" />
              {reeferTelemetry.length} reefer units streaming · 24h telemetry
            </p>
          </div>
        </div>
        <Button variant="danger" size="sm" onClick={() => setSimulateOpen(true)} disabled={!activeRecord}>
          <Zap className="h-3.5 w-3.5" /> Simulate Anomaly
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
        <Panel
          title="Active Reefer Units"
          subtitle="Cold-chain container telemetry"
          icon={<Radio className="h-4 w-4" />}
          bodyClassName="max-h-[640px] overflow-y-auto"
        >
          <TelemetryOverview selectedContainer={selected} onSelect={setSelected} />
        </Panel>

        <div className="space-y-3 xl:col-span-2">
          {activeRecord ? (
            <>
              <Panel
                title={`Multi-Sensor Time-Series · ${activeRecord.containerNumber}`}
                subtitle={`${activeRecord.cargoType} · target ${activeRecord.targetTempC}°C`}
                icon={<Thermometer className="h-4 w-4" />}
                bodyClassName="h-[300px]"
              >
                <MultiSensorChart history={activeRecord.history} targetTempC={activeRecord.targetTempC} />
              </Panel>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <Panel
                  title="MKT Spoilage Risk"
                  subtitle="Arrhenius degradation model"
                  icon={<Snowflake className="h-4 w-4" />}
                >
                  <TemperatureExcursionCard
                    history={activeRecord.history}
                    targetTempC={activeRecord.targetTempC}
                    cargoType={activeRecord.cargoType}
                  />
                </Panel>

                <Panel
                  title="Latest Sensor Snapshot"
                  subtitle={`Updated ${formatZulu(activeRecord.history[activeRecord.history.length - 1]?.timestamp ?? new Date().toISOString())}`}
                  icon={<Radio className="h-4 w-4" />}
                >
                  <SnapshotList history={activeRecord.history} />
                </Panel>
              </div>
            </>
          ) : (
            <Panel title="No Active Reefer" subtitle="No telemetry data">
              <p className="py-10 text-center font-mono text-xs text-[#94A3B8]">
                NO COLD-CHAIN SIGNAL DETECTED
              </p>
            </Panel>
          )}
        </div>
      </div>

      {activeRecord ? (
        <SimulateSensorEventModal
          open={simulateOpen}
          containerNumber={activeRecord.containerNumber}
          onClose={() => setSimulateOpen(false)}
        />
      ) : null}
    </div>
  );
}

function SnapshotList({ history }: { history: { timestamp: string; temperatureC: number; humidityPercent: number; shockG: number }[] }) {
  const recent = [...history].slice(-6).reverse();
  return (
    <div className="space-y-1.5">
      {recent.map((point) => (
        <div key={point.timestamp} className="flex items-center justify-between rounded border border-[#1E2C42]/60 bg-[#161F30]/40 px-2 py-1 font-mono text-[10px]">
          <span className="text-[#94A3B8]">
            {new Date(point.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="text-[#00F5FF]">{point.temperatureC.toFixed(1)}°C</span>
          <span className="text-[#8B5CF6]">{point.humidityPercent}%</span>
          <span className="text-[#F59E0B]">{point.shockG.toFixed(1)}G</span>
        </div>
      ))}
    </div>
  );
}
