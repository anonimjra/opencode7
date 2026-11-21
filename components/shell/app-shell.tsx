'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { StatusTicker } from './status-ticker';
import { CommandPalette } from './command-palette';
import { ToastViewport } from '@/components/ui/toast-system';
import { GlobalBookingWizard } from '@/components/shipments/global-booking-wizard';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#07090E]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <Header />
        <main className="relative flex-1 overflow-y-auto px-4 py-4 lg:px-6">
          <div className="mx-auto w-full max-w-[1680px]">{children}</div>
        </main>
        <StatusTicker />
      </div>
      <CommandPalette />
      <GlobalBookingWizard />
      <ToastViewport />
    </div>
  );
}
