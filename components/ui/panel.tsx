'use client';

interface PanelProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}

export function Panel({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
  bodyClassName = '',
  noPadding = false,
}: PanelProps) {
  return (
    <section
      className={`flex flex-col overflow-hidden rounded-xl border border-[#1E2C42] bg-[#0D111A]/92 backdrop-blur-sm ${className}`}
    >
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-[#1E2C42] bg-[#161F30]/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {icon ? <span className="text-[#00F5FF]">{icon}</span> : null}
            <div>
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F1F5F9]">
                {title}
              </h2>
              {subtitle ? (
                <p className="text-[10px] uppercase tracking-wide text-[#94A3B8]">{subtitle}</p>
              ) : null}
            </div>
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={`flex-1 ${noPadding ? '' : 'p-4'} ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[#94A3B8]">
      {children}
    </p>
  );
}
