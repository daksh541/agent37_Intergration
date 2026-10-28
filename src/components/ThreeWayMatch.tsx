import React, { useState } from 'react';
import { Check, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface ThreeWayMatchProps {
  onReconciled: () => void;
  status: string;
}

export const ThreeWayMatch: React.FC<ThreeWayMatchProps> = ({
  onReconciled,
  status
}) => {
  const [hasDiscrepancy, setHasDiscrepancy] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const handleResolve = () => {
    setIsResolved(true);
    setHasDiscrepancy(false);
    onReconciled();
  };

  return (
    <section
      id="stage-reconciliation"
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
              04b / 05
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
              Audit & Finance
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
              Zero-variance<br />invoice matching.
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
              The supplier's invoice, your approved payment, and the receiving dock record
              match three ways. If a supplier accidentally overbills freight or omits a line,
              Docket catches it instantly and claims the credit note before finance touches it.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setHasDiscrepancy(!hasDiscrepancy)}
                style={{
                  background: hasDiscrepancy ? 'rgba(239, 68, 68, 0.08)' : 'var(--tint)',
                  border: `1px solid ${hasDiscrepancy ? '#EF4444' : 'var(--cardline)'}`,
                  color: hasDiscrepancy ? '#EF4444' : 'var(--mut)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {hasDiscrepancy ? 'Simulate Clean Match' : 'Simulate $180 Invoice Discrepancy'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Three-Way Match Card (Screenshot 11) */}
        <div className="wb-card" style={{ padding: '28px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
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
              THREE-WAY MATCH
            </span>

            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: hasDiscrepancy ? '#EF4444' : '#24AB5C',
                fontWeight: 600
              }}
            >
              {hasDiscrepancy ? 'Discrepancy Flagged' : 'matched · filed by itself'}
            </span>
          </div>

          {/* Three Connected Blocks */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '16px 0'
            }}
          >
            {/* Box 1: Invoice */}
            <div
              style={{
                flex: 1,
                background: 'var(--tint)',
                border: `1.5px solid ${hasDiscrepancy ? '#EF4444' : '#24AB5C'}`,
                borderRadius: 12,
                padding: '16px 14px',
                textAlign: 'center'
              }}
            >
              <span style={{ display: 'block', fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 4 }}>
                1. INVOICE
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                {hasDiscrepancy ? '$21,780.00' : '$21,600.00'}
              </span>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', marginTop: 2 }}>
                DigiKey #INV-9902
              </span>
            </div>

            <span style={{ padding: '0 8px', color: 'var(--dim)', fontWeight: 600 }}>—</span>

            {/* Box 2: Payment */}
            <div
              style={{
                flex: 1,
                background: 'var(--tint)',
                border: '1.5px solid #24AB5C',
                borderRadius: 12,
                padding: '16px 14px',
                textAlign: 'center'
              }}
            >
              <span style={{ display: 'block', fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 4 }}>
                2. PAYMENT
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                $21,600.00
              </span>
              <span style={{ display: 'block', fontSize: '10px', color: '#24AB5C', marginTop: 2 }}>
                1-line settled
              </span>
            </div>

            <span style={{ padding: '0 8px', color: 'var(--dim)', fontWeight: 600 }}>—</span>

            {/* Box 3: Goods Receipt */}
            <div
              style={{
                flex: 1,
                background: 'var(--tint)',
                border: '1.5px solid #24AB5C',
                borderRadius: 12,
                padding: '16px 14px',
                textAlign: 'center'
              }}
            >
              <span style={{ display: 'block', fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 4 }}>
                3. DOCK RECEIPT
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)' }}>
                2,500 pcs
              </span>
              <span style={{ display: 'block', fontSize: '10px', color: '#24AB5C', marginTop: 2 }}>
                100% verified
              </span>
            </div>
          </div>

          {/* Discrepancy Alert & Resolution */}
          {hasDiscrepancy && (
            <div
              style={{
                marginTop: 18,
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 10,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'shake 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertTriangle size={18} color="#EF4444" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#EF4444' }}>
                    +$180.00 Freight Variance Detected
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--mut)' }}>
                    Supplier invoice billed expedited surcharge not in approved quote.
                  </div>
                </div>
              </div>

              <button
                onClick={handleResolve}
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 6,
                  padding: '7px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Auto-Claim $180 Credit Note
              </button>
            </div>
          )}

          {/* Reconciliation Footer Note */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid var(--cardline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              fontFamily: "'Roboto Mono', monospace",
              color: 'var(--dim)'
            }}
          >
            <span>No portal. No spreadsheet. The record wrote itself.</span>
            <span style={{ color: '#24AB5C', display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} />
              GL Code: 1410-INV
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
