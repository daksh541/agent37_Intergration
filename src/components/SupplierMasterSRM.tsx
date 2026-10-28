import React, { useState } from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  FileCheck2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Percent,
  Clock,
  Download,
  Filter,
  X
} from 'lucide-react';

export interface SRMSupplier {
  id: string;
  name: string;
  cluster: string;
  country: string;
  airport: string;
  otifRate: number; // On-Time In-Full %
  ppmDefects: number; // Parts Per Million defect rate
  leadTimeWeeks: number;
  riskScore: 'Low Risk' | 'Medium Risk' | 'Minimal Risk';
  riskColor: string;
  certifications: string[];
  msaNumber: string;
  msaExpiry: string;
  ndaActive: boolean;
  cageCode?: string;
  paymentTerms: string;
  incoterms: string;
  cleanroomSpec: string;
  auditScore: number;
  status: 'Preferred AVL' | 'Active AVL' | 'Backup Reserve';
}

const MASTER_SUPPLIERS: SRMSupplier[] = [
  {
    id: 'srm-01',
    name: 'AeroCarbon Precision Ltd',
    cluster: 'Shenzhen Aerospace Cluster (Bao’an)',
    country: 'China',
    airport: 'SZX · Shenzhen Bao’an',
    otifRate: 98.4,
    ppmDefects: 14,
    leadTimeWeeks: 1.5,
    riskScore: 'Low Risk',
    riskColor: '#24AB5C',
    certifications: ['AS9100D Rev D', 'ISO 9001:2015', 'RoHS 3 (EU 2015/863)', 'REACH SVHC', 'Nadcap Composite'],
    msaNumber: 'MSA-2024-881',
    msaExpiry: 'Dec 31, 2027',
    ndaActive: true,
    paymentTerms: 'Net 30 Days (2% 10 Net 30)',
    incoterms: 'DDP (Delivered Duty Paid)',
    cleanroomSpec: 'ISO Class 7 (Fed Std 209E Class 10,000)',
    auditScore: 99.4,
    status: 'Preferred AVL'
  },
  {
    id: 'srm-02',
    name: 'Apex Aero Composites Corp',
    cluster: 'Taichung Precision Machinery Park',
    country: 'Taiwan',
    airport: 'RMQ · Taichung International',
    otifRate: 97.9,
    ppmDefects: 18,
    leadTimeWeeks: 2.0,
    riskScore: 'Low Risk',
    riskColor: '#24AB5C',
    certifications: ['AS9100D', 'ISO 9001:2015', 'RoHS 3', 'REACH', 'JISQ 9100'],
    msaNumber: 'MSA-2025-102',
    msaExpiry: 'Aug 15, 2028',
    ndaActive: true,
    paymentTerms: 'Net 45 Days',
    incoterms: 'DDP (Delivered Duty Paid)',
    cleanroomSpec: 'ISO Class 8 Autoclave Curing',
    auditScore: 97.2,
    status: 'Preferred AVL'
  },
  {
    id: 'srm-03',
    name: 'Pacific Aero Dynamics LLC',
    cluster: 'Torrance Aerospace Corridor (South Bay)',
    country: 'USA',
    airport: 'LAX · Los Angeles Cargo',
    otifRate: 99.2,
    ppmDefects: 6,
    leadTimeWeeks: 1.0,
    riskScore: 'Minimal Risk',
    riskColor: '#309EFE',
    certifications: ['ITAR Registered', 'AS9100D Rev D', 'NIST SP 800-171', 'FAA Part 21', 'MIL-SPEC 45208'],
    msaNumber: 'DFA-2023-441',
    msaExpiry: 'Nov 30, 2029',
    ndaActive: true,
    cageCode: 'CAGE: 7K9L2',
    paymentTerms: 'Net 30 Days',
    incoterms: 'FOB Destination / Domestic Air',
    cleanroomSpec: 'Class 1,000 Precision Assembly',
    auditScore: 99.8,
    status: 'Active AVL'
  },
  {
    id: 'srm-04',
    name: 'Bodensee Aerospace Composites GmbH',
    cluster: 'Lake Constance Aerospace Valley',
    country: 'Germany',
    airport: 'FDH · Friedrichshafen',
    otifRate: 96.8,
    ppmDefects: 22,
    leadTimeWeeks: 2.5,
    riskScore: 'Low Risk',
    riskColor: '#24AB5C',
    certifications: ['EASA Part 21G', 'EN 9100:2018', 'ISO 14001', 'DIN EN ISO 50001'],
    msaNumber: 'MSA-EU-2024-09',
    msaExpiry: 'Jun 30, 2027',
    ndaActive: true,
    paymentTerms: 'Net 60 Days',
    incoterms: 'DDP (Delivered Duty Paid)',
    cleanroomSpec: 'EN Class 7 Autoclave',
    auditScore: 95.5,
    status: 'Active AVL'
  },
  {
    id: 'srm-05',
    name: 'Baja Aerospace Machining S.A.',
    cluster: 'Mexicali Aerospace Cluster',
    country: 'Mexico',
    airport: 'MXL · General Rodolfo Sánchez',
    otifRate: 95.1,
    ppmDefects: 34,
    leadTimeWeeks: 1.8,
    riskScore: 'Medium Risk',
    riskColor: '#F59E0B',
    certifications: ['USMCA Form 434 (Duty-Free)', 'AS9100D', 'ISO 9001:2015', 'CTPAT Certified'],
    msaNumber: 'MSA-MX-2025-77',
    msaExpiry: 'Mar 15, 2026',
    ndaActive: true,
    paymentTerms: 'Net 30 Days',
    incoterms: 'DDP / USMCA Truckload',
    cleanroomSpec: 'Semi-cleanroom machining',
    auditScore: 92.4,
    status: 'Backup Reserve'
  }
];

