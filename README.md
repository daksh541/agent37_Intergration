# Docket — Autonomous Hardware Purchasing Platform

> Autonomous procurement terminal inspired by [waybill.to](https://waybill.to) and institutional aerospace supply chain operations. Ingests component specs, scans verified AVL suppliers across global hubs, simulates direct telephony and encrypted vendor chats, tracks active cargo flight paths, and automates zero-variance invoice reconciliation down to the physical warehouse dock.

---

## ⚡ Architecture & Workflow

```
[1. Requisition Docket] ──► [2. Sourcing Radar] ──► [3. AVL Benchmarking] ──► [4. 1-Click RFQ Lock] ──► [5. Carrier Flight Watch] ──► [6. Dock & Inventory Sync]
```

1. **Requisition Specification Ingestion**: Parse natural language BOMs, mechanical dimensions (e.g., carbon fiber drone wings, STM32 MCUs, brushless gimbal motors), tolerances, target MOQs, and delivery deadlines.
2. **Sourcing Radar & Multi-Hub Flight Telemetry**: Live interactive orthographic projection mapping global manufacturing clusters (Shenzhen SZX, Taichung RMQ, Torrance LAX, Lake Constance FDH, Mexicali MXL) with simultaneous flight arcs and active cargo plane tracking.
3. **Verified AVL Supplier Dossier**: Deep institutional supplier telemetry including AS9100D certifications, Toray T700 compliance, quality yield rates, and direct unit cost breakdown.
4. **Direct Telephony & Encrypted Supplier Messaging**:
   - **Direct Audio Wire**: Simulated VoIP telephony bridge with live speech-to-text transcript generation and cryptographic BOM signing.
   - **Direct Supplier Chat**: Automated instant messaging widget with pre-configured contract and compliance negotiation chips.
5. **e-AWB Carrier & Customs Flight Watch**: Real-time cross-pacific cargo tracking with customs broker clearance, e-AWB generation, and tariff classification (HTS 8807.30.0090).
6. **Zero-Variance 3-Way Match & Dock Inventory Sync**: Live handheld barcode scanner simulation, automated PO-to-Dock matching, and instant warehouse bin allocation.
7. **Live Reactive Invoice**: High-density Waybill invoice with real-time reactive calculations, line-item approvals, and cryptographic payment receipt stamp.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Vanilla CSS with strict design tokens (Waybill Deep Obsidian `#07122B`, Electric Blue `#309EFE`, High-Yield Emerald `#24AB5C`, Hairline Dividers `#E2E8F0`)
- **Typography**: Funnel Display, Inter, and Roboto Mono
- **Icons**: Lucide React (clean vector strokes, zero emojis)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone git@github.com:daksh541/agent37_Intergration.git
cd agent37_Intergration
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📄 License
MIT
