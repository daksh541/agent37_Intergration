import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onScrollToNext: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart, onScrollToNext }) => {
  return (
    <section
      id="main"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        overflow: 'hidden'
      }}
    >
      {/* Waybill signature bottom radial glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '42vh',
          opacity: 0.65,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 58% 130% at 50% 108%, rgba(178,230,222,.95) 0%, rgba(48,158,254,.6) 26%, rgba(48,158,254,.16) 55%, rgba(0,0,0,0) 74%)'
        }}
      />

      {/* Backed Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 9,
          fontFamily: "'Roboto Mono', monospace",
          fontSize: '12px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.65)',
          marginBottom: 24,
          zIndex: 1
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#309EFE',
            boxShadow: '0 0 10px rgba(48, 158, 254, 0.8)',
            display: 'inline-block'
          }}
        />
        Backed by me
      </div>

      {/* Hero Headline */}
      <h1
        style={{
          margin: '0 0 24px',
          fontFamily: "'Funnel Display', sans-serif",
          fontSize: 'clamp(48px, 7.5vw, 108px)',
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: '-0.025em',
          color: '#FFFFFF',
          maxWidth: '18ch',
          zIndex: 1
        }}
      >
        Procurement on autopilot.
      </h1>

      {/* Subtext */}
      <p
        style={{
          margin: '0 0 38px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(16px, 1.8vw, 18.5px)',
          lineHeight: 1.65,
          color: 'rgba(255, 255, 255, 0.68)',
          maxWidth: '64ch',
          zIndex: 1
        }}
      >
        Say what you need. Approve the payment. Docket does everything in between:
        sourcing, negotiation, freight, customs, delivery, inventory. Built for{' '}
        <span style={{ color: '#FFFFFF', fontWeight: 500, borderBottom: '1px dotted rgba(255,255,255,0.4)' }}>
          teams that build hardware
        </span>
        .
      </p>

      {/* CTA Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>
        <button
          onClick={onStart}
          className="btn-primary"
          style={{
            padding: '13px 26px',
            fontSize: '15px',
            borderRadius: 10
          }}
        >
          Start for free
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Scroll Down Cue */}
      <div
        onClick={onScrollToNext}
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          zIndex: 2
        }}
      >
        <span
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '10.5px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)'
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: 1,
            height: 36,
            background: 'rgba(255, 255, 255, 0.16)',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '40%',
              background: '#309EFE',
              animation: 'wbCue 2.2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes wbCue {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(260%); }
        }
      `}</style>
    </section>
  );
};
