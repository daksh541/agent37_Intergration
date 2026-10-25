# AGENT37 — High-End Geospatial Sourcing, Flight Radar & Dynamic Invoice Architecture

## Overview
AGENT37 has been completely decluttered, spaced, and upgraded with:
1. **Google Maps Geospatial Sourcing System (`GoogleMapsSourcing.tsx`)**:
   - Interactive Tactical Map with Vector, Satellite, and Terrain modes.
   - Precision Latitude & Longitude HUD (`22.5431° N, 114.0579° E · Shenzhen Aerospace Cluster`).
   - Glowing halos and pulsating radar wave rings radiating from verified factories.
   - Interactive Google Maps style InfoWindow showing supplier capabilities, airport cargo distance, cleanroom spec, unit price, and lead times.
   - Zoom controls `[+]` `[-]` with smooth coordinate transformations.
2. **Intermediate RFQ & Customs Bill of Entry Pre-Clearance (Before Step 2 and After Step 1)**:
   - Automated RFQ generation and signed electronic supplier PO confirmation.
   - Bill of Entry Draft Table (HTS 8807.30.0090, 2.70% duty, licensed broker, 4 clearance documents verified).
   - Instant addition to Line 2 of the live invoice on the right side.
3. **Aerospace Flight Watch Radar (`FlightRadarCard.tsx`)**:
   - Carrier livery styling: DHL Express Aviation Boeing 777F.
   - Great Circle trans-Pacific route arc (`SZX ➜ SFO`).
   - Moving aircraft with glowing wake aura and rotating radar sweep beam.
   - Real-time aviation telemetry HUD:
     - `FEED: LIVE (ADS-B)`
     - `SPEED: 520 KTS / FL380`
     - `RTE: ON PLAN`
     - `ETA: 3 DAYS`
   - Carrier comparisons with 1-click select.
4. **Spacious Luxury UI & Split-Screen Alignment**:
   - Completely blank start state with centered greeting and clean quick prompt pills.
   - Generous container padding (`28px 28px`), airy card layout, high-contrast badges, and clean typography.
   - Right-side invoice dynamically updates with subtotal calculations, "Everything, in one line" landed formula, and official stamped green watermark **`[PAID · AGENT37]`**.

---

## Key Files
- [`src/components/GoogleMapsSourcing.tsx`](file:///Users/saidaksh/Agent%2035/src/components/GoogleMapsSourcing.tsx): Google Maps tactical geospatial sourcing interface.
- [`src/components/FlightRadarCard.tsx`](file:///Users/saidaksh/Agent%2035/src/components/FlightRadarCard.tsx): Aviation Flight Watch Radar card with live telemetry and Boeing 777F flight trajectory.
- [`src/components/ChatbotInterface.tsx`](file:///Users/saidaksh/Agent%2035/src/components/ChatbotInterface.tsx): Left-hand ChatGPT prompt flow with sequential approvals.
- [`src/components/LiveInvoiceView.tsx`](file:///Users/saidaksh/Agent%2035/src/components/LiveInvoiceView.tsx): Right-hand dynamic live forming invoice.
- [`src/App.tsx`](file:///Users/saidaksh/Agent%2035/src/App.tsx): Root application container.
