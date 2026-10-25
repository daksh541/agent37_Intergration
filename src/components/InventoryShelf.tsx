import React, { useState } from 'react';
import { Search, Check, Layers, Box, ArrowRight } from 'lucide-react';
import { InventoryItem } from '../types';

interface InventoryShelfProps {
  inventory: InventoryItem[];
}

export const InventoryShelf: React.FC<InventoryShelfProps> = ({ inventory }) => {
  const [searchTerm, setSearchTerm] = useState('the same part, six weeks later');
  const [isReserved, setIsReserved] = useState(false);

  const activeItem = inventory[0]; // STM32H743VIT6

  return (
    <section
      id="stage-shelf"
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
                background: '#24AB5C',
                boxShadow: '0 0 10px rgba(36, 171, 92, 0.5)'
              }}
            />
            <div
              style={{
                width: 2,
                height: 200,
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
              05 / 05
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
              05 · On shelf
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
              Next time, it's<br />already on the shelf.
            </h2>

            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '16px',
                lineHeight: 1.65,
                color: 'var(--mut)',
                maxWidth: '42ch'
              }}
            >
              Six weeks later, someone on your team needs the same part. AGENT37 checks
              your own shelf before it checks any supplier, shows the stock you already
              own, and reserves it to their project in one click. Nothing gets bought twice.
            </p>

            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 8, color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", fontSize: '12px' }}>
              <Box size={16} />
              <span>Zero redundant procurement spend guaranteed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Shelf Card (Screenshot 12) */}
        <div className="wb-card" style={{ padding: '28px 30px', background: '#FFFFFF' }}>
          {/* Search bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--tint)',
              border: '1px solid var(--cardline)',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 18
            }}
          >
            <Search size={16} color="var(--dim)" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                color: 'var(--ink)'
              }}
            />
            <span
              style={{
                width: 8,
                height: 18,
                background: '#309EFE',
                display: 'inline-block'
              }}
              className="caret-blink"
            />
          </div>

          {/* In Stock Box */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #24AB5C',
              borderRadius: 12,
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18
            }}
          >
            <div>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--ink)', display: 'block' }}>
                In stock · {activeItem.mpn}
              </span>
              <span style={{ fontSize: '11.5px', color: 'var(--mut)', fontFamily: "'Roboto Mono', monospace" }}>
                Bin {activeItem.binLocation} · {activeItem.yourBinQty} units available
              </span>
            </div>

            <button
              onClick={() => setIsReserved(true)}
              style={{
                background: isReserved ? '#24AB5C' : 'rgba(36, 171, 92, 0.1)',
                color: isReserved ? '#FFFFFF' : '#24AB5C',
                border: isReserved ? 'none' : '1px solid #24AB5C',
                borderRadius: 8,
                padding: '6px 14px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              {isReserved ? (
                <>
                  <Check size={13} />
                  Reserved to Project Falcon
                </>
              ) : (
                'take from the shelf'
              )}
            </button>
          </div>

          {/* Meters Grid (Screenshot 12) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 18
            }}
          >
            {/* Meter 1: Your Bin */}
            <div
              style={{
                background: 'var(--tint)',
                border: '1px solid var(--cardline)',
                borderRadius: 10,
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 8 }}>
                <span>YOUR BIN</span>
                <span style={{ color: '#24AB5C', fontWeight: 600 }}>850 pcs</span>
              </div>
              <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '80%', height: '100%', background: '#24AB5C', borderRadius: 99 }} />
              </div>
            </div>

            {/* Meter 2: Shared */}
            <div
              style={{
                background: 'var(--tint)',
                border: '1px solid var(--cardline)',
                borderRadius: 10,
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 8 }}>
                <span>SHARED</span>
                <span>200 pcs</span>
              </div>
              <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '30%', height: '100%', background: 'var(--dim)', borderRadius: 99 }} />
              </div>
            </div>

            {/* Meter 3: Reserve */}
            <div
              style={{
                background: 'var(--tint)',
                border: '1px solid var(--cardline)',
                borderRadius: 10,
                padding: '12px 14px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginBottom: 8 }}>
                <span>RESERVE</span>
                <span>100 pcs</span>
              </div>
              <div style={{ height: 6, background: 'rgba(7, 18, 43, 0.08)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ width: '15%', height: '100%', background: 'var(--dim)', borderRadius: 99 }} />
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              textAlign: 'center',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11.5px',
              color: 'var(--dim)',
              paddingTop: 10
            }}
          >
            reserved to your project in one click · nothing bought twice
          </div>
        </div>
      </div>
    </section>
  );
};
