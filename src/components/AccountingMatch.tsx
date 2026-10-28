import React, { useState } from 'react';
import { DollarSign, CheckCircle2, FileCheck, ArrowRight, Sparkles, Building2, Receipt, ShieldCheck } from 'lucide-react';

interface AccountingProps {
  partName?: string;
  qty?: number;
  partsCost?: number;
  freightCost?: number;
  dutiesCost?: number;
  clearanceCost?: number;
  deliveryCost?: number;
  initialStatus?: 'pending' | 'paid';
}

export const AccountingMatch: React.FC<AccountingProps> = ({
  partName = 'Drone Wings 450mm Carbon Fiber',
  qty = 1200,
  partsCost = 17040,
  freightCost = 1280,
  dutiesCost = 583.2,
  clearanceCost = 120,
  deliveryCost = 75,
  initialStatus = 'pending'
}) => {
  const [status, setStatus] = useState<'pending' | 'paid'>(initialStatus);
  const [syncedLedger, setSyncedLedger] = useState(false);

  const totalLandedCost = partsCost + freightCost + dutiesCost + clearanceCost + deliveryCost;

  const handleApprove = () => {
    setStatus('paid');
    setSyncedLedger(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1-Line Landed Payment Card (Screenshot: "Everything, in one line") */}
      <div
        className="wb-card"
        style={{
          padding: '24px 28px',
          background: '#FFFFFF',
          border: '1px solid var(--cardline)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              ALL-INCLUSIVE LANDED PAYMENT
            </span>
            <span className="wb-pill wb-pill-dim" style={{ fontSize: '10px' }}>
              ONE INVOICE · ZERO SURPRISES
            </span>
          </div>

          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              color: status === 'paid' ? '#24AB5C' : '#309EFE',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            {status === 'paid' ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
            {status === 'paid' ? 'SETTLED VIA ACH / WIRE' : 'READY FOR ONE-CLICK SETTLEMENT'}
          </span>
        </div>

        {/* 1-Line Landed Cost Formula Bar */}
        <div
          style={{
            background: 'var(--paper)',
            borderRadius: 10,
            padding: '16px 20px',
            border: '1px solid var(--cardline)',
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '8px 12px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '13px'
            }}
          >
            <span style={{ color: 'var(--dim)' }}>[parts]</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${partsCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

            <span style={{ color: 'var(--dim)' }}>+</span>
            <span style={{ color: 'var(--dim)' }}>[freight]</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${freightCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

            <span style={{ color: 'var(--dim)' }}>+</span>
            <span style={{ color: 'var(--dim)' }}>[duties]</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${dutiesCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

            <span style={{ color: 'var(--dim)' }}>+</span>
            <span style={{ color: 'var(--dim)' }}>[clearance]</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${clearanceCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

            <span style={{ color: 'var(--dim)' }}>+</span>
            <span style={{ color: 'var(--dim)' }}>[delivery]</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>${deliveryCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>

            <span style={{ color: '#309EFE', fontWeight: 700 }}>=</span>
            <span
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--ink)',
                background: 'rgba(48, 158, 254, 0.08)',
                padding: '2px 10px',
                borderRadius: 6
              }}
            >
              ${totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--dim)', marginTop: 8, fontFamily: "'Roboto Mono', monospace" }}>
            Landed cost per unit: ${(totalLandedCost / qty).toFixed(2)} / pc · Fully delivered to dock with customs paid
          </div>
        </div>

        {/* Action Button & Stamp */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          {status === 'pending' ? (
            <button
              onClick={handleApprove}
              className="btn-primary"
              style={{
                padding: '12px 24px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer'
              }}
            >
              Approve Landed Payment (${totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })})
              <ArrowRight size={14} />
            </button>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'rgba(36, 171, 92, 0.12)',
                border: '1.5px solid #24AB5C',
                color: '#24AB5C',
                padding: '10px 20px',
                borderRadius: 8,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <CheckCircle2 size={18} />
              [PAID · settled by Docket]
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(36, 171, 92, 0.8)' }}>
                TxID #TXN-88192-ACH
              </span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--dim)' }}>
              Net-30 Terms available · Escrow protected
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Section: 3-Way Match & GL Sync */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.2fr) minmax(260px, 0.8fr)', gap: 18 }}>
        {/* Three-Way Match Card (Screenshot 11) */}
        <div className="wb-card" style={{ padding: '22px 24px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
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
              THREE-WAY MATCH AUDIT
            </span>

            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: '#24AB5C',
                background: 'rgba(36, 171, 92, 0.08)',
                padding: '3px 8px',
                borderRadius: 4,
                fontWeight: 600
              }}
            >
              VARIANCE: $0.00 (EXACT)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--paper)',
                borderRadius: 8,
                border: '1px solid var(--cardline)'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                  1. Purchase Order (PO)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  PO #AG37-9821 · Qty: {qty} pcs
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12.5px', fontWeight: 600 }}>
                  ${partsCost.toLocaleString()}
                </span>
                <span style={{ color: '#24AB5C', marginLeft: 6 }}>✓</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--paper)',
                borderRadius: 8,
                border: '1px solid var(--cardline)'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                  2. Vendor Commercial Invoice
                </div>
                <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  INV #AC-2026-441 · AeroCarbon Tech
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12.5px', fontWeight: 600 }}>
                  ${partsCost.toLocaleString()}
                </span>
                <span style={{ color: '#24AB5C', marginLeft: 6 }}>✓</span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'var(--paper)',
                borderRadius: 8,
                border: '1px solid var(--cardline)'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                  3. Goods Receipt Note (GRN)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  GRN #DOCK-882 · Dock Scanner Inbound
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12.5px', fontWeight: 600 }}>
                  {qty} pcs received
                </span>
                <span style={{ color: '#24AB5C', marginLeft: 6 }}>✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* ERP & General Ledger Sync */}
        <div className="wb-card" style={{ padding: '22px 20px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Building2 size={15} color="#309EFE" />
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              GL & ERP SYNC
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--ink)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--dim)' }}>DR 1410 Inv - Raw Mat:</span>
                <span style={{ fontWeight: 600 }}>+${partsCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--dim)' }}>DR 5120 Freight Inbound:</span>
                <span style={{ fontWeight: 600 }}>+${freightCost.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: 'var(--dim)' }}>DR 5130 Customs & Duties:</span>
                <span style={{ fontWeight: 600 }}>+${(dutiesCost + clearanceCost + deliveryCost).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px solid var(--cardline)', paddingTop: 6 }}>
                <span style={{ color: '#24AB5C', fontWeight: 600 }}>CR 2010 Accounts Payable:</span>
                <span style={{ color: '#24AB5C', fontWeight: 700 }}>-${totalLandedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              background: 'var(--paper)',
              border: '1px solid var(--cardline)',
              fontSize: '11px',
              color: 'var(--dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>Connected to: <strong>NetSuite / QBO</strong></span>
            <span style={{ color: '#24AB5C', fontWeight: 600 }}>Auto-Synced ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
};
