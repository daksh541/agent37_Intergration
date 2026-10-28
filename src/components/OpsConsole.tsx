import React, { useState } from 'react';
import {
  PartRequest,
  SupplierQuote,
  BOMRow,
  InventoryItem,
  ChatMessage
} from '../types';
import { POPULAR_PARTS, INITIAL_BOM, INITIAL_INVENTORY, generateQuotesForPart } from '../data/catalog';
import {
  Search,
  Upload,
  CheckCircle,
  AlertTriangle,
  Send,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  RefreshCw,
  FileText,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpsConsoleProps {
  onBackToStory: () => void;
}

export const OpsConsole: React.FC<OpsConsoleProps> = ({ onBackToStory }) => {
  // State
  const [selectedPart, setSelectedPart] = useState<PartRequest>(POPULAR_PARTS[0]);
  const [customQuery, setCustomQuery] = useState('');
  const [requestedQty, setRequestedQty] = useState(selectedPart.requestedQty);
  const [quotes, setQuotes] = useState<SupplierQuote[]>(generateQuotesForPart(selectedPart));
  const [primaryQuote, setPrimaryQuote] = useState<SupplierQuote>(quotes[0]);
  const [bomRows, setBomRows] = useState<BOMRow[]>(INITIAL_BOM);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'quoted' | 'approved' | 'settled' | 'reconciled'>('quoted');
  const [activeTab, setActiveTab] = useState<'sourcing' | 'bom' | 'inventory' | 'reconciliation'>('sourcing');

  // Chat conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'docket',
      text: 'Order Desk active. Tell me the part number, BOM, or tech spec, and I will scan DigiKey, Mouser, and Arrow in parallel.',
      timestamp: '10:00 AM'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Handle part selection
  const handleSelectPart = (part: PartRequest) => {
    setSelectedPart(part);
    setRequestedQty(part.requestedQty);
    const generated = generateQuotesForPart(part);
    setQuotes(generated);
    setPrimaryQuote(generated[0]);
    setOrderStatus('quoted');

    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'user',
        text: `Requesting ${part.requestedQty} pcs of ${part.mpn} (${part.description})`,
        timestamp: 'Just now'
      },
      {
        id: `m-${Date.now() + 1}`,
        sender: 'docket',
        text: `Scanned 4 authorized sources. Recommended primary: ${generated[0].supplier} at $${generated[0].landedCost.toLocaleString()} landed. Fallback held in reserve with ${generated[1].supplier}.`,
        timestamp: 'Just now'
      }
    ]);
  };

  // Handle custom query search
  const handleSearchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    const newPart: PartRequest = {
      id: `REQ-${Date.now()}`,
      mpn: customQuery.toUpperCase(),
      description: `Hardware procurement request for ${customQuery}`,
      category: 'Semiconductors / Passives',
      requestedQty: requestedQty || 1000,
      needByDate: 'Nov 25, 2026',
      targetPrice: 5.50
    };

    handleSelectPart(newPart);
    setCustomQuery('');
  };

  // Handle Chat message
  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    const userText = inputMsg;
    setInputMsg('');

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: 'Just now'
      }
    ]);

    setTimeout(() => {
      let reply = 'I have updated your procurement request and refreshed distributor price breaks.';
      if (userText.toLowerCase().includes('approve') || userText.toLowerCase().includes('proceed')) {
        handleApproveOrder();
        reply = `Purchase order approved. Settling $${primaryQuote.landedCost.toLocaleString()} across parts, freight, and duties in 1 line item.`;
      } else if (userText.toLowerCase().includes('digikey') || userText.toLowerCase().includes('mouser')) {
        reply = `Cross-referencing DigiKey vs Mouser volume tiers. DigiKey holds 14,200 pcs with immediate dispatch.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'docket',
          text: reply,
          timestamp: 'Just now'
        }
      ]);
    }, 500);
  };

  // Approve purchase
  const handleApproveOrder = () => {
    setOrderStatus('settled');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 }
    });

    // Update inventory allocation
    setInventory((prev) =>
      prev.map((item) =>
        item.mpn === selectedPart.mpn
          ? { ...item, yourBinQty: item.yourBinQty + selectedPart.requestedQty }
          : item
      )
    );
  };

  return (
    <div
      style={{
        paddingTop: 78,
        minHeight: '100vh',
        backgroundColor: '#FAFCFE',
        backgroundImage: 'radial-gradient(rgba(7, 18, 43, 0.075) 1.2px, transparent 1.2px)',
        backgroundSize: '26px 26px'
      }}
    >
      {/* Top Banner with back button and Status */}
      <div
        style={{
          maxWidth: 1380,
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--cardline)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: 14,
          marginBottom: 24
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBackToStory}
            style={{
              background: 'var(--tint)',
              border: '1px solid var(--cardline)',
              borderRadius: 8,
              padding: '6px 12px',
              fontFamily: "'Roboto Mono', monospace",
              fontSize: '11.5px',
              color: 'var(--mut)',
              cursor: 'pointer'
            }}
          >
            ← Exit to Story Walkthrough
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#24AB5C' }} className="dot-pulse" />
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', fontFamily: "'Funnel Display', sans-serif" }}>
              Docket Ops Console · Production Workstation
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'sourcing', label: '1. Sourcing & Quotes' },
            { id: 'bom', label: '2. Multi-Line BOM' },
            { id: 'reconciliation', label: '3. 3-Way Reconciliation' },
            { id: 'inventory', label: '4. Warehouse Bins' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? '#309EFE' : 'var(--tint)',
                color: activeTab === tab.id ? '#07122B' : 'var(--mut)',
                border: activeTab === tab.id ? 'none' : '1px solid var(--cardline)',
                borderRadius: 8,
                padding: '7px 14px',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11.5px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* TAB 1: SOURCING & QUOTES */}
        {activeTab === 'sourcing' && (
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
            {/* Left: Part Intake & Conversational Desk */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Natural language part request */}
              <div className="wb-card" style={{ padding: '20px', background: '#FFFFFF' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: "'Roboto Mono', monospace", color: 'var(--ink)', marginBottom: 12 }}>
                  PART INTAKE & DISCOVERY
                </h3>

                <form onSubmit={handleSearchCustom} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <input
                    type="text"
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    placeholder="Search MPN (e.g. STM32H743, RP2040)..."
                    style={{
                      flex: 1,
                      border: '1px solid var(--cardline)',
                      background: 'var(--tint)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>
                    <Search size={14} />
                  </button>
                </form>

                {/* Preset popular parts */}
                <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginBottom: 8 }}>
                  POPULAR BENCHMARK PARTS:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {POPULAR_PARTS.map((p) => {
                    const isSelected = p.id === selectedPart.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSelectPart(p)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 8,
                          border: isSelected ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
                          background: isSelected ? 'rgba(48, 158, 254, 0.08)' : 'var(--tint)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--ink)' }}>
                            {p.mpn}
                          </span>
                          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--dim)' }}>
                            {p.requestedQty} pcs
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--mut)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conversational Desk */}
              <div className="wb-card" style={{ padding: '20px', background: '#FFFFFF', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>
                    CONVERSATIONAL DESK
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace" }}>
                    ● AI active
                  </span>
                </div>

                <div
                  style={{
                    flex: 1,
                    minHeight: 240,
                    maxHeight: 320,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    marginBottom: 12
                  }}
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        background: m.sender === 'user' ? '#309EFE' : 'var(--tint)',
                        color: m.sender === 'user' ? '#07122B' : 'var(--ink)',
                        border: m.sender === 'user' ? 'none' : '1px solid var(--cardline)',
                        borderRadius: 10,
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        lineHeight: 1.45
                      }}
                    >
                      {m.text}
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type: 'Approve order', 'check Mouser'..."
                    style={{
                      flex: 1,
                      border: '1px solid var(--cardline)',
                      borderRadius: 8,
                      padding: '8px 10px',
                      fontSize: '12.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      background: '#309EFE',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    <Send size={14} color="#07122B" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Sourcing Comparison & One-Click Approval */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Waybill "One answer. One fallback." Executive Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
                {/* Primary Card */}
                <div
                  className="wb-card"
                  style={{
                    padding: '24px',
                    border: '1.5px solid #24AB5C',
                    background: '#FFFFFF',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span
                      style={{
                        background: '#24AB5C',
                        color: '#FFFFFF',
                        fontFamily: "'Roboto Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 4
                      }}
                    >
                      PRIMARY RECOMMENDATION
                    </span>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: '#24AB5C', fontWeight: 600 }}>
                      Score 96/100
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                    {primaryQuote.supplier} · {primaryQuote.manufacturerPartNumber}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--mut)', marginBottom: 14 }}>
                    {selectedPart.requestedQty.toLocaleString()} units @ ${primaryQuote.unitPrice.toFixed(2)}/ea
                  </div>

                  {/* All-in Landed Cost Total */}
                  <div
                    style={{
                      background: 'var(--tint)',
                      border: '1px solid var(--cardline)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 16
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block' }}>
                        ONE PAYMENT · ALL-IN LANDED
                      </span>
                      <span style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)' }}>
                        ${primaryQuote.landedCost.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--mut)' }}>
                      <div>Freight: ${primaryQuote.breakdown.freight}</div>
                      <div>Duties: ${primaryQuote.breakdown.duties}</div>
                      <div>Clearance: ${primaryQuote.breakdown.clearance}</div>
                    </div>
                  </div>

                  {/* Approval Button */}
                  {orderStatus !== 'settled' ? (
                    <button
                      onClick={handleApproveOrder}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '14px' }}
                    >
                      <Sparkles size={15} />
                      1-Click Approve (${primaryQuote.landedCost.toLocaleString()})
                    </button>
                  ) : (
                    <div
                      style={{
                        background: '#24AB5C',
                        color: '#FFFFFF',
                        borderRadius: 10,
                        padding: '12px 20px',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                      }}
                    >
                      <CheckCircle size={16} />
                      Paid & Settled by Docket
                    </div>
                  )}
                </div>

                {/* Fallback Card */}
                <div className="wb-card" style={{ padding: '24px', background: 'var(--tint)', border: '1px dashed var(--cardline)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', color: 'var(--dim)', textTransform: 'uppercase' }}>
                      THE FALLBACK SOURCE
                    </span>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px', color: '#F59E0B' }}>
                      ● live in reserve
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                    {quotes[1]?.supplier || 'Mouser'}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--mut)', marginBottom: 14 }}>
                    ${quotes[1]?.landedCost.toLocaleString()} landed · Lead time {quotes[1]?.leadTimeWeeks} wks
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--mut)', lineHeight: 1.5 }}>
                    Zero deposit held. If {primaryQuote.supplier} allocation slips, Docket auto-reroutes
                    to {quotes[1]?.supplier} without schedule disruption.
                  </p>
                </div>
              </div>

              {/* Top 3 Supplier Comparison Table */}
              <div className="wb-card" style={{ background: '#FFFFFF', overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--cardline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>
                    TOP DISTRIBUTOR SCORING MATRIX
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                    DigiKey · Mouser · Arrow · Franchised
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.8fr',
                    gap: 12,
                    padding: '10px 20px',
                    background: 'var(--tint)',
                    borderBottom: '1px solid var(--cardline)',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--dim)',
                    textTransform: 'uppercase'
                  }}
                >
                  <span>Supplier</span>
                  <span>Landed Cost</span>
                  <span>Unit Price</span>
                  <span>Stock Available</span>
                  <span>Lead Time</span>
                  <span>Compliance</span>
                </div>

                {quotes.map((q) => {
                  const isPrimary = q.id === primaryQuote.id;

                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 0.8fr',
                        gap: 12,
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(7, 18, 43, 0.05)',
                        alignItems: 'center',
                        background: isPrimary ? 'rgba(36, 171, 92, 0.04)' : '#FFFFFF'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>
                          {q.supplier}
                        </div>
                        <span className={q.distributorType === 'authorized' ? 'pill-authorized' : 'pill-franchised'}>
                          {q.distributorType}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                          ${q.landedCost.toLocaleString()}
                        </span>
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'var(--mut)', fontFamily: "'Roboto Mono', monospace" }}>
                        ${q.unitPrice.toFixed(2)}
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'var(--ink)', fontFamily: "'Roboto Mono', monospace" }}>
                        {q.stockAvailable.toLocaleString()} pcs
                      </div>

                      <div style={{ fontSize: '12.5px', color: 'var(--mut)' }}>
                        {q.leadTimeWeeks} weeks
                      </div>

                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#24AB5C', fontSize: '11px', fontFamily: "'Roboto Mono', monospace" }}>
                          <ShieldCheck size={13} />
                          RoHS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MULTI-LINE BOM */}
        {activeTab === 'bom' && (
          <div className="wb-card" style={{ padding: '24px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', fontFamily: "'Funnel Display', sans-serif" }}>
                  Bill of Materials (BOM) Multi-Vendor Sourcing
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--mut)' }}>
                  Upload Altium, KiCad, or Excel BOM to scan global distributors across all line items at once.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn-secondary" style={{ color: 'var(--ink)', border: '1px solid var(--cardline)' }}>
                  <Upload size={14} />
                  Upload New BOM
                </button>
                <button className="btn-primary">
                  Source All 5 Lines ($34,850)
                </button>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--tint)', borderBottom: '1px solid var(--cardline)', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--dim)' }}>
                  <th style={{ padding: '10px 14px' }}>LINE</th>
                  <th style={{ padding: '10px 14px' }}>MPN</th>
                  <th style={{ padding: '10px 14px' }}>DESCRIPTION</th>
                  <th style={{ padding: '10px 14px' }}>QTY</th>
                  <th style={{ padding: '10px 14px' }}>REF DES</th>
                  <th style={{ padding: '10px 14px' }}>BEST DISTRIBUTOR</th>
                  <th style={{ padding: '10px 14px' }}>EST. LANDED</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {bomRows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid rgba(7, 18, 43, 0.05)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                      0{row.lineNum}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)' }}>
                      {row.mpn}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--mut)' }}>
                      {row.description}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace" }}>
                      {row.qty.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                      {row.referenceDesignator}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="pill-authorized">DigiKey (Primary)</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                      ${(row.qty * row.targetPrice).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#24AB5C', display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>
                        <CheckCircle size={13} />
                        Sourced
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: 3-WAY RECONCILIATION */}
        {activeTab === 'reconciliation' && (
          <div className="wb-card" style={{ padding: '28px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Funnel Display', sans-serif" }}>
              Automated 3-Way Reconciliation
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', marginBottom: 24 }}>
              Zero-variance matching: Supplier Invoice ↔ Approved PO Payment ↔ Dock Received Verification.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 28 }}>
              <div style={{ background: 'var(--tint)', border: '1px solid var(--cardline)', borderRadius: 12, padding: '18px' }}>
                <span style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block', marginBottom: 6 }}>
                  DIGIKEY INVOICE #DK-9902
                </span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>$21,600.00</div>
                <div style={{ fontSize: '11px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 4 }}>
                  ✓ Billed as quoted
                </div>
              </div>

              <div style={{ background: 'var(--tint)', border: '1px solid var(--cardline)', borderRadius: 12, padding: '18px' }}>
                <span style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block', marginBottom: 6 }}>
                  APPROVED PAYMENT PO-8841
                </span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>$21,600.00</div>
                <div style={{ fontSize: '11px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 4 }}>
                  ✓ 1-line settled in full
                </div>
              </div>

              <div style={{ background: 'var(--tint)', border: '1px solid var(--cardline)', borderRadius: 12, padding: '18px' }}>
                <span style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block', marginBottom: 6 }}>
                  DOCK RECEIVING SLIP
                </span>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--ink)' }}>2,500 pcs</div>
                <div style={{ fontSize: '11px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", marginTop: 4 }}>
                  ✓ 0 discrepancy / 100% genuine
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(36, 171, 92, 0.08)', border: '1px solid #24AB5C', borderRadius: 10, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#24AB5C', fontWeight: 600, fontSize: '13.5px' }}>
                <CheckCircle size={18} />
                <span>Reconciliation Complete · Variance: $0.00 · General Ledger Synced</span>
              </div>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11.5px', color: '#24AB5C' }}>
                Ref: GL-2026-X89
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: WAREHOUSE BINS */}
        {activeTab === 'inventory' && (
          <div className="wb-card" style={{ padding: '28px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Funnel Display', sans-serif" }}>
              Warehouse Inventory & Bin Allocation
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--mut)', marginBottom: 24 }}>
              Synchronized down to the bin location and reserved project. Nothing bought twice.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--tint)', borderBottom: '1px solid var(--cardline)', fontFamily: "'Roboto Mono', monospace", fontSize: '11px', color: 'var(--dim)' }}>
                  <th style={{ padding: '10px 14px' }}>MPN</th>
                  <th style={{ padding: '10px 14px' }}>BIN LOCATION</th>
                  <th style={{ padding: '10px 14px' }}>YOUR BIN</th>
                  <th style={{ padding: '10px 14px' }}>SHARED STOCK</th>
                  <th style={{ padding: '10px 14px' }}>RESERVE</th>
                  <th style={{ padding: '10px 14px' }}>PROJECT RESERVED</th>
                  <th style={{ padding: '10px 14px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(7, 18, 43, 0.05)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)' }}>
                      {item.mpn}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", color: '#309EFE' }}>
                      {item.binLocation}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", fontWeight: 600 }}>
                      {item.yourBinQty.toLocaleString()} pcs
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", color: 'var(--mut)' }}>
                      {item.sharedQty.toLocaleString()} pcs
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                      {item.reserveQty.toLocaleString()} pcs
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--mut)' }}>
                      {item.projectReserved}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={item.status === 'healthy' ? 'pill-authorized' : 'pill-broker'}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
