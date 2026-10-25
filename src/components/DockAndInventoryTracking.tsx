import React, { useState, useEffect } from 'react';
import { CheckCircle2, PackageCheck, Layers, AlertCircle, ArrowUpRight } from 'lucide-react';

interface DockAndInventoryTrackingProps {
  partName: string;
  binLocation: string;
  qty: number;
  poNumber: string;
  onSettleOrder?: () => void;
  isSettled?: boolean;
}

export const DockAndInventoryTracking: React.FC<DockAndInventoryTrackingProps> = ({
  partName,
  binLocation,
  qty,
  poNumber,
  onSettleOrder,
  isSettled = false
}) => {
  const [laserPos, setLaserPos] = useState(0.1);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    // Animate laser beam sweeping across the barcode
    const interval = setInterval(() => {
      setLaserPos((prev) => (prev >= 0.95 ? 0.05 : prev + 0.03));
    }, 70);

    const scanTimer = setTimeout(() => {
      setIsScanned(true);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(scanTimer);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
      {/* Container with the 2 cards side-by-side or stacked on smaller screens (Image 2) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 14,
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {/* ================= CARD 1: RECEIVING · YOUR DOCK (Exact Match to Image 2) ================= */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(7, 18, 43, 0.1)',
            borderRadius: 12,
            padding: '14px 16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Top Label */}
          <div
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              color: '#8896A6',
              letterSpacing: '0.08em',
              marginBottom: 14,
              textTransform: 'uppercase'
            }}
          >
            RECEIVING · YOUR DOCK
          </div>

          {/* Inset Carton Label (Image 2) */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(7, 18, 43, 0.1)',
              borderRadius: 12,
              padding: '16px 18px',
              boxShadow: '0 2px 8px rgba(7, 18, 43, 0.02)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Carton Label Header */}
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#07122B',
                  letterSpacing: '0.05em'
                }}
              >
                YOUR COMPANY
              </div>
              <div
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10.5px',
                  color: '#8896A6',
                  marginTop: 2
                }}
              >
                carton label · matched to the order
              </div>
            </div>

            {/* SVG Barcode with Animated Laser Beam Scan (Image 2) */}
            <div style={{ position: 'relative', height: 60, width: '100%', overflow: 'hidden' }}>
              <svg viewBox="0 0 280 60" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
                {/* Generated realistic high-density barcode bars */}
                {[
                  3, 6, 2, 8, 4, 10, 2, 5, 8, 3, 12, 4, 6, 9, 3, 7, 2, 11, 5, 8, 3, 9, 4, 7, 2, 12, 6,
                  4, 8, 3, 10, 5, 7, 2, 9, 4, 11, 3, 6, 8, 2, 12, 5, 7, 4, 9, 3, 8, 2, 10, 6, 4, 8
                ].map((gap, idx) => {
                  const x = idx * 5.2 + 4;
                  const isFat = idx % 3 === 0;
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y="4"
                      width={isFat ? 3.2 : 1.6}
                      height="52"
                      fill="#07122B"
                    />
                  );
                })}
              </svg>

              {/* Sweeping Laser Glow Beam (matching blue glow in Image 2) */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${laserPos * 100}%`,
                  width: '32px',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(90deg, rgba(48, 158, 254, 0) 0%, rgba(48, 158, 254, 0.45) 50%, rgba(48, 158, 254, 0) 100%)',
                  boxShadow: '0 0 16px rgba(48, 158, 254, 0.6)',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Inbound Scan Status Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 10,
                fontSize: '10px',
                fontFamily: "'Roboto Mono', monospace"
              }}
            >
              <span style={{ color: '#24AB5C', fontWeight: 600 }}>
                {isScanned ? '✓ CARTON SCANNED · MATCHED' : 'SCANNING CARTON...'}
              </span>
              <span style={{ color: '#8896A6' }}>PO: {poNumber}</span>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: INVENTORY · LIVE (Exact Match to Image 2) ================= */}
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(7, 18, 43, 0.1)',
            borderRadius: 12,
            padding: '14px 16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Top Label & Visibility */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              color: '#8896A6',
              letterSpacing: '0.08em',
              marginBottom: 16
            }}
          >
            <span>INVENTORY · LIVE</span>
            <span style={{ fontSize: '10px', color: '#8896A6', letterSpacing: '0' }}>visible to everyone</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Item 1: Your part · this order (Image 2) */}
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#07122B', marginBottom: 6 }}>
                Your part · this order
              </div>

              {/* Progress bar with green dot on the left (Image 2) */}
              <div
                style={{
                  position: 'relative',
                  height: 4,
                  background: 'rgba(7, 18, 43, 0.06)',
                  borderRadius: 2,
                  marginBottom: 6
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '35%',
                    height: '100%',
                    background: '#24AB5C',
                    borderRadius: 2
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: -2.5,
                    left: 0,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#24AB5C',
                    boxShadow: '0 0 6px #24AB5C'
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10.5px',
                  color: '#8896A6'
                }}
              >
                <span>bin assigned · reserved to your project</span>
                <span style={{ color: '#309EFE', fontWeight: 600 }}>{binLocation}</span>
              </div>
            </div>

            {/* Item 2: Another line (healthy) (Image 2) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '12.5px', color: '#4E596D' }}>Another line</span>
                <span style={{ fontSize: '10px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace" }}>healthy</span>
              </div>
              <div
                style={{
                  height: 4,
                  background: 'rgba(7, 18, 43, 0.06)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <div style={{ width: '82%', height: '100%', background: '#24AB5C' }} />
              </div>
            </div>

            {/* Item 3: A thinning line (restock suggested) (Image 2) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: '12.5px', color: '#4E596D' }}>A thinning line</span>
                <span style={{ fontSize: '10.5px', color: '#309EFE', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
                  restock suggested
                </span>
              </div>
              <div
                style={{
                  height: 4,
                  background: 'rgba(7, 18, 43, 0.06)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <div style={{ width: '18%', height: '100%', background: '#F59E0B' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Settle & Stamping Action */}
      {!isSettled ? (
        <button
          onClick={onSettleOrder}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '11px 20px',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 16px rgba(48, 158, 254, 0.35)'
          }}
        >
          <CheckCircle2 size={16} />
          Confirm Dock Receiving & Settle Landed Invoice with [PAID] Stamp ➔
        </button>
      ) : (
        <div
          style={{
            background: 'rgba(36, 171, 92, 0.08)',
            border: '1.5px solid #24AB5C',
            borderRadius: 10,
            padding: '12px 18px',
            color: '#24AB5C',
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <CheckCircle2 size={17} />
          [PAID · AGENT37] · Zero Variance 3-Way Match Reconciled & Stamped
        </div>
      )}
    </div>
  );
};
