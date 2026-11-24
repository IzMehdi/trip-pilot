# TripPilot — Architecture Decision Log

**Format:** Date | Decision | Alternatives Considered | Rationale | Status

---

## 2025-11-24 | Repository Structure & Branching Model

**Decision:** Monorepo with `main` (protected), `develop` (integration), `feat/mN-*` and `fix/mN-*` worker branches. Squash merge via PR.

**Alternatives:**
- Separate repos per service (backend, frontend) — rejected: overhead for M0–M5
- Trunk-based development — rejected: need isolation for parallel agent work
- Merge commits — rejected: squash keeps history clean

**Rationale:** Matches SUPERVISOR_PLAYBOOK.md requirements. Enables parallel agent worktrees.

**Status:** ✅ Implemented in M0

---

## 2025-11-24 | Language & Runtime

**Decision:** TypeScript 5.x strict mode throughout; Node.js 22+ LTS.

**Alternatives:**
- JavaScript with JSDoc — rejected: less type safety at boundaries
- Bun/Deno — rejected: Node.js 22 has native TypeScript support, broader ecosystem

**Rationale:** Non-negotiable per project rules. Strict mode catches boundary errors early.

**Status:** ✅ Documented; package.json in M1

---

## 2025-11-24 | Backend Framework

**Decision:** Fastify 4.x

**Alternatives:**
- Express — rejected: slower, no native TypeScript types, no schema validation
- Hono — rejected: smaller ecosystem, less mature
- NestJS — rejected: over-engineering for this scope

**Rationale:** Fastify has native Zod integration, high performance, good TypeScript support, schema-based validation.

**Status:** ✅ Documented; implementation in M1

---

## 2025-11-24 | Validation at Trust Boundaries

**Decision:** Zod schemas for all external inputs (user, providers, LLM tool calls). Runtime validation mandatory.

**Alternatives:**
- TypeScript interfaces only — rejected: no runtime guarantee
- io-ts / Valibot — rejected: Zod has best Fastify integration and DX

**Rationale:** "Validate all external inputs and provider responses at runtime" — non-negotiable rule.

**Status:** ✅ Documented; implementation in M1

---

## 2025-11-24 | Provider Adapter Pattern

**Decision:** Each external provider has a dedicated adapter module implementing a domain interface. Adapters normalize to internal domain types with Zod validation.

**Alternatives:**
- Direct provider calls in routes — rejected: tight coupling, untestable
- Single generic HTTP client — rejected: provider-specific logic (auth, pagination, errors) leaks

**Rationale:** "Use provider adapters and normalized internal domain types" — non-negotiable rule. Enables mocking, testing, provider swaps.

**Status:** ✅ Documented; implementation in M2

---

## 2025-11-24 | NVIDIA LLM Integration

**Decision:** OpenAI-compatible client against NVIDIA API Catalog endpoint. Backend owns tool registry/executor; LLM only proposes tool calls.

**Alternatives:**
- NVIDIA NIM self-hosted — rejected: operational overhead for M0–M7
- Direct NVIDIA SDK — rejected: OpenAI-compatible is standard, portable
- LangChain / Vercel AI SDK — rejected: adds abstraction layer; backend must control tool execution

**Rationale:** "Use an OpenAI-compatible client only after verifying the selected endpoint's actual base URL, model ID, streaming support and tool/function-calling support." Tool calls are proposals; backend validates and authorizes.

**Status:** 🔬 Research in M0; implementation in M3

---

## 2025-11-24 | Streaming Protocol

**Decision:** Server-Sent Events (SSE) with typed event schema. Events: `itinerary_start`, `tool_call`, `tool_result`, `itinerary_chunk`, `itinerary_complete`, `error`.

**Alternatives:**
- WebSockets — rejected: overkill for unidirectional stream; SSE simpler, works over HTTP/2
- Polling — rejected: poor UX, unnecessary load
- GraphQL subscriptions — rejected: adds complexity

**Rationale:** "Streaming must have a documented event schema and support cancellation." SSE is standard, browser-native, supports cancellation via `EventSource` close.

**Status:** ✅ Documented; implementation in M4

---

## 2025-11-24 | Database (Deferred)

**Decision:** No database in M0–M7 unless a verified dependency requires it. PostgreSQL added in M8 if needed.

**Alternatives:**
- SQLite for dev — rejected: adds dependency without clear need
- In-memory store — accepted for dev/test if session state needed

**Rationale:** "PostgreSQL as a later persistence option; do not add a database in M0 unless a verified dependency requires it." Trip planning is stateless in M0–M6; sessions can be in-memory or omitted.

**Status:** ✅ Documented; revisit at M8

---

