import React from 'react';
import { Check, ShieldCheck, Download, ExternalLink } from 'lucide-react';

export const ReceiptClosed: React.FC = () => {
  const checklist = [
    'Mapped every licensed source (DigiKey, Mouser, Arrow)',
    'Worked every quote, negotiated down',
    'Held a fallback, live in reserve',
    'Took one payment, settled the chain',
    'Collected the order into our custody',
    'Absorbed a source slip, date held',
    'Matched invoice, payment, and dock receiving record',
    'Put the parts on your shelf'
  ];

  return (
    <section
      id="stage-receipt"
      className="stage-dotted-bg"
      style={{
        padding: '90px 24px 120px',
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
            09 · The receipt
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
            One order, closed.
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
            That's the whole story. You described what you needed and approved
            one payment: two actions, start to finish. Docket did the eight
            things on the right, absorbed a supplier failure along the way, and
            delivered on the date you named. The full record, every document and
            every decision, is filed to the order and signed.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => window.print()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#FFFFFF',
                border: '1px solid var(--cardline)',
                borderRadius: 8,
                padding: '9px 16px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '12px',
                color: 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              Export Audit Trail (PDF)
            </button>
          </div>
        </div>

        {/* Right Column: Receipt Card (Screenshot 14) */}
        <div className="wb-card" style={{ padding: '32px', background: '#FFFFFF' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--dim)',
                textTransform: 'uppercase'
              }}
            >
              ORDER RECEIPT · #PO-2026-8841
            </span>

            <span
              style={{
                background: 'rgba(36, 171, 92, 0.1)',
                border: '1px solid #24AB5C',
                color: '#24AB5C',
                borderRadius: 6,
                padding: '3px 10px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '10.5px',
                fontWeight: 700
              }}
            >
              closed
            </span>
          </div>

          {/* 4 Key Stat Tiles (Screenshot 14) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              paddingBottom: 24,
              borderBottom: '1px solid var(--cardline)',
              marginBottom: 24
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#24AB5C'
                }}
              >
                On time
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                Need-by · held
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}
              >
                Two
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                Things you did
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}
              >
                One
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                Payment you made
              </div>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '26px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}
              >
                Zero
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                Chases · spreadsheets
              </div>
            </div>
          </div>

          {/* What Docket Handled (Checklist) */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: 'var(--dim)',
                textTransform: 'uppercase',
                marginBottom: 14
              }}
            >
              WHAT DOCKET HANDLED
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12
              }}
            >
              {checklist.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'rgba(36, 171, 92, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 2
                    }}
                  >
                    <Check size={10} color="#24AB5C" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '12.5px', color: 'var(--mut)', lineHeight: 1.4 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signature Footer */}
          <div
            style={{
              paddingTop: 18,
              borderTop: '1px solid var(--cardline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11.5px',
              color: 'var(--dim)'
            }}
          >
            <span>Filed in Orders</span>
            <span style={{ color: '#24AB5C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} />
              signed by Docket
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
