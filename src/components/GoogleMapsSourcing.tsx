import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, CheckCircle2, ShieldCheck, ArrowRight, Table, MapPin, Eye } from 'lucide-react';

export interface SourcingLocation {
  id: string;
  country: string;
  area: string;
  cluster: string;
  supplier: string;
  unitCost: number;
  moq: number;
  leadTime: string;
  quality: number;
  cert: string;
  airport: string;
  coords: { x: number; y: number };
  latLon: string;
  address: string;
}

interface GoogleMapsSourcingProps {
  locations: SourcingLocation[];
  selectedId: string;
  onSelectLocation: (id: string) => void;
  moq?: number;
  onOpenCall?: () => void;
  onOpenText?: () => void;
  vendorCalledConfirmed?: boolean;
  vendorTextAgreed?: boolean;
  onApproveSourcing?: (supplierName: string, unitPrice: number) => void;
  isApproved?: boolean;
}

export const GoogleMapsSourcing: React.FC<GoogleMapsSourcingProps> = ({
  locations,
  selectedId,
  onSelectLocation,
  moq = 1200,
  onOpenCall,
  onOpenText,
  vendorCalledConfirmed = false,
  vendorTextAgreed = false,
  onApproveSourcing,
  isApproved = false
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [hoveredLocId, setHoveredLocId] = useState<string | null>(null);

  const activeLoc = locations.find((l) => l.id === selectedId) || locations[0];

  // Animated airplane gliding from active ORG to DST (matches Image 2)
  const [t, setT] = useState(0.48);

  useEffect(() => {
    const timer = setInterval(() => {
      setT((prev) => (prev >= 0.94 ? 0.08 : prev + 0.007));
    }, 75);
    return () => clearInterval(timer);
  }, [selectedId]);

  // Destination (Your Dock / SFO)
  const pDst = { x: 75, y: 125 };

  // All 5 Supplier Locations on 540x240 white grid canvas with custom curve control points
  const locationCoordinates: Record<
    string,
    { x: number; y: number; ctrlX: number; ctrlY: number; labelYOffset: number; airportCode: string; distance: string }
  > = {
    'loc-us': { x: 170, y: 68, ctrlX: 125, ctrlY: 72, labelYOffset: -14, airportCode: 'LAX', distance: '540 km' },
    'loc-mx': { x: 195, y: 185, ctrlX: 135, ctrlY: 170, labelYOffset: 16, airportCode: 'MXL', distance: '820 km' },
    'loc-de': { x: 310, y: 55, ctrlX: 195, ctrlY: 60, labelYOffset: -14, airportCode: 'MUC', distance: '9,410 km' },
    'loc-cn': { x: 410, y: 110, ctrlX: 245, ctrlY: 75, labelYOffset: -14, airportCode: 'SZX', distance: '11,180 km' },
    'loc-tw': { x: 460, y: 175, ctrlX: 270, ctrlY: 180, labelYOffset: 16, airportCode: 'RMQ', distance: '10,450 km' }
  };

  const activeCoord = locationCoordinates[selectedId] || locationCoordinates['loc-cn'];

  // Current position and tangent angle of the gliding airplane on active path
  const p0 = { x: activeCoord.x, y: activeCoord.y };
  const p1 = { x: activeCoord.ctrlX, y: activeCoord.ctrlY };
  const p2 = pDst;

  const currentX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const currentY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

  const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
  const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Active Trailed path (solid blue from p0 to airplane)
  const splitP01 = { x: (1 - t) * p0.x + t * p1.x, y: (1 - t) * p0.y + t * p1.y };
  const activeTrailD = `M ${p0.x} ${p0.y} Q ${splitP01.x} ${splitP01.y} ${currentX} ${currentY}`;

  // Active Forward path (dashed grey from airplane to p2)
  const splitP12 = { x: (1 - t) * p1.x + t * p2.x, y: (1 - t) * p1.y + t * p2.y };
  const activeForwardD = `M ${currentX} ${currentY} Q ${splitP12.x} ${splitP12.y} ${p2.x} ${p2.y}`;

  const totalCost = activeLoc.unitCost * moq;

  const getCountryCode = (country: string) => {
    switch (country.toLowerCase()) {
      case 'china':
        return 'CN';
      case 'taiwan':
        return 'TW';
      case 'usa':
        return 'US';
      case 'germany':
        return 'DE';
      case 'mexico':
        return 'MX';
      default:
        return 'GL';
    }
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 14,
        border: `1.5px solid ${isApproved ? '#24AB5C' : '#309EFE'}`,
        boxShadow: '0 8px 30px rgba(7, 18, 43, 0.05)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* 1. Header (Exact Match to Image 2: waybill · flight watch + LIVE badge + View Toggle) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
          background: '#FFFFFF',
          flexWrap: 'wrap',
          gap: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
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
            [2. SOURCING RADAR] · waybill · flight watch
          </span>
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
            DIGIKEY · MOUSER SCANNED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View Mode Toggle: Radar Map vs Table Matrix */}
          <div
            style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: 2,
              borderRadius: 6,
              border: '1px solid rgba(7, 18, 43, 0.08)'
            }}
          >
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                fontSize: '10.5px',
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: viewMode === 'map' ? 700 : 500,
                background: viewMode === 'map' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'map' ? '#07122B' : '#64748B',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                boxShadow: viewMode === 'map' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Eye size={12} /> Map View
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px',
                fontSize: '10.5px',
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: viewMode === 'table' ? 700 : 500,
                background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'table' ? '#07122B' : '#64748B',
                borderRadius: 4,
                border: 'none',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <Table size={12} /> Compare All 5
            </button>
          </div>

          <span
            style={{
              background: '#309EFE',
              color: '#FFFFFF',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 6,
              letterSpacing: '0.05em'
            }}
          >
            LIVE
          </span>
        </div>
      </div>

      {/* 2. MAIN RADAR CANVAS OR TABLE VIEW */}
      {viewMode === 'map' ? (
        <div
          style={{
            position: 'relative',
            height: 200,
            background: '#FFFFFF',
            overflow: 'hidden',
            width: '100%'
          }}
        >
          <svg
            viewBox="0 0 540 240"
            style={{ width: '100%', height: '100%', display: 'block' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Square Grid Pattern matching Image 2 */}
              <pattern id="flightWatchGridFull" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(7, 18, 43, 0.08)" strokeWidth="1" />
              </pattern>

              {/* Glowing Filter for Selected Route */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Fill */}
            <rect width="540" height="240" fill="url(#flightWatchGridFull)" />

            {/* ================= ALL 5 FLIGHT PATHS SIMULTANEOUSLY ================= */}
            {locations.map((loc) => {
              const coord = locationCoordinates[loc.id] || { x: 300, y: 100, ctrlX: 190, ctrlY: 80 };
              const isSelected = loc.id === selectedId;
              const isHovered = loc.id === hoveredLocId;

              // Full bezier curve path
              const pathD = `M ${coord.x} ${coord.y} Q ${coord.ctrlX} ${coord.ctrlY} ${pDst.x} ${pDst.y}`;

              // Only render the background inactive flight paths here (the active one has solid trail + forward dashed)
              if (!isSelected) {
                return (
                  <g
                    key={`flight-arc-${loc.id}`}
                    onClick={() => onSelectLocation(loc.id)}
                    onMouseEnter={() => setHoveredLocId(loc.id)}
                    onMouseLeave={() => setHoveredLocId(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Invisible Fat Hitbox for effortless clicking of any flight path arc */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="20"
                    />

                    {/* Visible Flight Path Arc */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isHovered ? '#309EFE' : 'rgba(48, 158, 254, 0.38)'}
                      strokeWidth={isHovered ? '2.8' : '2'}
                      strokeDasharray="5 5"
                      strokeLinecap="round"
                    />

                    {/* Small Waypoint Icon halfway along inactive path */}
                    <circle
                      cx={(coord.x + pDst.x) / 2}
                      cy={(coord.ctrlY + pDst.y) / 2}
                      r="2.5"
                      fill={isHovered ? '#309EFE' : 'rgba(48, 158, 254, 0.6)'}
                    />
                  </g>
                );
              }
              return null;
            })}

            {/* ACTIVE FLIGHT PATH: Solid Blue Trail + Gliding Airplane + Dashed Forward Path */}
            <path
              d={activeTrailD}
              fill="none"
              stroke="#309EFE"
              strokeWidth="4.5"
              strokeLinecap="round"
              filter="url(#routeGlow)"
            />
            <path
              d={activeForwardD}
              fill="none"
              stroke="#64748B"
              strokeWidth="3.2"
              strokeDasharray="7 6"
              strokeLinecap="round"
            />

            {/* Animated Airplane with Translucent Blue Halo */}
            <g transform={`translate(${currentX}, ${currentY})`}>
              <circle cx="0" cy="0" r="16" fill="rgba(48, 158, 254, 0.22)" />
              <circle cx="0" cy="0" r="8" fill="rgba(48, 158, 254, 0.4)" />
              <g transform={`rotate(${angleDeg + 90})`}>
                <path
                  d="M 0,-11 L 3,-4 L 11,-1 L 11,2 L 3,1 L 2,8 L 5,10 L 5,12 L 0,11 L -5,12 L -5,10 L -2,8 L -3,1 L -11,2 L -11,-1 L -3,-4 Z"
                  fill="#309EFE"
                />
              </g>
            </g>

            {/* ================= DESTINATION (DST / YOUR DOCK) ================= */}
            <g transform={`translate(${pDst.x}, ${pDst.y})`}>
              {/* Concentric pulsing radar ring */}
              <circle cx="0" cy="0" r="18" fill="none" stroke="#309EFE" strokeWidth="1.2" opacity="0.6">
                <animate attributeName="r" values="10;24;10" dur="2.4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2.4s" repeatCount="indefinite" />
              </circle>
              <circle cx="0" cy="0" r="8" fill="#07122B" />
              <circle cx="0" cy="0" r="3" fill="#FFFFFF" />

              {/* DST Label (matching Image 2) */}
              <text
                x="-32"
                y="-14"
                fill="#07122B"
                fontSize="16"
                fontFamily="'Roboto Mono', monospace"
                fontWeight="800"
                letterSpacing="-0.02em"
              >
                DST
              </text>
              <text
                x="-32"
                y="0"
                fill="#64748B"
                fontSize="8.5"
                fontFamily="'Roboto Mono', monospace"
                fontWeight="700"
              >
                YOUR DOCK
              </text>
            </g>

            {/* ================= INTERACTIVE LOCATION NODES & BADGES ================= */}
            {locations.map((loc) => {
              const coord = locationCoordinates[loc.id] || { x: 300, y: 100, labelYOffset: -14 };
              const isSelected = loc.id === selectedId;
              const isHovered = loc.id === hoveredLocId;

              return (
                <g
                  key={`node-${loc.id}`}
                  onClick={() => onSelectLocation(loc.id)}
                  onMouseEnter={() => setHoveredLocId(loc.id)}
                  onMouseLeave={() => setHoveredLocId(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Active pulsating beacon halo */}
                  {isSelected && (
                    <>
                      <circle cx={coord.x} cy={coord.y} r="18" fill="rgba(48, 158, 254, 0.22)">
                        <animate attributeName="r" values="10;22;10" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={coord.x} cy={coord.y} r="12" fill="none" stroke="#309EFE" strokeWidth="1.5" />
                    </>
                  )}

                  {/* Core Node Circle */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 7.5 : isHovered ? 7 : 6}
                    fill={isSelected ? '#309EFE' : isHovered ? '#07122B' : '#64748B'}
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                  />

                  {/* Location Badge (Clickable Pill on Canvas) */}
                  <rect
                    x={coord.x - 48}
                    y={coord.y + coord.labelYOffset - 10}
                    width="96"
                    height="20"
                    rx="6"
                    fill={isSelected ? '#07122B' : isHovered ? '#F8FAFC' : '#FFFFFF'}
                    stroke={isSelected ? '#309EFE' : isHovered ? '#309EFE' : 'rgba(7, 18, 43, 0.2)'}
                    strokeWidth={isSelected ? 1.6 : 1}
                    filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.06))"
                  />
                  <text
                    x={coord.x}
                    y={coord.y + coord.labelYOffset + 4.2}
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#07122B'}
                    fontSize="9.5"
                    fontFamily="'Roboto Mono', monospace"
                    fontWeight={isSelected ? 700 : 600}
                  >
                    {loc.country} · ${loc.unitCost.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      ) : (
        /* TABLE COMPARISON VIEW OF ALL 5 LOCATIONS */
        <div style={{ padding: '14px 18px', background: '#FAFCFE', maxHeight: 250, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', fontFamily: "'Roboto Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid rgba(7, 18, 43, 0.1)', color: '#64748B', textAlign: 'left' }}>
                <th style={{ padding: '6px 8px' }}>COUNTRY / VENDOR</th>
                <th style={{ padding: '6px 8px' }}>UNIT</th>
                <th style={{ padding: '6px 8px' }}>LANDED ({moq.toLocaleString()})</th>
                <th style={{ padding: '6px 8px' }}>LEAD TIME</th>
                <th style={{ padding: '6px 8px' }}>SCORE</th>
                <th style={{ padding: '6px 8px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => {
                const isSelected = loc.id === selectedId;
                const locTotal = loc.unitCost * moq;
                return (
                  <tr
                    key={`tbl-${loc.id}`}
                    onClick={() => onSelectLocation(loc.id)}
                    style={{
                      borderBottom: '1px solid rgba(7, 18, 43, 0.06)',
                      background: isSelected ? 'rgba(48, 158, 254, 0.08)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '8px', fontWeight: isSelected ? 700 : 500, color: '#07122B' }}>
                      <span style={{ padding: '2px 5px', background: '#07122B', color: '#FFFFFF', borderRadius: 3, fontSize: '9px', fontWeight: 800, marginRight: 6, fontFamily: "'Roboto Mono', monospace" }}>
                        {getCountryCode(loc.country)}
                      </span>
                      {loc.country} · {loc.supplier}
                    </td>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#309EFE' }}>${loc.unitCost.toFixed(2)}</td>
                    <td style={{ padding: '8px', fontWeight: 700 }}>${locTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '8px', color: '#64748B' }}>{loc.leadTime}</td>
                    <td style={{ padding: '8px', color: '#24AB5C', fontWeight: 700 }}>{loc.quality}%</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLocation(loc.id);
                        }}
                        style={{
                          padding: '3px 8px',
                          borderRadius: 4,
                          background: isSelected ? '#309EFE' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#07122B',
                          border: `1px solid ${isSelected ? '#309EFE' : 'rgba(7, 18, 43, 0.15)'}`,
                          fontSize: '10px',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        {isSelected ? '✓ ACTIVE' : 'SELECT'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Sleek 5-Hub Segmented Bar (100% width, No horizontal overflow) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          background: '#F8FAFD',
          borderTop: '1px solid rgba(7, 18, 43, 0.08)',
          borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
          padding: '4px',
          gap: 4,
          boxSizing: 'border-box',
          width: '100%'
        }}
      >
        {locations.map((loc) => {
          const isSelected = selectedId === loc.id;
          return (
            <button
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              onMouseEnter={() => setHoveredLocId(loc.id)}
              onMouseLeave={() => setHoveredLocId(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 2px',
                borderRadius: 6,
                background: isSelected ? '#07122B' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#64748B',
                border: isSelected ? '1px solid #07122B' : '1px solid transparent',
                fontFamily: "'Roboto Mono', monospace",
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '9.5px', fontWeight: isSelected ? 800 : 600 }}>
                <span style={{ opacity: isSelected ? 1 : 0.7 }}>[{getCountryCode(loc.country)}]</span>
                <span>{loc.country}</span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? '#309EFE' : '#07122B', marginTop: 1 }}>
                ${loc.unitCost.toFixed(2)}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4. Single Consolidated Telemetry Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
          background: '#FFFFFF',
          textAlign: 'left'
        }}
      >
        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            ROUTE
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            {activeCoord.airportCode} → SFO
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            LEAD TIME
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            {activeLoc.leadTime}
          </div>
        </div>

        <div style={{ padding: '8px 12px', borderRight: '1px solid rgba(7, 18, 43, 0.08)' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            QUALITY YIELD
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            {activeLoc.quality}%
          </div>
        </div>

        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '9px', color: '#8896A6', fontFamily: "'Roboto Mono', monospace", letterSpacing: '0.06em' }}>
            CARRIER HUB
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
            {activeCoord.airportCode} Direct Air
          </div>
        </div>
      </div>

      {/* 5. VERIFIED AVL ALLOCATION DOSSIER */}
      <div style={{ padding: '14px 18px', background: '#FFFFFF' }}>
        {/* Supplier Title & Locked Landed Total */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '9.5px',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  background: '#07122B',
                  color: '#FFFFFF',
                  padding: '1px 5px',
                  borderRadius: 3
                }}
              >
                {getCountryCode(activeLoc.country)}
              </span>
              <span
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#07122B',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {activeLoc.supplier}
              </span>
              <span
                style={{
                  background: 'rgba(36, 171, 92, 0.1)',
                  color: '#24AB5C',
                  fontSize: '9px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: 3,
                  whiteSpace: 'nowrap'
                }}
              >
                AVL VERIFIED ✓
              </span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748B', fontFamily: "'Roboto Mono', monospace", marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {activeLoc.address} · {activeLoc.cert}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: "'Roboto Mono', monospace", color: '#07122B', letterSpacing: '-0.02em' }}>
              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: '10px', color: '#309EFE', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
              ${activeLoc.unitCost.toFixed(2)}/unit · {moq.toLocaleString()} pcs
            </div>
          </div>
        </div>

        {/* Action Wire Buttons (Call & Text) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
          <button
            onClick={onOpenCall}
            style={{
              padding: '8px 12px',
              background: vendorCalledConfirmed ? 'rgba(36, 171, 92, 0.08)' : '#FFFFFF',
              border: `1px solid ${vendorCalledConfirmed ? '#24AB5C' : 'rgba(7, 18, 43, 0.16)'}`,
              color: vendorCalledConfirmed ? '#24AB5C' : '#07122B',
              borderRadius: 6,
              fontSize: '11px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s ease'
            }}
          >
            <Phone size={12} color={vendorCalledConfirmed ? '#24AB5C' : '#309EFE'} strokeWidth={2.2} />
            <span>{vendorCalledConfirmed ? 'Call Verified ✓' : 'Direct Audio Wire'}</span>
          </button>

          <button
            onClick={onOpenText}
            style={{
              padding: '8px 12px',
              background: vendorTextAgreed ? 'rgba(36, 171, 92, 0.08)' : '#FFFFFF',
              border: `1px solid ${vendorTextAgreed ? '#24AB5C' : 'rgba(7, 18, 43, 0.16)'}`,
              color: vendorTextAgreed ? '#24AB5C' : '#07122B',
              borderRadius: 6,
              fontSize: '11px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s ease'
            }}
          >
            <MessageSquare size={12} color={vendorTextAgreed ? '#24AB5C' : '#309EFE'} strokeWidth={2.2} />
            <span>{vendorTextAgreed ? 'Terms Confirmed ✓' : 'Direct Supplier Chat'}</span>
          </button>
        </div>

        {/* If call or text confirmed */}
        {(vendorCalledConfirmed || vendorTextAgreed) && (
          <div
            style={{
              marginBottom: 10,
              padding: '6px 10px',
              background: 'rgba(36, 171, 92, 0.08)',
              border: '1px solid rgba(36, 171, 92, 0.2)',
              borderRadius: 6,
              fontSize: '10.5px',
              fontFamily: "'Roboto Mono', monospace",
              color: '#24AB5C',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <CheckCircle2 size={12} />
            <span>Verbal quote & chat terms cryptographically recorded to PO.</span>
          </div>
        )}

        {/* 1-Click Sourcing Approval - Waybill Dark Ink Style */}
        {!isApproved ? (
          <button
            onClick={() => onApproveSourcing && onApproveSourcing(activeLoc.supplier, activeLoc.unitCost)}
            style={{
              width: '100%',
              padding: '11px 16px',
              fontSize: '12px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 700,
              letterSpacing: '0.02em',
              background: '#07122B',
              color: '#FFFFFF',
              border: '1px solid rgba(48, 158, 254, 0.35)',
              borderRadius: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 10px rgba(7, 18, 43, 0.1)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0d1f42';
              e.currentTarget.style.borderColor = '#309EFE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#07122B';
              e.currentTarget.style.borderColor = 'rgba(48, 158, 254, 0.35)';
            }}
          >
            <span>Lock Allocation & Issue RFQ ({activeLoc.supplier} · ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}) ➔</span>
          </button>
        ) : (
          <div
            style={{
              color: '#24AB5C',
              fontSize: '11.5px',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 700,
              textAlign: 'center',
              padding: '9px 12px',
              background: 'rgba(36, 171, 92, 0.08)',
              borderRadius: 6,
              border: '1px solid #24AB5C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <CheckCircle2 size={14} />
            ALLOCATION LOCKED: {activeLoc.supplier} (${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}) confirmed on Line 1
          </div>
        )}
      </div>
    </div>
  );
};
