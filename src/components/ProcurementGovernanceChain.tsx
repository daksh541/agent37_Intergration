import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  DollarSign,
  FileSignature,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ApprovalTier {
  id: string;
  role: string;
  name: string;
  title: string;
  department: string;
  threshold: string;
  signed: boolean;
  timestamp?: string;
  signatureHash?: string;
  comments: string;
}

interface ProcurementGovernanceChainProps {
  partName: string;
  totalAmount: number;
  poNumber: string;
  onAllApproved: () => void;
  isAllApproved: boolean;
}

export const ProcurementGovernanceChain: React.FC<ProcurementGovernanceChainProps> = ({
  partName,
  totalAmount,
  poNumber,
  onAllApproved,
  isAllApproved
}) => {
  const [tiers, setTiers] = useState<ApprovalTier[]>([
    {
      id: 'tier-eng',
      role: 'Engineering Lead',
      name: 'Dr. Elena Rostova',
      title: 'VP of Hardware Architecture',
      department: 'Avionics & Mechanical Eng',
      threshold: 'Technical Feasibility & Spec Tolerances',
      signed: isAllApproved,
      timestamp: isAllApproved ? 'Oct 25, 2026 · 10:14:22 EST' : undefined,
      signatureHash: isAllApproved ? 'RSA-4096: 0x9b4f2c81...eng' : undefined,
      comments: 'Toray T700 pre-preg carbon spec confirmed. Tolerances within ±0.05mm. AS9102 FAI required on first lot.'
    },
    {
      id: 'tier-sourcing',
      role: 'Procurement Director',
      name: 'Marcus Vance',
      title: 'Head of Global Sourcing & AVL',
      department: 'Strategic Procurement',
      threshold: 'Spend > $10,000 · Supplier SLA Lock',
      signed: isAllApproved,
      timestamp: isAllApproved ? 'Oct 25, 2026 · 10:18:05 EST' : undefined,
      signatureHash: isAllApproved ? 'RSA-4096: 0x4a18d9e2...scm' : undefined,
      comments: 'Supplier vetted on AVL. Incoterms 2020 DDP terms locked. Taiwan secondary backup source verified.'
    },
    {
      id: 'tier-finance',
      role: 'Corporate Controller',
      name: 'Sarah Jenkins, CPA',
      title: 'Director of Accounting & Treasury',
      department: 'Finance & AP Operations',
      threshold: 'Budget Cap & Cost Center Verification',
      signed: isAllApproved,
      timestamp: isAllApproved ? 'Oct 25, 2026 · 10:21:40 EST' : undefined,
      signatureHash: isAllApproved ? 'RSA-4096: 0x7c92f143...fin' : undefined,
      comments: 'Charged to Cost Center CC-401 (Aerospace Propulsion). Within Q4 CapEx buffer. Net-30 approved.'
    },
    {
      id: 'tier-exec',
      role: 'Chief Financial Officer',
      name: 'David Sterling',
      title: 'Executive VP & CFO',
      department: 'Executive Committee',
      threshold: 'High-Dollar Tier > $15,000 Sign-off',
      signed: isAllApproved,
      timestamp: isAllApproved ? 'Oct 25, 2026 · 10:24:12 EST' : undefined,
      signatureHash: isAllApproved ? 'RSA-4096: 0x3f55e09a...cfo' : undefined,
      comments: 'Capital expenditure authorized under institutional hardware procurement mandate.'
    }
  ]);

  const [signingId, setSigningId] = useState<string | null>(null);

  const allSigned = tiers.every((t) => t.signed);

  const handleSignTier = (id: string) => {
    setSigningId(id);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST`;
      const randomHash = `RSA-4096: 0x${Math.random().toString(16).substring(2, 10)}...${id.replace('tier-', '')}`;

      const updated = tiers.map((t) => (t.id === id ? { ...t, signed: true, timestamp: timeStr, signatureHash: randomHash } : t));
      setTiers(updated);
      setSigningId(null);

      if (updated.every((t) => t.signed)) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#309EFE', '#24AB5C', '#FFFFFF']
        });
        onAllApproved();
      }
    }, 450);
  };

  const handleApproveAll = () => {
    const now = new Date();
    const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} EST`;

    const updated = tiers.map((t) => ({
      ...t,
      signed: true,
      timestamp: t.timestamp || timeStr,
      signatureHash: t.signatureHash || `RSA-4096: 0x${Math.random().toString(16).substring(2, 10)}...sig`
    }));

    setTiers(updated);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#309EFE', '#24AB5C', '#FFFFFF']
    });
    onAllApproved();
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--cardline)',
        borderRadius: 14,
        padding: '18px 20px',
        boxShadow: '0 4px 18px rgba(7, 18, 43, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--cardline)', paddingBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: allSigned ? '#24AB5C' : '#309EFE' }} className="dot-pulse" />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', fontWeight: 700, color: allSigned ? '#24AB5C' : '#309EFE', letterSpacing: '0.08em' }}>
              INTERNAL SPEND GOVERNANCE & APPROVAL HIERARCHY
            </span>
          </div>
          <h3 style={{ fontFamily: "'Funnel Display', sans-serif", fontSize: '17px', fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            Procure-to-Pay (P2P) Authorization Chain
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--dim)', margin: '3px 0 0 0', lineHeight: 1.4 }}>
            Institutional governance requires 4-tier cryptographic sign-offs before formal PO issuance and vendor fund commitment.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span
            style={{
              fontSize: '10px',
              fontFamily: "'Roboto Mono', monospace",
              padding: '3px 9px',
              borderRadius: 6,
              fontWeight: 700,
              background: allSigned ? 'rgba(36, 171, 92, 0.1)' : 'rgba(48, 158, 254, 0.1)',
              color: allSigned ? '#24AB5C' : '#309EFE',
              border: `1px solid ${allSigned ? 'rgba(36, 171, 92, 0.3)' : 'rgba(48, 158, 254, 0.3)'}`
            }}
          >
            {allSigned ? '✓ 4 OF 4 TIERS AUTHORIZED' : `${tiers.filter((t) => t.signed).length} OF 4 SIGNED`}
          </span>
          {!allSigned && (
            <button
              onClick={handleApproveAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                background: 'rgba(48, 158, 254, 0.08)',
                border: '1px solid rgba(48, 158, 254, 0.25)',
                borderRadius: 5,
                fontSize: '10px',
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 600,
                color: '#309EFE',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={11} /> 1-Click Executive Quorum
            </button>
          )}
        </div>
      </div>

      {/* Department Cost Center & Budget Allocation HUD */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          background: 'var(--paper)',
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid var(--cardline)',
          fontSize: '11px'
        }}
      >
        <div>
          <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9.5px', display: 'block', marginBottom: 2 }}>
            DEPARTMENT COST CENTER
          </span>
          <span style={{ fontWeight: 700, color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
            CC-401 (Aerospace Propulsion)
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9.5px', display: 'block', marginBottom: 2 }}>
            GENERAL LEDGER CODE
          </span>
          <span style={{ fontWeight: 700, color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
            GL-5310 (Direct Materials)
          </span>
        </div>

        <div>
          <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9.5px', display: 'block', marginBottom: 2 }}>
            Q4 HARDWARE BUDGET REMAINING
          </span>
          <span style={{ fontWeight: 700, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
            $59,201.80 ($120k Cap)
          </span>
        </div>
      </div>

      {/* 4 Approval Tiers Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tiers.map((tier, idx) => (
          <div
            key={tier.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: 10,
              background: tier.signed ? 'rgba(36, 171, 92, 0.03)' : '#FFFFFF',
              border: `1px solid ${tier.signed ? 'rgba(36, 171, 92, 0.3)' : 'var(--cardline)'}`,
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: tier.signed ? 'rgba(36, 171, 92, 0.12)' : 'rgba(7, 18, 43, 0.05)',
                  color: tier.signed ? '#24AB5C' : 'var(--dim)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {tier.signed ? <CheckCircle2 size={17} /> : <Clock size={16} />}
              </div>

              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                    {tier.name}
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', background: 'rgba(7, 18, 43, 0.05)', padding: '1px 6px', borderRadius: 4 }}>
                    {tier.role}
                  </span>
                  <span style={{ fontSize: '9.5px', color: 'var(--dim)' }}>
                    ({tier.title})
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: 3, fontStyle: 'italic', lineHeight: 1.35 }}>
                  "{tier.comments}"
                </div>

                {tier.signed && tier.signatureHash && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: '#24AB5C' }}>
                    <span>{tier.signatureHash}</span>
                    <span style={{ color: 'var(--dim)' }}>· {tier.timestamp}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ flexShrink: 0, marginLeft: 14 }}>
              {tier.signed ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(36, 171, 92, 0.12)',
                    color: '#24AB5C',
                    fontSize: '10.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 700
                  }}
                >
                  <ShieldCheck size={13} /> APPROVED
                </span>
              ) : (
                <button
                  onClick={() => handleSignTier(tier.id)}
                  disabled={signingId === tier.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 6,
                    background: '#07122B',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <FileSignature size={12} />
                  {signingId === tier.id ? 'Signing...' : 'Sign & Approve'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Governance Confirmation Footer */}
      {allSigned && (
        <div
          style={{
            padding: '10px 14px',
            background: 'rgba(36, 171, 92, 0.08)',
            border: '1px solid rgba(36, 171, 92, 0.25)',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            color: '#07122B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={16} color="#24AB5C" />
            <span>
              Internal Governance Quorum Satisfied. Purchase Order <strong>{poNumber}</strong> unlocked for legal execution.
            </span>
          </div>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', color: '#24AB5C', fontWeight: 700 }}>
            SOX 404 COMPLIANT
          </span>
        </div>
      )}
    </div>
  );
};
