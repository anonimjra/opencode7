import Link from 'next/link';
import { Compass, Radar, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-10">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5">
        <div className="absolute inset-4 rounded-full border border-[#00F5FF]/20" />
        <div className="absolute inset-10 rounded-full border border-[#00F5FF]/10" />
        <Radar className="absolute h-36 w-36 text-[#00F5FF]/25 radar-sweep" />
        <Radio className="h-12 w-12 text-[#00F5FF] text-glow-cyan" />
      </div>

      <div className="text-center">
        <p className="font-mono text-6xl font-bold tracking-widest text-[#EF4444] text-glow-crimson">404</p>
        <h1 className="mt-2 font-mono text-base uppercase tracking-[0.2em] text-[#F1F5F9]">
          Signal Lost — Sector Out of Reach
        </h1>
        <p className="mt-2 font-mono text-[11px] text-[#94A3B8]">
          Target coordinates could not be resolved by any telemetry satellite.
        </p>
        <p className="mt-1 font-mono text-[10px] text-[#1E2C42]">
          LAT 00.0000° · LNG 000.0000° · UPLINK LOST
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center gap-2 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#00F5FF] transition hover:bg-[#00F5FF]/20 hover:shadow-[0_0_18px_rgba(0,245,255,0.35)]"
      >
        <Compass className="h-3.5 w-3.5" /> Return to Mission Control
      </Link>
    </div>
  );
}
