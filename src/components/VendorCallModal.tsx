import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ShieldCheck, CheckCircle2, User, Radio } from 'lucide-react';

interface VendorCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  partName: string;
  qty: number;
  unitPrice: number;
  onCallConfirmed?: () => void;
}

export const VendorCallModal: React.FC<VendorCallModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  partName,
  qty,
  unitPrice,
  onCallConfirmed
}) => {
  const [callState, setCallState] = useState<'dialing' | 'connected' | 'completed'>('dialing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [transcriptStep, setTranscriptStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCallState('dialing');
      setCallDuration(0);
      setTranscriptStep(0);
      return;
    }

    // Dialing -> Connected after 1.8s
    const connectTimer = setTimeout(() => {
      setCallState('connected');
    }, 1800);

    return () => clearTimeout(connectTimer);
  }, [isOpen]);

  useEffect(() => {
    if (callState !== 'connected') return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    const step1 = setTimeout(() => setTranscriptStep(1), 800);
    const step2 = setTimeout(() => setTranscriptStep(2), 2600);
    const step3 = setTimeout(() => setTranscriptStep(3), 4800);

    return () => {
      clearInterval(timer);
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  }, [callState]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

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
          background: '#07122B',
          color: '#FFFFFF',
          borderRadius: 20,
          border: '1.5px solid rgba(48, 158, 254, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(48, 158, 254, 0.2)',
          width: '100%',
          maxWidth: 480,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        {/* Call Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'wbBlink 1s infinite' }} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.08em' }}>
              REC · AI VENDOR TELEPHONY
            </span>
          </div>

          <span
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '10.5px',
              color: '#24AB5C',
              background: 'rgba(36, 171, 92, 0.15)',
              padding: '2px 8px',
              borderRadius: 4
            }}
          >
            SHA-256 ENCRYPTED
          </span>
        </div>

        {/* Contact Profile & Call State */}
        <div style={{ padding: '24px 22px 16px 22px', textAlign: 'center' }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #309EFE 0%, #0047AB 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              boxShadow: '0 0 24px rgba(48, 158, 254, 0.4)',
              position: 'relative'
            }}
          >
            <User size={34} />
            {callState === 'connected' && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: '#24AB5C',
                  border: '2px solid #07122B'
                }}
              />
            )}
          </div>

          <h3 style={{ fontFamily: "'Funnel Display', sans-serif", fontSize: '20px', fontWeight: 700, marginBottom: 2 }}>
            {vendorName}
          </h3>
          <div style={{ fontSize: '12px', color: '#309EFE', fontFamily: "'Roboto Mono', monospace", marginBottom: 6 }}>
            Senior Global Account Rep · Verified Supplier
          </div>

          <div style={{ fontSize: '13px', color: callState === 'connected' ? '#24AB5C' : 'rgba(255, 255, 255, 0.6)', fontFamily: "'Roboto Mono', monospace" }}>
            {callState === 'dialing' && 'Calling direct line...'}
            {callState === 'connected' && `Call Connected · ${formatTime(callDuration)} (HD Voice 48kHz)`}
            {callState === 'completed' && 'Call Concluded · Stock Verified'}
          </div>

          {/* Animated Audio Equalizer Waveform during Live Call */}
          {callState === 'connected' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                height: 36,
                margin: '16px auto 0 auto'
              }}
            >
              {[14, 28, 20, 34, 18, 30, 24, 36, 16, 26, 32, 18, 24].map((h, i) => (
                <span
                  key={i}
                  style={{
                    width: 3.5,
                    height: `${h}px`,
                    background: '#309EFE',
                    borderRadius: 3,
                    animation: `wbDotPulse ${0.6 + (i % 5) * 0.15}s infinite ease-in-out`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Audio Transcript Box */}
        <div
          style={{
            margin: '0 20px 20px 20px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 12,
            padding: '14px',
            maxHeight: 160,
            overflowY: 'auto',
            fontSize: '11.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}
        >
          {transcriptStep >= 1 && (
            <div>
              <span style={{ color: '#309EFE', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                AGENT37:
              </span>{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                "Calling to verify immediate inventory for {qty.toLocaleString()} pcs of {partName}. Can you honor ${unitPrice.toFixed(2)}/unit with Nov 18 delivery?"
              </span>
            </div>
          )}

          {transcriptStep >= 2 && (
            <div>
              <span style={{ color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                {vendorName} REP:
              </span>{' '}
              <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                "Confirmed! We have {Math.round(qty * 1.25).toLocaleString()} pcs in reel bin 4. Unit rate locked at ${unitPrice.toFixed(2)}. Packaging conforms to AS9100D and CoC is sealed for DHL Priority Air."
              </span>
            </div>
          )}

          {transcriptStep >= 3 && (
            <div style={{ color: '#309EFE', fontStyle: 'italic', fontSize: '11px' }}>
              ✓ Verbal quote confirmed and cryptographically signed into BOM audit record.
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 22px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: isMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: isMuted ? '#EF4444' : '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Speaker On"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                if (onCallConfirmed) onCallConfirmed();
                onClose();
              }}
              style={{
                background: '#24AB5C',
                color: '#07122B',
                border: 'none',
                borderRadius: 999,
                padding: '10px 18px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer'
              }}
            >
              <CheckCircle2 size={15} />
              Confirm & Lock Quote
            </button>

            <button
              onClick={onClose}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="End Call"
            >
              <PhoneOff size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
