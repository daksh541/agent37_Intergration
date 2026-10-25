import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { SupplierQuote } from '../types';

interface CoucouNotchProps {
  quote?: SupplierQuote;
  status: 'draft' | 'rfq_sent' | 'quoted' | 'approved' | 'paid' | 'source_slipped' | 'dock_scanned' | 'reconciled' | 'closed';
  onApprove: () => void;
  onOpenStage?: (stage: number) => void;
}

export const CoucouNotch: React.FC<CoucouNotchProps> = ({
  quote,
  status,
  onApprove,
  onOpenStage
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const landedCostFormatted = quote
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(quote.landedCost)
    : '$21,600';

  const isApprovedOrPaid = status === 'approved' || status === 'paid' || status === 'dock_scanned' || status === 'reconciled' || status === 'closed';

  return (
    <aside className="coucou-notch-container" aria-label="Coucou Notch Quick Approval and Status">
      <div
        className={`coucou-notch ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          borderColor: isApprovedOrPaid
            ? '#24AB5C'
            : status === 'source_slipped'
            ? '#F59E0B'
            : '#309EFE'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 14 }}>
          {/* Status icon & label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            {isApprovedOrPaid ? (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#24AB5C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
              </div>
            ) : (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'rgba(48, 158, 254, 0.2)',
                  border: '1px solid #309EFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap size={11} color="#309EFE" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: isApprovedOrPaid ? '#24AB5C' : '#FFFFFF',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                Coucou Notch
                <span style={{ fontSize: '9px', opacity: 0.6 }}>· {status.replace('_', ' ')}</span>
              </span>

              <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.85)' }}>
                {status === 'quoted' && `Top quote ready: ${landedCostFormatted} · DigiKey`}
                {isApprovedOrPaid && `Paid & Settled: ${landedCostFormatted} · 1 line`}
                {status === 'source_slipped' && 'Allocation rerouted to fallback · Date held'}
                {status === 'draft' && 'Order Desk ready · Sourcing awaiting parts'}
                {status === 'rfq_sent' && 'Working licensed sources · Replies incoming'}
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={(e) => e.stopPropagation()}>
            {status === 'quoted' && (
              <button
                onClick={onApprove}
                style={{
                  background: '#309EFE',
                  color: '#07122B',
                  border: 'none',
                  borderRadius: 999,
                  padding: '6px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 10px rgba(48, 158, 254, 0.5)',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Sparkles size={12} />
                Approve ({landedCostFormatted})
              </button>
            )}

            {isApprovedOrPaid && (
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#24AB5C',
                  border: '1px solid #24AB5C',
                  borderRadius: 6,
                  padding: '3px 8px',
                  background: 'rgba(36, 171, 92, 0.1)'
                }}
              >
                SETTLED
              </span>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4
              }}
              aria-label={isExpanded ? 'Collapse Coucou Notch' : 'Expand Coucou Notch'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && quote && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                {quote.manufacturerPartNumber} · {quote.supplier} ({quote.distributorType})
              </span>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', color: '#309EFE' }}>
                Authenticity: 100% Genuine Guaranteed
              </span>
            </div>

            {/* Landed cost line item breakdown */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 10,
                padding: '10px 14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                textAlign: 'center'
              }}
            >
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto Mono', monospace" }}>PARTS</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>${quote.breakdown.partsCost.toLocaleString()}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto Mono', monospace" }}>FREIGHT</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>${quote.breakdown.freight}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto Mono', monospace" }}>DUTIES</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>${quote.breakdown.duties}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto Mono', monospace" }}>CLEARANCE</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>${quote.breakdown.clearance}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#24AB5C' }}>
                <ShieldCheck size={14} />
                <span>Single invoice settlement across suppliers and carriers</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {onOpenStage && (
                  <button
                    onClick={() => onOpenStage(3)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#309EFE',
                      fontSize: '11px',
                      fontFamily: "'Roboto Mono', monospace",
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Open Approval View →
                  </button>
                )}

                {!isApprovedOrPaid && (
                  <button
                    onClick={onApprove}
                    className="btn-primary"
                    style={{ padding: '6px 14px', fontSize: '11.5px' }}
                  >
                    Approve in 1-Click
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
