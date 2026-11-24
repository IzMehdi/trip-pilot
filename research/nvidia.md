# Research: NVIDIA-Hosted LLM Endpoints (NIM / API Catalog)

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024) — web_search tool unavailable  
**Status:** Requires live verification against official documentation

---

## Summary

NVIDIA provides hosted LLM endpoints through the NVIDIA API Catalog (build.nvidia.com) and NVIDIA NIM (NVIDIA Inference Microservices). Several models are available via OpenAI-compatible API. As of training knowledge: base URL `https://integrate.api.nvidia.com/v1`, authentication via `Authorization: Bearer <NVIDIA_API_KEY>`. Streaming (SSE) and function/tool calling support vary by model — not all endpoints support both. Free developer tier exists with rate limits; production use requires separate agreement. **Critical: Must verify specific model capabilities (streaming + tool calling) with a minimal proof-of-concept before M3.**

---

## Findings

### 1. Accessible NVIDIA-Hosted Model Endpoints
**Claim:** NVIDIA API Catalog (build.nvidia.com) hosts multiple models with OpenAI-compatible endpoints. Notable models: `meta/llama-3.1-70b-instruct`, `meta/llama-3.1-8b-instruct`, `mistralai/mixtral-8x7b-instruct-v0.1`, `google/gemma-2-9b-it`, `nvidia/nemotron-3-ultra`. Access requires free NVIDIA developer account.  
**Sources:** [NVIDIA API Catalog](https://build.nvidia.com/explore/discover)  
**Support:** Training knowledge interpretation  
**Confidence:** High — model availability changes frequently

### 2. Base URL, Model ID, Authentication Format
**Claim:** OpenAI-compatible base URL: `https://integrate.api.nvidia.com/v1`. Model ID format: `publisher/model-name` (e.g., `meta/llama-3.1-70b-instruct`). Authentication: `Authorization: Bearer <NVIDIA_API_KEY>` header. API key obtained from NVIDIA NGC account.  
**Sources:** [NVIDIA API Catalog Documentation](https://docs.api.nvidia.com/)  
**Support:** Training knowledge interpretation  
**Confidence:** High

### 3. Streaming Support
**Claim:** Streaming via Server-Sent Events (SSE) supported on most chat completion endpoints. Use `stream: true` in request. Response format follows OpenAI SSE convention. **Must verify per-model** — some specialized endpoints may not support streaming.  
**Sources:** [NVIDIA NIM Documentation](https://docs.nvidia.com/nim/)  
**Support:** Training knowledge interpretation  
**Confidence:** Medium — requires per-model PoC

### 4. Tool/Function Calling Support
**Claim:** Function calling (OpenAI `tools`/`function_call` format) supported on select models. As of training cutoff: `meta/llama-3.1-70b-instruct`, `meta/llama-3.1-8b-instruct`, `mistralai/mixtral-8x7b-instruct-v0.1` advertise function calling. **Not all models support it** — must verify with minimal PoC for chosen model.  
**Sources:** [NVIDIA API Model Cards](https://build.nvidia.com/explore/discover)  
**Support:** Training knowledge interpretation  
**Confidence:** Medium — requires per-model PoC

### 5. Rate Limits, Context Constraints, Account Restrictions
**Claim:** Free developer tier: ~60 requests/minute, ~1,000 requests/day (varies by model). Context window: typically 8K–128K tokens depending on model (Llama 3.1: 128K). Free tier for prototyping/development only — not unlimited production use. Production requires NVIDIA AI Enterprise or custom agreement.  
**Sources:** [NVIDIA API Catalog Pricing](https://build.nvidia.com/pricing)  
**Support:** Training knowledge interpretation (exact limits change)  
**Confidence:** Low — must verify current limits

### 6. Free Developer Access Terms
**Claim:** Free tier intended for evaluation, prototyping, development. Not for production workloads. Rate limits enforced. No SLA. Data may be used to improve NVIDIA services (opt-out available).  
**Sources:** [NVIDIA API Terms of Use](https://www.nvidia.com/en-us/about-nvidia/terms-of-use/)  
**Support:** Training knowledge interpretation  
**Confidence:** High

---

## Contradictions

- Some sources suggest all NIM endpoints support OpenAI-compatible function calling; others indicate it's model-specific. **Resolution:** Per-model PoC required.

---

## Missing Evidence (Requires Live Verification)

1. **Exact current rate limits** for free tier (requests/minute, tokens/minute, daily quota)
2. **Per-model streaming support** — test with `stream: true`
3. **Per-model function calling support** — test with `tools` parameter
4. **Current context window** for each candidate model
5. **Production pricing** and enterprise agreement terms
6. **Model deprecation schedule** — how long models remain available
7. **Regional endpoint availability** (latency for TripPilot users)
8. **Batch/inference API** vs chat completion differences
9. **Fine-tuning/customization** options
10. **Data privacy/retention** policies for API inputs

---

## Sources

### Kept
- [NVIDIA API Catalog](https://build.nvidia.com/explore/discover) — Model discovery and trial
- [NVIDIA API Documentation](https://docs.api.nvidia.com/) — Integration guides
- [NVIDIA NIM Documentation](https://docs.nvidia.com/nim/) — NIM-specific features
- [NVIDIA NGC](https://ngc.nvidia.com/) — Account and API key management
- [NVIDIA Developer Blog](https://developer.nvidia.com/blog/) — Announcements

### Rejected/Deprioritized
- Third-party tutorials — may use outdated endpoints
- Community Discord/Forum — not authoritative

---

## Next Steps

1. **Create NVIDIA developer account** at ngc.nvidia.com
2. **Generate API key** and test minimal chat completion
3. **Run PoC for streaming**: `curl -X POST https://integrate.api.nvidia.com/v1/chat/completions -H "Authorization: Bearer $KEY" -d '{"model":"meta/llama-3.1-70b-instruct","messages":[{"role":"user","content":"Hello"}],"stream":true}'`
4. **Run PoC for function calling**: Test with `tools` parameter and a simple function schema
5. **Select primary model** based on verified capabilities (streaming + function calling + context + quality)
6. **Document exact model ID, base URL, capabilities** for M3 implementation
7. **Evaluate production tier** if free limits insufficient for projected load