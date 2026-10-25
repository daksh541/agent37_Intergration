export type SupplierName = 'DigiKey' | 'Mouser' | 'Arrow' | 'Future Electronics' | 'Avnet';

export type SupplierType = 'authorized' | 'franchised' | 'vetted broker';

export type AVLStatus = 'approved' | 'preferred' | 'under-review' | 'restricted';

export interface PriceTier {
  breakQty: number;
  unitPrice: number;
}

export interface SupplierQuote {
  id: string;
  supplier: SupplierName;
  distributorType: SupplierType;
  supplierPartNumber: string;
  manufacturerPartNumber: string;
  manufacturer: string;
  description: string;
  stockAvailable: number;
  moq: number;
  leadTimeWeeks: number;
  unitPrice: number;
  priceTiers: PriceTier[];
  landedCost: number;
  rohsCompliant: boolean;
  reachCompliant: boolean;
  avlStatus: AVLStatus;
  genuineVerified: boolean;
  breakdown: {
    partsCost: number;
    freight: number;
    duties: number;
    clearance: number;
    handling: number;
  };
  score: number; // 0-100 composite ranking
}

export interface PartRequest {
  id: string;
  mpn: string;
  description: string;
  category: string;
  requestedQty: number;
  needByDate: string;
  targetPrice?: number;
  notes?: string;
  packageType?: string;
}

export interface SourcingSession {
  request: PartRequest;
  quotes: SupplierQuote[];
  primaryQuote?: SupplierQuote;
  fallbackQuote?: SupplierQuote;
  status: 'draft' | 'rfq_sent' | 'quoted' | 'approved' | 'paid' | 'source_slipped' | 'dock_scanned' | 'reconciled' | 'closed';
  approvalTimestamp?: string;
  paymentAmount?: number;
  reconciliationDiscrepancy?: {
    field: string;
    expected: string | number;
    actual: string | number;
    resolved: boolean;
  };
}

export interface BOMRow {
  id: string;
  lineNum: number;
  mpn: string;
  description: string;
  qty: number;
  referenceDesignator: string;
  targetPrice: number;
  matchedQuote?: SupplierQuote;
  status: 'pending' | 'sourced' | 'approved' | 'reconciled';
}

export interface InventoryItem {
  id: string;
  mpn: string;
  description: string;
  binLocation: string;
  yourBinQty: number;
  sharedQty: number;
  reserveQty: number;
  projectReserved: string;
  status: 'healthy' | 'thinning' | 'critical' | 'reorder_suggested';
  reorderPoint: number;
  unitCost: number;
}

export interface BOMWatchAlert {
  id: string;
  lineNum: number;
  mpn: string;
  type: 'price_drop' | 'eol_risk' | 'stock_thinning' | 'steady';
  title: string;
  actionText: string;
  actionType: 'renegotiate' | 'alternates_found' | 'restock_suggested' | 'watching';
  detail: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent37';
  text: string;
  timestamp: string;
  attachmentName?: string;
  suggestedAction?: 'review_quotes' | 'approve' | 'scan_dock' | 'view_inventory';
}
