import React, { useState, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  CheckCircle2,
  Globe,
  FileSpreadsheet,
  Phone,
  MessageSquare,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  Package,
  Radio
} from 'lucide-react';
import { LiveInvoiceView, InvoiceState } from './LiveInvoiceView';
import { GoogleMapsSourcing, SourcingLocation } from './GoogleMapsSourcing';
import { WaybillFlightWatch } from './WaybillFlightWatch';
import { VendorCallModal } from './VendorCallModal';
import { VendorTextingWidget } from './VendorTextingWidget';
import { DockAndInventoryTracking } from './DockAndInventoryTracking';

interface ChatbotInterfaceProps {
  onBackToStory?: () => void;
}

export const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ onBackToStory }) => {
  const [inputText, setInputText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Modals for Dummy Calling and Texting features
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [vendorCalledConfirmed, setVendorCalledConfirmed] = useState(false);
  const [vendorTextAgreed, setVendorTextAgreed] = useState(false);

  // Workflow Progression State (Image 3: Steps 1 to 6)
  const [step2Scanned, setStep2Scanned] = useState(false);
  const [selectedTopIdx, setSelectedTopIdx] = useState(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatScrollContainerRef.current) {
        chatScrollContainerRef.current.scrollTo({
          top: chatScrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 60);
  };

  // 5 Sourcing Clusters with Coordinates
  const sourcingLocations: SourcingLocation[] = [
    {
      id: 'loc-cn',
      country: 'China',
      area: "Bao'an, Shenzhen",
      cluster: 'Shenzhen Advanced Composites & Carbon Fiber Cluster',
      supplier: 'AeroCarbon Precision Ltd',
      unitCost: 14.20,
      moq: 500,
      leadTime: '1.5 wks (Nov 15)',
      quality: 99.4,
      cert: 'AS9100D · Toray T700 Certified',
      airport: '14km from SZX Cargo Hub',
      coords: { x: 395, y: 100 },
      latLon: '22.5431° N, 114.0579° E',
      address: "Bao'an Industrial District, Shenzhen"
    },
    {
      id: 'loc-tw',
      country: 'Taiwan',
      area: 'Taichung Park',
      cluster: 'Central Taiwan Aerospace & Precision Tech Park',
      supplier: 'Apex Aero Composites Corp',
      unitCost: 16.50,
      moq: 250,
      leadTime: '2.0 wks (Nov 18)',
      quality: 98.6,
      cert: 'RoHS 3 · REACH SVHC · ISO 9001',
      airport: '8km from RMQ Taichung Cargo',
      coords: { x: 460, y: 138 },
      latLon: '24.1477° N, 120.6736° E',
      address: 'Precision Innovation Park, Taichung'
    },
    {
      id: 'loc-us',
      country: 'USA',
      area: 'Torrance, CA',
      cluster: 'Southern California Aerospace Defense Corridor',
      supplier: 'Pacific Aero Dynamics LLC',
      unitCost: 24.80,
      moq: 100,
      leadTime: '1.0 wks (Nov 12)',
      quality: 99.8,
      cert: 'ITAR Registered · AS9100D Rev D',
      airport: '18km from LAX Cargo Terminal',
      coords: { x: 100, y: 80 },
      latLon: '33.8358° N, 118.3406° W',
      address: 'Airport Dr, Torrance, CA'
    },
    {
      id: 'loc-de',
      country: 'Germany',
      area: 'Friedrichshafen',
      cluster: 'Lake Constance Aerospace Engineering Hub',
      supplier: 'LuftKomposit GmbH',
      unitCost: 22.10,
      moq: 200,
      leadTime: '2.5 wks (Nov 20)',
      quality: 98.9,
      cert: 'EN 9100 · TÜV Rheinland Certified',
      airport: '10km from FDH Cargo Hub',
      coords: { x: 265, y: 65 },
      latLon: '47.6542° N, 9.4792° E',
      address: 'Flugplatz 12, Friedrichshafen'
    },
    {
      id: 'loc-mx',
      country: 'Mexico',
      area: 'Mexicali',
      cluster: 'Baja California Aerospace Free Trade Zone',
      supplier: 'Frontera Composites S.A.',
      unitCost: 15.90,
      moq: 300,
      leadTime: '1.8 wks (Nov 16)',
      quality: 96.8,
      cert: 'USMCA Duty-Free · ISO 9001:2015',
      airport: '5km from MXL Cargo Hub',
      coords: { x: 130, y: 138 },
      latLon: '32.6245° N, 115.4523° W',
      address: 'Parque Industrial Mexicali'
    }
  ];

  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-cn');

  // Initial Empty Invoice State
  const initialInvoice: InvoiceState = {
    isDefined: false,
    poNumber: 'AG37-2026-9821',
    invoiceNumber: 'INV-2026-0881',
    orderDate: 'Oct 25, 2026',
    importer: 'Your Company (Verified EOR)',
    partName: '',
    specs: '',
    moq: 1200,
    needByDate: 'Nov 18, 2026',
    htsCode: '8807.30.0090',
    origin: "Shenzhen Bao'an (SZX)",
    destination: 'San Francisco (SFO)',
    carrier: 'DHL Express UAV Priority Air',
    flightNum: 'FX 5291 (Boeing 777F)',
    binLocation: 'AISLE 04 · TIER 2 · BIN 08',
    sourcingApproved: false,
    sourcingAmount: 17040.00,
    selectedSupplier: 'AeroCarbon Precision Ltd',
    customsApproved: false,
    customsAmount: 583.20,
    rfqStatus: 'RFQ Sent & Auto-Confirmed',
    shippingApproved: false,
    shippingAmount: 830.00,
    selectedCarrier: 'DHL Express UAV Priority Air',
    complianceApproved: false,
    complianceAmount: 120.00,
    deliveryApproved: false,
    deliveryAmount: 75.00,
    isPaid: false,
    paidTxId: 'TXN-88192-ACH'
  };

  const [invoice, setInvoice] = useState<InvoiceState>(initialInvoice);
  const [userPromptText, setUserPromptText] = useState('');

  // Step 1: User inputs spec or BOM
  const handleStartIdea = (queryText: string) => {
    const text = queryText.trim();
    if (!text) return;

    setUserPromptText(text);
    setHasStarted(true);

    const lower = text.toLowerCase();
    let partName = 'Custom Drone Wings 450mm Carbon Fiber';
    let specs = '450mm length × 65mm chord · Matte Carbon Black · Toray T700';
    let moq = 1200;
    let needByDate = 'Nov 18, 2026';
    let unitBase = 14.20;
    let htsCode = '8807.30.0090';
    let origin = "Taichung (RMQ)";
    let destination = 'Los Angeles (LAX)';
    let carrier = 'DHL Express UAV Priority Air';
    let flightNum = 'FX 5291';
    let binLocation = 'AISLE 04 · TIER 2 · BIN 08';

    if (lower.includes('stm32') || lower.includes('mcu') || lower.includes('chip') || lower.includes('microcontroller')) {
      partName = 'STM32H743VIT6 ARM Cortex-M7 MCU';
      specs = 'LQFP-100 · 480MHz · Reel Packaging · RoHS Compliant';
      moq = 2500;
      needByDate = 'Nov 14, 2026';
      unitBase = 10.80;
      htsCode = '8542.31.0001';
      origin = 'Singapore (SIN)';
      destination = 'San Jose (SJC)';
      carrier = 'DHL Express Silicon Air';
      flightNum = 'D0 9102';
      binLocation = 'AISLE 01 · TIER 1 · BIN 14';
    } else if (lower.includes('motor') || lower.includes('gimbal') || lower.includes('actuator')) {
      partName = 'GM2804H-100T Gimbal Motor for 4K Drone';
      specs = '28mm Stator · 4mm Hollow Bore · Anodized Stealth Black';
      moq = 600;
      needByDate = 'Dec 05, 2026';
      unitBase = 26.50;
      htsCode = '8501.10.4040';
      origin = 'Taichung (RMQ)';
      destination = 'Los Angeles (LAX)';
      carrier = 'DHL Express UAV Priority Air';
      flightNum = 'FX 5291';
      binLocation = 'AISLE 03 · TIER 3 · BIN 02';
    }

    const qtyMatch = text.match(/(\d[\d,]*)\s*(pcs|pieces|units|moq)/i);
    if (qtyMatch) {
      const parsed = parseInt(qtyMatch[1].replace(/,/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) moq = parsed;
    }

    const dateMatch = text.match(/(by|before|date)\s+([A-Za-z]+[\s\d,]+)/i);
    if (dateMatch && dateMatch[2]) {
      needByDate = dateMatch[2].trim();
    }

    const partsTotal = unitBase * moq;
    const freight = 830.00;
    const duties = parseFloat((partsTotal * 0.027).toFixed(2));

    setInvoice({
      ...initialInvoice,
      isDefined: true,
      partName,
      specs,
      moq,
      needByDate,
      htsCode,
      origin,
      destination,
      carrier,
      flightNum,
      binLocation,
      sourcingAmount: partsTotal,
      shippingAmount: freight,
      customsAmount: duties,
      complianceAmount: 120.00,
      deliveryAmount: 75.00,
      sourcingApproved: false,
      customsApproved: false,
      shippingApproved: false,
      complianceApproved: false,
      deliveryApproved: false,
      isPaid: false
    });

    setInputText('');
    setStep2Scanned(true);
    scrollToBottom();
  };

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    const loc = sourcingLocations.find((l) => l.id === id);
    if (loc && !invoice.sourcingApproved) {
      const airportCode = loc.airport.match(/\b[A-Z]{3}\b/)?.[0] || loc.country;
      setInvoice((prev) => ({
        ...prev,
        selectedSupplier: loc.supplier,
        origin: `${loc.area} (${airportCode})`,
        sourcingAmount: loc.unitCost * prev.moq,
        customsAmount: parseFloat(((loc.unitCost * prev.moq) * 0.027).toFixed(2))
      }));
    }
  };

  const activeLoc = sourcingLocations.find((l) => l.id === selectedLocationId) || sourcingLocations[0];

  // Top 3 Qualified Options Matrix (Step 3 of Image 3)
  const top3Options = [
    {
      id: 'loc-cn',
      rank: 1,
      badge: 'RECOMMENDED · TOP SCORE 99.4%',
      supplier: 'AeroCarbon Precision Ltd',
      origin: 'China (Shenzhen / SZX)',
      unitPrice: 14.20,
      totalCost: 14.20 * invoice.moq,
      leadTime: '1.5 wks (Nov 15)',
      stock: `${Math.round(invoice.moq * 1.3).toLocaleString()} pcs (Verified)`,
      avlStatus: 'AVL Approved',
      cert: 'AS9100D · Toray T700'
    },
    {
      id: 'loc-tw',
      rank: 2,
      badge: 'PRECISION TOLERANCE (Nov 18)',
      supplier: 'Apex Aero Composites Corp',
      origin: 'Taiwan (Taichung / RMQ)',
      unitPrice: 16.50,
      totalCost: 16.50 * invoice.moq,
      leadTime: '2.0 wks (Express)',
      stock: `${Math.round(invoice.moq * 1.25).toLocaleString()} pcs in Stock`,
      avlStatus: 'ISO 9001 · REACH',
      cert: 'RoHS 3 · REACH SVHC'
    },
    {
      id: 'loc-us',
      rank: 3,
      badge: 'FASTEST VELOCITY (Nov 12)',
      supplier: 'Pacific Aero Dynamics LLC',
      origin: 'USA (Torrance / LAX)',
      unitPrice: 24.80,
      totalCost: 24.80 * invoice.moq,
      leadTime: '1.0 wks (Domestic Air)',
      stock: `${Math.round(invoice.moq * 1.1).toLocaleString()} pcs in Stock`,
      avlStatus: 'ITAR Registered',
      cert: 'AS9100D Rev D · Defense AVL'
    }
  ];

  const selectedOpt = top3Options.find((o) => o.id === selectedLocationId) || top3Options[0];

  // Step 4: Approve 1-Click
  const handleApproveStep4 = (supplierName: string, unitPrice: number) => {
    const loc = sourcingLocations.find((l) => l.supplier === supplierName) || activeLoc;
    const airportCode = loc.airport.match(/\b[A-Z]{3}\b/)?.[0] || loc.country;
    const newSourcingAmount = unitPrice * invoice.moq;
    setInvoice((prev) => ({
      ...prev,
      selectedSupplier: supplierName,
      origin: `${loc.area} (${airportCode})`,
      sourcingAmount: newSourcingAmount,
      customsAmount: parseFloat((newSourcingAmount * 0.027).toFixed(2)),
      sourcingApproved: true
    }));
    scrollToBottom();
  };

  // Step 5: Approve Shipping, Customs & Bill of Entry
  const handleApproveStep5 = (carrierName: string, freightCost: number) => {
    setInvoice((prev) => ({
      ...prev,
      selectedCarrier: carrierName,
      shippingAmount: freightCost,
      shippingApproved: true,
      customsApproved: true,
      complianceApproved: true,
      rfqStatus: `Customs Broker Dispatched · e-AWB #AWB-9812-7801`
    }));
    scrollToBottom();
  };

  // Step 6: Settle Final Landed Invoice with 3-Way Match
  const handleSettleStep6 = () => {
    setInvoice((prev) => ({
      ...prev,
      deliveryApproved: true,
      isPaid: true
    }));
    scrollToBottom();
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gridTemplateRows: 'minmax(0, 1fr)',
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        width: '100%',
        background: '#FAFBFD',
        color: '#07122B',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* ================= LEFT HALF: CHATGPT-STYLE PROMPT INTERFACE ================= */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          overflow: 'hidden',
          background: '#F8FAFD',
          borderRight: '1px solid var(--cardline)',
          boxSizing: 'border-box'
        }}
      >
        {/* Scrollable Messages Stream */}
        <div
          ref={chatScrollContainerRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minWidth: 0,
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* ================= STEP 1: INITIAL EMPTY CHATGPT-STYLE PROMPT ================= */}
          {!hasStarted ? (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '30px 16px',
                maxWidth: 480,
                margin: 'auto'
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: 'rgba(48, 158, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#309EFE',
                  marginBottom: 16,
                  boxShadow: '0 4px 16px rgba(48, 158, 254, 0.18)'
                }}
              >
                <Bot size={28} />
              </div>

              <h2
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '23px',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 8,
                  letterSpacing: '-0.02em'
                }}
              >
                What do you want to build or source?
              </h2>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--dim)',
                  lineHeight: 1.6,
                  marginBottom: 24,
                  maxWidth: '44ch'
                }}
              >
                [Step 1 of 6: Sourcing & Discovery] Enter any part query, BOM, or spec. AGENT37 will scan global distributors, call & text vendors, rank the top 3 options, launch flight watch, and sync dock inventory.
              </p>

              {/* Clickable Quick Starter Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                {[
                  'I want drone wings of 450mm length, 65mm chord, matte carbon black, 1,200 pcs MOQ by Nov 18',
                  'STM32H743VIT6 microcontrollers, 2500 pcs MOQ in tape and reel by Nov 14',
                  'GM2804H-100T brushless gimbal motor for 4K drone, 600 pcs MOQ by Dec 05'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStartIdea(preset)}
                    style={{
                      padding: '11px 16px',
                      borderRadius: 10,
                      background: '#FFFFFF',
                      border: '1px solid var(--cardline)',
                      color: 'var(--ink)',
                      fontSize: '12px',
                      fontFamily: "'Roboto Mono', monospace",
                      textAlign: 'left',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(7, 18, 43, 0.03)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#309EFE';
                      e.currentTarget.style.background = 'rgba(48, 158, 254, 0.03)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'var(--cardline)';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    <span style={{ color: '#309EFE', marginRight: 8 }}>➜</span>
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE WORKFLOW PIPELINE (STEPS 1 TO 6) */
            <>
              {/* REQUISITION SPECIFICATION DOCKET */}
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--cardline)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  boxShadow: '0 2px 10px rgba(7, 18, 43, 0.03)',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#309EFE', boxShadow: '0 0 8px rgba(48, 158, 254, 0.6)' }} />
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#07122B', letterSpacing: '0.06em' }}>
                      [1. REQUISITION SPECIFICATION INGESTED]
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                      PO: {invoice.poNumber}
                    </span>
                    <button
                      onClick={() => {
                        setHasStarted(false);
                        setInvoice(initialInvoice);
                        setUserPromptText('');
                        setStep2Scanned(false);
                      }}
                      style={{
                        padding: '3px 8px',
                        background: 'rgba(7, 18, 43, 0.04)',
                        border: '1px solid rgba(7, 18, 43, 0.12)',
                        borderRadius: 5,
                        fontSize: '10px',
                        fontFamily: "'Roboto Mono', monospace",
                        color: 'var(--dim)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = '#07122B';
                        e.currentTarget.style.background = 'rgba(7, 18, 43, 0.08)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = 'var(--dim)';
                        e.currentTarget.style.background = 'rgba(7, 18, 43, 0.04)';
                      }}
                    >
                      ↺ New Order
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#07122B',
                    lineHeight: 1.5,
                    fontFamily: "'Inter', sans-serif",
                    background: 'var(--paper)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--cardline)',
                    marginBottom: 10
                  }}
                >
                  "{userPromptText}"
                </div>

                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                  <span>PART: <strong style={{ color: '#07122B' }}>{invoice.partName}</strong></span>
                  <span>MOQ: <strong style={{ color: '#07122B' }}>{invoice.moq.toLocaleString()} pcs</strong></span>
                  <span>HTS: <strong style={{ color: '#07122B' }}>{invoice.htsCode}</strong></span>
                  <span>NEED-BY: <strong style={{ color: '#309EFE' }}>{invoice.needByDate}</strong></span>
                </div>
              </div>

                  {/* ================= STEP 2: SOURCING RADAR & BOM ================= */}
                  <div style={{ width: '100%', boxSizing: 'border-box' }}>
                    <GoogleMapsSourcing
                      locations={sourcingLocations}
                      selectedId={selectedLocationId}
                      onSelectLocation={handleSelectLocation}
                      moq={invoice.moq}
                      onOpenCall={() => setIsCallModalOpen(true)}
                      onOpenText={() => setIsTextModalOpen(true)}
                      vendorCalledConfirmed={vendorCalledConfirmed}
                      vendorTextAgreed={vendorTextAgreed}
                      onApproveSourcing={(supplier, price) => handleApproveStep4(supplier, price)}
                      isApproved={invoice.sourcingApproved}
                    />
                  </div>

                  {/* ================= STEP 5: SHIPPING, CUSTOMS & BILL OF ENTRY (WAYBILL FLIGHT WATCH) ================= */}
                  {invoice.sourcingApproved && (
                    <div style={{ width: '100%', boxSizing: 'border-box' }}>
                      <WaybillFlightWatch
                        origin={invoice.origin}
                        destination={invoice.destination}
                        carrier={invoice.selectedCarrier}
                        flightNum={invoice.flightNum}
                        shippingAmount={invoice.shippingAmount}
                        htsCode={invoice.htsCode}
                        onApproveShipping={handleApproveStep5}
                        isApproved={invoice.shippingApproved}
                      />
                    </div>
                  )}

                  {/* ================= STEP 6: ZERO-VARIANCE INVOICE MATCHING & DOCK SYNC (IMAGE 2) ================= */}
                  {invoice.shippingApproved && (
                    <div
                      className="wb-card"
                      style={{
                        background: '#FFFFFF',
                        border: `1.5px solid ${invoice.isPaid ? '#24AB5C' : '#309EFE'}`,
                        borderRadius: 14,
                        padding: '16px 18px',
                        boxShadow: '0 4px 16px rgba(7, 18, 43, 0.04)',
                        boxSizing: 'border-box',
                        width: '100%',
                        minWidth: 0
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#309EFE' }}>
                          [6. ZERO-VARIANCE INVOICE MATCHING & DOCK SYNC]
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontFamily: "'Roboto Mono', monospace",
                            padding: '2px 7px',
                            borderRadius: 4,
                            fontWeight: 600,
                            background: invoice.isPaid ? 'rgba(36, 171, 92, 0.1)' : 'rgba(48, 158, 254, 0.1)',
                            color: invoice.isPaid ? '#24AB5C' : '#309EFE'
                          }}
                        >
                          {invoice.isPaid ? 'ORDER CLOSED [PAID] ✓' : 'READY TO RECONCILE'}
                        </span>
                      </div>

                      {/* Dock Barcode Scan & Live Inventory Tracking Cards (Image 2) */}
                      <DockAndInventoryTracking
                        partName={invoice.partName}
                        binLocation={invoice.binLocation}
                        qty={invoice.moq}
                        poNumber={invoice.poNumber}
                        onSettleOrder={handleSettleStep6}
                        isSettled={invoice.isPaid}
                      />
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </>
              )}
        </div>

        {/* BOTTOM CHAT INPUT BAR */}
        <div
          style={{
            padding: '14px 28px',
            background: '#FFFFFF',
            borderTop: '1px solid var(--cardline)',
            flexShrink: 0,
            boxSizing: 'border-box',
            width: '100%',
            boxShadow: '0 -4px 16px rgba(7, 18, 43, 0.03)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1.5px solid rgba(7, 18, 43, 0.16)',
              borderRadius: 10,
              padding: '8px 12px',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              width: '100%'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartIdea(inputText)}
              placeholder="Type your hardware spec... (e.g. 'I want drone wings of 450mm length, 1200 MOQ by Nov 18')"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--ink)',
                minWidth: 0
              }}
            />

            <button
              onClick={() => handleStartIdea(inputText)}
              disabled={!inputText.trim()}
              style={{
                width: 32,
                height: 32,
                borderRadius: 7,
                background: inputText.trim() ? '#309EFE' : 'rgba(7, 18, 43, 0.1)',
                color: inputText.trim() ? '#07122B' : 'rgba(7, 18, 43, 0.3)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= RIGHT HALF: LIVE FORMING INVOICE & BOM ================= */}
      <div
        style={{
          height: '100%',
          maxHeight: '100%',
          minHeight: 0,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
      >
        <LiveInvoiceView invoice={invoice} />
      </div>

      {/* ================= DUMMY CALLING MODAL ================= */}
      <VendorCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        vendorName={selectedOpt ? selectedOpt.supplier : activeLoc.supplier}
        partName={invoice.partName}
        qty={invoice.moq}
        unitPrice={selectedOpt ? selectedOpt.unitPrice : activeLoc.unitCost}
        onCallConfirmed={() => {
          setVendorCalledConfirmed(true);
          scrollToBottom();
        }}
      />

      {/* ================= DIRECT VENDOR TEXTING WIDGET ================= */}
      <VendorTextingWidget
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        vendorName={selectedOpt ? selectedOpt.supplier : activeLoc.supplier}
        partName={invoice.partName}
        qty={invoice.moq}
        unitPrice={selectedOpt ? selectedOpt.unitPrice : activeLoc.unitCost}
        onApplyTerms={() => {
          setVendorTextAgreed(true);
          scrollToBottom();
        }}
      />
    </div>
  );
};
