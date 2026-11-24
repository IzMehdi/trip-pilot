# Research: Open-Meteo Forecast and Geocoding APIs

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024)  
**Status:** Requires live verification against official documentation

---

## Summary

Open-Meteo provides free weather forecast and geocoding APIs without requiring an API key for non-commercial use. The forecast API offers up to 16 days of hourly data with variables including temperature, precipitation, wind, cloud cover, and more. The geocoding API supports forward and reverse geocoding. Fair-use limits apply (estimated 10,000 requests/day per IP), and attribution is required. All findings based on training knowledge with freshness caveats — live verification required.

---

## Findings

### 1. Forecast API Endpoints and Variables
**Claim:** Base URL: `https://api.open-meteo.com/v1/forecast`. Supports hourly and daily forecasts up to 16 days. Key variables: `temperature_2m`, `relative_humidity_2m`, `precipitation`, `rain`, `snowfall`, `weather_code`, `cloud_cover`, `wind_speed_10m`, `wind_direction_10m`, `uv_index`, `visibility`, `soil_temperature_0cm`. Also supports historical data via `/v1/forecast` with `past_days` parameter.  
**Sources:** [Open-Meteo Forecast API Docs](https://open-meteo.com/en/docs)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 2. Geocoding API
**Claim:** Base URL: `https://geocoding-api.open-meteo.com/v1/search`. Forward geocoding (name → coordinates) and reverse geocoding (coordinates → name). Parameters: `name`, `count`, `language`, `format`. Returns: `id`, `name`, `latitude`, `longitude`, `elevation`, `feature_code`, `country_code`, `admin1_id`, `timezone`, `population`, `country`, `admin1`. No API key required.  
**Sources:** [Open-Meteo Geocoding API Docs](https://open-meteo.com/en/docs/geocoding-api)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 3. Attribution Requirements
**Claim:** Must display "Weather data by Open-Meteo.com" with link to `https://open-meteo.com/` when using the free API. Attribution must be visible to end users.  
**Sources:** [Open-Meteo License/Attribution](https://open-meteo.com/en/license)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 4. Fair-Use Limits
**Claim:** Free non-commercial use: estimated 10,000 requests/day per IP address. No strict published quota but "fair use" enforced. Commercial use requires separate agreement. No API key means limits are IP-based. Concurrent connection limits not publicly specified.  
**Sources:** [Open-Meteo Fair Use Policy](https://open-meteo.com/en/license)  
**Support:** Training knowledge interpretation (exact limits not officially published)  
**Confidence:** Medium — requires live verification

### 5. No API Key Required
**Claim:** Free endpoints accessible without authentication. No registration required for non-commercial use. Rate limiting is IP-based.  
**Sources:** [Open-Meteo API Docs](https://open-meteo.com/en/docs)  
**Support:** Training knowledge interpretation  
**Confidence:** High

---

## Contradictions

None found in training knowledge.

---

## Missing Evidence (Requires Live Verification)

1. Exact current rate limits (requests/second, requests/day) — not officially published
2. Current forecast horizon — may have extended beyond 16 days
3. Exact list of available weather variables — API expands over time
4. Commercial licensing terms and pricing
5. SLA / uptime guarantees for free tier
6. Data source attribution details (which weather models: ECMWF, GFS, ICON, etc.)
7. Historical data availability depth
8. Ensemble forecast availability
9. Marine/coastal specific variables
10. Geocoding API rate limits separate from forecast API

---

## Sources

### Kept
- [Open-Meteo Main Documentation](https://open-meteo.com/en/docs) — Primary forecast API reference
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) — Geocoding specification
- [Open-Meteo License/Attribution](https://open-meteo.com/en/license) — Usage terms and attribution
- [Open-Meteo API Status](https://open-meteo.com/en/status) — Uptime/status page
- [Open-Meteo GitHub](https://github.com/open-meteo) — Source code and issues

### Rejected/Deprioritized
- Third-party wrapper libraries — not authoritative for API contract
- Community forum posts — may be outdated

---

## Next Steps

1. Live test forecast API with TripPilot's target locations to verify data quality
2. Test geocoding accuracy for city/airport names used in trip planning
3. Verify current rate limits by making test requests
4. Confirm attribution wording matches current license
5. If commercial use anticipated, contact Open-Meteo for licensing before M2
6. Document exact variable names and units for integration