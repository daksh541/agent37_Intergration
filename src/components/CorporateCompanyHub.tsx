import React, { useState } from 'react';
import {
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Layers,
  Plane,
  Package,
  CreditCard,
  DollarSign,
  ArrowRight,
  TrendingUp,
  X,
  Sparkles,
  Briefcase,
  FileText
} from 'lucide-react';

interface CorporateCompanyHubProps {
  isOpen: boolean;
  onClose: () => void;
  activePartName?: string;
  poNumber?: string;
  totalSpend?: number;
  onOpenSRM?: () => void;
  onOpenGovernance?: () => void;
}

export const CorporateCompanyHub: React.FC<CorporateCompanyHubProps> = ({
  isOpen,
  onClose,
  activePartName = 'Custom Drone Wings 450mm Carbon Fiber',
  poNumber = 'AG37-2026-9821',
  totalSpend = 18648.20,
  onOpenSRM,
  onOpenGovernance
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');

  if (!isOpen) return null;

  const departments = [
    {
      id: 'eng',
      name: 'Engineering & Requisition',
      lead: 'Dr. Elena Rostova',
      title: 'VP Hardware Architecture',
      teamSize: '14 Engineers',
      mandate: 'Parse natural language BOMs, mechanical CAD tolerances (±0.05mm), Toray pre-preg specs, and AS9102 FAI requirements.',
      status: 'Active · Spec Ingested',
      badgeColor: '#309EFE',
      kpi: '100% Spec Tolerance Verified'
    },
    {
      id: 'sourcing',
      name: 'Strategic Sourcing & Category Management',
      lead: 'Marcus Vance',
      title: 'Director of Global Sourcing & AVL',
      teamSize: '8 Category Buyers',
      mandate: 'Orthographic geospatial supplier scanning, Top 3 landed price benchmarking, VoIP audio wire & encrypted chat negotiations.',
      status: 'Active · AVL Sourced',
      badgeColor: '#24AB5C',
      kpi: '3.8% Cost Reduction Locked'
    },
    {
      id: 'governance',
      name: 'Spend Governance & Controllership',
      lead: 'Sarah Jenkins, CPA',
      title: 'Corporate Controller',
      teamSize: '6 Financial Analysts',
      mandate: 'Multi-tier spend approval hierarchy (Eng, SCM, Finance, CFO), Cost Center CC-401 & GL-5310 allocation, SOX 404 compliance.',
      status: 'Quorum Authorized',
      badgeColor: '#24AB5C',
      kpi: '$120k Q4 Budget Managed'
    },
    {
      id: 'srm',
      name: 'Supplier Relationship Management (SRM)',
      lead: 'Chloe Lindqvist',
      title: 'Head of Vendor Quality & Compliance',
      teamSize: '5 Quality Auditors',
      mandate: 'Institutional vendor master directory, OTIF performance scorecards, AS9100D/ITAR audits, Master Service Agreements (MSAs) & NDAs.',
      status: '5/5 Hubs Audited',
      badgeColor: '#309EFE',
      kpi: '97.5% Avg Global OTIF'
    },
    {
      id: 'logistics',
      name: 'Global Freight & Trade Compliance',
      lead: 'Capt. Jonathan Reyes',
      title: 'Director of Logistics & Customs',
      teamSize: '9 Freight Forwarders',
      mandate: 'Trans-pacific flight telemetry (Boeing 777F SZX ➜ SFO), e-AWB generation, HTS tariff duty classification (8807.30.0090), Customs Bill of Entry.',
      status: 'Flight On Schedule',
      badgeColor: '#309EFE',
      kpi: 'FL380 / 520 KTS Priority Air'
    },
    {
      id: 'qa',
      name: 'Dock Quality & Inventory Operations',
      lead: 'Mateo Rodriguez',
      title: 'Director of Warehouse & QA',
      teamSize: '18 Logistics Techs',
      mandate: 'Physical dock barcode sweep, AS9102 First Article Inspection sampling (AQL 0.65), Non-Conformance (NCR/RMA) quarantine, bin allocation.',
      status: 'Zero Variance Verified',
      badgeColor: '#24AB5C',
      kpi: '100% CMM Tolerance Pass'
    },
    {
      id: 'ap',
      name: 'Accounts Payable & ERP Reconciliation',
      lead: 'Priya Sharma',
      title: 'AP Operations Manager',
      teamSize: '5 AP Specialists',
      mandate: 'Zero-variance 3-way match (PO vs GRN vs Vendor Invoice), automated ledger settlement via ACH wire, NetSuite / SAP Coupa sync.',
      status: '3-Way Reconciled',
      badgeColor: '#24AB5C',
      kpi: 'Zero Accounting Variance'
    }
  ];

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
          maxWidth: 1040,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 70px rgba(7, 18, 43, 0.28)',
          overflow: 'hidden',
          border: '1px solid var(--cardline)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--cardline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8FAFD'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #07122B 0%, #1A2E5A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#309EFE'
              }}
            >
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#309EFE', letterSpacing: '0.08em' }}>
                  HOLISTIC ENTERPRISE PROCUREMENT ORGANIZATION
                </span>
                <span style={{ fontSize: '9px', background: 'rgba(36, 171, 92, 0.1)', color: '#24AB5C', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                  7 CROSS-FUNCTIONAL TEAMS
                </span>
              </div>
              <h2 style={{ fontFamily: "'Funnel Display', sans-serif", fontSize: '20px', fontWeight: 700, color: 'var(--ink)', margin: '2px 0 0 0' }}>
                Corporate Procurement Operating System
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
            <X size={22} />
          </button>
        </div>

        {/* Corporate Status HUD */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            padding: '12px 24px',
            background: '#FFFFFF',
            borderBottom: '1px solid var(--cardline)',
            fontSize: '11px'
          }}
        >
          <div>
            <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>ACTIVE REQUISITION</span>
            <div style={{ fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activePartName}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>PO CONTRACT DOCKET</span>
            <div style={{ fontWeight: 700, color: '#309EFE', fontFamily: "'Roboto Mono', monospace" }}>
              {poNumber} (SOX Verified)
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>TOTAL COMMITTED SPEND</span>
            <div style={{ fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
              ${totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>ORG SYNC STATUS</span>
            <div style={{ fontWeight: 700, color: '#07122B', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} className="dot-pulse" />
              All 7 Teams Aligned
            </div>
          </div>
        </div>

        {/* Department Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace', fontWeight: 600" }}>
            CROSS-FUNCTIONAL DEPARTMENT DIRECTORY & REAL-TIME WORKFLOW:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
            {departments.map((dept) => (
              <div
                key={dept.id}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--cardline)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  boxShadow: '0 2px 8px rgba(7, 18, 43, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', margin: '0 0 2px 0' }}>
                      {dept.name}
                    </h4>
                    <span style={{ fontSize: '10.5px', color: 'var(--dim)' }}>
                      Lead: <strong style={{ color: 'var(--ink)' }}>{dept.lead}</strong> ({dept.title})
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontFamily: "'Roboto Mono', monospace",
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(36, 171, 92, 0.1)',
                      color: dept.badgeColor,
                      border: `1px solid ${dept.badgeColor}40`
                    }}
                  >
                    {dept.status}
                  </span>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--mut)', margin: 0, lineHeight: 1.45 }}>
                  {dept.mandate}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid rgba(7, 18, 43, 0.06)',
                    paddingTop: 8,
                    fontSize: '10px',
                    fontFamily: "'Roboto Mono', monospace"
                  }}
                >
                  <span style={{ color: 'var(--dim)' }}>{dept.teamSize}</span>
                  <span style={{ color: '#24AB5C', fontWeight: 600 }}>{dept.kpi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--cardline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#F8FAFD'
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            {onOpenSRM && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSRM();
                }}
                style={{
                  padding: '7px 14px',
                  background: '#FFFFFF',
                  border: '1px solid var(--cardline)',
                  borderRadius: 6,
                  fontSize: '11px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Briefcase size={12} color="#309EFE" /> Open Supplier Master (SRM)
              </button>
            )}

            {onOpenGovernance && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGovernance();
                }}
                style={{
                  padding: '7px 14px',
                  background: '#FFFFFF',
                  border: '1px solid var(--cardline)',
                  borderRadius: 6,
                  fontSize: '11px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <ShieldCheck size={12} color="#24AB5C" /> Open Spend Governance
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '7px 18px',
              background: '#07122B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 6,
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close Company Hub
          </button>
        </div>
      </div>
    </div>
  );
};
