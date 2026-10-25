import { PartRequest, SupplierQuote, InventoryItem, BOMWatchAlert, BOMRow } from '../types';

export const DEFAULT_REQUEST: PartRequest = {
  id: 'REQ-2026-8841',
  mpn: 'STM32H743VIT6',
  description: 'High-performance ARM Cortex-M7 MCU 480MHz, 2MB Flash, LQFP-100',
  category: 'Microcontrollers / Embedded',
  requestedQty: 2500,
  needByDate: 'Nov 14, 2026',
  targetPrice: 8.50,
  packageType: 'LQFP-100 (14x14mm)',
  notes: 'High reliability drone flight controller build. Requires genuine authorized chain.'
};

export const POPULAR_PARTS: PartRequest[] = [
  DEFAULT_REQUEST,
  {
    id: 'REQ-2026-8842',
    mpn: 'GM2804H-100T',
    description: 'Hollow Shaft Brushless Gimbal Motor for 4K Aerial Stabilization',
    category: 'Electromechanical / Motors',
    requestedQty: 600,
    needByDate: 'Nov 20, 2026',
    targetPrice: 32.00,
    packageType: '28mm Stator OD',
    notes: 'Need high-torque, pre-balanced for 3-axis cinema gimbal camera assembly.'
  },
  {
    id: 'REQ-2026-8843',
    mpn: 'ESP32-S3-WROOM-1-N8R8',
    description: 'Wi-Fi + Bluetooth 5 (LE) MCU Module, Xtensa dual-core, 8MB Flash, 8MB PSRAM',
    category: 'RF / Wireless Modules',
    requestedQty: 5000,
    needByDate: 'Nov 18, 2026',
    targetPrice: 3.40,
    packageType: 'SMD Module 18x25.5mm',
    notes: 'FCC/CE pre-certified. AVL preferred from Mouser or DigiKey.'
  },
  {
    id: 'REQ-2026-8844',
    mpn: 'DRV8301DCAR',
    description: 'Ultra-low Rds(on) 3-Phase Gate Driver with Dual Current Sense Amplifiers',
    category: 'Power Management / Drivers',
    requestedQty: 3000,
    needByDate: 'Nov 22, 2026',
    targetPrice: 4.80,
    packageType: 'HTSSOP-56',
    notes: 'Texas Instruments primary line. Automotive qualified.'
  }
];

