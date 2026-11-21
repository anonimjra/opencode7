'use client';

import { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#00F5FF]/15 text-[#00F5FF] border border-[#00F5FF]/40 hover:bg-[#00F5FF]/25 hover:shadow-[0_0_18px_rgba(0,245,255,0.35)]',
  success:
    'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/40 hover:bg-[#10B981]/25 hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]',
  danger:
    'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 hover:bg-[#EF4444]/25 hover:shadow-[0_0_18px_rgba(239,68,68,0.35)]',
  warning:
    'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40 hover:bg-[#F59E0B]/25 hover:shadow-[0_0_18px_rgba(245,158,11,0.35)]',
  ghost:
    'bg-transparent text-[#94A3B8] border border-transparent hover:bg-[#161F30] hover:text-[#F1F5F9]',
  outline:
    'bg-transparent text-[#F1F5F9] border border-[#1E2C42] hover:border-[#00F5FF]/50 hover:text-[#00F5FF]',
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-9 w-9 p-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className = '', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md font-mono font-medium uppercase tracking-wide transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
