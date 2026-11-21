import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aether OS — Autonomous Supply Chain Control Tower',
  description:
    'Global autonomous supply chain, maritime telematics and port yard control tower.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
