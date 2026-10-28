import React, { useState, useEffect } from 'react';
import { Plane, CheckCircle2, ChevronRight } from 'lucide-react';

interface WaybillFlightWatchProps {
  origin?: string;
  destination?: string;
  carrier?: string;
  flightNum?: string;
  shippingAmount?: number;
  htsCode?: string;
  onApproveShipping?: (carrierName: string, cost: number) => void;
  isApproved?: boolean;
}

export const WaybillFlightWatch: React.FC<WaybillFlightWatchProps> = ({
  origin = "Taichung (RMQ)",
  destination = "Los Angeles (LAX)",
  carrier = "DHL Express UAV Priority Air",
  flightNum = "FX 5291",
  shippingAmount = 830.00,
  htsCode = "8807.30.0090",
  onApproveShipping,
  isApproved = false
}) => {
  // Plane progress along quadratic curve: 0 = ORG (origin), 1 = DST (destination)
  const [t, setT] = useState(0.52);
  const [selectedCarrierIdx, setSelectedCarrierIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setT((prev) => (prev >= 0.95 ? 0.08 : prev + 0.006));
    }, 80);
    return () => clearInterval(timer);
  }, []);

  // Quadratic curve control points in 360x220 canvas
  // Matches Image 1: ORG at bottom right (255, 175), DST at middle left (75, 115)
  const p0 = { x: 255, y: 175 }; // ORG
  const p1 = { x: 175, y: 80 };  // Control Point
  const p2 = { x: 75, y: 115 };  // DST

  // Current position of airplane
  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  // Tangent vector for heading rotation (angle)
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Generate SVG path for sub-segment of quadratic bezier using de Casteljau's algorithm
  // Solid blue trail from p0 to current (t)
  const splitP01 = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
  const trailD = `M ${p0.x} ${p0.y} Q ${splitP01.x} ${splitP01.y} ${currentX} ${currentY}`;

  // Dashed forward path from current (t) to p2
  const splitP12 = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
  const forwardD = `M ${currentX} ${currentY} Q ${splitP12.x} ${splitP12.y} ${p2.x} ${p2.y}`;

  const carrierOptions = [
    { name: 'DHL Express UAV Priority Air', cost: shippingAmount, days: '3 Days Transit', code: flightNum },
    { name: 'Consolidated Air Cargo Direct', cost: Math.round(shippingAmount * 0.65), days: '6 Days Transit', code: 'CA 9851' },
    { name: 'Fast Maritime Ocean Freight', cost: Math.round(shippingAmount * 0.28), days: '18 Days Transit', code: 'SEA-LCL' }
  ];

  const activeCarrier = carrierOptions[selectedCarrierIdx];

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${isApproved ? '#24AB5C' : '#309EFE'}`,
        borderRadius: 14,
        boxShadow: '0 4px 20px rgba(7, 18, 43, 0.05)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* 1. Header: Stage Tag + waybill · flight watch + HTS Tag + LIVE badge */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
          background: '#FFFFFF',
          flexWrap: 'wrap',
          gap: 8
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isApproved ? '#24AB5C' : '#309EFE',
              display: 'inline-block',
              boxShadow: isApproved ? '0 0 8px rgba(36, 171, 92, 0.6)' : '0 0 8px rgba(48, 158, 254, 0.6)'
            }}
          />
          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '12.5px',
              fontWeight: 700,
              color: isApproved ? '#24AB5C' : '#07122B',
              letterSpacing: '-0.01em'
            }}
          >
            [5. SHIPPING & CUSTOMS] · waybill · flight watch
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: "'Roboto Mono', monospace",
              padding: '2px 7px',
              borderRadius: 4,
              fontWeight: 600,
              background: 'rgba(48, 158, 254, 0.1)',
              color: '#309EFE'
            }}
          >
            HTS {htsCode} @ 2.70%
          </span>
          <span
            style={{
              background: isApproved ? '#24AB5C' : '#309EFE',
              color: '#FFFFFF',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 6,
              letterSpacing: '0.05em'
            }}
          >
            {isApproved ? 'CLEARED' : 'LIVE'}
          </span>
        </div>
      </div>

      {/* 2. Flight Canvas (Exact Match to Image 1 with square orthogonal grid) */}
      <div
        style={{
          position: 'relative',
          height: 220,
          background: '#FFFFFF',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <svg
          viewBox="0 0 360 220"
          style={{ width: '100%', height: '100%', display: 'block' }}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Square Grid Pattern matching Image 1 */}
            <pattern id="flightWatchGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(7, 18, 43, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Grid Fill */}
          <rect width="360" height="220" fill="url(#flightWatchGrid)" />

          {/* DST Label (Destination) */}
          <text
            x="38"
            y="98"
            fill="#64748B"
            fontSize="18"
            fontFamily="'Roboto Mono', monospace"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            DST
          </text>

          {/* DST Node (Dark Grey Circle) */}
          <circle cx={p2.x} cy={p2.y} r="6.5" fill="#64748B" />

          {/* ORG Label (Origin) */}
          <text
            x="268"
            y="182"
            fill="#64748B"
            fontSize="18"
            fontFamily="'Roboto Mono', monospace"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            ORG
          </text>

          {/* ORG Node (Dark Grey Circle) */}
          <circle cx={p0.x} cy={p0.y} r="6.5" fill="#64748B" />

          {/* 1. Solid Blue Trailed Curve (from ORG to Plane) */}
          <path
            d={trailD}
            fill="none"
            stroke="#309EFE"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* 2. Dashed Grey Forward Curve (from Plane to DST) */}
          <path
            d={forwardD}
            fill="none"
            stroke="#64748B"
            strokeWidth="3.2"
            strokeDasharray="7 6"
            strokeLinecap="round"
          />

          {/* 3. Airplane Icon with Circular Halo */}
          <g transform={`translate(${currentX}, ${currentY})`}>
            {/* Soft Translucent Blue Halo Aura */}
            <circle cx="0" cy="0" r="16" fill="rgba(48, 158, 254, 0.18)" />

            {/* Rotated Minimalist Airplane (Oriented along trajectory) */}
            <g transform={`rotate(${angleDeg + 90})`}>
              <path
                d="M 0,-11 L 3,-4 L 11,-1 L 11,2 L 3,1 L 2,8 L 5,10 L 5,12 L 0,11 L -5,12 L -5,10 L -2,8 L -3,1 L -11,2 L -11,-1 L -3,-4 Z"
                fill="#309EFE"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* 3. Single Consolidated Telemetry Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          borderTop: '1px solid rgba(7, 18, 43, 0.08)',
          borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
          background: '#FFFFFF',
          textAlign: 'left'
        }}
      >
        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            CORRIDOR
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            {origin.split(' ')[0]} → LAX/SFO
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            FEED / RADAR
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            ADS-B Active
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            TRANSIT STATUS
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            On Schedule
          </div>
        </div>

        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            HTS CUSTOMS
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            Pre-Cleared
          </div>
        </div>
      </div>

      {/* 5. Carrier Selector & Approval Action */}
      <div style={{ padding: '14px 18px', background: '#FFFFFF', borderTop: '1px solid rgba(7, 18, 43, 0.06)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {carrierOptions.map((c, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedCarrierIdx(idx)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: 8,
                background: selectedCarrierIdx === idx ? 'rgba(48, 158, 254, 0.06)' : '#FAFCFE',
                border: `1.5px solid ${selectedCarrierIdx === idx ? '#309EFE' : 'rgba(7, 18, 43, 0.08)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#07122B' }}>
                  {c.name}
                </span>
                <span style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Roboto Mono', monospace", marginLeft: 8 }}>
                  {c.days} · {c.code}
                </span>
              </div>
              <div style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, fontSize: '12.5px', color: '#07122B' }}>
                ${c.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>

        {!isApproved ? (
          <button
            onClick={() => onApproveShipping && onApproveShipping(activeCarrier.name, activeCarrier.cost)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: '12.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
          >
            Approve Flight Dispatch: {activeCarrier.name} (${activeCarrier.cost.toLocaleString()}) ➔
          </button>
        ) : (
          <div
            style={{
              color: '#24AB5C',
              fontSize: '12px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 700,
              textAlign: 'center',
              padding: '6px'
            }}
          >
            ✓ Shipping Approved: {activeCarrier.name} (${activeCarrier.cost.toLocaleString()}) added to invoice line 3
          </div>
        )}
      </div>
    </div>
  );
};
