# TripPilot — Technical Architecture Overview

**Version:** 1.0 (M0)  
**Status:** Draft — pending M0 acceptance

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER BROWSER                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  React + Vite Frontend (M5)                                          │   │
│  │  - Trip input form                                                   │   │
│  │  - Streaming itinerary display (SSE client)                          │   │
│  │  - Map rendering (Google Maps JS / MapLibre)                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS / SSE
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Node.js 22+ / Fastify)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Fastify     │  │  Domain      │  │  Provider    │  │  NVIDIA      │   │
│  │  Routes      │◄─│  Types +     │◄─│  Adapters    │  │  LLM Client  │   │
│  │  (M1, M4)    │  │  Zod Schemas │  │  (M2)        │  │  (M3)        │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│         │                │                │                │               │
│         │                │                │                │               │
│         ▼                ▼                ▼                ▼               │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                    TOOL REGISTRY / EXECUTOR (M3)                   │   │
│  │  - Tool definitions (Zod schemas)                                  │   │
│  │  - Argument validation                                             │   │
│  │  - Authorization & rate limiting                                   │   │
│  │  - Execution sandbox (timeout, retries, output size limits)        │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
   │  OpenFlights│         │  Open-Meteo │         │  OSM /      │
   │  + Duffel   │         │  Weather    │         │  Nominatim  │
   │  Sandbox    │         │  (M2)       │         │  + OSRM     │
   └─────────────┘         └─────────────┘         └─────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version | Milestone |
|-------|------------|---------|-----------|
| Runtime | Node.js | 22+ (LTS) | M1 |
| Backend Framework | Fastify | 4.x | M1 |
| Language | TypeScript | 5.x (strict) | M1 |
| Validation | Zod | 3.x | M1 |
| Frontend | React | 18+ | M5 |
| Build Tool | Vite | 5+ | M5 |
| LLM Provider | NVIDIA NIM / API Catalog | — | M3 |
| Flight Data | OpenFlights (static) + Duffel Sandbox (test) + Mock Offers | — | M2 |
| Weather | Open-Meteo Forecast + Geocoding | v1 | M2 |
| Places/Routes | OpenStreetMap / Nominatim + OSRM / Valhalla | v1 | M2 |
| Map Rendering | MapLibre GL + OSM tiles (CartoDB, OpenMapTiles) | — | M5 |
| Database | PostgreSQL | 16+ | M8 (optional) |
| Containerization | Docker Compose | — | M8 |
| CI/CD | GitHub Actions | — | M0 |

---

## 3. Data Flow

### 3.1 Trip Planning Request Flow

```
User Input (natural language)
        │
        ▼
┌───────────────────┐
│  POST /api/trips  │  ← Fastify route (M1)
│  { prompt: string }│
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Zod Validation   │  ← Trust boundary: validate all external input
│  (prompt schema)  │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  NVIDIA LLM Client│  ← M3: Tool-calling agent
│  - System prompt  │
│  - Tool registry  │
│  - Stream response│
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    ▼           ▼
Tool Call    Tool Call      (LLM proposes → Backend validates → Executes)
    │           │
    ▼           ▼
┌─────────────────────────────────────┐
│        PROVIDER ADAPTERS            │
│  - OpenFlights: airport/route data  │
│  - Duffel Sandbox: flight offers    │
│  - Mock: estimated pricing (dev)    │
│  - Open-Meteo: weather forecast     │
│  - Nominatim: geocoding / places    │
│  - OSRM / Valhalla: routing         │
└─────────────────────────────────────┘
    │           │
    ▼           ▼
Normalized Domain Types (internal)
    │
    ▼
LLM receives tool results → continues reasoning
    │
    ▼
Streaming SSE Events → Frontend
```

### 3.2 Streaming Itinerary Protocol (M4)

```
Event Stream (Server-Sent Events):

event: itinerary_start
data: { "tripId": "uuid", "prompt": "..." }

event: tool_call
data: { "tool": "search_flights", "args": {...}, "callId": "uuid" }

event: tool_result
data: { "callId": "uuid", "result": {...}, "source": "amadeus", "retrievedAt": "ISO8601" }

event: itinerary_chunk
data: { "section": "flights", "content": "Markdown/structured", "citations": [...] }

event: itinerary_complete
data: { "tripId": "uuid", "fullItinerary": {...} }

event: error
data: { "code": "TOOL_TIMEOUT", "message": "...", "recoverable": true }
```

---

## 4. Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────┐
│                      UNTRUSTED ZONE                             │
│  - User input (prompt, parameters)                              │
│  - Provider responses (raw JSON)                                │
│  - LLM output (tool calls, generated text)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Zod validation / sanitization
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TRUSTED ZONE (Backend)                     │
│  - Validated domain types                                       │
│  - Authorized tool execution                                    │
│  - Provider adapter normalization                               │
│  - Secret management (API keys never leave backend)             │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Structured, cited, timestamped data
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND ZONE                              │
│  - Rendered itinerary (no secrets)                              │
│  - Map display (public tiles only)                              │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1 Validation Rules

