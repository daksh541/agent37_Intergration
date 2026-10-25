import React, { useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { CoucouNotch } from './components/CoucouNotch';
import { HeroSection } from './components/HeroSection';
import { ChaosSection } from './components/ChaosSection';
import { OrderDeskChat } from './components/OrderDeskChat';
import { SupplierDiscovery } from './components/SupplierDiscovery';
import { QuoteComparison } from './components/QuoteComparison';
import { ApprovalView } from './components/ApprovalView';
import { SourceSlipDemo } from './components/SourceSlipDemo';
import { DockReceivingScan } from './components/DockReceivingScan';
import { ThreeWayMatch } from './components/ThreeWayMatch';
import { InventoryShelf } from './components/InventoryShelf';
import { BOMWatch } from './components/BOMWatch';
import { SpendIntelligence } from './components/SpendIntelligence';
import { ReceiptClosed } from './components/ReceiptClosed';
import { OpsConsole } from './components/OpsConsole';
import { ChatbotInterface } from './components/ChatbotInterface';
import { DEFAULT_REQUEST, generateQuotesForPart, INITIAL_INVENTORY } from './data/catalog';
import { PartRequest, SupplierQuote } from './types';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'story' | 'chat' | 'ops'>('chat');
  const [currentStage, setCurrentStage] = useState(1);
  const [partRequest, setPartRequest] = useState<PartRequest>(DEFAULT_REQUEST);
  const [quotes, setQuotes] = useState<SupplierQuote[]>(generateQuotesForPart(DEFAULT_REQUEST));
  const [primaryQuote, setPrimaryQuote] = useState<SupplierQuote>(quotes[0]);
  const [fallbackQuote, setFallbackQuote] = useState<SupplierQuote>(quotes[1]);
  const [status, setStatus] = useState<
    'draft' | 'rfq_sent' | 'quoted' | 'approved' | 'paid' | 'source_slipped' | 'dock_scanned' | 'reconciled' | 'closed'
  >('quoted');

  // Stage navigators
  const handleScrollToStage = (stageNum: number) => {
    setCurrentStage(stageNum);
    const elementIds = ['', 'stage-ask', 'stage-sourcing', 'stage-approve', 'stage-dock', 'stage-shelf'];
    if (elementIds[stageNum]) {
      const el = document.getElementById(elementIds[stageNum]);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleUpdatePart = (mpn: string, qty: number, date: string) => {
    const updated: PartRequest = {
      ...partRequest,
      mpn,
      requestedQty: qty,
      needByDate: date
    };
    setPartRequest(updated);
    const newQuotes = generateQuotesForPart(updated);
    setQuotes(newQuotes);
    setPrimaryQuote(newQuotes[0]);
    setFallbackQuote(newQuotes[1]);
    setStatus('quoted');
  };

  const handleAdvanceToSourcing = () => {
    setStatus('rfq_sent');
    setCurrentStage(2);
    const el = document.getElementById('stage-sourcing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdvanceToComparison = () => {
    setStatus('quoted');
    const el = document.getElementById('stage-comparison');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdvanceToApproval = () => {
    setCurrentStage(3);
    const el = document.getElementById('stage-approve');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApprovePayment = () => {
    setStatus('paid');
    setCurrentStage(3);
  };

  const handleAdvanceToReceiving = () => {
    setCurrentStage(4);
    const el = document.getElementById('stage-dock');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDockScanComplete = () => {
    setStatus('dock_scanned');
  };

  const handleReconciled = () => {
    setStatus('reconciled');
    setCurrentStage(4);
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Signature Waybill Custom Cursor */}
      <CustomCursor />

      {/* Persistent Navigation Topbar */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={handleScrollToStage}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        isDarkTheme={viewMode === 'story' && currentStage === 0}
      />



      {/* VIEW MODE 1: STORY SHOWCASE */}
      {viewMode === 'story' && (
        <main>
          {/* Hero Section (Screenshot 1) */}
          <HeroSection
            onStart={() => setViewMode('chat')}
            onScrollToNext={() => {
              const el = document.getElementById('stage-ask');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Chaos of Manual Buying Collage (Screenshot 2) */}
          <ChaosSection />

          {/* Stage 01: The Ask - Conversational Order Desk (Screenshot 3) */}
          <OrderDeskChat
            request={partRequest}
            onUpdatePart={handleUpdatePart}
            onAdvanceToSourcing={handleAdvanceToSourcing}
            onOpenChatbot={() => setViewMode('chat')}
            status={status}
          />

          {/* Stage 02: Sourcing - Global Inventory Scan (Screenshot 4) */}
          <SupplierDiscovery
            quotes={quotes}
            onAdvanceToComparison={handleAdvanceToComparison}
            status={status}
          />

          {/* Stage 02/03: Quote Comparison - "One Answer. One Fallback." (Screenshot 1) */}
          <QuoteComparison
            primaryQuote={primaryQuote}
            fallbackQuote={fallbackQuote}
            allQuotes={quotes}
            onSelectPrimary={(q) => setPrimaryQuote(q)}
            onAdvanceToApproval={handleAdvanceToApproval}
          />

          {/* Stage 03: Approve - "Everything, in one line." (Screenshots 2.33.59, 2.35.15) */}
          <ApprovalView
            quote={primaryQuote}
            status={status}
            onApprovePayment={handleApprovePayment}
            onAdvanceToNext={handleAdvanceToReceiving}
          />

          {/* Resilience Failover: "A source slips. Your date doesn't." (Screenshot 5) */}
          <SourceSlipDemo />

          {/* Stage 04: Receiving & Dock Scan - "Scan the label. AGENT37 knows the box." (Screenshot 11) */}
          <DockReceivingScan
            onScanComplete={handleDockScanComplete}
            status={status}
          />

          {/* Stage 04b: Zero-Variance 3-Way Match & Invoice Reconciliation (Screenshot 11) */}
          <ThreeWayMatch
            onReconciled={handleReconciled}
            status={status}
          />

          {/* Stage 05: Inventory Shelf Allocation (Screenshot 12) */}
          <InventoryShelf inventory={INITIAL_INVENTORY} />

          {/* 24/7 BOM Watch Telemetry (Screenshot 13) */}
          <BOMWatch />

          {/* Spend Intelligence Query (Screenshot 11 bottom) */}
          <SpendIntelligence />

          {/* Stage 09: The Closed Order Receipt (Screenshot 14) */}
          <ReceiptClosed />
        </main>
      )}

      {/* VIEW MODE 2: CHATGPT-STYLE PROMPT CHATBOT INTERFACE */}
      {viewMode === 'chat' && (
        <div
          style={{
            position: 'fixed',
            top: 58,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: 'calc(100vh - 58px)',
            boxSizing: 'border-box',
            overflow: 'hidden',
            background: '#FAFBFD',
            zIndex: 10
          }}
        >
          <ChatbotInterface onBackToStory={() => setViewMode('story')} />
        </div>
      )}

      {/* VIEW MODE 3: PRODUCTION OPS CONSOLE */}
      {viewMode === 'ops' && (
        <div style={{ paddingTop: 58, minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
          <OpsConsole onBackToStory={() => setViewMode('story')} />
        </div>
      )}
    </div>
  );
};
export default App;
