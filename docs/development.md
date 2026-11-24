# Development Environment

This document lists the environment variables used by the application. **Never commit actual values** — use `.env.local` for local development (gitignored).

## Required Environment Variables

### NVIDIA (NIM / LLM)
- `NVIDIA_API_KEY`
- `NVIDIA_BASE_URL`
- `NVIDIA_MODEL_ID`

### Amadeus (Flights / Hotels)
- `AMADEUS_CLIENT_ID`
- `AMADEUS_CLIENT_SECRET`
- `AMADEUS_BASE_URL`

### Open-Meteo (Weather)
- `OPEN_METEO_BASE_URL`

### OpenStreetMap / OSM Ecosystem (Places / Geocoding / Routing)
- `NOMINATIM_USER_AGENT` — Required by Nominatim usage policy (identify your app)
- `OSRM_BASE_URL` — Optional, default: `https://router.project-osrm.org`
- `VALHALLA_BASE_URL` — Optional, for advanced routing

### Application
- `PORT` — HTTP server port (default: 3000)
- `NODE_ENV` — Runtime environment (`development`, `test`, `production`)

## Example `.env.local`

```bash
# NVIDIA (Free Tier - Verified Working 2025-11-24)
NVIDIA_API_KEY=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
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL_ID=nvidia/nemotron-3.5-bolt-e4b  # Verified: streaming + function calling
# Alternative: moonshotai/kimi-k3.1-pro (1M context, VLM)

# Duffel Sandbox (Free Test Environment for Flight Offers)
DUFFEL_ACCESS_TOKEN=your-duffel-sandbox-token
DUFFEL_BASE_URL=https://api.duffel.com

# AviationStack (Optional - Free Tier: 100 req/mo for schedules)
AVIATIONSTACK_API_KEY=your-aviationstack-key
AVIATIONSTACK_BASE_URL=http://api.aviationstack.com/v1

# Open-Meteo (Free, No Auth)
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1

# OpenStreetMap Ecosystem (Free)
NOMINATIM_USER_AGENT=TripPilot/1.0 (your-email@example.com)
OSRM_BASE_URL=https://router.project-osrm.org
VALHALLA_BASE_URL=https://valhalla1.openstreetmap.de

# App
PORT=3000
NODE_ENV=development
```

## Loading Order

1. System environment variables
2. `.env` (committed, non-secret defaults only)
3. `.env.local` (gitignored, local overrides)
4. `.env.<NODE_ENV>.local` (gitignored, environment-specific)

## Security Notes

- Never commit `.env.local` or any file containing secrets
- Rotate keys immediately if accidentally exposed
- Use separate credentials for development, staging, and production
- Prefer short-lived tokens where supported (Amadeus OAuth)