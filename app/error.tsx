'use client';

import { useEffect } from 'react';
import { Radar, RotateCcw, TriangleAlert } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== 'undefined') {
      console.error('[Aether OS RouteError]', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-10">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#EF4444]/40 bg-[#EF4444]/10">
        <Radar className="absolute h-24 w-24 text-[#EF4444]/30 radar-sweep" />
        <TriangleAlert className="h-10 w-10 text-[#EF4444]" />
      </div>
      <div className="max-w-md text-center">
        <h1 className="font-mono text-base uppercase tracking-[0.2em] text-[#EF4444] text-glow-crimson">
          Telemetry Fault
        </h1>
        <p className="mt-1 text-xs text-[#94A3B8]">
          An unexpected fault occurred in this module. The control tower core is unaffected.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="flex items-center gap-2 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#00F5FF] hover:bg-[#00F5FF]/20"
      >
        <RotateCcw className="h-3.5 w-3.5" /> Reinitialise Module
      </button>
    </div>
  );
}
