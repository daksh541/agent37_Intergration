import React from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Lock,
  Download,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { InvoiceState } from './LiveInvoiceView';

interface PurchaseOrderDocketProps {
  invoice: InvoiceState;
  onPrint?: () => void;
}

export const PurchaseOrderDocket: React.FC<PurchaseOrderDocketProps> = ({ invoice, onPrint }) => {
  const partsTotal = invoice.sourcingAmount;
  const customsTotal = invoice.customsAmount;
  const shippingTotal = invoice.shippingAmount;
  const complianceTotal = invoice.complianceAmount;
  const deliveryTotal = invoice.deliveryAmount;
  const grandTotal = partsTotal + customsTotal + shippingTotal + complianceTotal + deliveryTotal;

  return (
    <div
      className="live-invoice-scroller"
      style={{
        flex: 1,
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        background: '#FAFBFD',
        padding: '16px 20px 40px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: 640, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Official Purchase Order Document Container */}
        <div
          className="wb-card"
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #07122B',
            borderRadius: 14,
            padding: '24px 26px',
            boxShadow: '0 8px 30px rgba(7, 18, 43, 0.06)',
            position: 'relative',
            boxSizing: 'border-box',
            width: '100%'
          }}
        >
          {/* Top Document Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #07122B',
              paddingBottom: 16,
              marginBottom: 16
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: '#07122B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 800
                  }}
                >
                  PO
                </span>
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#07122B'
                  }}
                >
                  OFFICIAL PURCHASE ORDER CONTRACT
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#07122B',
                  margin: 0
                }}
              >
                {invoice.poNumber}
              </h2>
              <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                CONTRACT ID: CNT-2026-AG37 · REQUISITION AUTHORIZED
              </div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: invoice.sourcingApproved ? 'rgba(36, 171, 92, 0.12)' : 'rgba(48, 158, 254, 0.12)',
                  color: invoice.sourcingApproved ? '#24AB5C' : '#309EFE'
                }}
              >
                {invoice.isPaid ? 'EXECUTED & SETTLED ✓' : invoice.sourcingApproved ? 'LEGALLY ISSUED' : 'DRAFT CONTRACT'}
              </span>
              <div style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                Issue Date: {invoice.orderDate}
              </div>
              <div style={{ fontSize: '10px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)' }}>
                Promised Dock Delivery: <strong style={{ color: '#07122B' }}>{invoice.needByDate}</strong>
              </div>

              <button
                onClick={() => onPrint ? onPrint() : window.print()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 6,
                  padding: '3px 8px',
                  background: 'rgba(7, 18, 43, 0.05)',
                  border: '1px solid rgba(7, 18, 43, 0.15)',
                  borderRadius: 4,
                  fontSize: '9.5px',
                  fontFamily: "'Roboto Mono', monospace",
                  color: '#07122B',
                  cursor: 'pointer'
                }}
              >
                <Printer size={11} /> Print / Export PO
              </button>
            </div>
          </div>

          {/* Legal Contracting Parties */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              background: '#F8FAFD',
              border: '1px solid var(--cardline)',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: '11px',
              marginBottom: 16
            }}
          >
            <div>
              <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', display: 'block', marginBottom: 2 }}>
                BUYER (LEGALLY BOUND ENTITY):
              </span>
              <strong style={{ color: '#07122B', fontSize: '12px', display: 'block' }}>
                WAYBILL / DOCKET INC.
              </strong>
              <div style={{ color: 'var(--mut)', lineHeight: 1.35, marginTop: 2 }}>
                500 Howard Street, Suite 400<br />
                San Francisco, CA 94105 USA<br />
                EIN: 94-3829102 · EOR Registered
              </div>
            </div>

            <div>
              <span style={{ fontSize: '9.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', display: 'block', marginBottom: 2 }}>
                SUPPLIER (AUTHORIZED VENDOR):
              </span>
              <strong style={{ color: '#07122B', fontSize: '12px', display: 'block' }}>
                {invoice.selectedSupplier || 'AeroCarbon Precision Ltd'}
              </strong>
              <div style={{ color: 'var(--mut)', lineHeight: 1.35, marginTop: 2 }}>
                {invoice.origin}<br />
                AS9100D Certified Facility<br />
                AVL Status: Approved Institutional Partner
              </div>
            </div>
          </div>

          {/* Commercial Terms & Governance Codes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              border: '1px solid var(--cardline)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 16,
              fontSize: '10.5px'
            }}
          >
            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>INCOTERMS 2020</span>
              <strong style={{ color: '#07122B' }}>DDP (Delivered Duty Paid)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>PAYMENT TERMS</span>
              <strong style={{ color: '#07122B' }}>Net 30 (2% 10 Net 30)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>FREIGHT ROUTING</span>
              <strong style={{ color: '#07122B' }}>{invoice.selectedCarrier}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>COST CENTER</span>
              <strong style={{ color: '#07122B' }}>CC-401 (Propulsion)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>GL ALLOCATION</span>
              <strong style={{ color: '#07122B' }}>GL-5310 (Direct Mat.)</strong>
            </div>

            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '9px', display: 'block' }}>DELIVERY HUB</span>
              <strong style={{ color: '#07122B' }}>{invoice.destination}</strong>
            </div>
          </div>

          {/* Itemized PO Line Items Table */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                borderBottom: '1.5px solid #07122B',
                paddingBottom: 6,
                fontSize: '9.5px',
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 700,
                color: 'var(--dim)',
                textTransform: 'uppercase'
              }}
            >
              <span>LN</span>
              <span>ITEM DESCRIPTION & TECH SPEC</span>
              <span style={{ textAlign: 'center' }}>QTY</span>
              <span style={{ textAlign: 'right' }}>UNIT ($)</span>
              <span style={{ textAlign: 'right' }}>TOTAL ($)</span>
            </div>

            {/* Line 1: Main Hardware */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                padding: '9px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
                fontSize: '11px',
                alignItems: 'center'
              }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: 'var(--dim)' }}>01</span>
              <div>
                <strong style={{ color: '#07122B', display: 'block' }}>{invoice.partName}</strong>
                <span style={{ fontSize: '10px', color: 'var(--dim)' }}>{invoice.specs}</span>
              </div>
              <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>{invoice.moq.toLocaleString()}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>
                ${(invoice.sourcingAmount / (invoice.moq || 1)).toFixed(2)}
              </span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                ${partsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Line 2: Customs & Bill of Entry */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                padding: '9px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
                fontSize: '11px',
                alignItems: 'center'
              }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: 'var(--dim)' }}>02</span>
              <div>
                <span style={{ color: '#07122B', fontWeight: 600 }}>US Customs Tariff Classification</span>
                <span style={{ fontSize: '10px', color: 'var(--dim)', display: 'block' }}>HTS Code {invoice.htsCode} @ 2.70% Ad Valorem</span>
              </div>
              <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>1 LOT</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>${customsTotal.toFixed(2)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                ${customsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Line 3: Priority Air Cargo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                padding: '9px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
                fontSize: '11px',
                alignItems: 'center'
              }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: 'var(--dim)' }}>03</span>
              <div>
                <span style={{ color: '#07122B', fontWeight: 600 }}>International Trans-Pacific Air Cargo</span>
                <span style={{ fontSize: '10px', color: 'var(--dim)', display: 'block' }}>{invoice.selectedCarrier} · e-AWB #9812-7801</span>
              </div>
              <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>1 SHIP</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>${shippingTotal.toFixed(2)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                ${shippingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Line 4: Compliance & CoC */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                padding: '9px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.08)',
                fontSize: '11px',
                alignItems: 'center'
              }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: 'var(--dim)' }}>04</span>
              <div>
                <span style={{ color: '#07122B', fontWeight: 600 }}>AS9100D / RoHS 3 / REACH CoC Verification</span>
                <span style={{ fontSize: '10px', color: 'var(--dim)', display: 'block' }}>Lot Certification Dossier & Tensile Test Certificate</span>
              </div>
              <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>1 COC</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>${complianceTotal.toFixed(2)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                ${complianceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Line 5: Dock Receiving */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '30px minmax(0, 1fr) 70px 80px 95px',
                gap: 6,
                padding: '9px 0',
                borderBottom: '2px solid #07122B',
                fontSize: '11px',
                alignItems: 'center'
              }}
            >
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: 'var(--dim)' }}>05</span>
              <div>
                <span style={{ color: '#07122B', fontWeight: 600 }}>Physical Dock Receiving & Bin Allocation</span>
                <span style={{ fontSize: '10px', color: 'var(--dim)', display: 'block' }}>Barcode Intake & Shelf Placement ({invoice.binLocation})</span>
              </div>
              <span style={{ textAlign: 'center', fontFamily: "'Roboto Mono', monospace" }}>1 DOCK</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace" }}>${deliveryTotal.toFixed(2)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                ${deliveryTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Total Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
            <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dim)' }}>
                <span>Subtotal (Hardware & Services):</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace" }}>${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--dim)' }}>
                <span>Tariffs & Port Fees (Covered):</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace" }}>INCLUDED</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1.5px solid #07122B',
                  paddingTop: 6,
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#07122B'
                }}
              >
                <span>TOTAL COMMITTED VALUE:</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace" }}>
                  ${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Legal SLA Clauses & Liquidated Damages */}
          <div
            style={{
              background: '#F8FAFD',
              borderRadius: 8,
              border: '1px solid var(--cardline)',
              padding: '10px 12px',
              fontSize: '10px',
              color: 'var(--mut)',
              lineHeight: 1.45,
              marginBottom: 16
            }}
          >
            <strong style={{ color: '#07122B', display: 'block', marginBottom: 2 }}>
              INSTITUTIONAL TERMS & CONDITIONS (SLA CLAUSES):
            </strong>
            1. <strong>Liquidated Damages for Delay:</strong> Supplier guarantees delivery by <u>{invoice.needByDate}</u>. In the event of unexcused delay, a liquidated damages deduction of 1.50% per calendar week shall apply to Line 01.<br />
            2. <strong>AS9102 First Article Inspection:</strong> Inspection lot sampling per AQL 0.65 Level II required upon arrival. Non-conforming lots subject to immediate RMA quarantine and full debit memo.<br />
            3. <strong>Governing Law:</strong> Governed under the Uniform Commercial Code (UCC) and Incoterms 2020 DDP. Title transfers only upon verified receiving barcode scan at buyer dock.
          </div>

          {/* Cryptographic Digital Signatures Block */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              borderTop: '1px solid var(--cardline)',
              paddingTop: 12
            }}
          >
            <div style={{ border: '1px dashed var(--cardline)', borderRadius: 6, padding: '8px 10px', fontSize: '10px' }}>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block', marginBottom: 4 }}>
                BUYER AUTHORIZED SIGNATORY:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#24AB5C', fontWeight: 700 }}>
                <CheckCircle2 size={13} />
                <span>Dr. Elena Rostova & Sarah Jenkins</span>
              </div>
              <div style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginTop: 2 }}>
                SHA-256: 0x8a91b2c4...eor · Verified SOX 404
              </div>
            </div>

            <div style={{ border: '1px dashed var(--cardline)', borderRadius: 6, padding: '8px 10px', fontSize: '10px' }}>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", display: 'block', marginBottom: 4 }}>
                SUPPLIER ACCEPTANCE:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#309EFE', fontWeight: 700 }}>
                <CheckCircle2 size={13} />
                <span>{invoice.selectedSupplier || 'AeroCarbon Tech'}</span>
              </div>
              <div style={{ fontSize: '8.5px', fontFamily: "'Roboto Mono', monospace", color: 'var(--dim)', marginTop: 2 }}>
                Signed via Encrypted Vendor Handshake
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
