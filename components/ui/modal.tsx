'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  accent?: 'cyan' | 'emerald' | 'amber' | 'crimson' | 'violet';
}

const SIZE_MAP: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

const ACCENT_MAP: Record<NonNullable<ModalProps['accent']>, string> = {
  cyan: 'text-[#00F5FF] border-[#00F5FF]/40',
  emerald: 'text-[#10B981] border-[#10B981]/40',
  amber: 'text-[#F59E0B] border-[#F59E0B]/40',
  crimson: 'text-[#EF4444] border-[#EF4444]/40',
  violet: 'text-[#8B5CF6] border-[#8B5CF6]/40',
};

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  accent = 'cyan',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-[#07090E]/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className={`relative z-10 flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl border bg-[#0D111A] shadow-2xl ${ACCENT_MAP[accent]} ${SIZE_MAP[size]}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[#1E2C42] bg-[#161F30]/70 px-5 py-4">
              <div className="flex items-center gap-3">
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
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
            {footer ? (
              <div className="border-t border-[#1E2C42] bg-[#161F30]/50 px-5 py-3">{footer}</div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
