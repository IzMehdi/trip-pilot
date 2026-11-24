# Research: OpenStreetMap Ecosystem (Free Alternatives to Google Maps Platform)

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024)  
**Status:** Selected for TripPilot per user requirement for free APIs

---

## Summary

The OpenStreetMap ecosystem provides free alternatives for geocoding, places, routing, and map rendering. All components have public instances with fair-use limits suitable for development and low-traffic production. **No billing account or API keys required** (except Nominatim requires a descriptive User-Agent). Attribution to OpenStreetMap contributors is mandatory.

---

## Components

### 1. Geocoding & Places: Nominatim
- **Endpoint:** `https://nominatim.openstreetmap.org/search` (forward), `/reverse` (reverse)
- **Parameters:** `q` (query), `format=json`, `limit`, `addressdetails=1`, `extratags=1`
- **Rate Limit:** 1 request/second per IP (fair use); bulk queries need `nominatim.openstreetmap.org` download
- **User-Agent:** **Required** — must identify application (e.g., `TripPilot/1.0 (contact@example.com)`)
- **Response:** `place_id`, `lat`, `lon`, `display_name`, `address` (structured), `type`, `class`, `importance`
- **Coverage:** Global, community-maintained
- **Attribution:** "© OpenStreetMap contributors" + link to nominatim.org

### 2. Routing: OSRM (Open Source Routing Machine)
- **Public Instance:** `https://router.project-osrm.org`
- **Profiles:** `car`, `bike`, `foot`
- **Endpoint:** `/route/v1/{profile}/{coordinates}?steps=true&geometries=geojson`
- **Parameters:** coordinates as `lon,lat;lon,lat`, `steps`, `geometries`, `overview`
- **Rate Limit:** Fair use (no published hard limit; heavy use should self-host)
- **Response:** `routes[]` with `geometry` (GeoJSON), `legs[]` with `steps[]`, `duration`, `distance`
- **Coverage:** Global (OSM road network)

### 3. Routing: Valhalla (Multi-modal, Transit)
- **Public Instance:** `https://valhalla1.openstreetmap.de`
- **Profiles:** `auto`, `bicycle`, `pedestrian`, `transit`, `multimodal`
- **Endpoint:** `/route` (POST with JSON body)
- **Features:** Turn-by-turn, transit schedules, elevation, isochrones
- **Rate Limit:** Fair use
- **Response:** `trip` with `legs`, `shape` (encoded polyline), `maneuvers`, `summary`

### 4. Map Tiles (Vector)
| Provider | URL Pattern | Attribution | Notes |
|----------|-------------|-------------|-------|
| **OpenMapTiles** | `https://tiles.openmaptiles.org/{z}/{x}/{y}.pbf` | © OpenMapTiles, © OSM | Free tier, vector PBF |
| **CartoDB** | `https://basemaps.cartocdn.com/gl/{style}/{z}/{x}/{y}.pbf` | © CARTO, © OSM | Styles: positron, dark_matter, voyager |
| **Protomaps** | `https://api.protomaps.com/tiles/v3/{z}/{x}/{y}.pbf` | © Protomaps, © OSM | Requires free API key for production |
| **OSM2VectorTiles** | `https://vector.tiles.osm2vectortiles.org/{style}/{z}/{x}/{y}.pbf` | © OSM2VectorTiles, © OSM | Multiple styles |

### 5. Map Rendering: MapLibre GL JS
- **Library:** `maplibre-gl` (npm) — open-source fork of Mapbox GL JS
- **React Bindings:** `react-map-gl` (works with MapLibre), `@vis.gl/react-maplibre`
- **Tile Source:** Any vector tile endpoint above
- **Style:** MapLibre style JSON (can use OSM Liberty, OSM Bright, custom)
- **No API Key** needed for free tile providers

---

## Comparison: OSM Ecosystem vs Google Maps Platform

| Feature | OSM Ecosystem (Free) | Google Maps Platform |
|---------|---------------------|---------------------|
| **Cost** | Free (fair use) | $200/mo credit, then pay |
| **Billing Account** | Not required | **Required** (credit card) |
| **API Keys** | Not required (except Protomaps) | Required, with restrictions |
| **Geocoding** | Nominatim (1 req/s) | Geocoding API (50 QPS) |
| **Places** | Nominatim + Overpass | Places API (New) — rich details |
| **Routing** | OSRM (car/bike/foot), Valhalla (transit) | Routes API (all modes) |
| **Map Tiles** | Vector tiles (free providers) | Map Tiles API (paid) |
| **Map Rendering** | MapLibre GL JS | Maps JavaScript API |
| **Data Freshness** | Community updates (minutes–days) | Google updates (near real-time) |
| **POI Richness** | Good (OSM-dependent) | Excellent (Google business data) |
| **Transit Routing** | Valhalla (limited coverage) | Excellent (GTFS partners) |
| **SLA** | None (best effort) | 99.9% (paid) |
| **Attribution** | © OpenStreetMap contributors | "Powered by Google" + Terms |

---

## Fair-Use Guidelines (Critical for Production)

1. **Nominatim:** Max 1 request/second. Cache results. For batch, use local instance or download planet file.
2. **OSRM/Valhalla Public Instances:** Not for high-volume production. Self-host for production scale.
3. **Tile Providers:** Check each provider's terms. CartoDB/OpenMapTiles allow free use with attribution.
4. **Attribution:** Always display "© OpenStreetMap contributors" on map and in data citations.

---

## Missing Evidence (Requires Live Verification)

1. Current Nominatim rate limit enforcement (1 req/s documented, but may vary)
2. OSRM/Valhalla public instance uptime and latency
3. Tile provider free tier limits (CartoDB, OpenMapTiles current policies)
4. Valhalla transit coverage for TripPilot target regions
5. Overpass API for advanced POI queries (alternative to Nominatim places)
6. Self-hosting complexity for M8 if public instances insufficient

---

## Sources

### Kept
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) — Rate limits, User-Agent requirement
- [OSRM API Documentation](https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md) — Routing API
- [Valhalla API](https://valhalla.readthedocs.io/en/latest/api/turn-by-turn/api-reference/) — Multi-modal routing
- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) — Map rendering library
- [OpenMapTiles](https://openmaptiles.org/) — Free vector tiles
- [CartoDB Basemaps](https://carto.com/basemaps/) — Free vector tile styles

### Rejected/Deprioritized
- Overpass Turbo / Overpass API — powerful but complex; evaluate if Nominatim insufficient
- Self-hosted Nominatim/OSRM — M8 consideration only

---

## Next Steps

1. **M2 Implementation:** Build adapters for Nominatim (geocoding/places), OSRM (routing), Valhalla (transit routing)
2. **M5 Implementation:** Integrate MapLibre GL JS with CartoDB/OpenMapTiles vector tiles
3. **Test Coverage:** Verify Nominatim accuracy for TripPilot target cities/airports
4. **Rate Limit Handling:** Implement client-side caching and request queuing (1 req/s for Nominatim)
5. **Attribution Component:** Build reusable attribution display for map and data citations
6. **Fallback Strategy:** If public instances unreliable, plan self-hosting for M8