interface SupplierMasterSRMProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSupplierName?: string;
  onSelectSupplier?: (supplierName: string) => void;
}

export const SupplierMasterSRM: React.FC<SupplierMasterSRMProps> = ({
  isOpen,
  onClose,
  selectedSupplierName,
  onSelectSupplier
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SRMSupplier>(
    MASTER_SUPPLIERS.find((s) => s.name === selectedSupplierName) || MASTER_SUPPLIERS[0]
  );

  if (!isOpen) return null;

  const filtered = MASTER_SUPPLIERS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.cluster.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.certifications.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 18, 43, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 60px rgba(7, 18, 43, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--cardline)'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--cardline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8FAFD'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'rgba(48, 158, 254, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#309EFE'
              }}
            >
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#309EFE', letterSpacing: '0.08em' }}>
                  INSTITUTIONAL SRM & AVL MASTER DIRECTORY
                </span>
                <span style={{ fontSize: '9px', background: 'rgba(36, 171, 92, 0.1)', color: '#24AB5C', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>
                  5 VERIFIED HUBS
                </span>
              </div>
              <h2 style={{ fontFamily: "'Funnel Display', sans-serif", fontSize: '18px', fontWeight: 700, color: 'var(--ink)', margin: '1px 0 0 0' }}>
                Supplier Relationship Management Console
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--dim)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Global SRM KPI Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            padding: '12px 22px',
            background: '#FFFFFF',
            borderBottom: '1px solid var(--cardline)'
          }}
        >
          <div>
            <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>AVG ON-TIME DELIVERY (OTIF)</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
              97.5% <span style={{ fontSize: '10px', color: 'var(--dim)', fontWeight: 400 }}>target &gt; 95%</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>QUALITY DEFECT YIELD</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace" }}>
              19 PPM <span style={{ fontSize: '10px', color: '#24AB5C', fontWeight: 400 }}>(Aerospace Grade)</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>COMPLIANCE AUDIT RATE</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace" }}>
              100% <span style={{ fontSize: '10px', color: 'var(--dim)', fontWeight: 400 }}>AS9100D Audited</span>
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>ACTIVE MSAs / NDAs</span>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace" }}>
              5 / 5 <span style={{ fontSize: '10px', color: '#24AB5C', fontWeight: 400 }}>Legally Binding</span>
            </div>
          </div>
        </div>

        {/* Main Content Area (Split 2-Column: Supplier List & Detail Dossier) */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Left Column: Supplier Master List */}
          <div
            style={{
              borderRight: '1px solid var(--cardline)',
              display: 'flex',
              flexDirection: 'column',
              background: '#F8FAFD',
              minHeight: 0
            }}
          >
            {/* Search Input */}
            <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--cardline)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  border: '1px solid var(--cardline)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  gap: 6
                }}
              >
                <Search size={13} color="var(--dim)" />
                <input
                  type="text"
                  placeholder="Filter AVL by name, cert, hub..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '11px',
                    width: '100%',
                    fontFamily: "'Inter', sans-serif"
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
              {filtered.map((s) => {
                const isSelected = selectedSupplier.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSupplier(s)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: isSelected ? '#FFFFFF' : 'transparent',
                      border: isSelected ? '1px solid #309EFE' : '1px solid transparent',
                      boxShadow: isSelected ? '0 2px 8px rgba(48, 158, 254, 0.12)' : 'none',
                      cursor: 'pointer',
                      marginBottom: 6,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                        {s.name}
                      </span>
                      <span
                        style={{
                          fontSize: '8.5px',
                          fontFamily: "'Roboto Mono', monospace",
                          padding: '1px 5px',
                          borderRadius: 3,
                          fontWeight: 700,
                          background: s.status === 'Preferred AVL' ? 'rgba(36, 171, 92, 0.1)' : 'rgba(48, 158, 254, 0.1)',
                          color: s.status === 'Preferred AVL' ? '#24AB5C' : '#309EFE'
                        }}
                      >
                        {s.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '10.5px', color: 'var(--dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.cluster}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace" }}>
                      <span style={{ color: '#24AB5C' }}>OTIF: {s.otifRate}%</span>
                      <span style={{ color: 'var(--dim)' }}>PPM: {s.ppmDefects}</span>
                      <span style={{ color: s.riskColor, fontWeight: 600 }}>{s.riskScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Supplier Dossier & Scorecard */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--cardline)', paddingBottom: 14 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
                    {selectedSupplier.name}
                  </h3>
                  {selectedSupplier.cageCode && (
                    <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", background: 'rgba(7, 18, 43, 0.06)', padding: '2px 6px', borderRadius: 4, color: 'var(--ink)' }}>
                      {selectedSupplier.cageCode}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--dim)' }}>
                  {selectedSupplier.cluster} · Airport: <strong style={{ color: 'var(--ink)' }}>{selectedSupplier.airport}</strong>
                </div>
              </div>

              {onSelectSupplier && (
                <button
                  onClick={() => {
                    onSelectSupplier(selectedSupplier.name);
                    onClose();
                  }}
                  style={{
                    padding: '7px 14px',
                    background: '#07122B',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 6,
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <CheckCircle2 size={13} color="#24AB5C" /> Designate for Requisition
                </button>
              )}
            </div>

            {/* Scorecard Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--cardline)' }}>
                <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>OTIF ADHERENCE</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace' " }}>
                  {selectedSupplier.otifRate}%
                </div>
              </div>

              <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--cardline)' }}>
                <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>DEFECT YIELD</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace' " }}>
                  {selectedSupplier.ppmDefects} PPM
                </div>
              </div>

              <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--cardline)' }}>
                <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>AUDIT SCORE</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace' " }}>
                  {selectedSupplier.auditScore} / 100
                </div>
              </div>

              <div style={{ background: 'var(--paper)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--cardline)' }}>
                <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>TYPICAL LEAD TIME</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#07122B', fontFamily: "'Roboto Mono', monospace' " }}>
                  {selectedSupplier.leadTimeWeeks} Weeks
                </div>
              </div>
            </div>

            {/* Certifications Badges */}
            <div>
              <span style={{ fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', display: 'block', marginBottom: 6 }}>
                ACTIVE CERTIFICATIONS & REGULATORY ACCREDITATIONS:
              </span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedSupplier.certifications.map((c, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '10px',
                      fontFamily: "'Roboto Mono', monospace",
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(48, 158, 254, 0.08)',
                      border: '1px solid rgba(48, 158, 254, 0.25)',
                      color: '#07122B',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <ShieldCheck size={11} color="#309EFE" />
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Contract & Commercial Terms */}
            <div style={{ background: 'var(--paper)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--cardline)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', letterSpacing: '0.06em' }}>
                CONTRACTUAL SLA & COMMERCIAL PARAMETERS:
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, fontSize: '11.5px' }}>
                <div>
                  <span style={{ color: 'var(--dim)', fontSize: '10px', display: 'block' }}>Master Service Agreement (MSA)</span>
                  <strong style={{ color: 'var(--ink)' }}>{selectedSupplier.msaNumber}</strong>
                  <span style={{ color: 'var(--dim)', fontSize: '10px', marginLeft: 6 }}>(Expires {selectedSupplier.msaExpiry})</span>
                </div>

                <div>
                  <span style={{ color: 'var(--dim)', fontSize: '10px', display: 'block' }}>Mutual Non-Disclosure Agreement (NDA)</span>
                  <strong style={{ color: '#24AB5C' }}>✓ Active & Bound in Perpetuity</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--dim)', fontSize: '10px', display: 'block' }}>Payment Terms</span>
                  <strong style={{ color: 'var(--ink)' }}>{selectedSupplier.paymentTerms}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--dim)', fontSize: '10px', display: 'block' }}>Standard Incoterms 2020</span>
                  <strong style={{ color: 'var(--ink)' }}>{selectedSupplier.incoterms}</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(7, 18, 43, 0.06)', paddingTop: 8, fontSize: '11px', color: 'var(--mut)' }}>
                Cleanroom Specification: <strong style={{ color: 'var(--ink)' }}>{selectedSupplier.cleanroomSpec}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: '1px solid var(--cardline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8FAFD'
          }}
        >
          <span style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
            Docket SRM v2.4 · Continuous Automated Telemetry Sync
          </span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 16px',
              background: '#07122B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