| Boundary | Validation |
|----------|------------|
| User → Backend | Zod schema on all route inputs; max prompt length; sanitize HTML |
| LLM → Tool Executor | Zod schema on tool arguments; allowlist of permitted tools; arg size limits |
| Provider → Adapter | Zod schema on provider response; strip unknown fields; normalize units |
| Adapter → Domain | Transform to internal types; add `source`, `retrievedAt`, `providerRequestId` |
| Backend → Frontend | SSE event schema validation; no raw provider payloads; no secrets |

---

## 5. Provider Adapters Pattern

Each provider has a dedicated adapter module:

```typescript
// Domain types (internal, stable)
interface FlightOffer {
  id: string;
  source: 'amadeus';
  retrievedAt: Date;
  origin: AirportCode;
  destination: AirportCode;
  departure: DateTime;
  arrival: DateTime;
  price: Amount;
  currency: CurrencyCode;
  segments: FlightSegment[];
  bookingUrl?: string;  // Planning-only: no direct booking
}

// Adapter interface
interface FlightsAdapter {
  search(params: FlightSearchParams): Promise<FlightOffer[]>;
  normalize(raw: AmadeusFlightOffer): FlightOffer;
}

// Implementation
class AmadeusFlightsAdapter implements FlightsAdapter {
  constructor(private client: AmadeusClient) {}
  async search(params) { ... }
  normalize(raw) { ... }  // Validates with Zod, maps fields
}
```

**Rules:**
- Adapters own provider-specific logic (auth, pagination, error mapping)
- Domain types never expose provider-specific fields
- All provider responses validated at runtime with Zod
- Adapters are testable with mocked provider responses

---

## 6. NVIDIA LLM Client

```typescript
interface LLMClient {
  completeStream(params: {
    messages: Message[];
    tools: ToolDefinition[];
    toolChoice?: 'auto' | 'none' | { function: string };
  }): AsyncIterable<LLMEvent>;
}

// Tool definition (provided to LLM)
interface ToolDefinition {
  name: string;
  description: string;
  parameters: z.ZodSchema;  // JSON Schema from Zod
}

// Tool executor (backend-controlled)
class ToolExecutor {
  private tools = new Map<string, ToolImpl>();
  
  register(tool: ToolImpl) { ... }
  
  async execute(call: ToolCall): Promise<ToolResult> {
    // 1. Validate arguments against tool's Zod schema
    // 2. Check authorization (user permissions, rate limits)
    // 3. Execute with timeout (e.g., 10s)
    // 4. Validate result size
    // 5. Return normalized result
  }
}
```

**Boundaries enforced by backend (not LLM):**
- Max tool loop iterations (e.g., 10)
- Max tool call duration (e.g., 10s)
- Max total request duration (e.g., 60s)
- Max output tokens (e.g., 8000)
- Argument validation against Zod schemas
- Tool allowlist per user/session

---

## 7. Secret Management

| Secret | Storage | Access |
|--------|---------|--------|
| `NVIDIA_API_KEY` | Environment variable | Backend only (LLM client) |
| `DUFFEL_ACCESS_TOKEN` | Environment variable | Backend only (Duffel sandbox) |
| `OPEN_METEO_BASE_URL` | Environment variable | Backend only (no auth needed) |
| `NOMINATIM_USER_AGENT` | Environment variable | Backend only (required by policy) |
| `AVIATIONSTACK_API_KEY` | Environment variable | Backend only (optional, schedules) |

**Rules:**
- Never commit `.env` or secrets
- Use `.env.local` for development (gitignored)
- Separate keys for dev/staging/production
- Rotate on exposure
- No map API keys needed (MapLibre + free OSM tiles)

---

## 8. Error Handling

| Category | Strategy |
|----------|----------|
| Validation errors (Zod) | 400 response with structured error details |
| Provider errors (4xx/5xx) | Map to domain errors; retry with backoff for 5xx; circuit breaker |
| LLM errors | Timeout → partial result; tool failure → LLM informed; stream error event |
| Network errors | Retry with exponential backoff (max 3); degrade gracefully |
| Rate limits | Respect `Retry-After`; queue or reject with 429 |

---

## 9. Testing Strategy

| Level | Scope | Tools |
|-------|-------|-------|
| Unit | Domain logic, adapters (mocked providers), tool executors | Vitest |
| Integration | Fastify routes, provider adapters (live test env), SSE streaming | Vitest + testcontainers |
| Contract | Provider response schemas, SSE event schemas | Zod + schema snapshots |
| E2E | Full trip planning flow (M6+) | Playwright |
| Smoke | Live provider calls (opt-in, manual) | Scripts |

---

## 10. Deployment (M8)

```
Docker Compose Services:
├── app (Fastify + static React build)
├── postgres (optional, M8)
└── nginx (reverse proxy, TLS termination, rate limiting)

Environment-specific configs via Docker Compose overrides.
Secrets via Docker secrets or env files (not in image).
```

---

## 11. Open Decisions (Tracked in decisions.md)

1. Database: PostgreSQL vs in-memory for M1–M7?
2. Map renderer: Google Maps JS API vs MapLibre + OSM tiles?
3. Session management: JWT vs cookies vs SSE-only?
4. Caching strategy for provider responses?
5. Observability: logging, metrics, tracing stack?

---

*This document evolves with each milestone. See `docs/architecture/decisions.md` for dated decisions.*