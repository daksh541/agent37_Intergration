import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Package,
  Layers,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Sliders,
  XCircle,
  HelpCircle
} from 'lucide-react';

interface DockQualityInspectionProps {
  partName: string;
  qty: number;
  poNumber: string;
  binLocation: string;
  onDispositionAccept: () => void;
  onDispositionReject?: (reason: string) => void;
  isAccepted: boolean;
}

export const DockQualityInspection: React.FC<DockQualityInspectionProps> = ({
  partName,
  qty,
  poNumber,
  binLocation,
  onDispositionAccept,
  onDispositionReject,
  isAccepted
}) => {
  const [activeTab, setActiveTab] = useState<'inspection' | 'ncr'>('inspection');
  const [isNcrActive, setIsNcrActive] = useState(false);
  const [inspectedSamples, setInspectedSamples] = useState(32);
  const [passedSamples, setPassedSamples] = useState(32);

  const handleTriggerNcr = () => {
    setIsNcrActive(true);
    setActiveTab('ncr');
    setPassedSamples(28); // 4 defective
    if (onDispositionReject) {
      onDispositionReject('Dimensional tolerance variance on chord width (+0.12mm exceeding ±0.03mm spec)');
    }
  };

  const handleResetToPass = () => {
    setIsNcrActive(false);
    setActiveTab('inspection');
    setPassedSamples(32);
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${isNcrActive ? '#EF4444' : isAccepted ? '#24AB5C' : '#309EFE'}`,
        borderRadius: 14,
        padding: '18px 20px',
        boxShadow: '0 4px 18px rgba(7, 18, 43, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Top QA Inspection Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--cardline)', paddingBottom: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: isNcrActive ? '#EF4444' : isAccepted ? '#24AB5C' : '#309EFE' }} className="dot-pulse" />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700, color: isNcrActive ? '#EF4444' : isAccepted ? '#24AB5C' : '#309EFE', letterSpacing: '0.08em' }}>
              AS9102 FIRST ARTICLE INSPECTION (FAI) & QA INCOMING DOCK
            </span>
          </div>
          <h3 style={{ fontFamily: "'Funnel Display', sans-serif", fontSize: '16px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Receiving Quality Disposition & Material Verifications
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setActiveTab('inspection')}
            style={{
              padding: '4px 10px',
              borderRadius: 5,
              fontSize: '10px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'inspection' ? '#07122B' : 'rgba(7, 18, 43, 0.05)',
              color: activeTab === 'inspection' ? '#FFFFFF' : 'var(--dim)',
              cursor: 'pointer'
            }}
          >
            Inspection Report
          </button>

          <button
            onClick={() => setActiveTab('ncr')}
            style={{
              padding: '4px 10px',
              borderRadius: 5,
              fontSize: '10px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              border: 'none',
              background: activeTab === 'ncr' ? (isNcrActive ? '#EF4444' : '#07122B') : 'rgba(7, 18, 43, 0.05)',
              color: activeTab === 'ncr' ? '#FFFFFF' : 'var(--dim)',
              cursor: 'pointer'
            }}
          >
            NCR Defect Console {isNcrActive && '⚠️'}
          </button>
        </div>
      </div>

      {activeTab === 'inspection' && (
        <>
          {/* Sampling & AQL Protocol HUD */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              background: 'var(--paper)',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid var(--cardline)',
              fontSize: '10.5px'
            }}
          >
            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>SAMPLING STANDARD</span>
              <strong style={{ color: 'var(--ink)' }}>AQL 0.65 Level II</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>UNITS SAMPLED</span>
              <strong style={{ color: 'var(--ink)' }}>{inspectedSamples} of {qty.toLocaleString()} pcs</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>LOT YIELD RATE</span>
              <strong style={{ color: isNcrActive ? '#EF4444' : '#24AB5C' }}>
                {((passedSamples / inspectedSamples) * 100).toFixed(1)}% ({passedSamples}/{inspectedSamples})
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>MATERIAL TRACE</span>
              <strong style={{ color: 'var(--ink)' }}>Toray #LT-2026-904</strong>
            </div>
          </div>

          {/* Coordinate Measuring Machine (CMM) & Caliper Tolerance Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', fontWeight: 600 }}>
              PRECISION DIMENSIONAL TOLERANCE VERIFICATION:
            </span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 80px 80px 80px 70px',
                gap: 6,
                padding: '6px 10px',
                background: '#F8FAFD',
                borderRadius: 6,
                fontSize: '9.5px',
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 700,
                color: 'var(--dim)'
              }}
            >
              <span>SPECIFICATION PARAMETER</span>
              <span style={{ textAlign: 'center' }}>NOMINAL</span>
              <span style={{ textAlign: 'center' }}>TOLERANCE</span>
              <span style={{ textAlign: 'center' }}>MEASURED</span>
              <span style={{ textAlign: 'right' }}>STATUS</span>
            </div>

            {[
              { param: 'Overall Wing Length (Span)', nominal: '450.00 mm', tol: '±0.05 mm', measured: '450.02 mm', pass: true },
              { param: 'Mean Aerodynamic Chord', nominal: '65.00 mm', tol: '±0.03 mm', measured: isNcrActive ? '65.12 mm' : '65.01 mm', pass: !isNcrActive },
              { param: 'Dry Part Weight (Unit)', nominal: '142.0 g', tol: '±1.0 g', measured: '141.8 g', pass: true },
              { param: 'Glass Transition Temp (Tg)', nominal: '130°C min', tol: '≥ 130°C', measured: '132.4°C', pass: true }
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 80px 80px 80px 70px',
                  gap: 6,
                  padding: '7px 10px',
                  borderBottom: '1px solid rgba(7, 18, 43, 0.05)',
                  fontSize: '11px',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.param}</span>
                <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px' }}>{row.nominal}</span>
                <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', color: 'var(--dim)' }}>{row.tol}</span>
                <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', fontWeight: 700, color: row.pass ? 'var(--ink)' : '#EF4444' }}>
                  {row.measured}
                </span>
                <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700, color: row.pass ? '#24AB5C' : '#EF4444' }}>
                  {row.pass ? '✓ PASS' : 'FAIL ✗'}
                </span>
              </div>
            ))}
          </div>

          {/* Interactive Disposition Control Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--cardline)',
              paddingTop: 12,
              gap: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: 'var(--dim)' }}>
              <span>Quality Disposition:</span>
              <span
                style={{
                  fontWeight: 700,
                  color: isNcrActive ? '#EF4444' : isAccepted ? '#24AB5C' : '#309EFE',
                  fontFamily: "'Roboto Mono', monospace"
                }}
              >
                {isNcrActive ? 'QUARANTINED (NCR ACTIVE)' : isAccepted ? 'LOT ACCEPTED & RELEASED' : 'PENDING INSPECTION SIGN-OFF'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {!isNcrActive ? (
                <button
                  onClick={handleTriggerNcr}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#EF4444',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                  title="Simulate incoming defect tolerance excursion to trigger NCR & RMA process"
                >
                  <AlertTriangle size={12} /> Test Defect (Issue NCR)
                </button>
              ) : (
                <button
                  onClick={handleResetToPass}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: 'rgba(7, 18, 43, 0.06)',
                    border: '1px solid rgba(7, 18, 43, 0.15)',
                    color: 'var(--ink)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset to In-Spec
                </button>
              )}

              <button
                onClick={onDispositionAccept}
                disabled={isNcrActive}
                style={{
                  padding: '7px 16px',
                  borderRadius: 6,
                  background: isAccepted ? '#24AB5C' : '#07122B',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: isNcrActive ? 'not-allowed' : 'pointer',
                  opacity: isNcrActive ? 0.4 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.15s ease'
                }}
              >
                <CheckCircle2 size={13} />
                {isAccepted ? 'Lot Released to Active Inventory ✓' : 'Accept Lot & Release to Bin'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* NON-CONFORMANCE REPORT (NCR) CONSOLE TAB */}
      {activeTab === 'ncr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              padding: '12px 14px',
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              fontSize: '11.5px',
              color: '#07122B'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>
              <AlertTriangle size={15} />
              NON-CONFORMANCE REPORT #NCR-2026-081 (ACTIVE DEFECT QUARANTINE)
            </div>
            <div>
              <strong>Discrepancy:</strong> 4 of 32 sampled units exhibited mean chord dimension of <strong>65.12 mm</strong> (allowed upper limit 65.03 mm).
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              background: '#F8FAFD',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid var(--cardline)',
              fontSize: '10.5px'
            }}
          >
            <div>
              <span style={{ color: 'var(--dim)', fontSize: '9px', display: 'block' }}>QUARANTINE BIN</span>
              <strong style={{ color: '#EF4444' }}>BAY-09-QUARANTINE</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontSize: '9px', display: 'block' }}>VENDOR DEBIT MEMO</span>
              <strong style={{ color: 'var(--ink)' }}>-$3,408.00 (Shortage Hold)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontSize: '9px', display: 'block' }}>RMA ACTION TICKET</span>
              <strong style={{ color: 'var(--ink)' }}>RMA-AC-9921-EXP</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
            <span style={{ fontSize: '10.5px', color: 'var(--dim)' }}>
              Encrypted corrective action notice dispatched to supplier engineering.
            </span>
            <button
              onClick={handleResetToPass}
              style={{
                padding: '6px 14px',
                background: '#07122B',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 6,
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Resolve NCR & Re-Inspect Lot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
