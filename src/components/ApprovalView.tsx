import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { SupplierQuote } from '../types';
import { Check, ShieldCheck, Sparkles, CreditCard, Lock } from 'lucide-react';

interface ApprovalViewProps {
  quote?: SupplierQuote;
  status: string;
  onApprovePayment: () => void;
  onAdvanceToNext: () => void;
}

export const ApprovalView: React.FC<ApprovalViewProps> = ({
  quote,
  status,
  onApprovePayment,
  onAdvanceToNext
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const isPaid = status === 'paid' || status === 'dock_scanned' || status === 'reconciled' || status === 'closed';

  const amountFormatted = quote
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(quote.landedCost)
    : '$21,600';

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onApprovePayment();

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#309EFE', '#24AB5C', '#FFFFFF', '#B2E6DE']
      });
    }, 600);
  };

  return (
    <section
      id="stage-approve"
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
                background: isPaid ? '#24AB5C' : '#309EFE',
                boxShadow: isPaid ? '0 0 10px rgba(36, 171, 92, 0.5)' : '0 0 10px rgba(48, 158, 254, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 220,
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
              03 / 05
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
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isPaid ? '#24AB5C' : '#309EFE'
                }}
              />
              03 · Approve
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
              You approve.<br />That's the second thing you did.
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
              It's also the last. The price you approve is the whole price: parts,
              freight, duties, clearance, and delivery in one line. AGENT37 takes
              that single payment and settles everyone in the chain itself: the
              source, the carrier, the broker, customs. You never touch another
              invoice on this order.
            </p>

            {isPaid && (
              <div style={{ marginTop: 28 }}>
                <button
                  onClick={onAdvanceToNext}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '13.5px' }}
                >
                  Continue to Dock & Shelf Sync →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Approval Card (Screenshots 2.33.59 AM, 2.35.15 AM, 2.35.29 AM) */}
        <div
          className="wb-card"
          style={{
            padding: '36px 32px',
            background: '#FFFFFF',
            position: 'relative'
          }}
        >
          {/* Top Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              ONE PAYMENT
            </span>

            {/* Stamped PAID badge */}
            {isPaid && (
              <div className="paid-stamp" style={{ animation: 'bounceIn 0.3s ease' }}>
                PAID
              </div>
            )}
          </div>

          {/* Card Headline */}
          <h3
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontSize: '34px',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              marginBottom: 16
            }}
          >
            Everything, in one line.
          </h3>

          {/* Line item tags (Screenshot 2) */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {['parts', 'freight', 'duties', 'clearance', 'delivery'].map((tag) => (
              <span
                key={tag}
                style={{
                  border: '1px solid var(--cardline)',
                  background: 'var(--tint)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11.5px',
                  color: 'var(--mut)',
                  textTransform: 'lowercase'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Big Action Button */}
          {!isPaid ? (
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              style={{
                width: '100%',
                background: '#309EFE',
                color: '#07122B',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                padding: '16px 24px',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 4px 20px rgba(48, 158, 254, 0.45)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#42a7ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#309EFE')}
            >
              <CreditCard size={18} />
              {isProcessing ? 'Settling with DigiKey...' : `Approve payment (${amountFormatted})`}
            </button>
          ) : (
            <div
              style={{
                width: '100%',
                background: '#24AB5C',
                color: '#FFFFFF',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '16px',
                padding: '16px 24px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                boxShadow: '0 4px 18px rgba(36, 171, 92, 0.35)',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <Check size={18} strokeWidth={3} />
              Paid · settled by AGENT37
            </div>
          )}

          {/* Settlement Guarantee Footnote */}
          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: '1px solid var(--cardline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: 'var(--dim)',
              fontFamily: "'Roboto Mono', monospace"
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={13} color="var(--dim)" />
              <span>Escrow held & disbursed upon dock verification</span>
            </div>
            <span style={{ color: '#24AB5C' }}>Single PO Trail #PO-8841</span>
          </div>
        </div>
      </div>
    </section>
  );
};
