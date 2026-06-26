# REFACTOR PRIORITY

This document classifies all proposed pipeline refactors by priority and determines their safety windows.

## Priority Matrix

| Refactor | Priority | Safety Window |
|---|---|---|
| **1. Event Debouncing** | **CRITICAL** | Safe before Phase 2 |
| **2. Immutable Prompt Caching** | **HIGH** | Safe before Phase 2 |
| **3. FIFO Queue Ingestion** | **HIGH** | Safe before Phase 2 |
| **4. Bounded History Capping** | **MEDIUM** | Safe before Phase 2 |
| **5. Consolidate Debug Instrumentation** | **LOW** | Must wait until after Phase 2 |

---

## Classifications

### Safe before Phase 2 (Operational Stability)
* **Event Debouncing**: Necessary to establish a stable event window.
* **Immutable Prompt Caching**: Essential to resolve assets exactly once.
* **FIFO Queue Ingestion**: Required to prevent duplicate/race-condition uploads.
* **Bounded History Capping**: Safe logic containing array length boundaries.

### Must wait until after Phase 2 (Architectural Cleanup)
* **Consolidate Debug Instrumentation**: Removing duplicated debug blocks from `smart_assets.js` should occur after the core execution pipeline has been stabilized and validated.

### Should never be done
* **Full Parser/Upload Rewrite**: The parser and upload mechanisms must remain functionally unchanged to guarantee backwards compatibility with Google Flow.
