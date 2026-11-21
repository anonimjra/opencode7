'use client';

import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface CyberTooltipProps extends TooltipProps<ValueType, NameType> {
  labelPrefix?: string;
  valueFormatter?: (value: ValueType, name: NameType) => string;
}

export function CyberTooltip({
  active,
  payload,
  label,
  labelPrefix = '',
  valueFormatter,
}: CyberTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-[#00F5FF]/40 bg-[#0D111A]/95 px-3 py-2 shadow-xl backdrop-blur-md">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
        {labelPrefix}
        {String(label ?? '')}
      </p>
      <div className="space-y-1">
        {payload.map((entry) => {
          const itemKey = `${String(entry.dataKey)}-${String(entry.name)}`;
          const formatted =
            valueFormatter && entry.value !== undefined
              ? valueFormatter(entry.value, entry.name as NameType)
              : String(entry.value ?? '');
          return (
            <div key={itemKey} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#94A3B8]">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color ?? '#00F5FF' }}
                />
                {String(entry.name ?? '')}
              </span>
              <span className="font-mono text-[#F1F5F9]">{formatted}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
