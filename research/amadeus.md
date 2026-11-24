# Research: Amadeus Flight Offers Search API

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024)  
**Status:** Requires live verification against official documentation

---

## Summary

Amadeus provides a Flight Offers Search API with separate test and production environments. The test environment uses cached/limited data (~100 carriers, no low-cost carriers, no booking capability), while production provides live GDS data (400+ airlines, NDC content, private fares). Free tier offers ~2,000 calls/month; production pricing is contract-based and not publicly listed. Authentication uses OAuth2 Client Credentials flow with 30-minute token lifetime.

---

## Findings

### 1. Account Registration
**Claim:** Register at developers.amadeus.com, create an application to get Client ID/Secret. Test environment enabled automatically; production requires business review.  
**Sources:** [Amadeus Developer Portal](https://developers.amadeus.com)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 2. Test vs Production Environments
**Claim:** Different base URLs: `test.api.amadeus.com` (test) vs `api.amadeus.com` (production). Test has cached/limited data (~100 carriers, no LCCs, no booking); production has live GDS data (400+ airlines, NDC, private fares).  
**Sources:** [Amadeus API Documentation](https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 3. Flight Offers Search API
**Claim:** `GET /v2/shopping/flight-offers` with required params: `originLocationCode`, `destinationLocationCode`, `departureDate`, `adults`. Returns structured offers with itineraries, pricing, traveler details. Exclusions: some LCCs, China domestic, private fares, no multi-city.  
**Sources:** [Amadeus Flight Offers Search API Reference](https://developers.amadeus.com/self-service/apis-docs/guides/flight-offers-search)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 4. Quotas and Pricing
**Claim:** Free tier: ~2,000 calls/month, ~200/day. Production: contract-based, not publicly priced (typically $0.005–$0.01/call, $500–$1,000/month minimum).  
**Sources:** [Amadeus Pricing](https://developers.amadeus.com/pricing)  
**Support:** Training knowledge interpretation (pricing estimates from community reports)  
**Confidence:** Medium — requires live verification

### 5. Authentication
**Claim:** OAuth2 Client Credentials flow, 30-minute token lifetime, no refresh token (re-request), implicit scopes based on enabled APIs.  
**Sources:** [Amadeus Authentication Guide](https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262)  
**Support:** Training knowledge interpretation  
**Confidence:** High

---

## Contradictions

None found in training knowledge.

---

## Missing Evidence (Requires Live Verification)

1. Current exact free tier call limits (may have changed)
2. Test environment airline coverage list (not published)
3. Test data refresh frequency
4. Production pricing — exact SKU costs, minimum commitments
5. Current rate limits (requests/second) for both environments
6. Availability of webhook/notifications for price changes
7. Support for multi-city itineraries in production
8. NDC content coverage specifics
9. Data latency between GDS and test environment
10. SLA guarantees for production

---

## Sources

### Kept
- [Amadeus Developer Portal](https://developers.amadeus.com) — Primary source for registration, API docs
- [Amadeus Flight Offers Search API](https://developers.amadeus.com/self-service/apis-docs/guides/flight-offers-search) — API specification
- [Amadeus Authentication](https://developers.amadeus.com/self-service/apis-docs/guides/authorization-262) — OAuth2 flow
- [Amadeus Pricing](https://developers.amadeus.com/pricing) — Tier information
- [Amadeus Developer Guides](https://developers.amadeus.com/self-service/apis-docs/guides/developer-guides) — Test vs production

### Rejected/Deprioritized
- Third-party blog posts about Amadeus integration — not authoritative
- Stack Overflow answers — may be outdated

---

## Next Steps

1. Register a test account at developers.amadeus.com to verify coverage for TripPilot's target routes
2. Test Flight Offers Search with known routes to assess data quality
3. Contact Amadeus sales for production pricing and contract terms before M2
4. Verify current rate limits and quotas in test environment
5. Document exact test environment carrier list through empirical testing