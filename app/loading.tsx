import { Radar } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-10">
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-[#00F5FF]/30 bg-[#00F5FF]/5">
        <div className="absolute inset-3 rounded-full border border-[#00F5FF]/20" />
        <div className="absolute inset-8 rounded-full border border-[#00F5FF]/10" />
        <Radar className="absolute h-28 w-28 text-[#00F5FF]/40 radar-sweep" />
        <Radar className="h-8 w-8 text-[#00F5FF] text-glow-cyan" />
      </div>
      <div className="w-64">
        <p className="mb-1.5 text-center font-mono text-[11px] uppercase tracking-[0.2em] text-[#00F5FF]">
          Acquiring Telemetry…
        </p>
        <div className="shimmer h-1.5 overflow-hidden rounded-full bg-[#161F30]">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#00F5FF] to-[#10B981]" />
        </div>
        <p className="mt-1.5 text-center font-mono text-[9px] text-[#94A3B8]">
          Synchronising global fleet uplink
        </p>
      </div>
    </div>
  );
}
