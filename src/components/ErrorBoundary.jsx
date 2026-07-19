import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("StadiumPulse ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-panel p-8 rounded-2xl max-w-md border border-error/40 shadow-2xl">
            <span className="material-symbols-outlined text-error text-[48px] mb-3">warning</span>
            <h2 className="font-headline-md text-xl text-on-surface font-bold mb-2">System Telemetry Reconnecting</h2>
            <p className="text-xs text-on-surface-variant mb-6">
              A temporary telemetry synchronization anomaly occurred. The system self-healing protocol has been initiated.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-container text-on-primary-container font-label-bold px-4 py-2 rounded-lg hover:bg-primary transition-all glow-accent text-xs"
            >
              Reload Operational View
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
