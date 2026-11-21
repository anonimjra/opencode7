'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  accent?: 'cyan' | 'emerald' | 'amber' | 'crimson' | 'violet';
}

const WIDTH_MAP: Record<NonNullable<DrawerProps['width']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
};

const ACCENT_MAP: Record<NonNullable<DrawerProps['accent']>, string> = {
  cyan: 'border-[#00F5FF]/40 text-[#00F5FF]',
  emerald: 'border-[#10B981]/40 text-[#10B981]',
  amber: 'border-[#F59E0B]/40 text-[#F59E0B]',
  crimson: 'border-[#EF4444]/40 text-[#EF4444]',
  violet: 'border-[#8B5CF6]/40 text-[#8B5CF6]',
};

export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  width = 'md',
  accent = 'cyan',
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[110] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#07090E]/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={`relative z-10 flex h-full w-full flex-col overflow-hidden border-l bg-[#0D111A] ${ACCENT_MAP[accent]} ${WIDTH_MAP[width]}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#1E2C42] bg-[#161F30]/70 px-4 py-4">
              <div className="flex items-center gap-2.5">
                {icon ? <div className="shrink-0">{icon}</div> : null}
                <div>
                  <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#F1F5F9]">
                    {title}
                  </h2>
                  {subtitle ? (
                    <p className="mt-0.5 text-xs text-[#94A3B8]">{subtitle}</p>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-[#94A3B8] transition hover:bg-[#0D111A] hover:text-[#F1F5F9]"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
            {footer ? (
              <div className="border-t border-[#1E2C42] bg-[#161F30]/50 px-4 py-3">{footer}</div>
            ) : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
