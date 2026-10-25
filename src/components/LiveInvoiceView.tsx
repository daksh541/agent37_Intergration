import React from 'react';
import { FileCheck, ShieldCheck, Download, CheckCircle2, Building2, Package, Printer, ExternalLink } from 'lucide-react';

export interface InvoiceState {
  isDefined: boolean;
  poNumber: string;
  invoiceNumber: string;
  orderDate: string;
  importer: string;
  partName: string;
  specs: string;
  moq: number;
  needByDate: string;
  htsCode: string;
  origin: string;
  destination: string;
  carrier: string;
  flightNum: string;
  binLocation: string;
  sourcingApproved: boolean;
  sourcingAmount: number;
  selectedSupplier: string;
  customsApproved: boolean;
  customsAmount: number;
  rfqStatus: string;
  shippingApproved: boolean;
  shippingAmount: number;
  selectedCarrier: string;
  complianceApproved: boolean;
  complianceAmount: number;
  deliveryApproved: boolean;
  deliveryAmount: number;
  isPaid: boolean;
  paidTxId: string;
}

interface LiveInvoiceViewProps {
  invoice: InvoiceState;
  onPrint?: () => void;
}

export const LiveInvoiceView: React.FC<LiveInvoiceViewProps> = ({ invoice }) => {
  const currentTotal =
    (invoice.sourcingApproved ? invoice.sourcingAmount : 0) +
    (invoice.customsApproved ? invoice.customsAmount : 0) +
    (invoice.shippingApproved ? invoice.shippingAmount : 0) +
    (invoice.complianceApproved ? invoice.complianceAmount : 0) +
    (invoice.deliveryApproved ? invoice.deliveryAmount : 0);

  const potentialTotal =
    invoice.sourcingAmount +
    invoice.customsAmount +
    invoice.shippingAmount +
    invoice.complianceAmount +
    invoice.deliveryAmount;

  if (!invoice.isDefined) {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          background: '#FFFFFF',
          borderLeft: '1px solid var(--cardline)',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'rgba(7, 18, 43, 0.04)',
            border: '1px dashed rgba(7, 18, 43, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            color: 'var(--dim)'
          }}
        >
          <FileCheck size={26} />
        </div>

        <h3
          style={{
            fontFamily: "'Funnel Display', sans-serif",
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 8
          }}
        >
          Dynamic Landed Invoice & BOM
        </h3>

        <p
          style={{
            fontSize: '13px',
            color: 'var(--dim)',
            maxWidth: '38ch',
            lineHeight: 1.6,
            marginBottom: 20
          }}
        >
          Waiting for your hardware specification on the left. Once you submit a request, the live bill of materials, customs duties, freight, and accounting lines will form here in real-time.
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            background: 'var(--paper)',
            borderRadius: 20,
            fontSize: '11px',
            fontFamily: "'Roboto Mono', monospace",
            color: 'var(--dim)',
            border: '1px solid var(--cardline)'
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#309EFE' }} />
          Awaiting input: Drone Wings, MCU, Motors, etc.
        </div>
      </div>
    );
  }

  return (
    <div
      id="live-invoice-scroll-container"
      className="live-invoice-scroller"
      style={{
        flex: 1,
        height: '100%',
        maxHeight: '100%',
        minHeight: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain',
        background: '#FAFBFD',
        borderLeft: '1px solid var(--cardline)',
        padding: '24px 28px 80px 28px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: 640, width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Invoice Card Container */}
        <div
          className="wb-card"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--cardline)',
            borderRadius: 14,
            padding: '24px 26px',
            boxShadow: '0 4px 20px rgba(7, 18, 43, 0.04)',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {/* Official Watermark Paid Stamp when completed (Screenshot 2.35.15 AM.png) */}
          {invoice.isPaid && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 170,
                transform: 'rotate(-7deg)',
                border: '2px solid #24AB5C',
                borderRadius: 8,
                padding: '5px 12px',
                color: '#24AB5C',
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                background: 'rgba(255, 255, 255, 0.98)',
                boxShadow: '0 4px 16px rgba(36, 171, 92, 0.22)',
                zIndex: 10,
                pointerEvents: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle2 size={14} />
                [PAID · AGENT37]
              </div>
              <div style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.04em', textAlign: 'center', marginTop: 1, color: '#24AB5C' }}>
                TxID: {invoice.paidTxId}
              </div>
            </div>
          )}

          {/* Invoice Top Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--cardline)',
              paddingBottom: 16,
              marginBottom: 16
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#309EFE',
                    letterSpacing: '0.1em'
                  }}
                >
                  LANDED PROCUREMENT INVOICE
                </span>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 7px',
                    borderRadius: 4,
                    background: invoice.isPaid
                      ? 'rgba(36, 171, 92, 0.1)'
                      : 'rgba(48, 158, 254, 0.1)',
                    color: invoice.isPaid ? '#24AB5C' : '#309EFE',
                    fontWeight: 600
                  }}
                >
                  {invoice.isPaid ? 'SETTLED · ZERO VARIANCE' : 'FORMING IN REAL-TIME'}
                </span>
              </div>

              <h2
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--ink)'
                }}
              >
                {invoice.partName}
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", marginTop: 2 }}>
                Specs: {invoice.specs}
              </div>
            </div>

            <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontSize: '11px' }}>
              <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{invoice.invoiceNumber}</div>
              <div style={{ color: 'var(--dim)' }}>PO: {invoice.poNumber}</div>
              <div style={{ color: 'var(--dim)' }}>Date: {invoice.orderDate}</div>
            </div>
          </div>

          {/* Entities (Importer & Supplier) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              background: 'var(--paper)',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 18,
              fontSize: '11.5px',
              border: '1px solid var(--cardline)'
            }}
          >
            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', display: 'block', marginBottom: 2 }}>
                BILL TO (IMPORTER OF RECORD)
              </span>
              <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{invoice.importer}</div>
              <div style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px' }}>Destination: {invoice.destination}</div>
            </div>
            <div>
              <span style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '10px', display: 'block', marginBottom: 2 }}>
                SUPPLIER & ORIGIN
              </span>
              <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{invoice.selectedSupplier}</div>
              <div style={{ color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", fontSize: '10.5px' }}>Origin: {invoice.origin}</div>
            </div>
          </div>

          {/* DYNAMIC LINE ITEMS TABLE */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                borderBottom: '1.5px solid var(--cardline)',
                paddingBottom: 8,
                fontSize: '10px',
                fontFamily: "'Roboto Mono', monospace",
                color: 'var(--dim)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              <span>Component & Service Description</span>
              <span style={{ textAlign: 'center' }}>Approval</span>
              <span style={{ textAlign: 'right' }}>Amount (USD)</span>
            </div>

            {/* Line 1: Sourcing */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.06)',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  1. Sourcing: {invoice.partName}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  MOQ {invoice.moq.toLocaleString()} pcs @ ${(invoice.sourcingAmount / invoice.moq).toFixed(2)}/unit · {invoice.selectedSupplier}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                    background: invoice.sourcingApproved ? 'rgba(36, 171, 92, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                    color: invoice.sourcingApproved ? '#24AB5C' : 'var(--dim)'
                  }}
                >
                  {invoice.sourcingApproved ? 'APPROVED ✓' : 'PENDING'}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.sourcingApproved ? 'var(--ink)' : 'var(--dim)' }}>
                ${invoice.sourcingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Line 2: RFQ, Customs & Bill of Entry */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.06)',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  2. RFQ, Customs & Bill of Entry
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  HTS {invoice.htsCode} @ 2.70% · Licensed Broker Entry · {invoice.rfqStatus}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                    background: invoice.customsApproved ? 'rgba(36, 171, 92, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                    color: invoice.customsApproved ? '#24AB5C' : 'var(--dim)'
                  }}
                >
                  {invoice.customsApproved ? 'APPROVED ✓' : 'PENDING'}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.customsApproved ? 'var(--ink)' : 'var(--dim)' }}>
                ${invoice.customsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Line 3: Shipping & Flight Cargo */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.06)',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  3. Shipping: {invoice.selectedCarrier}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  Flight {invoice.flightNum} · {invoice.origin} → {invoice.destination} · Priority Air
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                    background: invoice.shippingApproved ? 'rgba(36, 171, 92, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                    color: invoice.shippingApproved ? '#24AB5C' : 'var(--dim)'
                  }}
                >
                  {invoice.shippingApproved ? 'APPROVED ✓' : 'PENDING'}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.shippingApproved ? 'var(--ink)' : 'var(--dim)' }}>
                ${invoice.shippingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Line 4: Regulatory Compliance & CoC */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1px solid rgba(7, 18, 43, 0.06)',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  4. Regulatory Compliance & CoC
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  RoHS 3 (EU 2015/863) · REACH SVHC · AS9100D Test Reports
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                    background: invoice.complianceApproved ? 'rgba(36, 171, 92, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                    color: invoice.complianceApproved ? '#24AB5C' : 'var(--dim)'
                  }}
                >
                  {invoice.complianceApproved ? 'APPROVED ✓' : 'PENDING'}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.complianceApproved ? 'var(--ink)' : 'var(--dim)' }}>
                ${invoice.complianceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            {/* Line 5: Dock Receiving & Final Mile */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 100px 115px',
                gap: 8,
                alignItems: 'center',
                padding: '11px 0',
                borderBottom: '1.5px solid var(--cardline)',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                  5. Dock Receiving & Final Mile Delivery
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                  Inbound Scan · Tamper Packaging · Bin {invoice.binLocation}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontFamily: "'Roboto Mono', monospace",
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontWeight: 600,
                    background: invoice.deliveryApproved ? 'rgba(36, 171, 92, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                    color: invoice.deliveryApproved ? '#24AB5C' : 'var(--dim)'
                  }}
                >
                  {invoice.deliveryApproved ? 'APPROVED ✓' : 'PENDING'}
                </span>
              </div>

              <div style={{ textAlign: 'right', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, color: invoice.deliveryApproved ? 'var(--ink)' : 'var(--dim)' }}>
                ${invoice.deliveryAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* 1-Line Landed Formula Bar (Screenshot 2.33.59 AM.png) */}
          <div
            style={{
              background: 'var(--paper)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 16,
              border: '1px solid var(--cardline)',
              fontSize: '11px',
              fontFamily: "'Roboto Mono', monospace"
            }}
          >
            <div style={{ color: 'var(--dim)', marginBottom: 6, fontSize: '10px', letterSpacing: '0.06em' }}>
              EVERYTHING, IN ONE LINE (ACTIVE ACCUMULATOR):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 5,
                  background: invoice.sourcingApproved ? 'rgba(48, 158, 254, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                  border: `1px solid ${invoice.sourcingApproved ? '#309EFE' : 'rgba(7, 18, 43, 0.1)'}`,
                  color: invoice.sourcingApproved ? '#07122B' : 'var(--dim)',
                  fontWeight: invoice.sourcingApproved ? 700 : 500
                }}
              >
                parts: ${invoice.sourcingApproved ? invoice.sourcingAmount.toLocaleString() : '0'}
              </span>
              <span style={{ color: 'var(--dim)', fontWeight: 700 }}>+</span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 5,
                  background: invoice.customsApproved ? 'rgba(48, 158, 254, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                  border: `1px solid ${invoice.customsApproved ? '#309EFE' : 'rgba(7, 18, 43, 0.1)'}`,
                  color: invoice.customsApproved ? '#07122B' : 'var(--dim)',
                  fontWeight: invoice.customsApproved ? 700 : 500
                }}
              >
                duties: ${invoice.customsApproved ? invoice.customsAmount.toFixed(2) : '0'}
              </span>
              <span style={{ color: 'var(--dim)', fontWeight: 700 }}>+</span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 5,
                  background: invoice.shippingApproved ? 'rgba(48, 158, 254, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                  border: `1px solid ${invoice.shippingApproved ? '#309EFE' : 'rgba(7, 18, 43, 0.1)'}`,
                  color: invoice.shippingApproved ? '#07122B' : 'var(--dim)',
                  fontWeight: invoice.shippingApproved ? 700 : 500
                }}
              >
                freight: ${invoice.shippingApproved ? invoice.shippingAmount.toLocaleString() : '0'}
              </span>
              <span style={{ color: 'var(--dim)', fontWeight: 700 }}>+</span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 5,
                  background: invoice.complianceApproved ? 'rgba(48, 158, 254, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                  border: `1px solid ${invoice.complianceApproved ? '#309EFE' : 'rgba(7, 18, 43, 0.1)'}`,
                  color: invoice.complianceApproved ? '#07122B' : 'var(--dim)',
                  fontWeight: invoice.complianceApproved ? 700 : 500
                }}
              >
                clearance: ${invoice.complianceApproved ? invoice.complianceAmount : '0'}
              </span>
              <span style={{ color: 'var(--dim)', fontWeight: 700 }}>+</span>
              <span
                style={{
                  padding: '3px 8px',
                  borderRadius: 5,
                  background: invoice.deliveryApproved ? 'rgba(48, 158, 254, 0.1)' : 'rgba(7, 18, 43, 0.05)',
                  border: `1px solid ${invoice.deliveryApproved ? '#309EFE' : 'rgba(7, 18, 43, 0.1)'}`,
                  color: invoice.deliveryApproved ? '#07122B' : 'var(--dim)',
                  fontWeight: invoice.deliveryApproved ? 700 : 500
                }}
              >
                delivery: ${invoice.deliveryApproved ? invoice.deliveryAmount : '0'}
              </span>
            </div>
          </div>

          {/* Calculation Summary Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, paddingTop: 4 }}>
            <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace", lineHeight: 1.6 }}>
              <div>● Terms: Net-30 ACH upon dock scan</div>
              <div>● Zero Variance 3-Way Match Guaranteed</div>
              <div>● Ledger Account: 1400 Raw Materials Inventory</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                Total Approved: ${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} / ${potentialTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div
                style={{
                  fontFamily: "'Funnel Display', sans-serif",
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  marginTop: 2
                }}
              >
                ${currentTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--dim)', fontFamily: "'Roboto Mono', monospace" }}>
                Landed per unit: ${(currentTotal / invoice.moq).toFixed(2)} / pc
              </div>
            </div>
          </div>
        </div>

        {/* Closed Order Audit Receipt (Screenshot 2.37.38 AM.png) */}
        <div
          className="wb-card"
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--cardline)',
            borderRadius: 16,
            padding: '16px 20px',
            boxShadow: '0 4px 16px rgba(7, 18, 43, 0.03)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--dim)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              ORDER AUDIT DOSSIER & HASH
            </span>
            <span style={{ fontSize: '10px', color: '#24AB5C', fontFamily: "'Roboto Mono', monospace", fontWeight: 700, background: 'rgba(36, 171, 92, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
              SHA-256 VERIFIED ✓
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, fontSize: '10.5px', fontFamily: "'Roboto Mono', monospace" }}>
            <div>
              <span style={{ color: 'var(--dim)' }}>Airway Bill:</span> DHL #AWB-9812-7801
            </div>
            <div>
              <span style={{ color: 'var(--dim)' }}>HTS Tariff:</span> {invoice.htsCode}
            </div>
            <div>
              <span style={{ color: 'var(--dim)' }}>Dock Bin:</span> {invoice.binLocation}
            </div>
            <div>
              <span style={{ color: 'var(--dim)' }}>3-Way Variance:</span> $0.00 (Exact Match)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
