import React, { useState } from 'react';
import { ShieldCheck, FileCheck, Check, ArrowRight } from 'lucide-react';

interface CustomsProps {
  partName?: string;
  htsCode?: string;
  dutyRate?: string;
  goodsValue?: string;
}

export const CustomsBillOfEntry: React.FC<CustomsProps> = ({
  partName = 'Custom Drone Wings 450mm Carbon Fiber',
  htsCode = '8807.30.0090',
  dutyRate = '2.7% ($583.20) · Covered by payment',
  goodsValue = '$21,600.00'
}) => {
  const [isFiled, setIsFiled] = useState(false);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(220px, 0.9fr)', gap: 18, alignItems: 'flex-start' }}>
      {/* Bill of Entry Draft Table (Screenshot 7) */}
      <div className="wb-card" style={{ padding: '24px 26px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--dim)'
            }}
          >
            <FileCheck size={14} color="#309EFE" />
            BILL OF ENTRY · DRAFT
          </span>

          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--dim)' }}>
            licensed broker
          </span>
        </div>

        {/* Table Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(7, 18, 43, 0.05)', paddingBottom: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Importer
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
              Your company (Verified EOR)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(7, 18, 43, 0.05)', paddingBottom: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Goods
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)', maxWidth: '28ch', textAlign: 'right' }}>
              {partName}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(7, 18, 43, 0.05)', paddingBottom: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Value
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
              {goodsValue} · nothing new to pay
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(7, 18, 43, 0.05)', paddingBottom: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Classification
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#309EFE', fontFamily: "'Roboto Mono', monospace" }}>
              HTS {htsCode} (Verified)
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(7, 18, 43, 0.05)', paddingBottom: 8 }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Duty
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--mut)' }}>
              {dutyRate}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              Filed by
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
              Licensed customs broker (Expedited Air Hub)
            </span>
          </div>
        </div>

        {/* Document Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {['commercial invoice ✓', 'packing list ✓', 'certificate of origin ✓', 'airway bill ✓'].map((doc) => (
            <span
              key={doc}
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '10.5px',
                color: '#24AB5C',
                background: 'rgba(36, 171, 92, 0.08)',
                border: '1px solid rgba(36, 171, 92, 0.3)',
                borderRadius: 6,
                padding: '3px 8px'
              }}
            >
              {doc}
            </span>
          ))}
        </div>

        {/* File the Entry Button */}
        {!isFiled ? (
          <button
            onClick={() => setIsFiled(true)}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', fontSize: '13.5px' }}
          >
            File the entry with Customs
          </button>
        ) : (
          <div
            style={{
              background: '#24AB5C',
              color: '#FFFFFF',
              borderRadius: 8,
              padding: '12px 18px',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            <Check size={16} strokeWidth={3} />
            Entry Filed & Pre-Cleared with Customs
          </div>
        )}
      </div>

      {/* Side Floating Classification Check Card (Screenshot 7) */}
      <div
        className="wb-card"
        style={{
          padding: '20px 22px',
          background: 'var(--tint)',
          border: '1px solid var(--cardline)'
        }}
      >
        <span
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--dim)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 8
          }}
        >
          CLASSIFICATION CHECK
        </span>

        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, lineHeight: 1.35 }}>
          Corrected with the supplier. Filed clean.
        </h4>

        <div style={{ marginBottom: 12 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(36, 171, 92, 0.1)',
              border: '1px solid #24AB5C',
              color: '#24AB5C',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: 6,
              padding: '3px 8px'
            }}
          >
            corrected invoice · verified
          </span>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5, marginBottom: 12 }}>
          Every filing is checked before it goes in. Supplier invoice carried wrong tariff code;
          AGENT37 caught it, verified spec with engineering, and filed clean.
        </p>

        <div
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '11px',
            color: 'var(--dim)',
            borderTop: '1px dashed var(--cardline)',
            paddingTop: 10
          }}
        >
          flag → fix · minutes, not days
        </div>
      </div>
    </div>
  );
};
