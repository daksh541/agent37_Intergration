import React, { useState, useRef, useEffect } from 'react';
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
  Radio,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plane,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { LiveInvoiceView, InvoiceState } from './LiveInvoiceView';
import { GoogleMapsSourcing, SourcingLocation } from './GoogleMapsSourcing';
import { WaybillFlightWatch } from './WaybillFlightWatch';
import { VendorCallModal } from './VendorCallModal';
import { VendorTextingWidget } from './VendorTextingWidget';
import { DockAndInventoryTracking } from './DockAndInventoryTracking';
import { parseRequisitionWithGemini, chatWithDocket, defaultLocations } from '../services/geminiService';

interface ChatbotInterfaceProps {
  onBackToStory?: () => void;
}

export interface ChatStreamMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTaken?: string;
}

export const ChatbotInterface: React.FC<ChatbotInterfaceProps> = ({ onBackToStory }) => {
  const [inputText, setInputText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatStream, setChatStream] = useState<ChatStreamMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Modals for Calling and Texting features
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [vendorCalledConfirmed, setVendorCalledConfirmed] = useState(false);
  const [vendorTextAgreed, setVendorTextAgreed] = useState(false);

  // Workflow Progression State (Simple 4-Step Pipeline: Spec -> Sourcing -> Flight -> Dock)
  const [activeStep, setActiveStep] = useState<'spec' | 'sourcing' | 'shipping' | 'dock'>('sourcing');
  const [isChatExpanded, setIsChatExpanded] = useState(false);
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

  // 5 Sourcing Clusters with Coordinates (Dynamic via Gemini 2.5 Flash)
  const [sourcingLocations, setSourcingLocations] = useState<SourcingLocation[]>(defaultLocations);
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

  const activeLoc = sourcingLocations.find((l) => l.id === selectedLocationId) || sourcingLocations[0] || defaultLocations[0];

  const baseUnitRate = invoice.moq > 0 && invoice.sourcingAmount > 0
    ? invoice.sourcingAmount / invoice.moq
    : (activeLoc ? activeLoc.unitCost : 14.20);

  // Top 3 Qualified Options Matrix
  const top3Options = [
    {
      id: sourcingLocations[0]?.id || 'loc-cn',
      rank: 1,
      badge: 'RECOMMENDED · TOP SCORE 99.4%',
      supplier: sourcingLocations[0]?.supplier || 'AeroCarbon Precision Ltd',
      origin: sourcingLocations[0]?.country ? `${sourcingLocations[0].country} (${sourcingLocations[0].area})` : 'China (Shenzhen / SZX)',
      unitPrice: baseUnitRate,
      totalCost: baseUnitRate * invoice.moq,
      leadTime: '1.5 wks (Nov 15)',
      stock: `${Math.round(invoice.moq * 1.3).toLocaleString()} pcs (Verified)`,
      avlStatus: 'AVL Approved',
      cert: sourcingLocations[0]?.cert || 'AS9100D · Toray T700'
    },
    {
      id: sourcingLocations[1]?.id || 'loc-tw',
      rank: 2,
      badge: 'PRECISION TOLERANCE (Nov 18)',
      supplier: sourcingLocations[1]?.supplier || 'Apex Aero Composites Corp',
      origin: sourcingLocations[1]?.country ? `${sourcingLocations[1].country} (${sourcingLocations[1].area})` : 'Taiwan (Taichung / RMQ)',
      unitPrice: parseFloat((baseUnitRate * 1.15).toFixed(2)),
      totalCost: parseFloat((baseUnitRate * 1.15 * invoice.moq).toFixed(2)),
      leadTime: '2.0 wks (Express)',
      stock: `${Math.round(invoice.moq * 1.25).toLocaleString()} pcs in Stock`,
      avlStatus: 'ISO 9001 · REACH',
      cert: sourcingLocations[1]?.cert || 'RoHS 3 · REACH SVHC'
    },
    {
      id: sourcingLocations[2]?.id || 'loc-us',
      rank: 3,
      badge: 'FASTEST VELOCITY (Nov 12)',
      supplier: sourcingLocations[2]?.supplier || 'Pacific Aero Dynamics LLC',
      origin: sourcingLocations[2]?.country ? `${sourcingLocations[2].country} (${sourcingLocations[2].area})` : 'USA (Torrance / LAX)',
      unitPrice: parseFloat((baseUnitRate * 1.65).toFixed(2)),
      totalCost: parseFloat((baseUnitRate * 1.65 * invoice.moq).toFixed(2)),
      leadTime: '1.0 wks (Domestic Air)',
      stock: `${Math.round(invoice.moq * 1.1).toLocaleString()} pcs in Stock`,
      avlStatus: 'ITAR Registered',
      cert: sourcingLocations[2]?.cert || 'AS9100D Rev D · Defense AVL'
    }
  ];

  const selectedOpt = top3Options.find((o) => o.id === selectedLocationId) || top3Options[0];

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
    setChatStream([
      {
        id: 'msg-init',
        role: 'assistant',
        text: `Requisition initiated for **${partName}** (${moq.toLocaleString()} pcs). Sourcing radar dispatched to scan global manufacturing clusters with landed duty calibration (HTS ${htsCode}).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    scrollToBottom();

    // Call real Gemini 2.5 Flash API to parse technical BOM specs & suppliers
    setIsAiScanning(true);
    parseRequisitionWithGemini(text)
      .then((res) => {
        if (res && res.suppliers && res.suppliers.length > 0) {
          setSourcingLocations(res.suppliers);
          const partsTotal = res.unitBase * res.moq;
          const freight = 830.00;
          const duties = parseFloat((partsTotal * 0.027).toFixed(2));
          const topSupplier = res.suppliers[0];

          setInvoice((prev) => ({
            ...prev,
            partName: res.partName,
            specs: res.specs,
            moq: res.moq,
            needByDate: res.needByDate,
            htsCode: res.htsCode,
            origin: res.origin,
            destination: res.destination,
            carrier: res.carrier,
            flightNum: res.flightNum,
            binLocation: res.binLocation,
            sourcingAmount: partsTotal,
            shippingAmount: freight,
            customsAmount: duties,
            selectedSupplier: topSupplier.supplier
          }));
          setSelectedLocationId(topSupplier.id);

          setChatStream((prev) => [
            ...prev,
            {
              id: `msg-verified-${Date.now()}`,
              role: 'assistant',
              text: `AI Telemetry benchmarked **${res.suppliers.length} manufacturing hubs**. Primary recommendation: **${topSupplier.supplier}** (${topSupplier.area}) at **$${res.unitBase.toFixed(2)}/unit** (${topSupplier.quality}% yield, ${topSupplier.cert}).`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      })
      .finally(() => {
        setIsAiScanning(false);
      });
  };

  // Step 1b: User submits follow-up prompts, adjustments, or questions
  const handleFollowUpPrompt = async (promptText: string) => {
    const text = promptText.trim();
    if (!text) return;

    setInputText('');

    const userMsg: ChatStreamMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatStream((prev) => [...prev, userMsg]);
    setIsAiThinking(true);
    scrollToBottom();

    const currentUnit = selectedOpt ? selectedOpt.unitPrice : activeLoc.unitCost;
    const context = {
      partName: invoice.partName,
      specs: invoice.specs,
      moq: invoice.moq,
      needByDate: invoice.needByDate,
      origin: invoice.origin,
      destination: invoice.destination,
      carrier: invoice.selectedCarrier,
      sourcingApproved: invoice.sourcingApproved,
      shippingApproved: invoice.shippingApproved,
      isPaid: invoice.isPaid,
      selectedSupplier: invoice.selectedSupplier,
      unitPrice: currentUnit
    };

    const history = chatStream.map((m) => ({ role: m.role, text: m.text }));

    try {
      const result = await chatWithDocket(text, context, history);

      if (result.isNewRequisition) {
        handleStartIdea(text);
        return;
      }

      if (result.mutation) {
        const mut = result.mutation;
        let stepToActivate: 'spec' | 'sourcing' | 'shipping' | 'dock' | null = null;

        setInvoice((prev) => {
          let newSupplier = prev.selectedSupplier;
          let newOrigin = prev.origin;
          let matchedLoc = sourcingLocations.find((l) => l.supplier === prev.selectedSupplier) || activeLoc;

          if (mut.updatedSupplierName) {
            const target = mut.updatedSupplierName.toLowerCase();
            const found = sourcingLocations.find((l) =>
              l.supplier.toLowerCase().includes(target) ||
              l.country.toLowerCase().includes(target) ||
              l.area.toLowerCase().includes(target) ||
              target.includes(l.country.toLowerCase()) ||
              target.includes(l.supplier.toLowerCase())
            );
            if (found) {
              matchedLoc = found;
              newSupplier = found.supplier;
              setSelectedLocationId(found.id);
              const airportCode = found.airport.match(/\b[A-Z]{3}\b/)?.[0] || found.country;
              newOrigin = `${found.area} (${airportCode})`;
              stepToActivate = 'sourcing';
            }
          }

          const newMoq = mut.updatedMoq && mut.updatedMoq > 0 ? mut.updatedMoq : prev.moq;
          const newUnitPrice = mut.updatedUnitPrice && mut.updatedUnitPrice > 0
            ? mut.updatedUnitPrice
            : (mut.updatedSupplierName && matchedLoc ? matchedLoc.unitCost : currentUnit);
          const newPartsTotal = parseFloat((newUnitPrice * newMoq).toFixed(2));
          const newDuties = parseFloat((newPartsTotal * 0.027).toFixed(2));

          let newCarrier = prev.selectedCarrier;
          let newShippingAmount = prev.shippingAmount;
          if (mut.updatedCarrier) {
            const cLower = mut.updatedCarrier.toLowerCase();
            if (cLower.includes('fedex')) {
              newCarrier = 'FedEx Aerospace Global Priority';
              newShippingAmount = 910.00;
              stepToActivate = 'shipping';
            } else if (cLower.includes('ups')) {
              newCarrier = 'UPS Worldwide Dedicated Drone Cargo';
              newShippingAmount = 760.00;
              stepToActivate = 'shipping';
            } else if (cLower.includes('dhl')) {
              newCarrier = 'DHL Express UAV Priority Air';
              newShippingAmount = 830.00;
              stepToActivate = 'shipping';
            } else {
              newCarrier = mut.updatedCarrier;
              stepToActivate = 'shipping';
            }
          }

          if (mut.updatedMoq && !stepToActivate) {
            stepToActivate = 'sourcing';
          }

          return {
            ...prev,
            moq: newMoq,
            origin: newOrigin,
            sourcingAmount: newPartsTotal,
            customsAmount: newDuties,
            selectedSupplier: newSupplier,
            carrier: newCarrier,
            selectedCarrier: newCarrier,
            shippingAmount: newShippingAmount,
            needByDate: mut.updatedNeedByDate || prev.needByDate
          };
        });

        if (stepToActivate) {
          setActiveStep(stepToActivate);
        }
      }

      setChatStream((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: result.reply,
          actionTaken: result.actionTaken,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn('Error in follow-up chat:', err);
      setChatStream((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          text: `Logged adjustment: "${text}". Requisition parameters and landed calculations updated.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAiThinking(false);
      scrollToBottom();
    }
  };

  // Optional: Auto-initiate requisition if query param ?q= is provided
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q && q.trim()) {
        handleStartIdea(decodeURIComponent(q));
      }
    } catch (_) {}
  }, []);

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


  // Step 2: Lock Supplier & Advance to Flight Tracking
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
    setActiveStep('shipping');
    setChatStream((prev) => [
      ...prev,
      {
        id: `approve-sourcing-${Date.now()}`,
        role: 'assistant',
        text: `Supplier **${supplierName}** locked at **$${unitPrice.toFixed(2)}/unit**. Advancing to **Step 03: Flight Telemetry & Air Cargo**.`,
        actionTaken: `Locked ${supplierName} ($${newSourcingAmount.toLocaleString()})`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    scrollToBottom();
  };

  // Step 3: Approve Shipping, Customs & Bill of Entry
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
    setActiveStep('dock');
    setChatStream((prev) => [
      ...prev,
      {
        id: `approve-shipping-${Date.now()}`,
        role: 'assistant',
        text: `Air cargo booked with **${carrierName}** ($${freightCost.toLocaleString()}). Boeing 777F landed at destination dock. Advancing to **Step 04: Dock Scan & 3-Way Match**.`,
        actionTaken: `Dispatched ${carrierName}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    scrollToBottom();
  };

  // Step 4: Settle Final Landed Invoice with 3-Way Match
  const handleSettleStep6 = () => {
    setInvoice((prev) => ({
      ...prev,
      deliveryApproved: true,
      isPaid: true
    }));
    setActiveStep('dock');
    setChatStream((prev) => [
      ...prev,
      {
        id: `settle-order-${Date.now()}`,
        role: 'assistant',
        text: `Zero-variance 3-way match verified. Landed invoice reconciled and settled in full via automated wire TXN-88192-ACH. Order closed!`,
        actionTaken: 'Order Closed [Paid in Full]',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    scrollToBottom();
  };

  const latestMsg = chatStream.length > 0 ? chatStream[chatStream.length - 1] : null;
  const lastAiMsg = [...chatStream].reverse().find((m) => m.role === 'assistant');
  const lastUserMsg = [...chatStream].reverse().find((m) => m.role === 'user');

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
      {/* ================= LEFT HALF: FOCUSED 4-STEP WORKFLOW INTERFACE ================= */}
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
        {!hasStarted ? (
          /* ================= STEP 1: INITIAL EMPTY CHATGPT-STYLE PROMPT ================= */
          <div
            ref={chatScrollContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              boxSizing: 'border-box'
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
              [Step 1 of 6: Sourcing & Discovery] Enter any part query, BOM, or spec. Docket will scan global distributors, call & text vendors, rank the top 3 options, launch flight watch, and sync dock inventory.
            </p>

            {/* Clickable Quick Starter Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 500 }}>
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
          /* ================= ACTIVE FOCUSED WORKFLOW PIPELINE ================= */
          <>
            {/* 1. TOP HEADER & LINEAR 4-STEP WORKFLOW STEPPER BAR (Sticky) */}
            <div
              style={{
                background: '#FFFFFF',
                borderBottom: '1px solid var(--cardline)',
                padding: '10px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flexShrink: 0
              }}
            >
              {/* Requisition Header & PO */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#309EFE', flexShrink: 0 }} className="dot-pulse" />
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#07122B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {invoice.partName}
                  </span>
                  <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', background: 'rgba(7, 18, 43, 0.05)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>
                    {invoice.moq.toLocaleString()} pcs
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                    PO: {invoice.poNumber}
                  </span>

                  <button
                    onClick={() => {
                      setHasStarted(false);
                      setInvoice(initialInvoice);
                      setUserPromptText('');
                      setStep2Scanned(false);
                      setActiveStep('sourcing');
                    }}
                    style={{
                      padding: '4px 8px',
                      background: 'rgba(7, 18, 43, 0.04)',
                      border: '1px solid rgba(7, 18, 43, 0.12)',
                      borderRadius: 4,
                      fontSize: '9.5px',
                      fontFamily: "'Roboto Mono', monospace",
                      color: 'var(--dim)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <RefreshCw size={10} /> Reset
                  </button>
                </div>
              </div>

              {/* 4-Step Linear Workflow Stepper Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, width: '100%' }}>
                {/* Step 1: Spec */}
                <button
                  onClick={() => setActiveStep('spec')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: activeStep === 'spec' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
                    background: activeStep === 'spec' ? 'rgba(48, 158, 254, 0.08)' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: activeStep === 'spec' ? '#309EFE' : 'var(--dim)' }}>
                      01 SPEC
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: '#24AB5C' }}>
                      ✓ OK
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#07122B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Spec & BOM
                  </span>
                </button>

                {/* Step 2: Sourcing */}
                <button
                  onClick={() => setActiveStep('sourcing')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: activeStep === 'sourcing' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
                    background: activeStep === 'sourcing' ? 'rgba(48, 158, 254, 0.08)' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: activeStep === 'sourcing' ? '#309EFE' : 'var(--dim)' }}>
                      02 SOURCING
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.sourcingApproved ? '#24AB5C' : '#309EFE' }}>
                      {invoice.sourcingApproved ? '✓ LOCKED' : 'ACTIVE'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#07122B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Radar & RFQ
                  </span>
                </button>

                {/* Step 3: Flight */}
                <button
                  onClick={() => setActiveStep('shipping')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: activeStep === 'shipping' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
                    background: activeStep === 'shipping' ? 'rgba(48, 158, 254, 0.08)' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: activeStep === 'shipping' ? '#309EFE' : 'var(--dim)' }}>
                      03 FLIGHT
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.shippingApproved ? '#24AB5C' : (invoice.sourcingApproved ? '#309EFE' : 'var(--dim)') }}>
                      {invoice.shippingApproved ? '✓ EN ROUTE' : (invoice.sourcingApproved ? 'READY' : 'PENDING')}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#07122B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Air Cargo
                  </span>
                </button>

                {/* Step 4: Dock & Match */}
                <button
                  onClick={() => setActiveStep('dock')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 8,
                    border: activeStep === 'dock' ? '1.5px solid #309EFE' : '1px solid var(--cardline)',
                    background: activeStep === 'dock' ? 'rgba(48, 158, 254, 0.08)' : '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: activeStep === 'dock' ? '#309EFE' : 'var(--dim)' }}>
                      04 DOCK & MATCH
                    </span>
                    <span style={{ fontSize: '8px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.isPaid ? '#24AB5C' : (invoice.shippingApproved ? '#309EFE' : 'var(--dim)') }}>
                      {invoice.isPaid ? '✓ PAID' : (invoice.shippingApproved ? 'READY' : 'PENDING')}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#07122B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Scan & Settle
                  </span>
                </button>
              </div>
            </div>

            {/* 2. DOCKET INTELLIGENT COPILOT BAR (Sticky) */}
            <div
              style={{
                background: '#FFFFFF',
                borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
                padding: '8px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 7,
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} className="dot-pulse" />
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '10px', fontWeight: 700, color: '#309EFE', letterSpacing: '0.04em' }}>
                    DOCKET REQUISITION COPILOT
                  </span>
                  <span style={{ fontSize: '9px', fontFamily: "'Roboto Mono', monospace", color: '#07122B', background: 'rgba(48, 158, 254, 0.12)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                    Gemini 3.1 Live
                  </span>
                </div>

                {chatStream.length > 1 && (
                  <button
                    onClick={() => setIsChatExpanded(!isChatExpanded)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#309EFE',
                      fontSize: '10px',
                      fontFamily: "'Roboto Mono', monospace",
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3
                    }}
                  >
                    {isChatExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    {isChatExpanded ? 'Hide History' : `History (${chatStream.length})`}
                  </button>
                )}
              </div>

              {/* Latest message or thinking banner */}
              {isAiThinking ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, background: 'rgba(48, 158, 254, 0.06)', borderLeft: '3px solid #309EFE' }}>
                  <Sparkles size={13} color="#309EFE" className="dot-pulse" />
                  <span style={{ fontSize: '11px', fontFamily: "'Roboto Mono', monospace", color: '#309EFE' }}>
                    Refining requisition parameters & updating landed invoice...
                  </span>
                </div>
              ) : (
                lastAiMsg && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 10px', borderRadius: 8, background: 'rgba(48, 158, 254, 0.04)', borderLeft: '3px solid #309EFE' }}>
                    {lastUserMsg && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                        <span style={{ fontWeight: 700, color: '#309EFE' }}>PROMPT:</span>
                        <span style={{ color: '#07122B', fontWeight: 600 }}>"{lastUserMsg.text}"</span>
                      </div>
                    )}
                    <div style={{ fontSize: '11.5px', color: '#07122B', lineHeight: 1.45 }}>
                      {lastAiMsg.text}
                    </div>
                    {lastAiMsg.actionTaken && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, alignSelf: 'flex-start', marginTop: 2, padding: '2px 8px', borderRadius: 4, background: 'rgba(36, 171, 92, 0.12)', color: '#24AB5C', fontSize: '10px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                        <CheckCircle2 size={11} color="#24AB5C" />
                        {lastAiMsg.actionTaken}
                      </div>
                    )}
                  </div>
                )
              )}

              {/* Collapsible conversation history drawer */}
              {isChatExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 150, overflowY: 'auto', padding: '6px 0', borderTop: '1px solid rgba(7, 18, 43, 0.06)' }}>
                  {chatStream.slice(0, -1).map((msg) => (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '5px 8px', borderRadius: 6, background: msg.role === 'user' ? 'rgba(7, 18, 43, 0.03)' : 'rgba(48, 158, 254, 0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '9px', fontWeight: 700, color: msg.role === 'user' ? '#07122B' : '#309EFE' }}>
                          {msg.role === 'user' ? 'YOU:' : 'DOCKET:'}
                        </span>
                        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '8.5px', color: 'var(--dim)' }}>
                          {msg.timestamp}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#07122B' }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick refinement chips */}
              {!isAiThinking && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[
                    'Qty: 2,500 pcs',
                    'Switch to Taiwan',
                    'Ship via FedEx Priority'
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleFollowUpPrompt(chip)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid rgba(48, 158, 254, 0.3)',
                        color: '#07122B',
                        borderRadius: 999,
                        padding: '2px 8px',
                        fontSize: '9.5px',
                        fontFamily: "'Roboto Mono', monospace",
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#309EFE';
                        e.currentTarget.style.background = 'rgba(48, 158, 254, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(48, 158, 254, 0.3)';
                        e.currentTarget.style.background = '#FFFFFF';
                      }}
                    >
                      <span style={{ color: '#309EFE', fontWeight: 700 }}>➜</span> {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. FOCUSED ACTIVE STAGE CANVAS (Scrollable) */}
            <div
              ref={chatScrollContainerRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                minWidth: 0,
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              {/* STAGE 1: SPEC & BOM VIEW */}
              {activeStep === 'spec' && (
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid var(--cardline)',
                    borderRadius: 12,
                    padding: '16px 18px',
                    boxShadow: '0 2px 10px rgba(7, 18, 43, 0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: '11px', fontWeight: 700, color: '#309EFE' }}>
                      [STEP 01: REQUISITION SPECIFICATION DOCKET]
                    </span>
                    <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: '#24AB5C', background: 'rgba(36, 171, 92, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
                      ✓ VERIFIED BY DOCKET
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#07122B', margin: '0 0 6px 0' }}>
                      {invoice.partName}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--dim)', margin: 0, lineHeight: 1.5 }}>
                      {invoice.specs}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, background: '#F8FAFD', padding: 12, borderRadius: 8, border: '1px solid var(--cardline)' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>TARGET QUANTITY</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#07122B' }}>{invoice.moq.toLocaleString()} pcs</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>NEED-BY DATE</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#07122B' }}>{invoice.needByDate}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>HTS TARIFF CODE</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#07122B' }}>{invoice.htsCode} (2.7% duty)</div>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>DESTINATION DOCK</span>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#07122B' }}>{invoice.destination}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 6 }}>
                    <button
                      onClick={() => setActiveStep('sourcing')}
                      style={{
                        padding: '9px 18px',
                        background: '#07122B',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s ease'
                      }}
                    >
                      Proceed to Global Sourcing Radar (Step 2) <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 2: GLOBAL SOURCING & DIRECT NEGOTIATION */}
              {activeStep === 'sourcing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

                  {invoice.sourcingApproved && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(36, 171, 92, 0.08)',
                        border: '1px solid rgba(36, 171, 92, 0.25)',
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="#24AB5C" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#07122B' }}>
                          Primary Supplier Locked: <strong style={{ color: '#24AB5C' }}>{invoice.selectedSupplier}</strong> (${(invoice.sourcingAmount / invoice.moq).toFixed(2)}/unit)
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveStep('shipping')}
                        style={{
                          padding: '7px 14px',
                          background: '#24AB5C',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        Proceed to Flight Cargo (Step 03) <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 3: FLIGHT WATCH & CUSTOMS CLEARANCE */}
              {activeStep === 'shipping' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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

                  {invoice.shippingApproved && (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(48, 158, 254, 0.08)',
                        border: '1px solid rgba(48, 158, 254, 0.25)',
                        borderRadius: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={16} color="#309EFE" />
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#07122B' }}>
                          Air Freight Dispatched: <strong style={{ color: '#309EFE' }}>{invoice.selectedCarrier}</strong> (AWB-9812-7801)
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveStep('dock')}
                        style={{
                          padding: '7px 14px',
                          background: '#07122B',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6
                        }}
                      >
                        Proceed to Dock & 3-Way Match (Step 04) <ArrowRight size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 4: DOCK SCAN & ZERO-VARIANCE RECONCILIATION */}
              {activeStep === 'dock' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {!invoice.shippingApproved && (
                    <div style={{ padding: '8px 12px', background: 'rgba(48, 158, 254, 0.08)', borderRadius: 8, fontSize: '11.5px', color: '#07122B', borderLeft: '3px solid #309EFE' }}>
                      💡 Inbound shipment is in transit. Below is the automated dock scanner and warehouse shelf allocation simulator.
                    </div>
                  )}

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
                        [STEP 04: RECEIVING DOCK & 3-WAY MATCH]
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

                    <DockAndInventoryTracking
                      partName={invoice.partName}
                      binLocation={invoice.binLocation}
                      qty={invoice.moq}
                      poNumber={invoice.poNumber}
                      onSettleOrder={handleSettleStep6}
                      isSettled={invoice.isPaid}
                    />
                  </div>

                  {invoice.isPaid && (
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(36, 171, 92, 0.1)',
                        border: '1.5px solid #24AB5C',
                        borderRadius: 12,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <ShieldCheck size={20} color="#24AB5C" />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#07122B' }}>
                            Order Closed & Settled with Zero Variance!
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                            Invoice #INV-2026-0881 · Paid via Wire TXN-88192-ACH · Shelved in {invoice.binLocation}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => window.print()}
                        style={{
                          padding: '8px 16px',
                          background: '#24AB5C',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Export Landed Invoice PDF
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>
          </>
        )}

        {/* BOTTOM CHAT INPUT BAR - Slim, clean dock */}
        <div
          style={{
            padding: '8px 18px',
            background: '#FFFFFF',
            borderTop: '1px solid var(--cardline)',
            flexShrink: 0,
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid rgba(7, 18, 43, 0.14)',
              borderRadius: 8,
              padding: '4px 8px',
              background: '#FFFFFF',
              boxSizing: 'border-box',
              width: '100%',
              gap: 8
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputText.trim()) {
                  if (!hasStarted) {
                    handleStartIdea(inputText);
                  } else {
                    handleFollowUpPrompt(inputText);
                  }
                }
              }}
              placeholder={
                !hasStarted
                  ? "Describe part or BOM (e.g. '450mm drone wings 1,200 pcs Nov 18')..."
                  : "Prompt or refine (e.g. 'Change MOQ to 3,000', 'Switch to Taiwan', 'Why is customs 2.7%?')..."
              }
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--ink)',
                minWidth: 0
              }}
            />

            <button
              onClick={() => {
                if (!hasStarted) {
                  handleStartIdea(inputText);
                } else {
                  handleFollowUpPrompt(inputText);
                }
              }}
              disabled={!inputText.trim() || isAiThinking}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: inputText.trim() && !isAiThinking ? '#309EFE' : 'rgba(7, 18, 43, 0.08)',
                color: inputText.trim() && !isAiThinking ? '#07122B' : 'rgba(7, 18, 43, 0.3)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() && !isAiThinking ? 'pointer' : 'default',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <Send size={13} />
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
        <LiveInvoiceView
          invoice={invoice}
          onPrint={() => window.print()}
        />
      </div>

      {/* ================= INTERACTIVE CALLING MODAL ================= */}
      <VendorCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        vendorName={selectedOpt ? selectedOpt.supplier : activeLoc.supplier}
        partName={invoice.partName}
        qty={invoice.moq}
        unitPrice={selectedOpt ? selectedOpt.unitPrice : activeLoc.unitCost}
        onCallConfirmed={(negotiatedPrice) => {
          setVendorCalledConfirmed(true);
          if (negotiatedPrice) {
            const newSourcingAmount = negotiatedPrice * invoice.moq;
            setInvoice((prev) => ({
              ...prev,
              sourcingAmount: newSourcingAmount,
              customsAmount: parseFloat((newSourcingAmount * 0.027).toFixed(2))
            }));
            setChatStream((prev) => [
              ...prev,
              {
                id: `call-lock-${Date.now()}`,
                role: 'assistant',
                text: `VoIP Audio Wire negotiation locked with **${selectedOpt ? selectedOpt.supplier : activeLoc.supplier}**! Unit rate confirmed at **$${negotiatedPrice.toFixed(2)}/unit**. Landed invoice updated.`,
                actionTaken: `Voice negotiated rate applied: $${negotiatedPrice.toFixed(2)}/unit`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
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
          setChatStream((prev) => [
            ...prev,
            {
              id: `text-lock-${Date.now()}`,
              role: 'assistant',
              text: `Encrypted supplier text negotiation terms approved with **${selectedOpt ? selectedOpt.supplier : activeLoc.supplier}**. Packaging and priority dispatch confirmed.`,
              actionTaken: 'Vendor chat terms logged into PO docket',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
          scrollToBottom();
        }}
      />
    </div>
  );
};
