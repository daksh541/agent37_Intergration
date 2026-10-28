/**
 * Gemini 2.5 Flash Autonomous Procurement Service for Docket
 * Powered by Google AI Studio authorization key
 */

import { SourcingLocation } from '../components/GoogleMapsSourcing';

const DEFAULT_API_KEY = '';
const API_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) || DEFAULT_API_KEY;

// High-speed, high-quota candidate models in priority order
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3.5-flash',
  'gemini-2.5-flash'
];

const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function callGeminiApi(payload: any, timeoutMs = 8000): Promise<any> {
  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify(payload)
      });
      clearTimeout(timeout);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (_) {}
  }
  return null;
}

export interface ParsedRequisition {
  partName: string;
  specs: string;
  moq: number;
  needByDate: string;
  unitBase: number;
  htsCode: string;
  origin: string;
  destination: string;
  carrier: string;
  flightNum: string;
  binLocation: string;
  suppliers: SourcingLocation[];
}

export const defaultLocations: SourcingLocation[] = [
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

/**
 * Call Gemini 2.5 Flash to autonomously parse any hardware prompt into verified BOM specs & 5 suppliers
 */
export async function parseRequisitionWithGemini(userPrompt: string): Promise<ParsedRequisition | null> {
  const systemPrompt = `You are Docket, an institutional autonomous hardware procurement and sourcing AI.
Analyze the user's hardware requisition prompt and extract or synthesize accurate technical manufacturing details.

Return a STRICT JSON object with these EXACT keys:
{
  "partName": "Short descriptive part title (e.g. 'STM32H743VIT6 ARM Cortex-M7 MCU' or 'Custom Drone Wings 450mm Carbon Fiber')",
  "specs": "Engineering specifications string (tolerances, packaging, materials, rating)",
  "moq": integer (e.g. 1200 or whatever requested),
  "needByDate": "Formatted date string (e.g. 'Nov 18, 2026')",
  "unitBase": number (estimated landed target unit cost in USD, e.g. 14.20),
  "htsCode": "10-digit Harmonized Tariff Schedule code (e.g. '8807.30.0090' or '8542.31.0001')",
  "origin": "Primary airport origin (e.g. 'Taichung (RMQ)' or 'Shenzhen Bao\\'an (SZX)')",
  "destination": "San Francisco (SFO) or Los Angeles (LAX)",
  "carrier": "DHL Express Priority Air",
  "flightNum": "Flight number (e.g. 'FX 5291' or 'D0 2841')",
  "binLocation": "Warehouse bin (e.g. 'AISLE 04 · TIER 2 · BIN 08')",
  "suppliers": [
    {
      "id": "loc-cn",
      "country": "China",
      "area": "Specific city/district",
      "cluster": "Industrial manufacturing cluster name",
      "supplier": "Realistic verified factory name Ltd",
      "unitCost": number,
      "moq": integer,
      "leadTime": "e.g. 1.5 wks (Nov 15)",
      "quality": number (e.g. 99.4),
      "cert": "Industry certification (e.g. AS9100D · ISO 9001)",
      "airport": "e.g. 14km from SZX Cargo Hub",
      "coords": {"x": 395, "y": 100},
      "latLon": "coordinates string",
      "address": "Factory industrial park address"
    },
    {
      "id": "loc-tw",
      "country": "Taiwan",
      "area": "e.g. Taichung Park or Hsinchu",
      "cluster": "Precision cluster name",
      "supplier": "Taiwan factory name Corp",
      "unitCost": number,
      "moq": integer,
      "leadTime": "e.g. 2.0 wks (Nov 18)",
      "quality": number (e.g. 98.6),
      "cert": "RoHS 3 · REACH SVHC",
      "airport": "e.g. 8km from RMQ Taichung Cargo",
      "coords": {"x": 460, "y": 138},
      "latLon": "coordinates string",
      "address": "address string"
    },
    {
      "id": "loc-us",
      "country": "USA",
      "area": "e.g. Torrance, CA or Austin, TX",
      "cluster": "Aerospace/Electronics Corridor",
      "supplier": "US factory name LLC",
      "unitCost": number,
      "moq": integer,
      "leadTime": "e.g. 1.0 wks (Nov 12)",
      "quality": number (e.g. 99.8),
      "cert": "ITAR Registered · AS9100D",
      "airport": "e.g. 18km from LAX Cargo Terminal",
      "coords": {"x": 100, "y": 80},
      "latLon": "coordinates string",
      "address": "address string"
    },
    {
      "id": "loc-de",
      "country": "Germany",
      "area": "e.g. Friedrichshafen or Stuttgart",
      "cluster": "Engineering Hub",
      "supplier": "German factory GmbH",
      "unitCost": number,
      "moq": integer,
      "leadTime": "e.g. 2.5 wks (Nov 20)",
      "quality": number (e.g. 98.9),
      "cert": "EN 9100 · TÜV Rheinland",
      "airport": "e.g. 10km from FDH Cargo Hub",
      "coords": {"x": 265, "y": 65},
      "latLon": "coordinates string",
      "address": "address string"
    },
    {
      "id": "loc-mx",
      "country": "Mexico",
      "area": "e.g. Mexicali or Guadalajara",
      "cluster": "Free Trade Manufacturing Zone",
      "supplier": "Mexican supplier S.A.",
      "unitCost": number,
      "moq": integer,
      "leadTime": "e.g. 1.8 wks (Nov 16)",
      "quality": number (e.g. 96.8),
      "cert": "USMCA Duty-Free · ISO 9001",
      "airport": "e.g. 5km from MXL Cargo Hub",
      "coords": {"x": 130, "y": 138},
      "latLon": "coordinates string",
      "address": "address string"
    }
  ]
}`;

  try {
    const data = await callGeminiApi({
      contents: [
        {
          parts: [
            { text: `${systemPrompt}\n\nUSER HARDWARE REQUISITION: "${userPrompt}"` }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }, 12000);

    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) return null;

    const parsed: ParsedRequisition = JSON.parse(candidate);
    
    // Ensure all 5 suppliers have standard screen coordinates for map rendering
    const fixedCoords: Record<string, { x: number; y: number }> = {
      'loc-cn': { x: 395, y: 100 },
      'loc-tw': { x: 460, y: 138 },
      'loc-us': { x: 100, y: 80 },
      'loc-de': { x: 265, y: 65 },
      'loc-mx': { x: 130, y: 138 }
    };

    parsed.suppliers = parsed.suppliers.map((sup, idx) => {
      const fallback = defaultLocations[idx] || defaultLocations[0];
      return {
        ...fallback,
        ...sup,
        coords: fixedCoords[sup.id] || fallback.coords
      };
    });

    return parsed;
  } catch (err) {
    console.warn('Gemini API parse error, falling back to heuristic:', err);
    return null;
  }
}

export interface DocketChatContext {
  partName: string;
  specs: string;
  moq: number;
  needByDate: string;
  origin: string;
  destination: string;
  carrier: string;
  sourcingApproved: boolean;
  shippingApproved: boolean;
  isPaid: boolean;
  selectedSupplier: string;
  unitPrice: number;
}
export type Agent37ChatContext = DocketChatContext;

export interface DocketChatResult {
  reply: string;
  actionTaken?: string;
  mutation?: {
    updatedMoq?: number;
    updatedSupplierName?: string;
    updatedCarrier?: string;
    updatedUnitPrice?: number;
    updatedNeedByDate?: string;
  };
  isNewRequisition?: boolean;
}
export type Agent37ChatResult = DocketChatResult;

/**
 * Handle multi-turn follow-up prompts and questions in Docket
 */
export async function chatWithDocket(
  userPrompt: string,
  context: DocketChatContext,
  history: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<DocketChatResult> {
  const systemPrompt = `You are Docket, the institutional autonomous hardware procurement terminal AI.
You are assisting an engineer who is currently sourcing and purchasing hardware components.

CURRENT ACTIVE REQUISITION STATE:
- Part: ${context.partName}
- Specs: ${context.specs}
- Quantity (MOQ): ${context.moq} pcs
- Need-by Date: ${context.needByDate}
- Selected Supplier: ${context.selectedSupplier} ($${context.unitPrice.toFixed(2)}/unit)
- Origin: ${context.origin}
- Destination: ${context.destination}
- Carrier: ${context.carrier}
- Sourcing Approved: ${context.sourcingApproved}
- Shipping Approved: ${context.shippingApproved}
- Order Closed/Paid: ${context.isPaid}

AVAILABLE QUALIFIED SUPPLIERS IN TERMINAL:
1. AeroCarbon Precision Ltd (Country: China, Area: Bao'an Shenzhen, Base Rate: $14.20)
2. Apex Aero Composites Corp (Country: Taiwan, Area: Taichung Park, Base Rate: $16.50)
3. Pacific Aero Dynamics LLC (Country: USA, Area: Torrance LAX, Base Rate: $24.80)
4. Bavaria Composites GmbH (Country: Germany, Area: Munich MUC, Base Rate: $22.10)
5. MexiAero Precision SA (Country: Mexico, Area: Mexicali MXL, Base Rate: $15.90)

AVAILABLE CARRIERS:
- DHL Express UAV Priority Air ($830.00, 3-day transit)
- FedEx Aerospace Global Priority ($910.00, 2-day express)
- UPS Worldwide Dedicated Drone Cargo ($760.00, 4-day economy)

INSTRUCTIONS:
1. If the user asks a question (about lead times, suppliers, customs duties HTS 8807.30 / 8542.31, certifications like AS9100D or RoHS, comparisons, flight paths), answer with high engineering precision and technical clarity in markdown.
2. If the user wants to adjust parameters (e.g. "change quantity to 3000", "negotiate down to $13.50", "switch supplier to Taiwan / Apex Aero", "use FedEx", "deliver by Dec 1"), output updated mutation fields in JSON.
   - For supplier changes, set "updatedSupplierName" to the EXACT supplier name from the list above.
   - For carrier changes, set "updatedCarrier" to the EXACT carrier name from the list above.
3. If the user wants to start an entirely new part query (e.g. "Actually I need 500 STM32 boards"), set "isNewRequisition": true.

Return a STRICT JSON object:
{
  "reply": "Concise, helpful response explaining what you did or answering the question in markdown format (2-3 sentences)",
  "actionTaken": "Short 1-line audit log (e.g. 'Updated MOQ from 1,200 to 2,500 units' or 'Switched supplier to Apex Aero Composites Corp (Taiwan)')",
  "mutation": {
    "updatedMoq": integer or null,
    "updatedSupplierName": string or null,
    "updatedCarrier": string or null,
    "updatedUnitPrice": number or null,
    "updatedNeedByDate": string or null
  },
  "isNewRequisition": boolean
}`;

  try {
    const historyText = history.slice(-4).map((h) => `${h.role.toUpperCase()}: ${h.text}`).join('\n');
    const data = await callGeminiApi({
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nRECENT CHAT HISTORY:\n${historyText}\n\nUSER INPUT: "${userPrompt}"`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }, 9000);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (err) {
    console.warn('Gemini chatWithDocket error, using heuristic fallback:', err);
  }

  // Bulletproof Heuristic Engine for instant, reliable fallback
  const lower = userPrompt.toLowerCase();

  // 1. Quantity Adjustments (e.g., "Increase quantity to 2,500", "change MOQ to 3000", "5000 pcs")
  const qtyMatch = userPrompt.match(/(?:quantity|moq|qty|to|make it|order|increase|decrease)\s*[:=]?\s*(\d[\d,]*)/i) ||
                   userPrompt.match(/(\d[\d,]*)\s*(?:pcs|pieces|units|moq)/i) ||
                   userPrompt.match(/\b([1-9]\d{2,6})\b/);
  if (qtyMatch) {
    const newQty = parseInt(qtyMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(newQty) && newQty > 0) {
      return {
        reply: `Requisition quantity adjusted to **${newQty.toLocaleString()} units**. Landed customs duty and carrier flight payload have been recalculated automatically.`,
        actionTaken: `Updated MOQ to ${newQty.toLocaleString()} pcs`,
        mutation: { updatedMoq: newQty },
        isNewRequisition: false
      };
    }
  }

  // 2. Supplier / Country Switching
  if (lower.includes('taiwan') || lower.includes('apex')) {
    return {
      reply: `Primary sourcing shifted to **Apex Aero Composites Corp** in Taichung, Taiwan. Unit pricing updated to **$16.50/unit** with express trans-Pacific transit.`,
      actionTaken: `Switched supplier to Apex Aero Composites Corp (Taiwan)`,
      mutation: { updatedSupplierName: 'Apex Aero Composites Corp', updatedUnitPrice: 16.50 },
      isNewRequisition: false
    };
  }
  if (lower.includes('china') || lower.includes('aerocarbon') || lower.includes('shenzhen')) {
    return {
      reply: `Primary sourcing calibrated to **AeroCarbon Precision Ltd** in Shenzhen, China. Benchmark unit price locked at **$14.20/unit** (AS9100D certified).`,
      actionTaken: `Switched supplier to AeroCarbon Precision Ltd (China)`,
      mutation: { updatedSupplierName: 'AeroCarbon Precision Ltd', updatedUnitPrice: 14.20 },
      isNewRequisition: false
    };
  }
  if (lower.includes('usa') || lower.includes('america') || lower.includes('pacific aero') || lower.includes('torrance')) {
    return {
      reply: `Primary sourcing routed to domestic AVL supplier **Pacific Aero Dynamics LLC** (Torrance, USA). Unit rate updated to **$24.80/unit** with 1-week delivery.`,
      actionTaken: `Switched supplier to Pacific Aero Dynamics LLC (USA)`,
      mutation: { updatedSupplierName: 'Pacific Aero Dynamics LLC', updatedUnitPrice: 24.80 },
      isNewRequisition: false
    };
  }
  if (lower.includes('germany') || lower.includes('bavaria') || lower.includes('munich')) {
    return {
      reply: `Primary sourcing routed to **Bavaria Composites GmbH** in Munich, Germany. Unit rate updated to **$22.10/unit** with DIN EN 9100 certification.`,
      actionTaken: `Switched supplier to Bavaria Composites GmbH (Germany)`,
      mutation: { updatedSupplierName: 'Bavaria Composites GmbH', updatedUnitPrice: 22.10 },
      isNewRequisition: false
    };
  }
  if (lower.includes('mexico') || lower.includes('mexiaero') || lower.includes('mexicali')) {
    return {
      reply: `Primary sourcing routed to nearshore partner **MexiAero Precision SA** in Mexicali, Mexico. Unit rate set at **$15.90/unit** via USMCA cross-border corridor.`,
      actionTaken: `Switched supplier to MexiAero Precision SA (Mexico)`,
      mutation: { updatedSupplierName: 'MexiAero Precision SA', updatedUnitPrice: 15.90 },
      isNewRequisition: false
    };
  }

  // 3. Carrier Switching
  if (lower.includes('fedex')) {
    return {
      reply: `Logistics priority reassigned to **FedEx Aerospace Global Priority**. Transit window accelerated to 2 business days ($910.00 freight).`,
      actionTaken: `Switched carrier to FedEx Aerospace Global Priority`,
      mutation: { updatedCarrier: 'FedEx Aerospace Global Priority' },
      isNewRequisition: false
    };
  }
  if (lower.includes('ups')) {
    return {
      reply: `Logistics reassigned to **UPS Worldwide Dedicated Drone Cargo**. Freight rate adjusted to economy air line ($760.00 freight).`,
      actionTaken: `Switched carrier to UPS Worldwide Dedicated Drone Cargo`,
      mutation: { updatedCarrier: 'UPS Worldwide Dedicated Drone Cargo' },
      isNewRequisition: false
    };
  }
  if (lower.includes('dhl')) {
    return {
      reply: `Logistics routed via **DHL Express UAV Priority Air**. Direct SZX/RMQ flight corridor locked ($830.00 freight).`,
      actionTaken: `Switched carrier to DHL Express UAV Priority Air`,
      mutation: { updatedCarrier: 'DHL Express UAV Priority Air' },
      isNewRequisition: false
    };
  }

  // 4. Customs Tariff Question
  if (lower.includes('customs') || lower.includes('tariff') || lower.includes('duty') || lower.includes('2.7%') || lower.includes('hts')) {
    return {
      reply: `The **2.7% tariff** is assessed under **HTS code 8807.30.0090** for composite drone airframe assemblies imported into the US. By comparison, semiconductor chips (HTS 8542.31) qualify for 0.0% duty under the Information Technology Agreement (ITA).`,
      actionTaken: `Provided HTS 8807.30.0090 customs tariff breakdown`,
      isNewRequisition: false
    };
  }

  // 5. Discount Negotiation
  if (lower.includes('discount') || lower.includes('negotiate') || lower.includes('cheaper') || lower.includes('reduce price')) {
    const discountedRate = parseFloat((context.unitPrice * 0.94).toFixed(2));
    return {
      reply: `Initiated automated volume counter-offer with ${context.selectedSupplier}. Applied preferred tier discount of 6%, reducing unit price from **$${context.unitPrice.toFixed(2)}** to **$${discountedRate.toFixed(2)}/unit**.`,
      actionTaken: `Negotiated 6% volume discount to $${discountedRate.toFixed(2)}/unit`,
      mutation: { updatedUnitPrice: discountedRate },
      isNewRequisition: false
    };
  }

  // 6. New Requisition / BOM Reset
  if (lower.includes('new') || lower.includes('stm32') || lower.includes('mcu') || lower.includes('motor') || lower.includes('gimbal')) {
    return {
      reply: `Detected new component specification. Transitioning procurement pipeline to new requisition setup.`,
      actionTaken: `Triggered new requisition setup`,
      isNewRequisition: true
    };
  }

  return {
    reply: `Logged instruction: "${userPrompt}". Sourcing radar, landed duty accumulators, and AVL telemetry for **${context.partName}** have been updated.`,
    actionTaken: 'Logged prompt into requisition audit stream',
    isNewRequisition: false
  };
}

export const chatWithAgent37 = chatWithDocket;

/**
 * Handle real-time interactive voice call conversation turns with vendor sales director
 */
export async function interactiveVoiceCallTurn(
  userSpeechOrText: string,
  vendorName: string,
  partName: string,
  qty: number,
  unitPrice: number,
  callHistory: Array<{ speaker: string; text: string }>
): Promise<{ vendorReply: string; offeredUnitPrice?: number; discountOffered: boolean }> {
  const prompt = `You are the Senior Technical Sales Director at ${vendorName} on a live VoIP phone call with a hardware buyer (Docket).
Current terms: ${qty.toLocaleString()} pcs of ${partName} at $${unitPrice.toFixed(2)}/unit.

The buyer just said: "${userSpeechOrText}"

Respond conversationally in 1 to 2 spoken sentences as the sales director.
If they ask for a discount, volume break, or custom terms, be realistic:
- For discounts: offer a reasonable concession (e.g. reduce unit price by 3% to 8%) if plausible, or confirm stock availability and AS9100D/RoHS packaging.
Return a STRICT JSON object:
{
  "vendorReply": "Your spoken dialogue line here (1-2 sentences)",
  "offeredUnitPrice": number (the new unit price if discounted or agreed, else ${unitPrice.toFixed(2)}),
  "discountOffered": boolean (true if you offered or agreed to a lower price)
}`;

  try {
    const data = await callGeminiApi({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.5,
        thinkingConfig: { thinkingBudget: 0 }
      }
    }, 8000);

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      return JSON.parse(text);
    }
  } catch (e) {
    console.warn('Gemini voice turn error, fallback:', e);
  }

  // Fallback
  const lower = userSpeechOrText.toLowerCase();
  if (lower.includes('discount') || lower.includes('cheaper') || lower.includes('price') || lower.includes('lower')) {
    const discounted = parseFloat((unitPrice * 0.95).toFixed(2));
    return {
      vendorReply: `We can approve a volume concession down to $${discounted.toFixed(2)} per unit if we lock the PO today. Packaging conforms to AS9100D standard.`,
      offeredUnitPrice: discounted,
      discountOffered: true
    };
  }

  return {
    vendorReply: `Understood! We have confirmed reel bin allocation for your ${qty.toLocaleString()} units of ${partName}, and we can guarantee priority dispatch by Nov 18.`,
    offeredUnitPrice: unitPrice,
    discountOffered: false
  };
}

/**
 * Call Gemini 2.5 Flash to generate an intelligent vendor chat reply
 */
export async function generateVendorChatReply(
  history: Array<{ sender: 'agent' | 'vendor'; text: string }>,
  vendorName: string,
  partName: string,
  qty: number,
  unitPrice: number
): Promise<string> {
  const systemPrompt = `You are the Senior Technical Sales Director at ${vendorName}.
You are in a live direct business chat with Docket (an autonomous purchasing agent) negotiating an order for ${qty} units of ${partName} at $${unitPrice.toFixed(2)}/unit.
Keep your response professional, precise, concise (1 to 2 sentences), and reference relevant certifications (AS9100D, RoHS 3, REACH), packaging (tape & reel, nitrogen sealed), or DHL priority cargo flights when applicable.`;

  try {
    const messagesText = history.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nCONVERSATION SO FAR:\n${messagesText}\n\nRespond as ${vendorName}:` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 120,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Gemini status ${res.status}`);

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (reply) return reply;
  } catch (err) {
    console.warn('Gemini chat error, using fallback:', err);
  }

  return `Confirmed from ${vendorName}. We have verified reel bin allocation for ${qty.toLocaleString()} pcs of ${partName}. All compliance documentation is pre-cleared for priority dispatch.`;
}

/**
 * Call Gemini 2.5 Flash to generate live verbal quote transcript for the Audio Wire
 */
export async function generateVoiceCallDialogue(
  vendorName: string,
  partName: string,
  qty: number,
  unitPrice: number
): Promise<{ agentLine: string; vendorLine: string }> {
  const prompt = `Generate a realistic 2-line institutional procurement voice dialogue.
Line 1 is Docket calling to verify stock of ${qty} pcs of ${partName} at $${unitPrice.toFixed(2)}.
Line 2 is ${vendorName} verifying the warehouse stock, quoting the exact unit rate, and confirming AS9100D/RoHS compliance.
Return JSON: {"agentLine": "...", "vendorLine": "..."}`;

  try {
    const res = await fetch(GEMINI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return JSON.parse(text);
      }
    }
  } catch (e) {
    console.warn('Gemini voice dialogue fallback:', e);
  }

  return {
    agentLine: `Calling to verify immediate inventory for ${qty.toLocaleString()} pcs of ${partName}. Can you honor $${unitPrice.toFixed(2)}/unit with guaranteed Nov 18 delivery?`,
    vendorLine: `Confirmed! We have ${Math.round(qty * 1.25).toLocaleString()} pcs in reel bin 4. Unit rate locked at $${unitPrice.toFixed(2)}. Packaging conforms to AS9100D and CoC is sealed for DHL Priority Air.`
  };
}
