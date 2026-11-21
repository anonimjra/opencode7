'use client';

import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

export type ToastSeverity = 'info' | 'success' | 'warning' | 'critical';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  severity: ToastSeverity;
  durationMs: number;
}

interface ToastStore {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, 'id' | 'durationMs'> & { durationMs?: number }) => string;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const durationMs = toast.durationMs ?? 5000;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id, durationMs }],
    }));
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));

export function pushToast(
  title: string,
  message?: string,
  severity: ToastSeverity = 'info',
): void {
  useToastStore.getState().push({ title, message, severity });
}

const SEVERITY_STYLES: Record<
  ToastSeverity,
  { border: string; glow: string; icon: React.ReactNode; text: string }
> = {
  info: {
    border: 'border-[#00F5FF]',
    glow: 'glow-cyan',
    icon: <Info className="h-4 w-4 text-[#00F5FF]" />,
    text: 'text-[#00F5FF]',
  },
  success: {
    border: 'border-[#10B981]',
    glow: 'glow-emerald',
    icon: <CheckCircle2 className="h-4 w-4 text-[#10B981]" />,
    text: 'text-[#10B981]',
  },
  warning: {
    border: 'border-[#F59E0B]',
    glow: 'glow-amber',
    icon: <AlertTriangle className="h-4 w-4 text-[#F59E0B]" />,
    text: 'text-[#F59E0B]',
  },
  critical: {
    border: 'border-[#EF4444]',
    glow: 'glow-crimson',
    icon: <XCircle className="h-4 w-4 text-[#EF4444]" />,
    text: 'text-[#EF4444]',
  },
};

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const style = SEVERITY_STYLES[toast.severity];

  useEffect(() => {
    timerRef.current = setTimeout(() => dismiss(toast.id), toast.durationMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, toast.durationMs, dismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      className={`pointer-events-auto w-[340px] rounded-lg border bg-[#0D111A]/95 p-3 backdrop-blur-md ${style.border} ${style.glow}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">{style.icon}</div>
        <div className="min-w-0 flex-1">
          <p className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${style.text}`}>
            {toast.severity}
          </p>
          <p className="mt-0.5 text-sm font-medium text-[#F1F5F9]">{toast.title}</p>
          {toast.message ? (
            <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => dismiss(toast.id)}
          className="shrink-0 rounded p-1 text-[#94A3B8] transition hover:bg-[#161F30] hover:text-[#F1F5F9]"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: toast.durationMs / 1000, ease: 'linear' }}
        className={`mt-2 h-0.5 origin-left rounded-full ${style.text.replace('text-', 'bg-')}`}
      />
    </motion.div>
  );
}

export function ToastViewport() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] flex flex-col gap-2.5">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
