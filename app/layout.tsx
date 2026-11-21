import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppShell } from '@/components/shell/app-shell';

export const metadata: Metadata = {
  title: 'Aether OS — Autonomous Supply Chain Control Tower',
  description:
    'Aether OS is an enterprise-grade global logistics control tower: maritime telematics, 2D port yard slotting, IoT cold-chain monitoring, Incoterms & customs finance, and disruption war-room simulations.',
  applicationName: 'Aether OS',
  authors: [{ name: 'Aether Global Maritime Line' }],
  keywords: [
    'supply chain',
    'maritime telematics',
    'port yard',
    'cold chain',
    'incoterms',
    'customs',
    'logistics control tower',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07090E',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
