'use client';

import { useEffect, useState } from 'react';
import {
  Bell,
  Command,
  Plus,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSupplyChainStore } from '@/lib/store/use-supply-chain-store';
import { useUiStore } from '@/lib/store/use-ui-store';
import { formatRelativeTime } from '@/lib/utils/formatters';

const SEVERITY_TONE: Record<string, string> = {
  critical: 'border-[#EF4444]/40 text-[#EF4444]',
  warning: 'border-[#F59E0B]/40 text-[#F59E0B]',
  info: 'border-[#00F5FF]/40 text-[#00F5FF]',
};

export function Header() {
  const openCommandPalette = useUiStore((state) => state.openCommandPalette);
  const openBookingWizard = useUiStore((state) => state.openBookingWizard);
  const notificationsOpen = useUiStore((state) => state.notificationsOpen);
  const toggleNotifications = useUiStore((state) => state.toggleNotifications);
  const closeNotifications = useUiStore((state) => state.closeNotifications);

  const audioMuted = useSupplyChainStore((state) => state.audioMuted);
  const toggleAudioMute = useSupplyChainStore((state) => state.toggleAudioMute);
  const alerts = useSupplyChainStore((state) => state.alerts);
  const acknowledgeAlert = useSupplyChainStore((state) => state.acknowledgeAlert);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeAlerts = alerts.filter((alert) => !alert.isAcknowledged);
  const unreadCount = activeAlerts.length;

  return (
    <header className="app-header relative z-40 flex h-14 shrink-0 items-center gap-3 border-b border-[#1E2C42] bg-[#0D111A]/85 px-4 backdrop-blur-md lg:pl-4">
      <div className="hidden items-center gap-2 lg:flex">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
          Aether Global Command
        </span>
        <span className="h-1 w-1 rounded-full bg-[#1E2C42]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#10B981]">
          Uplink Stable
        </span>
      </div>

      <button
        type="button"
        onClick={openCommandPalette}
        className="group ml-auto flex h-9 w-full max-w-md items-center gap-2 rounded-md border border-[#1E2C42] bg-[#0D111A] px-3 text-left transition hover:border-[#00F5FF]/40 lg:ml-4"
      >
        <Search className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#00F5FF]" />
        <span className="flex-1 text-xs text-[#94A3B8]">
          Search shipments, vessels, ports…
        </span>
        <kbd className="flex items-center gap-0.5 rounded border border-[#1E2C42] bg-[#161F30] px-1.5 py-0.5 font-mono text-[10px] text-[#94A3B8]">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </button>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleAudioMute}
          className={`flex h-9 w-9 items-center justify-center rounded-md border transition ${
            audioMuted
              ? 'border-[#1E2C42] text-[#94A3B8] hover:text-[#F1F5F9]'
              : 'border-[#10B981]/40 bg-[#10B981]/10 text-[#10B981] glow-emerald'
          }`}
          aria-label={audioMuted ? 'Unmute sonar audio' : 'Mute sonar audio'}
          title={audioMuted ? 'Sonar audio muted' : 'Sonar audio active'}
        >
          {audioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={toggleNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-md border border-[#1E2C42] text-[#94A3B8] transition hover:border-[#00F5FF]/40 hover:text-[#F1F5F9]"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 font-mono text-[9px] text-white">
                {unreadCount}
              </span>
            ) : null}
          </button>

          {mounted && notificationsOpen ? (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={closeNotifications}
                aria-hidden
              />
              <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-lg border border-[#1E2C42] bg-[#0D111A] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#1E2C42] px-3 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#F1F5F9]">
                    Alert Stream
                  </span>
                  <span className="font-mono text-[10px] text-[#EF4444]">
                    {unreadCount} active
                  </span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {activeAlerts.length === 0 ? (
                    <p className="px-3 py-6 text-center font-mono text-[11px] text-[#94A3B8]">
                      All alerts acknowledged
                    </p>
                  ) : (
                    activeAlerts.slice(0, 8).map((alert) => (
                      <div
                        key={alert.id}
                        className={`border-b border-[#1E2C42]/60 border-l-2 px-3 py-2 ${SEVERITY_TONE[alert.severity]}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-medium text-[#F1F5F9]">{alert.title}</p>
                          <span className="shrink-0 font-mono text-[9px] text-[#94A3B8]">
                            {formatRelativeTime(alert.timestamp)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] leading-snug text-[#94A3B8]">
                          {alert.message}
                        </p>
                        <button
                          type="button"
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#00F5FF] hover:underline"
                        >
                          Acknowledge
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        <button
          type="button"
          onClick={openBookingWizard}
          className="flex h-9 items-center gap-1.5 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/15 px-3 font-mono text-xs font-medium uppercase tracking-wide text-[#00F5FF] transition hover:bg-[#00F5FF]/25 hover:shadow-[0_0_18px_rgba(0,245,255,0.35)]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Booking</span>
        </button>
      </div>
    </header>
  );
}