export function generateQuotesForPart(part: PartRequest): SupplierQuote[] {
  const basePrice = part.targetPrice || 8.00;
  const qty = part.requestedQty;

  const digiKeyParts = qty * (basePrice * 0.94);
  const digiKeyFreight = 420;
  const digiKeyDuties = Math.round(digiKeyParts * 0.024);
  const digiKeyClearance = 180;
  const digiKeyLanded = Math.round(digiKeyParts + digiKeyFreight + digiKeyDuties + digiKeyClearance);

  const mouserParts = qty * (basePrice * 0.96);
  const mouserFreight = 390;
  const mouserDuties = Math.round(mouserParts * 0.025);
  const mouserClearance = 190;
  const mouserLanded = Math.round(mouserParts + mouserFreight + mouserDuties + mouserClearance);

  const arrowParts = qty * (basePrice * 1.02);
  const arrowFreight = 480;
  const arrowDuties = Math.round(arrowParts * 0.028);
  const arrowClearance = 210;
  const arrowLanded = Math.round(arrowParts + arrowFreight + arrowDuties + arrowClearance);

  const futureParts = qty * (basePrice * 1.08);
  const futureLanded = Math.round(futureParts + 520 + Math.round(futureParts * 0.03) + 240);

  return [
    {
      id: 'QUOTE-DK-01',
      supplier: 'DigiKey',
      distributorType: 'authorized',
      supplierPartNumber: `DK-${part.mpn}-ND`,
      manufacturerPartNumber: part.mpn,
      manufacturer: part.mpn.startsWith('STM') ? 'STMicroelectronics' : part.mpn.startsWith('ESP') ? 'Espressif' : 'OEM Tech',
      description: part.description,
      stockAvailable: Math.max(qty * 3, 14200),
      moq: 1,
      leadTimeWeeks: 1.2,
      unitPrice: Number((digiKeyParts / qty).toFixed(2)),
      priceTiers: [
        { breakQty: 1, unitPrice: Number((basePrice * 1.25).toFixed(2)) },
        { breakQty: 100, unitPrice: Number((basePrice * 1.08).toFixed(2)) },
        { breakQty: 1000, unitPrice: Number((basePrice * 0.97).toFixed(2)) },
        { breakQty: 2500, unitPrice: Number((digiKeyParts / qty).toFixed(2)) },
      ],
      landedCost: digiKeyLanded,
      rohsCompliant: true,
      reachCompliant: true,
      avlStatus: 'approved',
      genuineVerified: true,
      breakdown: {
        partsCost: Math.round(digiKeyParts),
        freight: digiKeyFreight,
        duties: digiKeyDuties,
        clearance: digiKeyClearance,
        handling: 0
      },
      score: 96
    },
    {
      id: 'QUOTE-MO-02',
      supplier: 'Mouser',
      distributorType: 'authorized',
      supplierPartNumber: `512-${part.mpn}`,
      manufacturerPartNumber: part.mpn,
      manufacturer: part.mpn.startsWith('STM') ? 'STMicroelectronics' : part.mpn.startsWith('ESP') ? 'Espressif' : 'OEM Tech',
      description: part.description,
      stockAvailable: Math.max(qty * 2, 8500),
      moq: 1,
      leadTimeWeeks: 1.5,
      unitPrice: Number((mouserParts / qty).toFixed(2)),
      priceTiers: [
        { breakQty: 1, unitPrice: Number((basePrice * 1.28).toFixed(2)) },
        { breakQty: 100, unitPrice: Number((basePrice * 1.10).toFixed(2)) },
        { breakQty: 1000, unitPrice: Number((basePrice * 0.99).toFixed(2)) },
        { breakQty: 2500, unitPrice: Number((mouserParts / qty).toFixed(2)) },
      ],
      landedCost: mouserLanded,
      rohsCompliant: true,
      reachCompliant: true,
      avlStatus: 'preferred',
      genuineVerified: true,
      breakdown: {
        partsCost: Math.round(mouserParts),
        freight: mouserFreight,
        duties: mouserDuties,
        clearance: mouserClearance,
        handling: 0
      },
      score: 91
    },
    {
      id: 'QUOTE-AR-03',
      supplier: 'Arrow',
      distributorType: 'authorized',
      supplierPartNumber: `ARW-${part.mpn}-REEL`,
      manufacturerPartNumber: part.mpn,
      manufacturer: part.mpn.startsWith('STM') ? 'STMicroelectronics' : part.mpn.startsWith('ESP') ? 'Espressif' : 'OEM Tech',
      description: part.description,
      stockAvailable: Math.max(qty * 1.5, 4800),
      moq: 250,
      leadTimeWeeks: 2.1,
      unitPrice: Number((arrowParts / qty).toFixed(2)),
      priceTiers: [
        { breakQty: 250, unitPrice: Number((basePrice * 1.15).toFixed(2)) },
        { breakQty: 1000, unitPrice: Number((basePrice * 1.04).toFixed(2)) },
        { breakQty: 2500, unitPrice: Number((arrowParts / qty).toFixed(2)) },
      ],
      landedCost: arrowLanded,
      rohsCompliant: true,
      reachCompliant: true,
      avlStatus: 'approved',
      genuineVerified: true,
      breakdown: {
        partsCost: Math.round(arrowParts),
        freight: arrowFreight,
        duties: arrowDuties,
        clearance: arrowClearance,
        handling: 0
      },
      score: 84
    },
    {
      id: 'QUOTE-FE-04',
      supplier: 'Future Electronics',
      distributorType: 'franchised',
      supplierPartNumber: `FE-${part.mpn}`,
      manufacturerPartNumber: part.mpn,
      manufacturer: part.mpn.startsWith('STM') ? 'STMicroelectronics' : part.mpn.startsWith('ESP') ? 'Espressif' : 'OEM Tech',
      description: part.description,
      stockAvailable: 2100,
      moq: 500,
      leadTimeWeeks: 3.4,
      unitPrice: Number((futureParts / qty).toFixed(2)),
      priceTiers: [
        { breakQty: 500, unitPrice: Number((basePrice * 1.18).toFixed(2)) },
        { breakQty: 2500, unitPrice: Number((futureParts / qty).toFixed(2)) },
      ],
      landedCost: futureLanded,
      rohsCompliant: true,
      reachCompliant: true,
      avlStatus: 'under-review',
      genuineVerified: true,
      breakdown: {
        partsCost: Math.round(futureParts),
        freight: 520,
        duties: Math.round(futureParts * 0.03),
        clearance: 240,
        handling: 0
      },
      score: 72
    }
  ];
}

