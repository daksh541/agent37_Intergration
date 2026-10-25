import React, { useState } from 'react';
import { Search, DollarSign, TrendingDown, PieChart } from 'lucide-react';

export const SpendIntelligence: React.FC = () => {
  const [query, setQuery] = useState('what has this project cost this quarter');

  return (
    <section
      id="stage-spend"
      className="stage-dotted-bg"
      style={{
        padding: '70px 24px 90px',
        borderTop: '1px solid rgba(7, 18, 43, 0.08)'
      }}
    >
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div className="wb-card" style={{ padding: '32px 36px', background: '#FFFFFF' }}>
          {/* Header */}
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
              SPEND · ASK ANYTHING
            </span>

            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: 'var(--dim)'
              }}
            >
              by project · line · quarter
            </span>
          </div>

          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--tint)',
              border: '1px solid var(--cardline)',
              borderRadius: 12,
              padding: '12px 18px',
              marginBottom: 24
            }}
          >
            <Search size={16} color="var(--dim)" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14.5px',
                color: 'var(--ink)'
              }}
            />
          </div>

          {/* Quick preset suggestions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 26, flexWrap: 'wrap' }}>
            {[
              'what has this project cost this quarter',
              'show savings negotiated down from DigiKey',
              'breakdown by freight & customs'
            ].map((p) => (
              <button
                key={p}
                onClick={() => setQuery(p)}
                style={{
                  background: query === p ? 'rgba(48,158,254,0.08)' : '#FFFFFF',
                  border: query === p ? '1px solid #309EFE' : '1px solid var(--cardline)',
                  color: query === p ? '#309EFE' : 'var(--mut)',
                  borderRadius: 999,
                  padding: '4px 12px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10.5px',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Answer Card */}
          <div
            style={{
              background: 'var(--tint)',
              border: '1px solid var(--cardline)',
              borderRadius: 14,
              padding: '24px 28px',
              display: 'grid',
              gridTemplateColumns: 'minmax(200px, 260px) 1fr',
              gap: 28,
              alignItems: 'center'
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  color: 'var(--dim)',
                  display: 'block',
                  marginBottom: 6
                }}
              >
                this quarter · Project Falcon
              </span>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '44px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  lineHeight: 1
                }}
              >
                $48,250
              </div>
              <div style={{ fontSize: '12.5px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingDown size={14} />
                <span>$3,420 negotiated down</span>
              </div>
            </div>

            {/* Categorical Breakdown Bars (Screenshot 11) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--mut)', marginBottom: 4 }}>
                  <span>parts</span>
                  <span>$39,565 (82%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: '#07122B', borderRadius: 99 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--mut)', marginBottom: 4 }}>
                  <span>freight</span>
                  <span>$4,342 (9%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '22%', height: '100%', background: '#309EFE', borderRadius: 99 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--mut)', marginBottom: 4 }}>
                  <span>duties & fees</span>
                  <span>$4,343 (9%)</span>
                </div>
                <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ width: '18%', height: '100%', background: 'var(--dim)', borderRadius: 99 }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
