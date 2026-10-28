import React from 'react';
import { ArrowRight, Layers, Terminal, Building2 } from 'lucide-react';

interface NavbarProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  viewMode: 'story' | 'chat' | 'ops';
  onToggleViewMode: (mode: 'story' | 'chat' | 'ops') => void;
  isDarkTheme?: boolean;
  onOpenCompanyHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  viewMode,
  onToggleViewMode,
  isDarkTheme = true,
  onOpenCompanyHub
}) => {
  const stages = [
    { id: 1, label: 'Requested' },
    { id: 2, label: 'Sourced' },
    { id: 3, label: 'Approved' },
    { id: 4, label: 'Reconciled' },
    { id: 5, label: 'On Shelf' }
  ];

  return (
    <header className={`wb-topbar ${!isDarkTheme ? 'light-theme' : ''}`}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <a
          href="#main"
          onClick={(e) => {
            e.preventDefault();
            onToggleViewMode('story');
            onSelectStage(0);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: isDarkTheme ? '#FFFFFF' : '#07122B',
            cursor: 'pointer'
          }}
        >
          {/* Logo mark cube */}
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #309EFE 0%, #0062D2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(48, 158, 254, 0.4)'
            }}
          >
            <div style={{ width: 10, height: 10, border: '1.5px solid #FFFFFF', borderRadius: 2 }} />
          </div>
          <span
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            dock<span style={{ color: '#309EFE' }}>et</span>
          </span>
        </a>
      </div>

      {/* Lifecycle Stage Tracker in Story Mode, or Clean Status in Chat/Ops Mode */}
      {viewMode === 'story' ? (
        <nav className="wb-tracker" aria-label="Procurement Lifecycle">
          {stages.map((stage, idx) => {
            const isActive = viewMode === 'story' && currentStage === stage.id;
            const isCompleted = viewMode === 'story' && currentStage > stage.id;

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => {
                    if (viewMode !== 'story') onToggleViewMode('story');
                    onSelectStage(stage.id);
                  }}
                  className={`tracker-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  style={{
                    color: isActive
                      ? '#309EFE'
                      : isCompleted
                      ? '#24AB5C'
                      : isDarkTheme
                      ? 'rgba(255,255,255,0.45)'
                      : 'rgba(7,18,43,0.45)'
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#309EFE' : isCompleted ? '#24AB5C' : 'currentColor'
                    }}
                    className={isActive ? 'dot-pulse' : ''}
                  />
                  {stage.label}
                </div>
                {idx < stages.length - 1 && (
                  <span
                    className="tracker-arrow"
                    style={{ color: isDarkTheme ? 'rgba(255,255,255,0.25)' : 'rgba(7,18,43,0.2)' }}
                  >
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#24AB5C', boxShadow: '0 0 8px #24AB5C' }} />
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#309EFE', fontWeight: 600, letterSpacing: '0.06em' }}>
            AUTONOMOUS PROCUREMENT WORKSTATION · CHAT & LIVE INVOICE
          </span>
        </div>
      )}

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* View Mode Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(7,18,43,0.05)',
            border: `1px solid ${isDarkTheme ? 'rgba(255,255,255,0.12)' : 'rgba(7,18,43,0.1)'}`,
            borderRadius: 8,
            padding: 3
          }}
        >
          <button
            onClick={() => onToggleViewMode('story')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: viewMode === 'story' ? (isDarkTheme ? 'rgba(255,255,255,0.15)' : '#FFFFFF') : 'transparent',
              color: viewMode === 'story' ? (isDarkTheme ? '#FFFFFF' : '#07122B') : isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(7,18,43,0.5)',
              border: 'none',
              borderRadius: 6,
              padding: '5px 11px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Interactive Story Showcase"
          >
            <Layers size={13} />
            Story
          </button>

          <button
            onClick={() => onToggleViewMode('chat')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: viewMode === 'chat' ? '#309EFE' : 'transparent',
              color: viewMode === 'chat' ? '#07122B' : isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(7,18,43,0.5)',
              border: 'none',
              borderRadius: 6,
              padding: '5px 11px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Autonomous Terminal & Requisition Copilot"
          >
            <Terminal size={13} />
            Terminal
          </button>

          <button
            onClick={() => onToggleViewMode('ops')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: viewMode === 'ops' ? '#309EFE' : 'transparent',
              color: viewMode === 'ops' ? '#07122B' : isDarkTheme ? 'rgba(255,255,255,0.5)' : 'rgba(7,18,43,0.5)',
              border: 'none',
              borderRadius: 6,
              padding: '5px 11px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Full Production Workstation"
          >
            Ops
          </button>

          {onOpenCompanyHub && (
            <button
              onClick={onOpenCompanyHub}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                background: 'transparent',
                color: isDarkTheme ? 'rgba(255,255,255,0.7)' : 'rgba(7,18,43,0.7)',
                border: isDarkTheme ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(7,18,43,0.15)',
                borderRadius: 6,
                padding: '4px 10px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Inspect 7 Enterprise Procurement Departments"
            >
              <Building2 size={12} color="#309EFE" />
              Company Hub
            </button>
          )}
        </div>

        {viewMode === 'story' && (
          <button
            onClick={() => onToggleViewMode('chat')}
            className="btn-primary"
            style={{ padding: '7px 14px', fontSize: '12px' }}
          >
            Launch Terminal
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </header>
  );
};
