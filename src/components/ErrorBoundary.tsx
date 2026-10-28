import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Docket ErrorBoundary caught an exception:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F8FAFC',
            fontFamily: 'Inter, -apple-system, sans-serif',
            padding: 24,
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              maxWidth: 540,
              width: '100%',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              padding: '32px 28px',
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: '#FEF2F2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto'
              }}
            >
              <AlertTriangle size={26} />
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 8px 0'
              }}
            >
              Docket Workstation Notice
            </h2>

            <p
              style={{
                fontSize: 14,
                color: '#64748B',
                lineHeight: 1.5,
                margin: '0 0 20px 0'
              }}
            >
              A cached script or runtime event interrupted the view. Click below to refresh your session with the latest update.
            </p>

            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  background: '#F1F5F9',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#334155',
                  overflowX: 'auto',
                  marginBottom: 20,
                  whiteSpace: 'pre-wrap'
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: '#0F172A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <RefreshCw size={16} />
              Reload Workstation
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
