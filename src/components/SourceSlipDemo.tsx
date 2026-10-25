import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export const SourceSlipDemo: React.FC = () => {
  const [hasSlipped, setHasSlipped] = useState(false);

  return (
    <section
      id="stage-sourceslip"
      className="stage-dotted-bg"
      style={{
        padding: '90px 24px 100px',
        borderTop: '1px solid rgba(7, 18, 43, 0.08)'
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 460px) minmax(360px, 680px)',
          gap: 60,
          alignItems: 'center'
        }}
      >
        {/* Left Column: Story */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 6
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: '#24AB5C',
                boxShadow: '0 0 10px rgba(36, 171, 92, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 200,
                background: 'linear-gradient(to bottom, #24AB5C, rgba(7, 18, 43, 0.12))',
                margin: '6px 0'
              }}
            />
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: 'var(--dim)',
                whiteSpace: 'nowrap'
              }}
            >
              03b / 05
            </span>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dim)',
                marginBottom: 14
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} />
              Resilience
            </div>

            <h2
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontSize: 'clamp(32px, 3.2vw, 46px)',
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: '-0.018em',
                color: 'var(--ink)',
                marginBottom: 16
              }}
            >
              A source slips.<br />Your date doesn't.
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                lineHeight: 1.65,
                color: 'var(--mut)',
                maxWidth: '42ch'
              }}
            >
              If the primary source, for whatever reason, can't fulfil your order,
              the fallback you saw in sourcing activates: still quoted, still live,
              inside the payment you already approved. Collection reroutes, custody
              stays unbroken, and your date holds. You learn it happened from a note,
              not a fire.
            </p>

            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => setHasSlipped(!hasSlipped)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: hasSlipped ? 'rgba(36, 171, 92, 0.1)' : 'var(--tint)',
                  border: `1px solid ${hasSlipped ? '#24AB5C' : 'var(--cardline)'}`,
                  color: hasSlipped ? '#24AB5C' : 'var(--ink)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.18s ease'
                }}
              >
                <RefreshCw size={13} className={hasSlipped ? 'dot-pulse' : ''} />
                {hasSlipped ? 'Reset Simulation' : 'Simulate Primary Supplier Slip'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Source Slip Cards (Screenshot 5) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Primary Source Card */}
          <div
            className="wb-card"
            style={{
              padding: '22px 26px',
              background: hasSlipped ? 'rgba(239, 68, 68, 0.03)' : '#FFFFFF',
              border: hasSlipped ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid var(--cardline)',
              opacity: hasSlipped ? 0.8 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--dim)',
                  textTransform: 'uppercase'
                }}
              >
                THE PRIMARY SOURCE
              </span>

              {hasSlipped ? (
                <span
                  style={{
                    background: 'rgba(48, 158, 254, 0.12)',
                    color: '#0284C7',
                    border: '1px solid rgba(48, 158, 254, 0.4)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600
                  }}
                >
                  Missed dispatch
                </span>
              ) : (
                <span className="pill-authorized">Active Allocation</span>
              )}
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.5 }}>
              {hasSlipped
                ? 'Allocation falls through, hours before pickup. This is where a schedule usually dies.'
                : 'DigiKey primary reel allocation scheduled for morning dispatch.'}
            </p>
          </div>

          {/* Center Connector Badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: '#FFFFFF',
                border: '1px solid #24AB5C',
                borderRadius: 999,
                padding: '5px 14px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: '#24AB5C',
                boxShadow: '0 2px 8px rgba(36, 171, 92, 0.15)'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} />
              Need-by · holds
            </span>
          </div>

          {/* Fallback Source Card */}
          <div
            className="wb-card"
            style={{
              padding: '22px 26px',
              background: hasSlipped ? 'rgba(36, 171, 92, 0.05)' : 'var(--tint)',
              border: hasSlipped ? '1.5px solid #24AB5C' : '1px dashed var(--cardline)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--dim)',
                  textTransform: 'uppercase'
                }}
              >
                THE FALLBACK SOURCE
              </span>

              {hasSlipped ? (
                <span
                  style={{
                    background: '#24AB5C',
                    color: '#FFFFFF',
                    borderRadius: 999,
                    padding: '3px 12px',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 700
                  }}
                >
                  Activated · shipping tonight
                </span>
              ) : (
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    color: 'var(--dim)'
                  }}
                >
                  Quoted & held in reserve
                </span>
              )}
            </div>

            <p style={{ fontSize: '13.5px', color: 'var(--mut)', lineHeight: 1.5 }}>
              Quoted since day one. Collection reroutes, custody stays unbroken, inside
              the payment you already approved.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