export const INITIAL_BOM: BOMRow[] = [
  {
    id: 'BOM-01',
    lineNum: 1,
    mpn: 'STM32H743VIT6',
    description: 'ARM Cortex-M7 MCU 480MHz, 2MB Flash, LQFP-100',
    qty: 2500,
    referenceDesignator: 'U1',
    targetPrice: 8.50,
    status: 'sourced'
  },
  {
    id: 'BOM-02',
    lineNum: 2,
    mpn: 'DRV8301DCAR',
    description: '3-Phase Gate Driver with Dual Current Sense',
    qty: 2500,
    referenceDesignator: 'U2, U3',
    targetPrice: 4.80,
    status: 'sourced'
  },
  {
    id: 'BOM-03',
    lineNum: 3,
    mpn: 'TPS54560DDA',
    description: '60V, 5A Step-Down DC-DC Converter',
    qty: 2500,
    referenceDesignator: 'U4',
    targetPrice: 2.90,
    status: 'sourced'
  },
  {
    id: 'BOM-04',
    lineNum: 4,
    mpn: 'RC0402FR-0710KL',
    description: '10k Ohm 1% 0402 SMD Resistor 1/16W',
    qty: 25000,
    referenceDesignator: 'R1-R10',
    targetPrice: 0.008,
    status: 'sourced'
  },
  {
    id: 'BOM-05',
    lineNum: 5,
    mpn: 'GRM155R71C104KA88D',
    description: '0.1uF 16V X7R 0402 MLCC Capacitor',
    qty: 30000,
    referenceDesignator: 'C1-C12',
    targetPrice: 0.012,
    status: 'sourced'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'INV-01',
    mpn: 'STM32H743VIT6',
    description: 'ARM Cortex-M7 MCU 480MHz LQFP-100',
    binLocation: 'BIN-A3-44',
    yourBinQty: 850,
    sharedQty: 200,
    reserveQty: 100,
    projectReserved: 'Project Falcon 4K',
    status: 'healthy',
    reorderPoint: 500,
    unitCost: 8.12
  },
  {
    id: 'INV-02',
    mpn: 'DRV8301DCAR',
    description: '3-Phase Gate Driver HTSSOP-56',
    binLocation: 'BIN-B1-12',
    yourBinQty: 1400,
    sharedQty: 450,
    reserveQty: 150,
    projectReserved: 'Project Falcon 4K',
    status: 'healthy',
    reorderPoint: 600,
    unitCost: 4.60
  },
  {
    id: 'INV-03',
    mpn: 'TPS54560DDA',
    description: 'Step-Down DC-DC Converter SOIC-8',
    binLocation: 'BIN-C2-09',
    yourBinQty: 120,
    sharedQty: 40,
    reserveQty: 20,
    projectReserved: 'Sub-assembly Beta',
    status: 'thinning',
    reorderPoint: 400,
    unitCost: 2.85
  },
  {
    id: 'INV-04',
    mpn: 'RC0402FR-0710KL',
    description: '10k Ohm 1% 0402 SMD Reel',
    binLocation: 'BIN-D4-01',
    yourBinQty: 45000,
    sharedQty: 15000,
    reserveQty: 5000,
    projectReserved: 'SMT Line 2',
    status: 'healthy',
    reorderPoint: 10000,
    unitCost: 0.007
  }
];

export const BOM_WATCH_ALERTS: BOMWatchAlert[] = [
  {
    id: 'BW-01',
    lineNum: 1,
    mpn: 'STM32H743VIT6',
    type: 'price_drop',
    title: 'Line 01 · price moving down',
    actionText: 'renegotiating',
    actionType: 'renegotiate',
    detail: 'DigiKey dropped volume tier pricing by 3.8% across 2.5k reels. Auto-negotiation initiated.'
  },
  {
    id: 'BW-02',
    lineNum: 2,
    mpn: 'DRV8301DCAR',
    type: 'eol_risk',
    title: 'Line 02 · end-of-life risk',
    actionText: 'alternates found',
    actionType: 'alternates_found',
    detail: 'PCN alert issued for leadframe revision. AGENT37 identified DRV8302 and TI pin-compatible direct drop-ins.'
  },
  {
    id: 'BW-03',
    lineNum: 3,
    mpn: 'TPS54560DDA',
    type: 'stock_thinning',
    title: 'Line 03 · stock running thin',
    actionText: 'restock suggested',
    actionType: 'restock_suggested',
    detail: 'North American distributor stock fell below 3 weeks of buffer. Recommended proactive replenishment.'
  },
  {
    id: 'BW-04',
    lineNum: 4,
    mpn: 'RC0402FR-0710KL',
    type: 'steady',
    title: 'Every other line · steady',
    actionText: 'watching',
    actionType: 'watching',
    detail: '62 lines steady with healthy distributor allocation and zero price drift.'
  }
];
