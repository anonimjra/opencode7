'use client';

export type BadgeTone = 'cyan' | 'emerald' | 'amber' | 'crimson' | 'violet' | 'muted';

interface BadgeProps {
  tone?: BadgeTone;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const TONE_MAP: Record<BadgeTone, string> = {
  cyan: 'bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/40',
  emerald: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/40',
  amber: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/40',
  crimson: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/40',
  violet: 'bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/40',
  muted: 'bg-[#161F30] text-[#94A3B8] border-[#1E2C42]',
};

export function Badge({ tone = 'cyan', pulse = false, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider ${TONE_MAP[tone]} ${pulse ? 'blink-critical' : ''} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone = 'cyan', pulse = true }: { tone?: BadgeTone; pulse?: boolean }) {
  const colorMap: Record<BadgeTone, string> = {
    cyan: 'bg-[#00F5FF]',
    emerald: 'bg-[#10B981]',
    amber: 'bg-[#F59E0B]',
    crimson: 'bg-[#EF4444]',
    violet: 'bg-[#8B5CF6]',
    muted: 'bg-[#94A3B8]',
  };
  return (
    <span className={`inline-block h-1.5 w-1.5 rounded-full ${colorMap[tone]} ${pulse ? 'pulse-dot' : ''}`} />
  );
}
