import React, { useState } from 'react';
import { ShieldCheck, Award, FileCheck2, Download, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

interface ComplianceProps {
  partName?: string;
  material?: string;
  supplierName?: string;
}

export const ComplianceDossier: React.FC<ComplianceProps> = ({
  partName = 'Drone Wings 450mm Carbon Fiber',
  material = 'Toray 3K Pre-preg Carbon Fiber (T700S / Ep-240)',
  supplierName = 'AeroCarbon Tech Ltd (Shenzhen)'
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const complianceStandards = [
    {
      code: 'RoHS 3',
      name: 'EU Directive 2015/863',
      status: 'Compliant (10/10 substances)',
      detail: 'Pb, Hg, Cd, Cr VI, PBB, PBDE, DEHP, BBP, DBP, DIBP < 0.1% max concentration',
      verified: true,
      lab: 'SGS Hong Kong Lab #SGS-HK-9921'
    },
    {
      code: 'REACH SVHC',
      name: 'EC Regulation 1907/2006',
      status: '0 Substances Above 0.1% w/w',
      detail: 'Screened against 240 SVHC candidate list (ECHA updated 2026)',
      verified: true,
      lab: 'TÜV Rheinland InterCert #TR-8812'
    },
    {
      code: 'AS9100 Rev D',
      name: 'Aerospace Quality Management System',
      status: 'Certified Facility (Audited Feb 2026)',
      detail: 'Equivalent to EN 9100:2018 / JISQ 9100. Lot trace code: #LT-2026-904',
      verified: true,
      lab: 'BSI Aerospace Registrar #FM-729901'
    },
    {
      code: 'ISO 9001:2015',
      name: 'Quality Management Systems',
      status: 'Active Certification',
      detail: 'Precision CNC machining & automated autoclave cure cycle control',
      verified: true,
      lab: 'DNV GL Business Assurance'
    },
    {
      code: 'CMA / MTR',
      name: 'Material Test Report & Lot CoC',
      status: 'Tensile Modulus 230 GPa Passed',
      detail: 'Resin content 33% ± 2%, Glass transition temp Tg 132°C, Defect ultrasonic C-scan clean',
      verified: true,
      lab: 'National Composite Testing Center'
    }
  ];

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(240px, 0.9fr)', gap: 18, alignItems: 'flex-start' }}>
      {/* Standards List Card */}
      <div className="wb-card" style={{ padding: '24px 26px', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
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
            <ShieldCheck size={14} color="#24AB5C" />
            REGULATORY & QUALITY DOSSIER
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              color: '#24AB5C',
              background: 'rgba(36, 171, 92, 0.08)',
              padding: '3px 8px',
              borderRadius: 4,
              fontWeight: 600
            }}
          >
            <CheckCircle2 size={12} />
            AUDIT PASSED (100%)
          </span>
        </div>

        {/* Item context */}
        <div
          style={{
            background: 'var(--paper)',
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 20,
            border: '1px solid var(--cardline)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Component:</span>
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{partName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Raw Material:</span>
            <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{material}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Certified Supplier:</span>
            <span style={{ fontWeight: 500, color: '#309EFE' }}>{supplierName}</span>
          </div>
        </div>

        {/* Compliance Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {complianceStandards.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                paddingBottom: idx < complianceStandards.length - 1 ? 14 : 0,
                borderBottom: idx < complianceStandards.length - 1 ? '1px solid rgba(7, 18, 43, 0.06)' : 'none'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'rgba(36, 171, 92, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2
                }}
              >
                <CheckCircle2 size={15} color="#24AB5C" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, fontSize: '12px', color: 'var(--ink)' }}>
                      {item.code}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--dim)' }}>
                      {item.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'Roboto Mono', monospace",
                      fontSize: '11px',
                      color: '#24AB5C',
                      fontWeight: 600
                    }}
                  >
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--dim)', marginTop: 3 }}>
                  {item.detail}
                </div>
                <div style={{ fontSize: '10.5px', color: 'rgba(7, 18, 43, 0.45)', marginTop: 2, fontFamily: "'Roboto Mono', monospace" }}>
                  Verified by: {item.lab}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Card: Material Certificate of Conformance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="wb-card" style={{ padding: '22px 20px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Award size={16} color="#309EFE" />
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              LAB TEST SPECIFICATION
            </span>
          </div>

          <div
            style={{
              border: '1px dashed rgba(48, 158, 254, 0.35)',
              background: 'rgba(48, 158, 254, 0.03)',
              borderRadius: 8,
              padding: 14,
              marginBottom: 16
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Tensile Strength:</span>
                <span style={{ fontWeight: 600 }}>4,900 MPa (Toray T700)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Young's Modulus:</span>
                <span style={{ fontWeight: 600 }}>230 GPa (Aerospace Grade)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Resin Matrix:</span>
                <span style={{ fontWeight: 600 }}>Epoxy thermoset Tg 132°C</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>Flammability:</span>
                <span style={{ fontWeight: 600, color: '#24AB5C' }}>UL94 V-0 Self-extinguishing</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>3TG Conflict Minerals:</span>
                <span style={{ fontWeight: 600, color: '#24AB5C' }}>Conflict-Free Verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 8,
              background: downloaded ? 'rgba(36, 171, 92, 0.1)' : 'var(--paper)',
              color: downloaded ? '#24AB5C' : 'var(--ink)',
              border: `1px solid ${downloaded ? '#24AB5C' : 'var(--cardline)'}`,
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease'
            }}
          >
            {downloaded ? (
              <>
                <CheckCircle2 size={14} color="#24AB5C" />
                Certificate Pack Downloaded (.zip)
              </>
            ) : (
              <>
                <Download size={14} />
                Download CoC & Test Pack (.pdf)
              </>
            )}
          </button>
        </div>

        {/* Chain of Custody Stamp */}
        <div
          className="wb-card"
          style={{
            padding: '18px 20px',
            background: 'linear-gradient(135deg, rgba(7, 18, 43, 0.02) 0%, rgba(48, 158, 254, 0.04) 100%)',
            border: '1px solid var(--cardline)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <FileCheck2 size={15} color="#309EFE" />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 600, color: 'var(--ink)' }}>
              CHAIN OF CUSTODY SEAL
            </span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--dim)', lineHeight: 1.5, margin: 0 }}>
            Every raw fiber spool and component batch is cryptographically hashed to supplier autoclave logs. Zero counterfeit risk.
          </p>
        </div>
      </div>
    </div>
  );
};
