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

### Google Maps (Places / Geocoding)
- `GOOGLE_MAPS_API_KEY`

### Application
- `PORT` — HTTP server port (default: 3000)
- `NODE_ENV` — Runtime environment (`development`, `test`, `production`)

## Example `.env.local`

```bash
# NVIDIA
NVIDIA_API_KEY=your-key-here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL_ID=meta/llama-3.1-70b-instruct

# Amadeus
AMADEUS_CLIENT_ID=your-client-id
AMADEUS_CLIENT_SECRET=your-client-secret
AMADEUS_BASE_URL=https://test.api.amadeus.com

# Open-Meteo
OPEN_METEO_BASE_URL=https://api.open-meteo.com/v1

# Google Maps
GOOGLE_MAPS_API_KEY=your-api-key

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