## 2025-11-24 | Frontend Stack

**Decision:** React 18+ with Vite 5+. TypeScript strict. Map renderer decision deferred to M5.

**Alternatives:**
- Next.js — rejected: SSR not needed; adds complexity
- Svelte/Solid — rejected: team familiarity with React
- Create React App — rejected: deprecated

**Rationale:** Vite provides fast HMR, native TypeScript, simple config. React ecosystem for map libraries.

**Status:** ✅ Documented; implementation in M5

---

## 2025-11-24 | Map Rendering (Deferred to M5)

**Decision:** Choose between Google Maps JavaScript API and MapLibre GL + compliant tile provider in M5.

**Alternatives:**
- Leaflet — rejected: limited vector tile support, older API
- Mapbox GL — rejected: requires Mapbox account, pricing complexity
- Custom OSM tiles — rejected: "Do not scrape map tiles or assume public OSM demo services are production infrastructure"

**Rationale:** Must use production-ready tile infrastructure. Decision depends on Google Maps Platform billing approval and tile provider evaluation.

**Status:** ⏳ Deferred to M5

---

## 2025-11-24 | Session / State Management

**Decision:** Stateless SSE stream per trip request. No server-side session storage in M0–M6. Trip ID returned for potential resume.

**Alternatives:**
- JWT sessions — rejected: not needed for stateless planning
- Redis for stream state — rejected: premature optimization

**Rationale:** Planning-only product; each request independent. Resume capability can be added later if needed.

**Status:** ✅ Documented; revisit if resume required

---

## 2025-11-24 | CI/CD Pipeline

**Decision:** GitHub Actions on PR to `main`/`develop`. Steps: Node 22 setup, `npm ci`, `lint`, `typecheck`, `test`. Extend per milestone.

**Alternatives:**
- GitLab CI / CircleCI — rejected: GitHub Actions native to repo
- Pre-commit hooks only — rejected: CI enforces on all contributors

**Rationale:** Required by M0 acceptance criteria. Fast feedback on PRs.

**Status:** ✅ Implemented in M0 (placeholder until package.json)

---

## 2025-11-24 | Testing Strategy

**Decision:** Deterministic unit/integration tests with mocked providers. Opt-in live smoke tests (manual, documented).

**Alternatives:**
- Heavy live testing — rejected: flaky, slow, costs money, rate limits
- No tests — rejected: "Prefer deterministic tests with mocked provider responses"

**Rationale:** Non-negotiable rule. Mocked tests fast, reliable, free. Smoke tests verify live integration before release.

**Status:** ✅ Documented; implementation from M1

---

## 2025-11-24 | Security: Secret Handling

**Decision:** All provider credentials on backend only. Frontend gets restricted Google Maps key only. `.env.local` gitignored. No secrets in prompts, logs, or commits.

**Alternatives:**
- Backend proxy for all frontend API calls — accepted (already the case)
- Frontend direct provider calls — rejected: exposes secrets

**Rationale:** "Keep provider credentials on the backend only." "Never commit `.env`, API keys, access tokens, personal data, or provider secrets."

**Status:** ✅ Documented; enforced in code from M1

---

## 2025-11-24 | Error Handling & Resilience

**Decision:** Structured error types per boundary. Retry with backoff for provider 5xx. Circuit breaker for repeated failures. Timeouts on all external calls.

**Alternatives:**
- Let errors bubble — rejected: poor UX, no observability
- Global error handler only — rejected: need context-specific handling

**Rationale:** "Bound LLM tool loops, tool arguments, request duration, retries and output size." Provider failures must not crash the stream.

**Status:** ✅ Documented; implementation from M1

---

## 2025-11-24 | Observability (Deferred)

**Decision:** Structured JSON logging (pino). Metrics/tracing stack decision at M7.

**Alternatives:**
- OpenTelemetry from start — rejected: overhead before needed
- Console.log — rejected: not production-ready

**Rationale:** M0–M6 focus on correctness. Observability hardened at M7.

**Status:** ⏳ Deferred to M7

---

## 2025-11-24 | Deployment Target (M8)

**Decision:** Docker Compose for M8. Single-container app (Fastify serves static React build). Nginx reverse proxy. PostgreSQL optional.

**Alternatives:**
- Kubernetes — rejected: overkill for initial deployment
- Serverless (Vercel/Cloud Run) — rejected: streaming SSE and long-running LLM calls need persistent connections
- Static export — rejected: backend required for secrets and provider calls

**Rationale:** Docker Compose is simple, portable, supports SSE. Matches M8 requirements.

**Status:** ⏳ Documented; implementation in M8

---

*Add new decisions above this line with date prefix. Keep chronological.*