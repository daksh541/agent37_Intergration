import React, { useState } from 'react';
import { Send, MessageSquare, ShieldCheck, CheckCheck, Paperclip, Bot, User, CheckCircle2, X, Sparkles } from 'lucide-react';
import { generateVendorChatReply } from '../services/geminiService';

interface VendorTextingWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  partName: string;
  qty: number;
  unitPrice: number;
  onApplyTerms?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'agent' | 'vendor';
  text: string;
  time: string;
}

export const VendorTextingWidget: React.FC<VendorTextingWidgetProps> = ({
  isOpen,
  onClose,
  vendorName,
  partName,
  qty,
  unitPrice,
  onApplyTerms
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: `Hello ${vendorName} sales desk, Docket is dispatching an autonomous procurement request for ${qty.toLocaleString()} pcs of ${partName}. Can you confirm immediate warehouse allocation at $${unitPrice.toFixed(2)}/unit?`,
      time: '10:41 AM'
    },
    {
      id: 'm2',
      sender: 'vendor',
      text: `Hello! Yes, we have verified inventory of ${Math.round(qty * 1.3).toLocaleString()} units in reel bins. We can guarantee $${unitPrice.toFixed(2)} unit rate. Full AS9100D CoC and RoHS 3 test reports will be attached to the e-AWB customs dossier.`,
      time: '10:42 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    setIsTyping(true);

    // Call real Gemini 2.5 Flash API for vendor technical sales reply
    generateVendorChatReply([...messages, newMsg], vendorName, partName, qty, unitPrice)
      .then((reply) => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-rep-${Date.now()}`,
            sender: 'vendor',
            text: reply,
            time: 'Just now'
          }
        ]);
        setIsTyping(false);
      })
      .catch(() => {
        setIsTyping(false);
      });
  };

  const quickChips = [
    'Please verify RoHS 3 & REACH certificates',
    'Can we expedite delivery via DHL Priority Air?',
    'Confirm tape & reel packaging standards',
    'Lock price at Net-30 payment terms'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(7, 18, 43, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          color: '#07122B',
          borderRadius: 18,
          border: '1px solid rgba(7, 18, 43, 0.12)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: 520,
          height: 560,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
            background: '#FAFBFD'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#309EFE',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              {vendorName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)' }}>
                {vendorName} · RFQ Desk
              </div>
              <div style={{ fontSize: '10.5px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#24AB5C' }} />
                Online · Instant Supplier Gateway
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--dim)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message Thread */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: '#F8FAFD'
          }}
        >
          {messages.map((m) => {
            const isAgent = m.sender === 'agent';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isAgent ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    background: isAgent ? '#07122B' : '#FFFFFF',
                    color: isAgent ? '#FFFFFF' : '#07122B',
                    padding: '10px 14px',
                    borderRadius: isAgent ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    fontSize: '12.5px',
                    lineHeight: 1.5,
                    boxShadow: '0 2px 8px rgba(7, 18, 43, 0.04)',
                    border: isAgent ? 'none' : '1px solid rgba(7, 18, 43, 0.08)'
                  }}
                >
                  <div>{m.text}</div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      color: isAgent ? 'rgba(255, 255, 255, 0.6)' : 'var(--dim)',
                      textAlign: 'right',
                      marginTop: 4,
                      fontFamily: "'Roboto Mono', monospace"
                    }}
                  >
                    {m.time} {isAgent && '✓✓'}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--dim)', fontSize: '11px', fontFamily: "'Roboto Mono', monospace" }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#309EFE', animation: 'wbBlink 1s infinite' }} />
              {vendorName} representative is typing...
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '8px 14px',
            overflowX: 'auto',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(7, 18, 43, 0.06)'
          }}
          className="no-scrollbar"
        >
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              style={{
                background: 'rgba(48, 158, 254, 0.06)',
                border: '1px solid rgba(48, 158, 254, 0.25)',
                color: '#309EFE',
                borderRadius: 14,
                padding: '4px 10px',
                fontSize: '10.5px',
                fontFamily: "'Roboto Mono', monospace",
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              + {chip}
            </button>
          ))}
        </div>

        {/* Input & Action Bar */}
        <div
          style={{
            padding: '12px 16px',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(7, 18, 43, 0.08)',
            display: 'flex',
            gap: 8,
            alignItems: 'center'
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message to vendor..."
            style={{
              flex: 1,
              padding: '9px 12px',
              border: '1.5px solid rgba(7, 18, 43, 0.14)',
              borderRadius: 8,
              fontSize: '12.5px',
              outline: 'none',
              fontFamily: "'Inter', sans-serif"
            }}
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            style={{
              padding: '9px 14px',
              background: inputVal.trim() ? '#309EFE' : 'rgba(7, 18, 43, 0.1)',
              color: inputVal.trim() ? '#07122B' : 'rgba(7, 18, 43, 0.3)',
              border: 'none',
              borderRadius: 8,
              cursor: inputVal.trim() ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Send size={15} />
          </button>

          <button
            onClick={() => {
              if (onApplyTerms) onApplyTerms();
              onClose();
            }}
            className="btn-primary"
            style={{ padding: '9px 14px', fontSize: '11.5px', whiteSpace: 'nowrap' }}
          >
            Apply Terms
          </button>
        </div>
      </div>
    </div>
  );
};
