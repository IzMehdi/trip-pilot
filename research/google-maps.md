# Research: Google Maps Platform APIs (Places, Geocoding, Routes)

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024) — web_search tool unavailable  
**Status:** Requires live verification against official documentation — **Human approval required before any paid test**

---

## Summary

Google Maps Platform provides Places API (New), Geocoding API, and Routes API. **Billing account is mandatory** — even free tier requires billing setup. Current $200/month free credit covers significant usage but each SKU has specific free caps. Field masks are required for cost control. API key restrictions (HTTP referrers, IP addresses, API restrictions) are essential for security. Budget alerts must be configured. All pricing/quota claims based on training knowledge — **live verification required before M2**.

---

## Findings

### 1. Places API (New)
**Claim:** New Places API (not legacy) uses `places.googleapis.com/v1/places`. Key endpoints: `searchNearby`, `searchText`, `getPlaceDetails`, `autocomplete`. **Field masks mandatory** — specify only needed fields to control costs (e.g., `fields=displayName,formattedAddress,location,rating,priceLevel,photos,types`). Response includes place ID, location, address components, ratings, photos, opening hours.  
**Sources:** [Places API (New) Documentation](https://developers.google.com/maps/documentation/places/web-service)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 2. Geocoding API
**Claim:** Endpoint: `maps.googleapis.com/maps/api/geocode/json`. Forward (address → lat/lng) and reverse (lat/lng → address). Parameters: `address`, `components`, `bounds`, `region`, `language`. Returns: `results[]` with `geometry.location`, `formatted_address`, `place_id`, `address_components`. Rate limit: 50 requests/second per project.  
**Sources:** [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 3. Routes API
**Claim:** Endpoint: `routes.googleapis.com/directions/v2:computeRoutes`. Supports travel modes: `DRIVE`, `WALK`, `BICYCLE`, `TRANSIT`, `TWO_WHEELER`. Waypoints supported with `intermediateWaypoints`. Parameters: `origin`, `destination`, `travelMode`, `routingPreference`, `departureTime`, `computeAlternativeRoutes`. Field mask required: `routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.legs`.  
**Sources:** [Routes API Documentation](https://developers.google.com/maps/documentation/routes)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 4. Billing Requirement
**Claim:** **Billing account mandatory** for all Maps Platform APIs. Free tier ($200/month credit) only activates after billing setup. No billing = API requests fail. Must provide credit card even for free usage.  
**Sources:** [Google Maps Platform Billing](https://developers.google.com/maps/billing)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 5. Current SKU Pricing and Free Caps (Training Knowledge — Verify Current)
**Claim:** Monthly $200 credit applies across all Maps SKUs. Approximate free tiers (verify current):
- **Places API (New) - Place Details:** $17/1000 calls → ~11,700 free/month
- **Places API (New) - Nearby Search:** $32/1000 calls → ~6,250 free/month
- **Places API (New) - Text Search:** $32/1000 calls → ~6,250 free/month
- **Geocoding API:** $5/1000 calls → ~40,000 free/month
- **Routes API - Compute Routes:** $5/1000 calls → ~40,000 free/month
- **Routes API - Compute Routes Matrix:** $10/1000 elements → ~20,000 free/month

**Pricing changes frequently — verify at [Google Maps Pricing](https://developers.google.com/maps/pricing) before any paid test.**  
**Sources:** [Google Maps Platform Pricing](https://developers.google.com/maps/pricing)  
**Support:** Training knowledge interpretation (pricing as of ~2024)  
**Confidence:** Low — must verify current pricing

### 6. API Key Restrictions
**Claim:** **Essential for production**. Restrictions in Google Cloud Console:
- **Application restrictions:** HTTP referrers (web), IP addresses (server), Android/iOS apps
- **API restrictions:** Select only enabled APIs (Places, Geocoding, Routes, Maps JavaScript)
- **Recommendation:** Separate keys for frontend (referrer-restricted) and backend (IP-restricted)  
**Sources:** [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 7. Budget Alerts
**Claim:** Configure in Google Cloud Console → Billing → Budgets & alerts. Set alert at 50%, 90%, 100% of monthly budget. Can trigger email/pubsub. **Required before enabling billing.**  
**Sources:** [Cloud Billing Budgets](https://cloud.google.com/billing/docs/how-to/budgets)  
**Support:** Training knowledge interpretation  
**Confidence:** High

---

## Contradictions

- Legacy Places API vs Places API (New) pricing differs significantly. **Resolution:** Use Places API (New) only.
- Some sources suggest $200 credit covers all usage; others note specific SKU minimums. **Resolution:** Verify current pricing page.

---

## Missing Evidence (Requires Live Verification)

1. **Exact current SKU pricing** — pricing page updates quarterly
2. **Current free tier caps per SKU** — may have changed
3. **Rate limits** (QPS, QPD) for each API
4. **Places API (New) field mask pricing** — some fields may be "basic" vs "advanced" vs "premium"
5. **Autocomplete pricing** (separate SKU)
6. **Photos API pricing** (if using place photos)
7. **Transit/routing specifics** for target regions
8. **Data coverage** for TripPilot's target countries
9. **SLA for Maps Platform** (99.9% typical)
10. **Enterprise support options** and pricing

---

## Billing Exposure Documentation

| Risk | Mitigation |
|------|------------|
| Accidental high usage | Budget alerts at 50%/90%/100%; API key quotas |
| Unrestricted key leakage | Separate frontend/backend keys; referrer/IP restrictions |
| Unintended API calls | Enable only required APIs per key |
| Free tier exhaustion | Monitor Cloud Console billing; set hard quota limits |
| **Paid test without approval** | **HUMAN APPROVAL REQUIRED before enabling billing or making billable calls** |

---

## Sources

### Kept
- [Google Maps Platform Documentation](https://developers.google.com/maps) — Main portal
- [Places API (New)](https://developers.google.com/maps/documentation/places/web-service) — Places integration
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding) — Geocoding
- [Routes API](https://developers.google.com/maps/documentation/routes) — Routing
- [Maps Platform Pricing](https://developers.google.com/maps/pricing) — Current SKU pricing
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices) — Security
- [Cloud Billing Budgets](https://cloud.google.com/billing/docs/how-to/budgets) — Alerts

### Rejected/Deprioritized
- Legacy Places API docs — deprecated, different pricing
- Third-party tutorials — may use old APIs

---

## Next Steps

1. **Human approval** — Confirm before creating billing account or making any billable API calls
2. Create Google Cloud project and enable Maps Platform APIs
3. Set up billing account with budget alerts (50%/90%/100%)
4. Create restricted API keys (separate for frontend/backend)
5. Test each API with minimal requests using free tier
6. Verify field mask pricing for Places API (New)
7. Document exact SKU costs for TripPilot's projected usage
8. Implement server-side quota monitoring before M2