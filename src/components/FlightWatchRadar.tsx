import React, { useState, useEffect } from 'react';
import { Plane, Radio, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface FlightWatchProps {
  origin?: string;
  destination?: string;
  originCode?: string;
  destCode?: string;
  carrier?: string;
  flightNum?: string;
  etaDate?: string;
}

export const FlightWatchRadar: React.FC<FlightWatchProps> = ({
  origin = 'Shenzhen (SZX)',
  destination = 'San Francisco (SFO)',
  originCode = 'ORG',
  destCode = 'DST',
  carrier = 'DHL Express',
  flightNum = 'D0 2841',
  etaDate = 'On schedule · 3 days'
}) => {
  const [planeProgress, setPlaneProgress] = useState(0.42);
  const [selectedCarrier, setSelectedCarrier] = useState<'dhl' | 'air_cargo' | 'ocean'>('dhl');

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaneProgress((prev) => (prev >= 0.88 ? 0.15 : prev + 0.005));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Compute plane coordinates along SVG quadratic curve:
  // P0 = (240, 160) [ORG], P1 = (140, 40) [Control], P2 = (40, 60) [DST]
  const t = planeProgress;
  const p0 = { x: 230, y: 155 };
  const p1 = { x: 135, y: 35 };
  const p2 = { x: 45, y: 65 };

  const planeX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const planeY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  // Tangent angle
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Flight Radar Card matching Screenshot 6 (Pasted 2026-10-25 at 2.35.53 AM.png) */}
      <div
        className="wb-card"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--cardline)',
          borderRadius: 16,
          overflow: 'hidden'
        }}
      >
        {/* Radar Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
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
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--dim)'
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
            agent37 · flight watch
          </span>

          <span
            style={{
              background: '#309EFE',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4
            }}
          >
            LIVE
          </span>
        </div>

        {/* Radar Canvas with Flight Path */}
        <div
          style={{
            position: 'relative',
            height: 200,
            background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
            borderBottom: '1px solid var(--cardline)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Radar Grid Lines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(7, 18, 43, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(7, 18, 43, 0.05) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
              pointerEvents: 'none'
            }}
          />

          <svg
            viewBox="0 0 280 200"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
          >
            {/* Dashed trajectory line */}
            <path
              d="M 230 155 Q 135 35 45 65"
              fill="none"
              stroke="rgba(7, 18, 43, 0.2)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />

            {/* Glowing active arc */}
            <path
              d="M 230 155 Q 135 35 45 65"
              fill="none"
              stroke="#309EFE"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Destination Dot & Label (DST) */}
            <circle cx="45" cy="65" r="5" fill="#07122B" />
            <text
              x="22"
              y="52"
              fontFamily="'Funnel Display', sans-serif"
              fontSize="12"
              fontWeight="700"
              fill="#07122B"
            >
              {destCode}
            </text>

            {/* Origin Dot & Label (ORG) */}
            <circle cx="230" cy="155" r="5" fill="#07122B" />
            <text
              x="240"
              y="160"
              fontFamily="'Funnel Display', sans-serif"
              fontSize="12"
              fontWeight="700"
              fill="#07122B"
            >
              {originCode}
            </text>

            {/* In-Flight Airplane Icon moving along the curve */}
            <g
              transform={`translate(${planeX}, ${planeY}) rotate(${angle + 90})`}
              style={{ transition: 'transform 0.15s linear' }}
            >
              {/* Outer pulse aura */}
              <circle r="14" fill="rgba(48, 158, 254, 0.25)" className="dot-pulse" />
              {/* Plane marker */}
              <path
                d="M 0 -8 L 5 4 L 0 2 L -5 4 Z"
                fill="#07122B"
                stroke="#309EFE"
                strokeWidth="1.5"
              />
            </g>
          </svg>

          {/* Floating carrier info badge */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 14,
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(6px)',
              border: '1px solid var(--cardline)',
              borderRadius: 6,
              padding: '4px 10px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '10.5px',
              color: 'var(--ink)'
            }}
          >
            {carrier} · {flightNum}
          </div>
        </div>

        {/* Radar Telemetry Grid (FEED, POS, RTE, ETA) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            borderBottom: '1px solid var(--cardline)',
            background: '#FFFFFF',
            textAlign: 'center'
          }}
        >
          <div style={{ padding: '9px 4px', borderRight: '1px solid var(--cardline)' }}>
            <span style={{ display: 'block', fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              FEED
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
              live
            </span>
          </div>

          <div style={{ padding: '9px 4px', borderRight: '1px solid var(--cardline)' }}>
            <span style={{ display: 'block', fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              POS
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
              live
            </span>
          </div>

          <div style={{ padding: '9px 4px', borderRight: '1px solid var(--cardline)' }}>
            <span style={{ display: 'block', fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              RTE
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
              on plan
            </span>
          </div>

          <div style={{ padding: '9px 4px' }}>
            <span style={{ display: 'block', fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
              ETA
            </span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
              on time
            </span>
          </div>
        </div>

        {/* Route labels footnote */}
        <div
          style={{
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--dim)',
            background: 'var(--tint)'
          }}
        >
          <span>{origin} → {destination}</span>
          <span>direct DHL Express charter</span>
        </div>
      </div>

      {/* Shipping Possibilities & Cost Comparison Table */}
      <div
        className="wb-card"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--cardline)',
          borderRadius: 14,
          padding: '18px 20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11.5px', fontWeight: 700, color: 'var(--ink)' }}>
            SHIPPING POSSIBILITIES & COST COMPARISON
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
            Landed door-to-door delivery
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Option 1: DHL Express Priority (Recommended) */}
          <div
            onClick={() => setSelectedCarrier('dhl')}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: selectedCarrier === 'dhl' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
              background: selectedCarrier === 'dhl' ? 'rgba(48,158,254,0.06)' : 'var(--tint)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                  ✈ DHL Express Air Courier
                </span>
                <span
                  style={{
                    background: '#24AB5C',
                    color: '#FFFFFF',
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 7px',
                    borderRadius: 999,
                    fontWeight: 700
                  }}
                >
                  RECOMMENDED
                </span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: 2 }}>
                Transit: 3 business days · Real-time flight tracking · Pre-cleared in air
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>$420.00</span>
              <span style={{ display: 'block', fontSize: '10px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
                Guaranteed date
              </span>
            </div>
          </div>

          {/* Option 2: Consolidated Air Cargo */}
          <div
            onClick={() => setSelectedCarrier('air_cargo')}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: selectedCarrier === 'air_cargo' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
              background: selectedCarrier === 'air_cargo' ? 'rgba(48,158,254,0.06)' : 'var(--tint)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                ✈ Consolidated Air Freight
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: 2 }}>
                Transit: 6–8 business days · Scheduled weekly consolidated departure
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>$280.00</span>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                Economy option
              </span>
            </div>
          </div>

          {/* Option 3: Ocean Fast Freight */}
          <div
            onClick={() => setSelectedCarrier('ocean')}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: selectedCarrier === 'ocean' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
              background: selectedCarrier === 'ocean' ? 'rgba(48,158,254,0.06)' : 'var(--tint)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.15s ease'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                🚢 Ocean Fast Freight (LCL)
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--mut)', marginTop: 2 }}>
                Transit: 18–22 days · Best for heavy structural pallets & bulk production
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>$140.00</span>
              <span style={{ display: 'block', fontSize: '10px', color: '#F59E0B', fontFamily: "'Roboto Mono', monospace" }}>
                Slow transit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
