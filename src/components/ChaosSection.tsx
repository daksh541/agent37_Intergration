import React from 'react';

export const ChaosSection: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        backgroundColor: '#030712',
        color: '#FFFFFF',
        padding: '110px 24px 100px',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Roboto Mono', monospace",
            fontSize: '11.5px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.45)',
            marginBottom: 16
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
          Today
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontSize: 'clamp(32px, 4.2vw, 54px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: '#FFFFFF',
            margin: '0 auto 60px',
            maxWidth: '22ch'
          }}
        >
          This is what buying one part looks like.
        </h2>

        {/* Scattered Chaos Collage */}
        <div
          style={{
            position: 'relative',
            minHeight: 520,
            margin: '0 auto',
            maxWidth: 1000
          }}
        >
          {/* Stat badge 1 */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: '4%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(-2deg)',
              zIndex: 3
            }}
          >
            15–20 suppliers messaged
          </div>

          {/* Stat badge 2 */}
          <div
            style={{
              position: 'absolute',
              top: '22%',
              left: '26%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(1.6deg)',
              zIndex: 3
            }}
          >
            10 reply
          </div>

          {/* Stat badge 3 */}
          <div
            style={{
              position: 'absolute',
              top: '6%',
              right: '24%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(-1.4deg)',
              zIndex: 3
            }}
          >
            4 days of back-and-forth
          </div>

          {/* Stat badge 4 */}
          <div
            style={{
              position: 'absolute',
              bottom: '16%',
              left: '12%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(2deg)',
              zIndex: 3
            }}
          >
            7 reject you on MOQ
          </div>

          {/* Stat badge 5 */}
          <div
            style={{
              position: 'absolute',
              bottom: '8%',
              left: '42%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(-1.6deg)',
              zIndex: 3
            }}
          >
            3 redundant orders, hoping one ships
          </div>

          {/* Stat badge 6 */}
          <div
            style={{
              position: 'absolute',
              bottom: '12%',
              right: '6%',
              background: '#FFFFFF',
              color: '#07122B',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 600,
              fontSize: '13px',
              padding: '10px 16px',
              borderRadius: 8,
              boxShadow: '0 12px 34px rgba(0,0,0,0.5)',
              transform: 'rotate(1.2deg)',
              zIndex: 3
            }}
          >
            5–6 hands per box
          </div>

          {/* Dark card: revised pricelist */}
          <div
            style={{
              position: 'absolute',
              top: '18%',
              left: '6%',
              width: 290,
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '14px 16px',
              transform: 'rotate(1.6deg)',
              zIndex: 2
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
              RE: revised pricelist — valid till Friday
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', margin: '6px 0 8px', lineHeight: 1.5 }}>
              New rates attached. The old quote is void.
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', color: 'rgba(255,255,255,0.35)' }}>
              supplier · attachment · unread
            </div>
          </div>

          {/* Dark card: Excel final final */}
          <div
            style={{
              position: 'absolute',
              top: '56%',
              left: '5%',
              width: 280,
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '12px 15px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              transform: 'rotate(2deg)',
              zIndex: 2
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                background: 'rgba(36, 171, 92, 0.2)',
                border: '1px solid rgba(36, 171, 92, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '12px',
                color: '#24AB5C',
                fontFamily: "'Roboto Mono', monospace"
              }}
            >
              X
            </div>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                vendor_compare_FINAL_FINAL.xlsx
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Roboto Mono', monospace" }}>
                edited again last night
              </div>
            </div>
          </div>

          {/* Dark card: password expired */}
          <div
            style={{
              position: 'absolute',
              top: '32%',
              left: '35%',
              width: 260,
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transform: 'rotate(-1.8deg)',
              zIndex: 2
            }}
          >
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                supplier portal · password expired
              </div>
              <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Roboto Mono', monospace" }}>
                reset (again)
              </div>
            </div>
            <span
              style={{
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '10px',
                fontFamily: "'Roboto Mono', monospace",
                color: 'rgba(255,255,255,0.6)'
              }}
            >
              log in
            </span>
          </div>

          {/* Yellow sticky note */}
          <div
            style={{
              position: 'absolute',
              bottom: '22%',
              right: '30%',
              background: '#FFC664',
              borderRadius: 4,
              padding: '12px 18px',
              boxShadow: '0 10px 28px rgba(0,0,0,0.5)',
              transform: 'rotate(-3.5deg)',
              zIndex: 4,
              textAlign: 'left'
            }}
          >
            <div
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 600,
                fontSize: '12.5px',
                color: '#000000',
                lineHeight: 1.4
              }}
            >
              call the broker back<br />before 5
            </div>
          </div>

          {/* Dark card: ops message */}
          <div
            style={{
              position: 'absolute',
              top: '20%',
              right: '8%',
              width: 270,
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '12px 15px',
              transform: 'rotate(1.4deg)',
              zIndex: 2
            }}
          >
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.4)', fontFamily: "'Roboto Mono', monospace" }}>
              #hardware · this morning
            </div>
            <div style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.85)', margin: '6px 0', lineHeight: 1.4 }}>
              any update on the parts? line down Thursday
            </div>
            <span
              style={{
                display: 'inline-block',
                background: '#309EFE',
                color: '#07122B',
                fontSize: '9.5px',
                fontWeight: 700,
                fontFamily: "'Roboto Mono', monospace",
                borderRadius: 999,
                padding: '2px 7px'
              }}
            >
              new
            </span>
          </div>

          {/* Dark card: customs broker */}
          <div
            style={{
              position: 'absolute',
              top: '48%',
              right: '16%',
              width: 260,
              textAlign: 'left',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 12,
              padding: '12px 14px',
              transform: 'rotate(-2.2deg)',
              zIndex: 2
            }}
          >
            <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
              Missed call · customs broker
            </div>
            <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.35)', fontFamily: "'Roboto Mono', monospace", marginTop: 4 }}>
              second attempt
            </div>
          </div>
        </div>

        {/* Conclusion line */}
        <div
          style={{
            marginTop: 40,
            fontFamily: "'Funnel Display', sans-serif",
            fontSize: 'clamp(20px, 2.2vw, 28px)',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          Information dilutes at every handoff.
        </div>

        {/* Flip Banner */}
        <div
          style={{
            margin: '80px auto 0',
            paddingTop: 50,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontFamily: "'Funnel Display', sans-serif",
            fontSize: 'clamp(28px, 3.4vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#FFFFFF'
          }}
        >
          The same buy, through AGENT37.
        </div>
      </div>
    </section>
  );
};
