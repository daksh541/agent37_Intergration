import React, { useState } from 'react';
import { SupplierQuote } from '../types';
import { ShieldCheck, ArrowRight, ChevronDown, ChevronUp, Clock, CheckCircle } from 'lucide-react';

interface QuoteComparisonProps {
  primaryQuote?: SupplierQuote;
  fallbackQuote?: SupplierQuote;
  allQuotes: SupplierQuote[];
  onSelectPrimary: (quote: SupplierQuote) => void;
  onAdvanceToApproval: () => void;
}

export const QuoteComparison: React.FC<QuoteComparisonProps> = ({
  primaryQuote,
  fallbackQuote,
  allQuotes,
  onSelectPrimary,
  onAdvanceToApproval
}) => {
  const [showFullMatrix, setShowFullMatrix] = useState(false);

  if (!primaryQuote) return null;

  const primaryCostFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(primaryQuote.landedCost);

  const fallbackCostFormatted = fallbackQuote
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(fallbackQuote.landedCost)
    : '$22,100';

  return (
    <section
      id="stage-comparison"
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
              02 / 05
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
              02 · Sourcing
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
              One answer.<br />One fallback.
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
              You don't read nine quotes. You get one recommendation: the source that
              meets your date at the best landed cost. The runner-up stays quoted and
              live in reserve, at no cost to you. Remember that reserve. It matters in
              a minute.
            </p>

            <div style={{ marginTop: 28 }}>
              <button
                onClick={onAdvanceToApproval}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '13.5px' }}
              >
                Proceed to 1-Line Approval →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Waybill "One answer. One fallback." Cards (Screenshot 1) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Card 1: The Primary Source (Recommended) */}
          <div
            className="wb-card"
            style={{
              padding: '24px 26px',
              border: '1.5px solid #24AB5C',
              background: '#FFFFFF',
              boxShadow: '0 12px 36px rgba(36, 171, 92, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span
                style={{
                  background: '#24AB5C',
                  color: '#FFFFFF',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '3px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase'
                }}
              >
                RECOMMENDED
              </span>

              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  color: '#24AB5C',
                  fontWeight: 600
                }}
              >
                Score: {primaryQuote.score}/100
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3
                  style={{
                    fontFamily: "'Funnel Display', sans-serif",
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    marginBottom: 6
                  }}
                >
                  The primary source
                </h3>
                <div style={{ fontSize: '13px', color: 'var(--mut)', marginBottom: 14 }}>
                  {primaryQuote.supplier} · {primaryQuote.manufacturerPartNumber}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>
                  {primaryCostFormatted}
                </span>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  All-in landed
                </span>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
              <span className="pill-authorized">
                <CheckCircle size={11} style={{ marginRight: 4 }} />
                authorized
              </span>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10.5px',
                  color: 'var(--mut)',
                  background: 'var(--tint)',
                  border: '1px solid var(--cardline)',
                  borderRadius: 999,
                  padding: '2px 9px'
                }}
              >
                <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
                meets your date ({primaryQuote.leadTimeWeeks} wks)
              </span>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10.5px',
                  color: '#24AB5C',
                  background: 'rgba(36,171,92,0.08)',
                  border: '1px solid rgba(36,171,92,0.3)',
                  borderRadius: 999,
                  padding: '2px 9px'
                }}
              >
                best landed cost
              </span>
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: '1px solid var(--cardline)',
                paddingTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--mut)',
                fontFamily: "'Roboto Mono', monospace"
              }}
            >
              <span>One payment · parts, freight, duties, delivery</span>
              <span style={{ color: '#24AB5C', fontWeight: 600 }}>ready</span>
            </div>
          </div>

          {/* Card 2: The Fallback Source (Held in reserve) */}
          <div
            className="wb-card"
            style={{
              padding: '18px 24px',
              background: 'var(--tint)',
              border: '1px dashed var(--cardline)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4
                  style={{
                    fontFamily: "'Funnel Display', sans-serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: 4
                  }}
                >
                  The fallback source
                </h4>
                <div style={{ fontSize: '12.5px', color: 'var(--mut)' }}>
                  {fallbackQuote?.supplier || 'Mouser'} · {fallbackCostFormatted} landed
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '11px',
                    color: 'var(--dim)'
                  }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                  held in reserve · live
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Full Top 3 Comparison Matrix */}
          <div>
            <button
              onClick={() => setShowFullMatrix(!showFullMatrix)}
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1px solid var(--cardline)',
                borderRadius: 10,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                color: 'var(--mut)',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              <span>{showFullMatrix ? 'Hide' : 'Inspect'} Top 3 Supplier Comparison Matrix</span>
              {showFullMatrix ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Expandable Top 3 Table (Screenshot 4 Phase 2) */}
            {showFullMatrix && (
              <div
                className="wb-card"
                style={{
                  marginTop: 10,
                  overflow: 'hidden',
                  background: '#FFFFFF'
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                    gap: 10,
                    padding: '10px 18px',
                    borderBottom: '1px solid var(--cardline)',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--dim)',
                    background: 'var(--tint)'
                  }}
                >
                  <span>Supplier</span>
                  <span>Landed Cost</span>
                  <span>Lead Time</span>
                  <span>Stock / MOQ</span>
                  <span>Action</span>
                </div>

                {allQuotes.map((q) => {
                  const isPrimary = q.id === primaryQuote.id;
                  const isFallback = q.id === fallbackQuote?.id;

                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
                        gap: 10,
                        padding: '12px 18px',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(7, 18, 43, 0.05)',
                        background: isPrimary ? 'rgba(36, 171, 92, 0.04)' : '#FFFFFF'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                          {q.supplier}
                        </div>
                        <span className={q.distributorType === 'authorized' ? 'pill-authorized' : 'pill-franchised'}>
                          {q.distributorType}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)' }}>
                          ${q.landedCost.toLocaleString()}
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                          ${q.unitPrice.toFixed(2)} / unit
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '12.5px', color: 'var(--mut)' }}>
                          {q.leadTimeWeeks} weeks
                        </span>
                        <div style={{ fontSize: '10px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
                          On-time guarantee
                        </div>
                      </div>

                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
                          {q.stockAvailable.toLocaleString()} pcs
                        </span>
                        <div style={{ fontSize: '10px', color: 'var(--dim)' }}>
                          MOQ: {q.moq}
                        </div>
                      </div>

                      <div>
                        {isPrimary ? (
                          <span
                            style={{
                              fontFamily: "'Roboto Mono', monospace",
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: '#24AB5C'
                            }}
                          >
                            PRIMARY
                          </span>
                        ) : isFallback ? (
                          <span
                            style={{
                              fontFamily: "'Roboto Mono', monospace",
                              fontSize: '10.5px',
                              color: '#F59E0B'
                            }}
                          >
                            FALLBACK
                          </span>
                        ) : (
                          <button
                            onClick={() => onSelectPrimary(q)}
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--cardline)',
                              borderRadius: 6,
                              padding: '3px 8px',
                              fontSize: '10.5px',
                              fontFamily: "'Roboto Mono', monospace",
                              cursor: 'pointer'
                            }}
                          >
                            Set Primary
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
