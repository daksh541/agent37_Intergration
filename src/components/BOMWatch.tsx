import React, { useState } from 'react';
import { BOM_WATCH_ALERTS } from '../data/catalog';
import { BOMWatchAlert } from '../types';
import { Activity, ShieldCheck, ChevronRight } from 'lucide-react';

export const BOMWatch: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<BOMWatchAlert | null>(null);

  return (
    <section
      id="stage-bomwatch"
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
            Intelligence · From here
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
            Your BOM, watched<br />around the clock.
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--mut)',
              maxWidth: '42ch',
              marginBottom: 20
            }}
          >
            Hand Docket your BOM and it watches every line around the clock:
            prices moving, parts approaching end-of-life, stock running thin at
            distributors. When something changes, Docket suggests the move
            early: renegotiate, switch to a vetted alternate, restock, before the
            problem ever reaches your build.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#309EFE', fontFamily: "'Roboto Mono', monospace", fontSize: '12px' }}>
            <Activity size={16} />
            <span>Autonomous price & obsolescence telemetry</span>
          </div>
        </div>

        {/* Right Column: BOM Watch Card (Screenshot 13) */}
        <div className="wb-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--dim)',
                textTransform: 'uppercase'
              }}
            >
              BOM WATCH
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: '#309EFE',
                fontWeight: 500
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
              always on
            </span>
          </div>

          {/* Alert rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BOM_WATCH_ALERTS.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;

              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(isSelected ? null : alert)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: '1px solid var(--cardline)',
                    background: isSelected ? 'rgba(48,158,254,0.06)' : 'var(--tint)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background:
                          alert.type === 'price_drop'
                            ? '#24AB5C'
                            : alert.type === 'eol_risk'
                            ? '#309EFE'
                            : alert.type === 'stock_thinning'
                            ? '#309EFE'
                            : 'var(--dim)'
                      }}
                    />
                    <span style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--ink)' }}>
                      {alert.title}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: '11px',
                      color:
                        alert.actionType === 'renegotiate'
                          ? '#24AB5C'
                          : alert.actionType === 'alternates_found'
                          ? '#309EFE'
                          : alert.actionType === 'restock_suggested'
                          ? '#0284C7'
                          : 'var(--dim)',
                      background: '#FFFFFF',
                      border: '1px solid var(--cardline)',
                      borderRadius: 999,
                      padding: '3px 12px'
                    }}
                  >
                    {alert.actionText}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Expanded Alert Detail */}
          {selectedAlert && (
            <div
              style={{
                marginTop: 16,
                padding: '14px 16px',
                background: 'rgba(48, 158, 254, 0.05)',
                border: '1px solid rgba(48, 158, 254, 0.25)',
                borderRadius: 10,
                fontSize: '12.5px',
                color: 'var(--ink)',
                lineHeight: 1.5,
                animation: 'fadeIn 0.2s ease'
              }}
            >
              <div style={{ fontWeight: 600, color: '#309EFE', marginBottom: 4, fontFamily: "'Roboto Mono', monospace" }}>
                Docket Proactive Countermeasure:
              </div>
              {selectedAlert.detail}
            </div>
          )}

          {/* Footer note */}
          <div
            style={{
              marginTop: 18,
              paddingTop: 14,
              borderTop: '1px solid var(--cardline)',
              textAlign: 'center',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              color: 'var(--dim)'
            }}
          >
            checked around the clock · acted on before it bites
          </div>
        </div>
      </div>
    </section>
  );
};
