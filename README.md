# TripPilot — Milestone Pack

TripPilot is an AI-powered trip-planning application. Users describe a trip in natural language; the application searches real external providers for flights, weather, places and routes; an NVIDIA-hosted LLM uses typed function tools to coordinate those services; and the application streams a progressively generated itinerary to the browser.

## How to use this pack

1. Create a **new, empty GitHub repository** (suggested name: `trip-pilot`). Do not assume an old repository exists.
2. Clone it into your WSL/Linux development environment.
3. Start Pi inside Herdr in the repository directory.
4. Give the supervisor the contents of `SUPERVISOR_PLAYBOOK.md` and `milestones/M0.md`.
5. Complete one milestone at a time. Do not start the next milestone until the current milestone's acceptance criteria pass and you approve it.
6. Keep the milestone files in the repository under `docs/milestones/` so the project instructions evolve with the code.

Suggested initial commands:

```bash
git clone git@github.com:<YOUR_GITHUB_USERNAME>/trip-pilot.git
cd trip-pilot
mkdir -p docs/milestones
# Copy this pack's milestone files into docs/milestones/
herdr
pi
```

If your Herdr session is already open, start Pi from the project directory within that session.

## Milestone sequence

| Milestone | Outcome |
|---|---|
| M0 | Repository, architecture and provider feasibility validation |
| M1 | Backend foundation |
| M2 | Flight, weather, maps and places integrations |
| M3 | NVIDIA LLM agent and function calling |
| M4 | Streaming itinerary protocol |
| M5 | React frontend |
| M6 | Complete end-to-end trip planning |
| M7 | Testing, security and reliability |
| M8 | Docker deployment and documentation |

## Initial product scope

The first complete version is **planning-only**. It searches and presents travel options but does not purchase flights, make restaurant reservations, book hotels, charge payment methods, or perform other irreversible transactions.

Provider data must be clearly labelled with source and retrieval time. Never invent live availability, flight prices, route durations, weather data or citations.

## Provider strategy

- **LLM:** NVIDIA API Catalog / hosted NVIDIA NIM endpoint. Use an OpenAI-compatible client only after verifying the selected endpoint's actual base URL, model ID, streaming support and tool/function-calling support.
- **Flights:** Amadeus Flight Offers Search. Start with its test environment, which has a subset of real data. Production access and the current quota/pricing must be verified before claiming fully live coverage.
- **Weather:** Open-Meteo Forecast API and Geocoding API. Follow current fair-use limits and attribution requirements; the free hosted API is for non-commercial use.
- **Maps and places:** Google Maps Platform Places API (New), Geocoding and Routes API. Billing is required; use field masks, key restrictions, quotas and budget alerts. Verify current SKU free caps and pricing.
- **Map rendering:** choose a browser map renderer (for example Google Maps JavaScript API or MapLibre with a compliant tile provider) in M5. Do not scrape map tiles or assume public OSM demo services are production infrastructure.

## Non-negotiable engineering rules

- TypeScript throughout; Node.js 22 or newer.
- Keep provider credentials on the backend only.
- Validate all external inputs and provider responses at runtime.
- Use provider adapters and normalized internal domain types.
- Do not expose raw provider payloads or secrets to the LLM unnecessarily.
- Bound LLM tool loops, tool arguments, request duration, retries and output size.
- Tool calls are proposals from the model; backend code validates and authorizes every call.
- Never let the LLM invent tool results. It must use returned data or clearly disclose missing data.
- Streaming must have a documented event schema and support cancellation.
- Agents work in separate worktrees/branches, not in one shared checkout.
- No agent may push directly to `main`. Use pull requests and supervisor review.
- Do not merge unreviewed or failing code.
- Never commit `.env`, API keys, access tokens, personal data, or provider secrets.
- Prefer deterministic tests with mocked provider responses; keep a small opt-in live smoke test.
