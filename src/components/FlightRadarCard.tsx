import React, { useState, useEffect } from 'react';
import { Plane, Radio, Clock, ShieldCheck, ArrowRight, Compass, Gauge, AlertCircle } from 'lucide-react';

interface FlightRadarCardProps {
  origin: string;
  destination: string;
  flightNum: string;
  selectedCarrier: string;
  shippingAmount: number;
  onApproveShipping: (carrier: string, amount: number) => void;
  isApproved: boolean;
}

export const FlightRadarCard: React.FC<FlightRadarCardProps> = ({
  origin,
  destination,
  flightNum,
  selectedCarrier,
  shippingAmount,
  onApproveShipping,
  isApproved
}) => {
  const [planeProgress, setPlaneProgress] = useState(0.48);
  const [carrierOption, setCarrierOption] = useState<'dhl' | 'air_freight' | 'ocean'>('dhl');

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaneProgress((prev) => (prev >= 0.88 ? 0.15 : prev + 0.005));
    }, 110);
    return () => clearInterval(interval);
  }, []);

  // Compute curved flight coordinates: P0 = (280, 160) [SZX], P1 = (160, 35) [Pacific waypoint], P2 = (45, 65) [SFO]
  const t = planeProgress;
  const p0 = { x: 280, y: 155 };
  const p1 = { x: 160, y: 35 };
  const p2 = { x: 45, y: 65 };

  const planeX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const planeY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const carriers = [
    {
      id: 'dhl',
      name: 'DHL Express UAV Priority Air',
      flight: 'D0 2841 (Boeing 777F)',
      cost: 1280.00,
      days: '3 Days Transit',
      speed: 'Express 520 kts',
      status: 'On Plan · Flight Watch Live',
      isFastest: true
    },
    {
      id: 'air_freight',
      name: 'Consolidated Air Cargo (Direct)',
      flight: 'CA 9851 (Airbus A330F)',
      cost: 640.00,
      days: '7 Days Transit',
      speed: 'Standard Air',
      status: 'Scheduled Departure',
      isFastest: false
    },
    {
      id: 'ocean',
      name: 'Fast Ocean Freight (LCL Express)',
      flight: 'Vessel Cosco Shipping',
      cost: 210.00,
      days: '22 Days Transit',
      speed: 'Maritime Slow',
      status: 'Port Drayage Booked',
      isFastest: false
    }
  ];

  const currentCarrier = carriers.find((c) => c.id === carrierOption) || carriers[0];

  return (
    <div
      className="wb-card"
      style={{
        background: '#FFFFFF',
        border: `1.5px solid ${isApproved ? '#24AB5C' : '#309EFE'}`,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(7, 18, 43, 0.06)'
      }}
    >
      {/* Flight Radar Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 20px',
          background: '#0B132B',
          color: '#FFFFFF'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: '#FFCC00',
              color: '#D40511',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '11px',
              fontFamily: "'Funnel Display', sans-serif"
            }}
          >
            DHL
          </div>
          <div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11.5px', fontWeight: 700, color: '#FFFFFF' }}>
              FLIGHT WATCH · {currentCarrier.flight}
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255, 255, 255, 0.55)', fontFamily: "'Roboto Mono', monospace" }}>
              {origin} ➜ {destination} (Great Circle Trans-Pacific)
            </div>
          </div>
        </div>

        <span
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '10.5px',
            color: '#24AB5C',
            background: 'rgba(36, 171, 92, 0.15)',
            padding: '3px 8px',
            borderRadius: 4,
            fontWeight: 600
          }}
        >
          {isApproved ? 'SHIPPING APPROVED ✓' : 'RADAR ACTIVE · ON PLAN'}
        </span>
      </div>

      {/* High-Tech Tactical Flight Radar Canvas */}
      <div
        style={{
          position: 'relative',
          height: 190,
          background: 'radial-gradient(ellipse at 50% 60%, #0F203C 0%, #060E1A 100%)',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 340 190" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(48, 158, 254, 0.25)" />
              <stop offset="100%" stopColor="rgba(48, 158, 254, 0)" />
            </radialGradient>
          </defs>

          {/* Radar Range Distance Rings */}
          <circle cx="170" cy="95" r="40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <circle cx="170" cy="95" r="80" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <circle cx="170" cy="95" r="120" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />

          {/* Axis crosshair lines */}
          <line x1="170" y1="10" x2="170" y2="180" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
          <line x1="20" y1="95" x2="320" y2="95" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />

          {/* Origin Airport Beacon: SZX */}
          <g transform="translate(280, 155)">
            <circle cx="0" cy="0" r="14" fill="rgba(48, 158, 254, 0.15)">
              <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="5" fill="#309EFE" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="0" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="'Roboto Mono', monospace" fontWeight="700">
              SZX (ORG)
            </text>
          </g>

          {/* Destination Airport Beacon: SFO */}
          <g transform="translate(45, 65)">
            <circle cx="0" cy="0" r="14" fill="rgba(36, 171, 92, 0.15)">
              <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="5" fill="#24AB5C" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="0" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="'Roboto Mono', monospace" fontWeight="700">
              SFO (DST)
            </text>
          </g>

          {/* Great Circle Flight Path Arc */}
          <path
            d="M 280 155 Q 160 35 45 65"
            fill="none"
            stroke="rgba(48, 158, 254, 0.45)"
            strokeWidth="2.2"
            strokeDasharray="5 4"
          />

          {/* Animated Aircraft along Path */}
          <g transform={`translate(${planeX}, ${planeY}) rotate(${angle})`}>
            {/* Pulsing wake aura */}
            <circle cx="0" cy="0" r="12" fill="rgba(48, 158, 254, 0.25)" />
            {/* Plane Silhouette */}
            <path
              d="M 0 -8 L 4 0 L 12 2 L 4 4 L 3 8 L 0 7 L -3 8 L -4 4 L -12 2 L -4 0 Z"
              fill="#FFFFFF"
              stroke="#309EFE"
              strokeWidth="1"
            />
          </g>
        </svg>

        {/* Live Aviation Telemetry HUD Bar (Screenshot 2.35.53 AM.png: FEED, POS, RTE, ETA) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'rgba(11, 19, 43, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <div style={{ padding: '8px 4px', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Roboto Mono', monospace" }}>FEED</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>LIVE (ADS-B)</span>
          </div>
          <div style={{ padding: '8px 4px', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Roboto Mono', monospace" }}>SPEED</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', fontFamily: "'Roboto Mono', monospace" }}>520 KTS / FL380</span>
          </div>
          <div style={{ padding: '8px 4px', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Roboto Mono', monospace" }}>RTE</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace" }}>ON PLAN</span>
          </div>
          <div style={{ padding: '8px 4px' }}>
            <span style={{ display: 'block', fontSize: '9px', color: 'rgba(255,255,255,0.45)', fontFamily: "'Roboto Mono', monospace" }}>ETA</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>3 DAYS</span>
          </div>
        </div>
      </div>

      {/* Carrier Selection and 1-Click Approve Actions */}
      <div style={{ padding: '16px 20px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {carriers.map((car) => {
            const isSelected = carrierOption === car.id;
            return (
              <div
                key={car.id}
                onClick={() => setCarrierOption(car.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: isSelected ? 'rgba(48, 158, 254, 0.06)' : 'var(--paper)',
                  border: `1.5px solid ${isSelected ? '#309EFE' : 'var(--cardline)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ink)' }}>
                    {car.name} {car.isFastest && <span style={{ color: '#309EFE', fontSize: '10px' }}>★ Fastest</span>}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                    {car.days} · {car.speed} · {car.status}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, fontFamily: "'Roboto Mono', monospace", color: 'var(--ink)' }}>
                    ${car.cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '9.5px', color: isSelected ? '#309EFE' : 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                    {isSelected ? 'SELECTED ➜' : 'Select'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!isApproved ? (
          <button
            onClick={() => onApproveShipping(currentCarrier.name, currentCarrier.cost)}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '10px 18px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            Approve {currentCarrier.name} (${currentCarrier.cost.toLocaleString()}) & Update Invoice ➔
          </button>
        ) : (
          <div style={{ color: '#24AB5C', fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace", fontWeight: 600, textAlign: 'center' }}>
            ✓ Shipping Approved: {selectedCarrier} (${shippingAmount.toLocaleString()}) added to invoice
          </div>
        )}
      </div>
    </div>
  );
};
