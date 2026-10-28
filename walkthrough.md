# Docket — Holistic Institutional Enterprise Procurement Architecture

## Overview
Docket has been transformed into a **Holistic Enterprise Autonomous Procurement Operating System**, integrating all 7 corporate procurement pillars across Engineering, Sourcing, Governance, Compliance, Freight Logistics, Dock Quality Assurance, and Accounts Payable.

---

## 🏢 What Was Missing & What Has Been Integrated

| Institutional Procurement Function | Previous State | Integrated Holistic Corporate Solution |
| :--- | :--- | :--- |
| **1. Internal Spend Governance & Approvals** | Missing (single-click commitment without authorization) | **[`ProcurementGovernanceChain.tsx`](file:///Users/saidaksh/Agent%2035/src/components/ProcurementGovernanceChain.tsx)**: 4-tier cryptographic approval chain (**Engineering Lead**, **Sourcing Director**, **Finance Controller**, **CFO**) with SOX 404 audit ledger, Cost Center (`CC-401`), GL (`GL-5310`), and budget cap validation. |
| **2. Supplier Master & SRM Directory** | Map markers only, no persistent vendor profiles | **[`SupplierMasterSRM.tsx`](file:///Users/saidaksh/Agent%2035/src/components/SupplierMasterSRM.tsx)**: Institutional Supplier Relationship Management console across 5 global clusters with **OTIF%**, **PPM Defect Rates**, **AS9100D/ITAR audits**, active **MSAs & NDAs**. |
| **3. Legal Purchase Order (PO Contract)** | Only commercial invoice displayed | **[`PurchaseOrderDocket.tsx`](file:///Users/saidaksh/Agent%2035/src/components/PurchaseOrderDocket.tsx)**: Formal legal PO document featuring Incoterms 2020 DDP, Net-30 payment terms, 1.5%/wk delay liquidated damages, and dual digital signature blocks. |
| **4. Dock QA & Incoming Inspection** | Basic barcode scan with instant zero variance | **[`DockQualityInspection.tsx`](file:///Users/saidaksh/Agent%2035/src/components/DockQualityInspection.tsx)**: **AS9102 First Article Inspection (FAI)** with CMM dimension tolerance checks (Length, Chord, Weight), CoC verification, and **interactive Non-Conformance (NCR / RMA) defect quarantine simulation**. |
| **5. Cross-Functional Department Hub** | Disconnected buyer view | **[`CorporateCompanyHub.tsx`](file:///Users/saidaksh/Agent%2035/src/components/CorporateCompanyHub.tsx)**: Holistic operating system command modal visualizing all 7 corporate departments, team leaders, mandates, and live KPIs. |
| **6. Multi-Docket Document Workspace** | Single invoice tab | **[`LiveInvoiceView.tsx`](file:///Users/saidaksh/Agent%2035/src/components/LiveInvoiceView.tsx)**: 4-way document switcher allowing users to toggle between **Landed Invoice**, **Legal PO Docket**, **Governance P2P**, and **AS9100D CoC**. |

---

## ⚡ The Full 6-Stage Corporate Procurement Lifecycle

```
[01. Spec & BOM] ──► [02. Sourcing Radar & SRM] ──► [03. Spend Governance P2P] ──► [04. Flight Cargo & Customs] ──► [05. Dock QA & AS9102 FAI] ──► [06. 3-Way Match & Settlement]
```

1. **Step 01: Spec & BOM Requisition**:
   - Parses engineering BOMs, tolerances (±0.05mm), target MOQs, and delivery deadlines.
   - Allocates Cost Center (`CC-401 Aerospace Propulsion`) and General Ledger (`GL-5310 Direct Production`).

2. **Step 02: Strategic Sourcing & Master SRM**:
   - Tactical Google Maps geospatial radar tracking 5 global clusters (Shenzhen, Taichung, Torrance, Lake Constance, Mexicali).
   - Top 3 AVL Benchmarked quotes with simulated VoIP telephony audio wire and encrypted vendor instant messaging.
   - Master SRM button allows auditing vendor performance metrics (OTIF 97.5%, 19 PPM defect rate).

3. **Step 03: Internal Spend Governance & Quorum Authorization**:
   - Multi-tier corporate approval hierarchy:
     - **Dr. Elena Rostova** (VP Hardware Architecture) — Technical tolerance & FAI sign-off.
     - **Marcus Vance** (Procurement Director) — Incoterms 2020 DDP & dual-sourcing validation.
     - **Sarah Jenkins, CPA** (Corporate Controller) — GL code allocation & budget cap check.
     - **David Sterling** (CFO) — High-dollar spend authorization.
   - Generates cryptographic SHA-256 digital signature hashes and unlocks the legal PO docket.

4. **Step 04: Trans-Pacific Air Cargo & Customs Clearing**:
   - Great Circle trans-Pacific flight tracking with Boeing 777F aircraft telemetry (`SZX ➜ SFO`, FL380, 520 KTS).
   - Customs Bill of Entry draft table with HTS tariff classification (`8807.30.0090` @ 2.70%).

5. **Step 05: Dock QA & AS9102 Incoming Inspection**:
   - Inspection lot sampling per AQL 0.65 Level II (32 samples).
   - Caliper & CMM precision tolerance table verification:
     - Overall Length: Nominal 450.00mm, Measured 450.02mm (PASS)
     - Mean Chord: Nominal 65.00mm, Measured 65.01mm (PASS)
     - Unit Weight: Nominal 142.0g, Measured 141.8g (PASS)
     - Glass Transition Temp (Tg): Nominal ≥ 130°C, Measured 132.4°C (PASS)
   - Interactive **Non-Conformance Report (NCR / RMA)** defect simulator with quarantine bay placement (`BAY-09-QUARANTINE`) and vendor debit memo.
   - Quality disposition releases lot to active inventory.

6. **Step 06: Zero-Variance 3-Way Match & Ledger Settlement**:
   - Handheld barcode scanner sweep simulation matching PO vs GRN vs Vendor Invoice.
   - Physical warehouse bin placement (`AISLE 04 · TIER 2 · BIN 08`).
   - Automated cryptographic payment wire (`TXN-88192-ACH`) with green watermark paid stamp.

---

## 🛠️ Key Files
- [`src/components/CorporateCompanyHub.tsx`](file:///Users/saidaksh/Agent%2035/src/components/CorporateCompanyHub.tsx): Enterprise procurement organization command center showing 7 cross-functional departments.
- [`src/components/ProcurementGovernanceChain.tsx`](file:///Users/saidaksh/Agent%2035/src/components/ProcurementGovernanceChain.tsx): Multi-tier P2P internal spend approval chain.
- [`src/components/SupplierMasterSRM.tsx`](file:///Users/saidaksh/Agent%2035/src/components/SupplierMasterSRM.tsx): Supplier Relationship Management console & AVL master directory.
- [`src/components/PurchaseOrderDocket.tsx`](file:///Users/saidaksh/Agent%2035/src/components/PurchaseOrderDocket.tsx): Official legal purchase order contract document.
- [`src/components/DockQualityInspection.tsx`](file:///Users/saidaksh/Agent%2035/src/components/DockQualityInspection.tsx): AS9102 incoming inspection, CMM tolerances, and NCR/RMA console.
- [`src/components/LiveInvoiceView.tsx`](file:///Users/saidaksh/Agent%2035/src/components/LiveInvoiceView.tsx): Dynamic landed invoice with 4-tab docket selector.
- [`src/components/ChatbotInterface.tsx`](file:///Users/saidaksh/Agent%2035/src/components/ChatbotInterface.tsx): Full 6-stage linear corporate workstation.
- [`src/components/Navbar.tsx`](file:///Users/saidaksh/Agent%2035/src/components/Navbar.tsx): Persistent navigation with direct Company Hub and SRM launch buttons.
