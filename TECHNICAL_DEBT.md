# TECHNICAL DEBT

The following item has been intentionally deferred to later stages of architectural cleanup:

## 1. Consolidate Debug Instrumentation
* **Description**: Consolidating legacy duplicate diagnostics from the main production code (`assets/smart_assets.js`) and relying entirely on the dedicated debug modules (`debug/`) when `DEBUG_MODE=true`.
* **Rationale**: Deferred to avoid unnecessary code movement during the critical stabilization phase. This refactor does not affect the production runtime footprint, as the production compiler and runtime flags completely bypass all diagnostic paths when `DEBUG_MODE=false`.
* **Planned Window**: Post-Phase 2 / Architectural Cleanup.
