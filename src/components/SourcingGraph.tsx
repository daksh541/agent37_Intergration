import React, { useState } from 'react';
import { MapPin, Globe, CheckCircle, ShieldCheck, Factory, Layers } from 'lucide-react';

export interface RegionalSupplier {
  id: string;
  country: string;
  area: string;
  clusterName: string;
  supplierName: string;
  type: 'authorized' | 'franchised' | 'vetted broker';
  unitCost: number;
  moq: number;
  leadTimeWeeks: number;
  qualityScore: number;
  stockAvailable: number;
  certifications: string[];
  materials: string;
  coordinates: { x: number; y: number };
}

interface SourcingGraphProps {
  partName?: string;
  requestedQty?: number;
  onSelectPrimary?: (supplier: RegionalSupplier) => void;
}

export const SourcingGraph: React.FC<SourcingGraphProps> = ({
  partName = 'Drone Wings 450mm Carbon Fiber',
  requestedQty = 1200,
  onSelectPrimary
}) => {
  const regions: RegionalSupplier[] = [
    {
      id: 'reg-cn',
      country: 'China',
      area: 'Shenzhen / Dongguan',
      clusterName: "Bao'an Advanced Composites & Carbon Fiber Cluster",
      supplierName: 'AeroCarbon Tech Ltd',
      type: 'authorized',
      unitCost: 14.20,
      moq: 500,
      leadTimeWeeks: 1.5,
      qualityScore: 99.2,
      stockAvailable: 4800,
      certifications: ['ISO 9001', 'AS9100D', 'RoHS 3', 'Toray T700 Certified'],
      materials: 'Toray 3K Pre-preg Carbon Fiber (Matte Weave)',
      coordinates: { x: 340, y: 130 }
    },
    {
      id: 'reg-tw',
      country: 'Taiwan',
      area: 'Taichung / Hsinchu',
      clusterName: 'Central Taiwan Precision Aerospace Park',
      supplierName: 'Apex Aero Composites',
      type: 'authorized',
      unitCost: 16.50,
      moq: 250,
      leadTimeWeeks: 2.0,
      qualityScore: 98.6,
      stockAvailable: 2200,
      certifications: ['ISO 9001', 'CE Certified', 'REACH SVHC'],
      materials: 'Aerospace Grade 3K Carbon + Titanium Insert',
      coordinates: { x: 380, y: 170 }
    },
    {
      id: 'reg-us',
      country: 'USA',
      area: 'Torrance, CA',
      clusterName: 'Southern California Aerospace Corridor',
      supplierName: 'Pacific Aero Dynamics LLC',
      type: 'authorized',
      unitCost: 24.80,
      moq: 100,
      leadTimeWeeks: 1.0,
      qualityScore: 100,
      stockAvailable: 1500,
      certifications: ['ITAR Registered', 'AS9100D', 'DFARS Compliant'],
      materials: 'Military Spec Carbon Composite (FAA PMA)',
      coordinates: { x: 120, y: 110 }
    },
    {
      id: 'reg-de',
      country: 'Germany',
      area: 'Friedrichshafen / Munich',
      clusterName: 'Lake Constance Aerospace Engineering Hub',
      supplierName: 'LuftKomposit GmbH',
      type: 'authorized',
      unitCost: 22.10,
      moq: 200,
      leadTimeWeeks: 2.5,
      qualityScore: 98.9,
      stockAvailable: 1800,
      certifications: ['EN 9100', 'TÜV Rheinland', 'EASA Part 21'],
      materials: 'High-modulus Autoclave Carbon Matrix',
      coordinates: { x: 230, y: 80 }
    },
    {
      id: 'reg-mx',
      country: 'Mexico',
      area: 'Mexicali / Baja',
      clusterName: 'Baja California Aerospace Free Trade Zone',
      supplierName: 'Frontera Composites S.A.',
      type: 'franchised',
      unitCost: 15.90,
      moq: 300,
      leadTimeWeeks: 1.8,
      qualityScore: 96.8,
      stockAvailable: 3100,
      certifications: ['USMCA Duty-Free', 'ISO 9001', 'RoHS'],
      materials: 'Standard 3K Carbon Fiber Vacuum Infused',
      coordinates: { x: 140, y: 150 }
    }
  ];

  const [selectedRegion, setSelectedRegion] = useState<RegionalSupplier>(regions[0]);
  const [primaryId, setPrimaryId] = useState<string>('reg-cn');
  const [fallbackId, setFallbackId] = useState<string>('reg-tw');

  const handleSetPrimary = (reg: RegionalSupplier) => {
    setPrimaryId(reg.id);
    if (onSelectPrimary) onSelectPrimary(reg);
  };

  const handleSetFallback = (reg: RegionalSupplier) => {
    setFallbackId(reg.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Sourcing Graph & Map Visualizer Card */}
      <div
        className="wb-card"
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--cardline)',
          borderRadius: 16,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderBottom: '1px solid var(--cardline)',
            background: '#FFFFFF'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={15} color="#309EFE" />
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'var(--ink)',
                textTransform: 'uppercase'
              }}
            >
              GLOBAL SOURCING GRAPH · SELECT COUNTRY & REGION
            </span>
          </div>

          <span style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
            5 Verified Regional Clusters Mapped
          </span>
        </div>

        {/* Interactive SVG Network Graph / Map View */}
        <div
          style={{
            position: 'relative',
            height: 230,
            background: 'linear-gradient(180deg, #F9FBFC 0%, #FFFFFF 100%)',
            borderBottom: '1px solid var(--cardline)',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Stage Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(7, 18, 43, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(7, 18, 43, 0.04) 1px, transparent 1px)',
              backgroundSize: '28px 28px'
            }}
          />

          <svg viewBox="0 0 500 230" style={{ width: '100%', height: '100%' }}>
            {/* Center demand node (User's Dock) */}
            <circle cx="250" cy="190" r="14" fill="#07122B" />
            <text x="250" y="194" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="'Roboto Mono', monospace" fontWeight="700">
              YOU
            </text>

            {/* Connecting lines from Center to each regional cluster */}
            {regions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              const isPrimary = primaryId === reg.id;
              const isFallback = fallbackId === reg.id;

              return (
                <g key={`line-${reg.id}`}>
                  <line
                    x1="250"
                    y1="190"
                    x2={reg.coordinates.x}
                    y2={reg.coordinates.y}
                    stroke={isSelected || isPrimary ? '#309EFE' : 'rgba(7, 18, 43, 0.15)'}
                    strokeWidth={isSelected || isPrimary ? 2.5 : 1.2}
                    strokeDasharray={isFallback ? '3 3' : 'none'}
                  />
                </g>
              );
            })}

            {/* Regional Nodes */}
            {regions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              const isPrimary = primaryId === reg.id;
              const isFallback = fallbackId === reg.id;

              return (
                <g
                  key={reg.id}
                  transform={`translate(${reg.coordinates.x}, ${reg.coordinates.y})`}
                  onClick={() => setSelectedRegion(reg)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Aura pulse if selected */}
                  {isSelected && (
                    <circle r="20" fill="rgba(48, 158, 254, 0.22)" className="dot-pulse" />
                  )}
                  {/* Node Circle */}
                  <circle
                    r="11"
                    fill={isPrimary ? '#24AB5C' : isFallback ? '#F59E0B' : isSelected ? '#309EFE' : '#07122B'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Node text */}
                  <text
                    y="-16"
                    textAnchor="middle"
                    fill="#07122B"
                    fontFamily="'Roboto Mono', monospace"
                    fontSize="10"
                    fontWeight={isSelected ? '700' : '500'}
                  >
                    {reg.country} · {reg.area.split('/')[0]}
                  </text>
                  <text
                    y="24"
                    textAnchor="middle"
                    fill={isPrimary ? '#24AB5C' : 'var(--dim)'}
                    fontFamily="'Roboto Mono', monospace"
                    fontSize="9.5"
                    fontWeight="600"
                  >
                    ${reg.unitCost.toFixed(2)}/ea
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick country selector pills at bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 12,
              right: 12,
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              paddingBottom: 4
            }}
          >
            {regions.map((reg) => {
              const isSelected = selectedRegion.id === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg)}
                  style={{
                    background: isSelected ? '#07122B' : 'rgba(255, 255, 255, 0.9)',
                    color: isSelected ? '#FFFFFF' : 'var(--ink)',
                    border: isSelected ? '1px solid #07122B' : '1px solid var(--cardline)',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  {reg.country}: {reg.area}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Regional Supplier Inspection Drawer */}
        <div style={{ padding: '20px 22px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)' }}>
                  {selectedRegion.supplierName}
                </h4>
                <span className="pill-authorized">
                  {selectedRegion.type}
                </span>
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    color: '#24AB5C',
                    background: 'rgba(36, 171, 92, 0.08)',
                    borderRadius: 4,
                    padding: '2px 7px',
                    fontWeight: 600
                  }}
                >
                  Quality Score: {selectedRegion.qualityScore}%
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--mut)', marginTop: 3 }}>
                Cluster: {selectedRegion.clusterName} ({selectedRegion.area}, {selectedRegion.country})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ink)' }}>
                ${selectedRegion.unitCost.toFixed(2)}
              </span>
              <span style={{ display: 'block', fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                per unit (Est. ${(selectedRegion.unitCost * requestedQty).toLocaleString()} total)
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              padding: '12px 14px',
              background: 'var(--tint)',
              border: '1px solid var(--cardline)',
              borderRadius: 10,
              marginBottom: 16
            }}
          >
            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                MIN ORDER QTY
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                {selectedRegion.moq.toLocaleString()} pcs
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                LEAD TIME
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                {selectedRegion.leadTimeWeeks} weeks
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                BUFFER STOCK
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#24AB5C' }}>
                {selectedRegion.stockAvailable.toLocaleString()} ready
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                SPEC / MATERIAL
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {selectedRegion.materials.split('(')[0]}
              </span>
            </div>
          </div>

          {/* Certifications badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedRegion.certifications.map((cert) => (
                <span
                  key={cert}
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10px',
                    color: 'var(--mut)',
                    background: '#FFFFFF',
                    border: '1px solid var(--cardline)',
                    borderRadius: 999,
                    padding: '3px 8px'
                  }}
                >
                  ✓ {cert}
                </span>
              ))}
            </div>

            {/* Selection buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleSetFallback(selectedRegion)}
                style={{
                  background: fallbackId === selectedRegion.id ? '#F59E0B' : 'var(--tint)',
                  color: fallbackId === selectedRegion.id ? '#FFFFFF' : 'var(--ink)',
                  border: '1px solid var(--cardline)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {fallbackId === selectedRegion.id ? 'Held as Fallback ✓' : 'Set as Fallback (Reserve)'}
              </button>

              <button
                onClick={() => handleSetPrimary(selectedRegion)}
                style={{
                  background: primaryId === selectedRegion.id ? '#24AB5C' : '#309EFE',
                  color: primaryId === selectedRegion.id ? '#FFFFFF' : '#07122B',
                  border: 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {primaryId === selectedRegion.id ? 'Primary Source ✓' : 'Select as Primary'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
