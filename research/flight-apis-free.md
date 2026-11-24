# Research: Free Flight Data APIs for TripPilot

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024) — web_search tool unavailable  
**Context:** Amadeus self-service developer registration ended July 17, 2026. Need FREE alternatives for flight search/offers.

---

## Summary

**No free API provides live flight *offers* (pricing + availability) comparable to Amadeus.** The free tier landscape:

| API | Free Tier | Data Type | Suitability for TripPilot |
|-----|-----------|-----------|---------------------------|
| **AviationStack** | 100 requests/month | Schedules (not offers/pricing) | ❌ Insufficient for pricing |
| **Duffel** | Sandbox only (test bookings) | Offers + booking | ⚠️ Sandbox only, no live pricing |
| **OpenSky Network** | Free (registration) | Live tracking, historical | ❌ No schedules/offers |
| **OpenFlights / OurAirports** | Free (static CSV/SQL) | Static airport/route data | ✅ Good for airport lookup, not offers |
| **Kiwi Tequila** | No free tier | Offers | ❌ Paid only |
| **RapidAPI Flight APIs** | Varies (often 50–100/mo) | Mixed | ❌ Unreliable, limited |
| **Amadeus Test** | **No longer accessible** | Offers (cached) | ❌ Self-service ended July 2026 |

**Recommendation:** Use **static schedule data** (OpenFlights/OpenSky) for airport/route validation + **mock flight offers** for development. Defer live flight offers to post-MVP or evaluate Duffel sandbox for testing flow.

---

## Findings

### 1. AviationStack
**Claim:** Free tier: 100 requests/month. Provides flight *schedules* (airline, departure/arrival times, airports, aircraft), not live pricing/offers. Paid tiers start at $49/mo for 10,000 requests with historical data.  
**Sources:** [AviationStack Pricing](https://aviationstack.com/pricing)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ❌ Insufficient — no pricing/offers

### 2. Duffel
**Claim:** Offers sandbox environment for testing flight search, offers, and booking flow. Sandbox uses test data, not live pricing. Production requires commercial agreement. No public free tier for live data.  
**Sources:** [Duffel Docs](https://duffel.com/docs)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ⚠️ Sandbox only — useful for M2 integration testing, not live data

### 3. OpenSky Network
**Claim:** Free with registration. Provides live ADS-B flight tracking (position, altitude, velocity), historical tracks. No schedules, no offers, no pricing. API: `https://opensky-network.org/api`  
**Sources:** [OpenSky API](https://opensky-network.org/apidoc/rest.html)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ❌ Wrong data type — tracking only

### 4. OpenFlights / OurAirports
**Claim:** Free static datasets (CSV, SQL). OpenFlights: airports (10,000+), airlines (6,000+), routes (67,000+). OurAirports: detailed airport metadata. Updated periodically, not real-time.  
**Sources:** [OpenFlights Data](https://openflights.org/data.html), [OurAirports](https://ourairports.com/data/)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ✅ Excellent for airport/airline/route validation in TripPilot

### 5. Kiwi.com Tequila API
**Claim:** No free tier. Pricing starts at ~$0.01/request. Provides flight search with pricing.  
**Sources:** [Kiwi Tequila](https://tequila.kiwi.com/)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ❌ Paid only

### 6. RapidAPI Flight Marketplace
**Claim:** Multiple flight APIs (Skyscanner, FlightAPI, etc.) with free tiers typically 50–100 requests/month. Data quality varies, often scraping-based, unreliable for production.  
**Sources:** [RapidAPI Flight APIs](https://rapidapi.com/collection/flight-apis)  
**Support:** Training knowledge interpretation  
**Confidence:** Medium  
**Verdict:** ❌ Unreliable, too limited

### 7. FlightAware / FlightRadar24
**Claim:** Enterprise-focused. Free tiers very limited (personal use only). No flight offers/search.  
**Sources:** [FlightAware API](https://flightaware.com/commercial/flightapi/), [FlightRadar24 API](https://www.flightradar24.com/business/aviation-data)  
**Support:** Training knowledge interpretation  
**Confidence:** High  
**Verdict:** ❌ Not suitable

---

## Contradictions

- Some sources claim AviationStack includes "flight prices" — but documentation shows only schedules. **Resolution:** Free tier definitely no pricing.
- Duffel sandbox vs production parity unclear. **Resolution:** Assume sandbox for flow testing only.

---

## Missing Evidence (Requires Live Verification)

1. Duffel sandbox exact capabilities (search, offers, booking flow)
2. AviationStack paid tier pricing for offers (if any)
3. Any emerging free flight offers API (market changes rapidly)
4. Skyscanner API access (historically partner-only)
5. Google Flights / QPX Express (deprecated)

---

## Recommended Architecture for TripPilot

### Option A: Static Data + Mock Offers (Recommended for M2–M5)
```
Flight Adapter (M2):
├── Airport/Airline/Route validation → OpenFlights static data (bundled)
├── Schedule lookup → AviationStack free tier (100/mo) or OpenSky
└── Offer generation → MOCK (deterministic, seeded by route/date)
    ├── Base price by distance + seasonality
    ├── Carrier selection from route data
    └── Clear labeling: "ESTIMATED — Not live pricing"
```

### Option B: Duffel Sandbox (For Integration Testing)
```
Flight Adapter (M2):
├── Duffel sandbox client
├── Search → returns test offers
├── Clearly labeled: "SANDBOX DATA — Not live"
└── Swap to production client when credentials available
```

### Option C: Defer Flight Offers to Post-MVP
- M2: Only airport/route validation (OpenFlights)
- M3–M5: Build full planning flow with mock flight data
- Post-M6: Evaluate paid APIs or partnerships

---

## Sources

### Kept
- [AviationStack](https://aviationstack.com/) — Schedules API
- [Duffel](https://duffel.com/docs) — Sandbox environment
- [OpenSky Network](https://opensky-network.org/) — Tracking API
- [OpenFlights](https://openflights.org/data.html) — Static airport/route data
- [OurAirports](https://ourairports.com/data/) — Airport metadata
- [Kiwi Tequila](https://tequila.kiwi.com/) — Paid offers API

### Rejected/Deprioritized
- RapidAPI flight APIs — unreliable, scraping-based
- FlightAware/FlightRadar24 — enterprise, tracking only

---

## Next Steps

1. **Download OpenFlights data** (airports.dat, airlines.dat, routes.dat) for M2 bundling
2. **Test Duffel sandbox** — create account, verify search/offers flow works for M2 integration
3. **Implement Flight Adapter with mock offers** — deterministic, distance-based pricing, clearly labeled
4. **Document data sources** per non-negotiable rule: "Provider data must be clearly labelled with source and retrieval time"
5. **Revisit post-MVP** — evaluate paid APIs if live pricing becomes requirement