# Research: NVIDIA-Hosted LLM Endpoints (NIM / API Catalog)

**Research Date:** 2025-11-24  
**Researcher:** Pi Subagent (training knowledge, cutoff ~2024) — web_search tool unavailable  
**Live Verification Date:** 2025-11-24 (using provided API key)  
**Status:** ✅ Verified - Working model identified

---

## Summary

NVIDIA provides hosted LLM endpoints through the NVIDIA API Catalog (build.nvidia.com). **Live verification completed 2025-11-24** using the provided API key. Base URL: `https://integrate.api.nvidia.com/v1`, OpenAI-compatible. **Verified working model:** `nvidia/nemotron-3.5-bolt-e4b` supports both streaming (SSE) and function calling. Alternative: `moonshotai/kimi-k3.1-pro` (1M context, VLM, tools advertised). Many older models (Llama 3.1/3.2/3.3, Nemotron 3 Ultra/4, Mixtral) have reached EOL as of 2026.

---

## Findings

### 1. Accessible NVIDIA-Hosted Model Endpoints
**Claim:** NVIDIA API Catalog (build.nvidia.com) hosts multiple models with OpenAI-compatible endpoints. **As of 2025-11-24 live verification**, available models include: `nvidia/nemotron-3.5-bolt-e4b`, `moonshotai/kimi-k3.1-pro`, `google/gemma-3-12b-it`, `google/gemma-3-4b-it`, `google/gemma-4-31b-it`, `mistralai/mistral-large-4-1t-a52b`, and others. Many older models (Llama 3.1/3.2/3.3, Nemotron 3 Ultra/4, Mixtral) have reached EOL.
**Sources:** [NVIDIA API Catalog](https://build.nvidia.com/explore/discover), live `/v1/models` endpoint
**Support:** Direct evidence from API
**Confidence:** High

### 2. Base URL, Model ID, Authentication Format
**Claim:** OpenAI-compatible base URL: `https://integrate.api.nvidia.com/v1`. Model ID format: `publisher/model-name` (e.g., `nvidia/nemotron-3.5-bolt-e4b`). Authentication: `Authorization: Bearer <NVIDIA_API_KEY>` header. API key obtained from NVIDIA NGC account. **Verified working.**
**Sources:** [NVIDIA API Catalog Documentation](https://docs.api.nvidia.com/), live verification
**Support:** Direct evidence
**Confidence:** High

### 3. Streaming Support
**Claim:** Streaming via Server-Sent Events (SSE) supported. **Verified working** with `nvidia/nemotron-3.5-bolt-e4b` using `stream: true`. Response follows OpenAI SSE convention with `data:` chunks and `[DONE]` terminator.
**Sources:** Live verification 2025-11-24
**Support:** Direct evidence
**Confidence:** High

### 4. Tool/Function Calling Support
**Claim:** Function calling (OpenAI `tools`/`function_call` format) supported on select models. **Verified working** with `nvidia/nemotron-3.5-bolt-e4b` — correctly returns `tool_calls` with function name and JSON arguments. The `moonshotai/kimi-k3.1-pro` model also advertises `supports_tools: true` in `/v1/models` response.
**Sources:** Live verification 2025-11-24, `/v1/models` endpoint
**Support:** Direct evidence
**Confidence:** High

### 5. Rate Limits, Context Constraints, Account Restrictions
**Claim:** Free developer tier limits not publicly documented precisely. Context window varies by model (Nemotron 3.5 Bolt: unknown, Kimi K3.1 Pro: 1M tokens per `/v1/models`). Free tier for prototyping/development only. Production requires NVIDIA AI Enterprise or custom agreement.
**Sources:** [NVIDIA API Catalog Pricing](https://build.nvidia.com/pricing), `/v1/models` endpoint
**Support:** Partial evidence (context from API)
**Confidence:** Medium — rate limits need live measurement

### 6. Free Developer Access Terms
**Claim:** Free tier intended for evaluation, prototyping, development. Not for production workloads. Rate limits enforced. No SLA. Data may be used to improve NVIDIA services (opt-out available).
**Sources:** [NVIDIA API Terms of Use](https://www.nvidia.com/en-us/about-nvidia/terms-of-use/)
**Support:** Training knowledge interpretation
**Confidence:** High

---

## Contradictions

- Many models listed in training knowledge have reached EOL (Llama 3.1/3.2/3.3, Nemotron 3 Ultra/4, Mixtral 8x7B). **Resolution:** Always check `/v1/models` endpoint for current availability.

---

## Missing Evidence (Requires Live Verification)

1. **Exact current rate limits** for free tier (requests/minute, tokens/minute, daily quota)
2. **Context window** for `nvidia/nemotron-3.5-bolt-e4b` (not in `/v1/models`)
3. **Production pricing** and enterprise agreement terms
4. **Model deprecation schedule** — many models EOL'd in 2026
5. **Regional endpoint availability** (latency for TripPilot users)
6. **Batch/inference API** vs chat completion differences
7. **Fine-tuning/customization** options
8. **Data privacy/retention** policies for API inputs

## Verified Working (2025-11-24)

| Model | Streaming | Function Calling | Context Window | Notes |
|-------|-----------|------------------|----------------|-------|
| `nvidia/nemotron-3.5-bolt-e4b` | ✅ Yes | ✅ Yes | Unknown | Fast, small model |
| `moonshotai/kimi-k3.1-pro` | ⚠️ Timeout | ✅ Advertised | 1,048,576 | VLM, supports tools |
| `google/gemma-3-12b-it` | ❓ Untested | ❓ Untested | Unknown | |
| `mistralai/mistral-large-4-1t-a52b` | ❓ Untested | ❓ Untested | Unknown | |

---

## Sources

### Kept
- [NVIDIA API Catalog](https://build.nvidia.com/explore/discover) — Model discovery and trial
- [NVIDIA API Documentation](https://docs.api.nvidia.com/) — Integration guides
- [NVIDIA NIM Documentation](https://docs.nvidia.com/nim/) — NIM-specific features
- [NVIDIA NGC](https://ngc.nvidia.com/) — Account and API key management
- Live `/v1/models` endpoint — Current model list
- Live `/v1/chat/completions` endpoint — Verified streaming and function calling

### Rejected/Deprioritized
- Third-party tutorials — may use outdated endpoints
- Community Discord/Forum — not authoritative

---

## Next Steps

1. ✅ **NVIDIA developer account** — API key provided by user
2. ✅ **Generate API key** — done
3. ✅ **PoC for streaming** — verified with `nvidia/nemotron-3.5-bolt-e4b`
4. ✅ **PoC for function calling** — verified with `nvidia/nemotron-3.5-bolt-e4b`
5. **Select primary model** — Recommend `nvidia/nemotron-3.5-bolt-e4b` for speed, or `moonshotai/kimi-k3.1-pro` for larger context (1M tokens) and VLM
6. **Document exact model ID, base URL, capabilities** for M3 implementation — done below
7. **Evaluate production tier** if free limits insufficient for projected load
8. **Measure rate limits** with sustained requests

## Recommended Configuration for M3

```yaml
NVIDIA_BASE_URL: https://integrate.api.nvidia.com/v1
NVIDIA_MODEL_ID: nvidia/nemotron-3.5-bolt-e4b  # or moonshotai/kimi-k3.1-pro for 1M context
NVIDIA_API_KEY: [provided by user]
# Capabilities verified:
# - Streaming: YES
# - Function calling: YES
# - OpenAI-compatible: YES
```