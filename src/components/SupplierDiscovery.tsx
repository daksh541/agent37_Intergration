import React from 'react';
import { SupplierQuote } from '../types';
import { ShieldCheck, Check, Radio } from 'lucide-react';

interface SupplierDiscoveryProps {
  quotes: SupplierQuote[];
  onAdvanceToComparison: () => void;
  status: string;
}

export const SupplierDiscovery: React.FC<SupplierDiscoveryProps> = ({
  quotes,
  onAdvanceToComparison
}) => {
  return (
    <section
      id="stage-sourcing"
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
                background: '#309EFE',
                boxShadow: '0 0 10px rgba(48, 158, 254, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 200,
                background: 'linear-gradient(to bottom, #309EFE, rgba(7, 18, 43, 0.12))',
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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
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
              Every licensed source, found and worked.
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
              Docket maps every source licensed to sell your part, anywhere in the world:
              authorized distributors (DigiKey, Mouser, Arrow), franchised lines, and vetted
              brokers. Then it sends RFQs to all of them at once. What takes a team
              four days of email happens here in minutes.
            </p>

            <div style={{ marginTop: 28 }}>
              <button
                onClick={onAdvanceToComparison}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '13px' }}
              >
                Compare Top 3 Quotes →
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sourcing Card (Screenshot 4) */}
        <div className="wb-card">
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid var(--cardline)',
              background: '#FFFFFF'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              <Radio size={14} color="#309EFE" className="dot-pulse" />
              docket · sourcing
            </span>

            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 500,
                color: '#309EFE',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} />
              RFQs out · replies coming in
            </span>
          </div>

          {/* Sub-header badges */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '12px 20px',
              borderBottom: '1px solid var(--cardline)',
              background: 'var(--tint)',
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid var(--cardline)',
                background: '#FFFFFF',
                borderRadius: 999,
                padding: '4px 11px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: 'var(--mut)'
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#24AB5C' }} />
              every licensed source
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid var(--cardline)',
                background: '#FFFFFF',
                borderRadius: 999,
                padding: '4px 11px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: 'var(--mut)'
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#24AB5C' }} />
              within your constraints
            </span>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid rgba(48,158,254,0.3)',
                background: 'rgba(48,158,254,0.08)',
                borderRadius: 999,
                padding: '4px 11px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: '#309EFE'
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
              worked at once
            </span>
          </div>

          {/* Supplier Rows */}
          <div style={{ padding: '8px 0', background: '#FFFFFF' }}>
            {quotes.map((q, idx) => (
              <div
                key={q.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 20px',
                  borderBottom: idx < quotes.length - 1 ? '1px solid rgba(7,18,43,0.04)' : 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--ink)' }}>
                    {q.supplier}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                    {q.supplierPartNumber}
                  </span>
                </div>

                {/* Distributor Type Pill */}
                <span className={q.distributorType === 'authorized' ? 'pill-authorized' : 'pill-franchised'}>
                  {q.distributorType}
                </span>

                {/* Compliance Badge */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '10.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    color: '#24AB5C'
                  }}
                  title="RoHS & REACH Compliant"
                >
                  <ShieldCheck size={13} />
                  RoHS
                </span>

                {/* Status */}
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '11px',
                    color: 'var(--dim)',
                    minWidth: 85,
                    textAlign: 'right'
                  }}
                >
                  RFQ confirmed
                </span>
              </div>
            ))}

            {/* Simulated Extended qualified suppliers */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 20px',
                borderTop: '1px dashed var(--cardline)',
                background: 'var(--tint)'
              }}
            >
              <span style={{ flex: 1, fontSize: '13px', color: 'var(--mut)', fontStyle: 'italic' }}>
                …and 8 other vetted distributor lines
              </span>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', color: 'var(--dim)' }}>
                mapped · worked
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
