import React, { useState } from 'react';
import { Scan, CheckCircle, Bell, ArrowRight } from 'lucide-react';

interface DockReceivingScanProps {
  onScanComplete: () => void;
  status: string;
}

export const DockReceivingScan: React.FC<DockReceivingScanProps> = ({
  onScanComplete,
  status
}) => {
  const [isScanned, setIsScanned] = useState(
    status === 'dock_scanned' || status === 'reconciled' || status === 'closed'
  );
  const [scanPulse, setScanPulse] = useState(false);

  const handleScan = () => {
    setScanPulse(true);
    setTimeout(() => {
      setScanPulse(false);
      setIsScanned(true);
      onScanComplete();
    }, 700);
  };

  return (
    <section
      id="stage-dock"
      className="stage-dotted-bg"
      style={{
        padding: '90px 24px 100px',
        borderTop: '1px solid rgba(7, 18, 43, 0.08)'
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 460px) minmax(360px, 680px)',
          gap: 60,
          alignItems: 'center'
        }}
      >
        {/* Left Column: Story */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 6
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: isScanned ? '#24AB5C' : '#309EFE',
                boxShadow: isScanned ? '0 0 10px rgba(36, 171, 92, 0.5)' : '0 0 10px rgba(48, 158, 254, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 220,
                background: 'linear-gradient(to bottom, #24AB5C, rgba(7, 18, 43, 0.12))',
                margin: '6px 0'
              }}
            />
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                color: 'var(--dim)',
                whiteSpace: 'nowrap'
              }}
            >
              04 / 05
            </span>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dim)',
                marginBottom: 14
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} />
              04 · Receiving
            </div>

            <h2
              style={{
                fontFamily: "'Funnel Display', sans-serif",
                fontSize: 'clamp(32px, 3.2vw, 46px)',
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: '-0.018em',
                color: 'var(--ink)',
                marginBottom: 16
              }}
            >
              Scan the label.<br />Docket knows the box.
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                lineHeight: 1.65,
                color: 'var(--mut)',
                maxWidth: '42ch',
                marginBottom: 20
              }}
            >
              The box arrives, your team scans the label, and Docket knows
              exactly what's inside, because it has managed this order end to end.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, fontSize: '14px', color: 'var(--mut)' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#24AB5C', fontWeight: 'bold' }}>•</span>
                <span>Everyone who asked for the parts gets pinged that they've landed.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#24AB5C', fontWeight: 'bold' }}>•</span>
                <span>Inventory updates itself, down to the bin and the project reserved.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span style={{ color: '#24AB5C', fontWeight: 'bold' }}>•</span>
                <span>The supplier's invoice and receiving slip match three ways automatically.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Dock Card (Screenshot 11) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="wb-card" style={{ padding: '24px 28px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--dim)',
                  textTransform: 'uppercase'
                }}
              >
                RECEIVING · YOUR DOCK
              </span>

              <button
                onClick={handleScan}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: isScanned ? 'rgba(36, 171, 92, 0.1)' : '#309EFE',
                  color: isScanned ? '#24AB5C' : '#07122B',
                  border: isScanned ? '1px solid #24AB5C' : 'none',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Scan size={13} className={scanPulse ? 'dot-pulse' : ''} />
                {isScanned ? 'Label Scanned ✓' : 'Simulate Dock Scan'}
              </button>
            </div>

            {/* Carton Barcode Display */}
            <div
              style={{
                background: 'var(--tint)',
                border: '1px solid var(--cardline)',
                borderRadius: 12,
                padding: '20px 24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 4
                }}
              >
                YOUR COMPANY
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginBottom: 14 }}>
                carton label · matched to order #PO-2026-8841
              </div>

              {/* Barcode lines */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  height: 48,
                  margin: '0 auto 12px'
                }}
              >
                {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 2, 6, 3, 1, 5, 2, 4, 6, 2, 3, 5, 1, 4, 6, 2, 3, 5, 1, 4].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: i % 3 === 0 ? 3 : 1.5,
                      height: `${32 + (h * 2)}px`,
                      background: scanPulse ? '#309EFE' : '#07122B',
                      transition: 'background 0.2s ease'
                    }}
                  />
                ))}
              </div>

              {/* Matched Confirmation */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  color: '#24AB5C',
                  fontSize: '12.5px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 600
                }}
              >
                <CheckCircle size={14} />
                Contents matched to the order
              </div>
            </div>

            {/* Team Slack/App Ping */}
            <div
              style={{
                marginTop: 18,
                background: 'rgba(48, 158, 254, 0.05)',
                border: '1px solid rgba(48, 158, 254, 0.25)',
                borderRadius: 10,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: '#309EFE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#07122B'
                  }}
                >
                  <Bell size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                    #hardware · docket app
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                    Your order landed. On shelf BIN-A3-44 shortly.
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '10px',
                  color: '#24AB5C',
                  background: 'rgba(36, 171, 92, 0.1)',
                  padding: '3px 8px',
                  borderRadius: 999
                }}
              >
                notified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
