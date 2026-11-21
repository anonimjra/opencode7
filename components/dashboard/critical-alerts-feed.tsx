'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  Check,
  CloudLightning,
  ExternalLink,
  Info,
  ShieldAlert,
  Snowflake,
  XCircle,
} from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { playAlarmBeep } from '@/lib/utils/sound-fx';
import { formatRelativeTime } from '@/lib/utils/formatters';
import type { AlertCategory, AlertSeverity, CriticalAlert } from '@/types/supply-chain';

const SEVERITY_ICON: Record<AlertSeverity, React.ReactNode> = {
  critical: <XCircle className="h-4 w-4 text-[#EF4444]" />,
  warning: <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />,
  info: <Info className="h-4 w-4 text-[#00F5FF]" />,
};

const CATEGORY_ICON: Record<AlertCategory, React.ReactNode> = {
  weather: <CloudLightning className="h-3 w-3" />,
  customs: <ShieldAlert className="h-3 w-3" />,
  telemetry_excursion: <Snowflake className="h-3 w-3" />,
  congestion: <AlertTriangle className="h-3 w-3" />,
  geopolitical: <ShieldAlert className="h-3 w-3" />,
};

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  critical: 'border-l-[#EF4444]',
  warning: 'border-l-[#F59E0B]',
  info: 'border-l-[#00F5FF]',
};

export function CriticalAlertsFeed() {
  const router = useRouter();
  const alerts = useSupplyChainStore((state) => state.alerts);
  const acknowledgeAlert = useSupplyChainStore((state) => state.acknowledgeAlert);
  const audioMuted = useSupplyChainStore((state) => state.audioMuted);
  const lastPlayedRef = useRef<number>(0);

  const sorted = useMemo(() => {
    const severityOrder: Record<AlertSeverity, number> = { critical: 0, warning: 1, info: 2 };
    return [...alerts].sort((a, b) => {
      if (a.isAcknowledged !== b.isAcknowledged) return a.isAcknowledged ? 1 : -1;
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [alerts]);

  const hasUnackedCritical = alerts.some(
    (alert) => alert.severity === 'critical' && !alert.isAcknowledged,
  );

  useEffect(() => {
    if (hasUnackedCritical && !audioMuted) {
      const now = Date.now();
      if (now - lastPlayedRef.current > 6000) {
        lastPlayedRef.current = now;
        playAlarmBeep();
      }
    }
  }, [hasUnackedCritical, audioMuted]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
          {sorted.filter((alert) => !alert.isAcknowledged).length} unacknowledged
        </span>
        <button
          type="button"
          onClick={() => router.push('/incidents')}
          className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#00F5FF] hover:underline"
        >
          War Room <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {sorted.map((alert) => (
          <AlertRow key={alert.id} alert={alert} onAcknowledge={acknowledgeAlert} />
        ))}
      </div>
    </div>
  );
}

function AlertRow({
  alert,
  onAcknowledge,
}: {
  alert: CriticalAlert;
  onAcknowledge: (id: string) => void;
}) {
  return (
    <div
      className={`rounded-md border border-[#1E2C42] border-l-2 bg-[#161F30]/40 p-2.5 ${SEVERITY_BORDER[alert.severity]} ${
        alert.isAcknowledged ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">{SEVERITY_ICON[alert.severity]}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-medium text-[#F1F5F9]">{alert.title}</p>
            <span className="shrink-0 font-mono text-[9px] text-[#94A3B8]">
              {formatRelativeTime(alert.timestamp)}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] leading-snug text-[#94A3B8]">{alert.message}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded bg-[#0D111A] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[#94A3B8]">
              {CATEGORY_ICON[alert.category]}
              {alert.category.replace('_', ' ')}
            </span>
            {alert.isAcknowledged ? (
              <span className="flex items-center gap-1 font-mono text-[9px] text-[#10B981]">
                <Check className="h-3 w-3" /> Acknowledged
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onAcknowledge(alert.id)}
                className="font-mono text-[9px] uppercase tracking-wider text-[#00F5FF] hover:underline"
              >
                Acknowledge
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
