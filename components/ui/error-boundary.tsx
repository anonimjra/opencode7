'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Radar, RotateCcw, TriangleAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (typeof console !== 'undefined') {
      console.error('[Aether OS ErrorBoundary]', error, info.componentStack);
    }
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#EF4444]/50 bg-[#EF4444]/10">
            <Radar className="absolute h-20 w-20 text-[#EF4444]/30 radar-sweep" />
            <TriangleAlert className="h-10 w-10 text-[#EF4444]" />
          </div>
          <div className="max-w-md text-center">
            <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-[#EF4444] text-glow-crimson">
              System Fault Detected
            </h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              A subsystem telemetry fault was intercepted. The control tower remains online.
            </p>
            {this.state.message ? (
              <p className="mt-2 rounded border border-[#1E2C42] bg-[#0D111A] px-3 py-1.5 font-mono text-[10px] text-[#EF4444]">
                {this.state.message}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 rounded-md border border-[#00F5FF]/40 bg-[#00F5FF]/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#00F5FF] hover:bg-[#00F5FF]/20"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restore Subsystem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
