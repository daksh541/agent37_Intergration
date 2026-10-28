import React, { useState } from 'react';
import { ArrowUp, Paperclip, FileText, CheckCircle2 } from 'lucide-react';
import { PartRequest } from '../types';

interface OrderDeskChatProps {
  request: PartRequest;
  onUpdatePart: (mpn: string, qty: number, date: string) => void;
  onAdvanceToSourcing: () => void;
  onOpenChatbot?: () => void;
  status: string;
}

export const OrderDeskChat: React.FC<OrderDeskChatProps> = ({
  request,
  onUpdatePart,
  onAdvanceToSourcing,
  onOpenChatbot,
  status
}) => {
  const [inputText, setInputText] = useState(
    `Need ${request.requestedQty} pcs of ${request.mpn} on dock by ${request.needByDate}.`
  );
  const [activePill, setActivePill] = useState<'type' | 'bom' | 'plm' | 'drone'>('type');
  const [hasSent, setHasSent] = useState(status !== 'draft');

  const handleSend = () => {
    setHasSent(true);
    onAdvanceToSourcing();
  };

  const handleSelectPreset = (type: 'type' | 'bom' | 'plm' | 'drone') => {
    setActivePill(type);
    if (type === 'type') {
      setInputText('Need 2,500 pcs of STM32H743VIT6 on dock by Nov 14, 2026.');
      onUpdatePart('STM32H743VIT6', 2500, 'Nov 14, 2026');
    } else if (type === 'drone') {
      setInputText('I want drone wings of 450mm length, 65mm chord, matte carbon black, 1,200 pcs MOQ by Nov 18.');
      if (onOpenChatbot) {
        onOpenChatbot();
      }
    } else if (type === 'bom') {
      setInputText('Project Falcon 4K Drone BOM uploaded. 5 core lines, lead times < 2 weeks.');
      onUpdatePart('STM32H743VIT6', 2500, 'Nov 14, 2026');
    } else {
      setInputText('Altium 365 PLM sync completed. 1 line item requiring global distributor scan.');
      onUpdatePart('GM2804H-100T', 600, 'Nov 20, 2026');
    }
  };

  return (
    <section
      id="stage-ask"
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
        {/* Left Column: Story & Stepper */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Vertical Stepper track */}
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
                background: '#24AB5C',
                boxShadow: '0 0 10px rgba(36, 171, 92, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 180,
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
              01 / 05
            </span>
          </div>

          <div>
            {/* Eyebrow */}
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
              01 · The ask
            </div>

            {/* Title */}
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
              That's the first thing you did.
            </h2>

            {/* Description */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                lineHeight: 1.65,
                color: 'var(--mut)',
                maxWidth: '42ch'
              }}
            >
              The moment you hit send, Docket goes to work. You don't fill forms,
              open tickets, or brief anyone on context. Sourcing starts before you
              close the tab.
            </p>

            <div
              style={{
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '12px',
                color: '#24AB5C'
              }}
            >
              <CheckCircle2 size={16} />
              <span>Zero supplier back-and-forth required</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Desk Card (Screenshot 3) */}
        <div className="wb-card">
          {/* Card Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
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
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--dim)'
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} />
              docket · order desk
            </span>

            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: hasSent ? '#24AB5C' : 'var(--dim)'
              }}
            >
              {hasSent ? 'Sent' : 'Draft'}
            </span>
          </div>

          {/* Card Body */}
          <div
            style={{
              minHeight: 280,
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              background: '#FFFFFF'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                color: 'var(--dim)'
              }}
            >
              Your team · new request
            </div>

            {/* Quick Action Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleSelectPreset('plm')}
                style={{
                  border: activePill === 'plm' ? '1px solid #309EFE' : '1px solid var(--cardline)',
                  background: activePill === 'plm' ? 'rgba(48,158,254,0.08)' : 'var(--tint)',
                  borderRadius: 999,
                  padding: '5px 13px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: activePill === 'plm' ? '#309EFE' : 'var(--mut)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                from your PLM
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('bom')}
                style={{
                  border: activePill === 'bom' ? '1px solid #309EFE' : '1px solid var(--cardline)',
                  background: activePill === 'bom' ? 'rgba(48,158,254,0.08)' : 'var(--tint)',
                  borderRadius: 999,
                  padding: '5px 13px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: activePill === 'bom' ? '#309EFE' : 'var(--mut)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                paste a BOM
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('type')}
                style={{
                  border: activePill === 'type' ? '1px solid #309EFE' : '1px solid var(--cardline)',
                  background: activePill === 'type' ? 'rgba(48,158,254,0.08)' : 'var(--tint)',
                  borderRadius: 999,
                  padding: '5px 13px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 500,
                  color: activePill === 'type' ? '#309EFE' : 'var(--mut)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                just type it
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset('drone')}
                style={{
                  border: activePill === 'drone' ? '1.5px solid #309EFE' : '1px solid rgba(48, 158, 254, 0.4)',
                  background: activePill === 'drone' ? '#309EFE' : 'rgba(48, 158, 254, 0.1)',
                  borderRadius: 999,
                  padding: '5px 13px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 600,
                  color: activePill === 'drone' ? '#07122B' : '#309EFE',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                🛸 Drone Wings (AI Chatbot)
              </button>
            </div>

            {/* Chat Bubble: User Message */}
            <div
              style={{
                alignSelf: 'flex-end',
                maxWidth: '82%',
                background: 'rgba(48, 158, 254, 0.08)',
                border: '1px solid rgba(48, 158, 254, 0.35)',
                borderRadius: '16px 16px 4px 16px',
                padding: '13px 16px'
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--ink)' }}>
                {inputText}
              </div>

              <div
                style={{
                  marginTop: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  border: '1px solid var(--cardline)',
                  background: '#FFFFFF',
                  borderRadius: 7,
                  padding: '5px 10px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: '11px',
                  color: 'var(--mut)'
                }}
              >
                <FileText size={13} color="var(--dim)" />
                {activePill === 'bom' ? 'Project_Falcon_BOM.csv' : 'spec_request.json'}
              </div>
            </div>

            {/* Chat Bubble: Docket Acknowledgment */}
            {hasSent && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '75%',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div
                  style={{
                    background: 'var(--tint)',
                    border: '1px solid var(--cardline)',
                    borderRadius: '16px 16px 16px 4px',
                    padding: '12px 16px',
                    fontSize: '13.5px',
                    lineHeight: 1.5,
                    color: 'var(--mut)'
                  }}
                >
                  Received. Sourcing starts now. Working DigiKey, Mouser, and Arrow in parallel.
                </div>
                <div
                  style={{
                    marginTop: 5,
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    color: 'var(--dim)'
                  }}
                >
                  docket · just now
                </div>
              </div>
            )}
          </div>

          {/* Card Footer: Interactive Input Bar */}
          <div
            style={{
              borderTop: '1px solid var(--cardline)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'var(--tint)'
            }}
          >
            <div
              style={{
                flex: 1,
                border: '1px solid var(--cardline)',
                background: '#FFFFFF',
                borderRadius: 12,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Enter part number, quantity, and need-by date..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '13.5px',
                  color: 'var(--ink)',
                  background: 'transparent'
                }}
              />
              <button
                type="button"
                onClick={() => handleSelectPreset('bom')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--dim)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Attach BOM"
              >
                <Paperclip size={16} />
              </button>
            </div>

            <button
              onClick={handleSend}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#309EFE',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 10px rgba(48, 158, 254, 0.45)',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Send to Sourcing"
            >
              <ArrowUp size={18} color="#07122B" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
