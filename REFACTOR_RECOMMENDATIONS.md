# REFACTOR RECOMMENDATIONS

Based on the architecture review, the following future refactoring steps are recommended to stabilize the Smart Assets execution pipeline:

## 1. Implement Event Debouncing
* **Classification**: **HIGH**
* **Description**: Delay the parsing and upload cycle by 300ms after the last keyup event.
* **Benefit**: Eliminates high-frequency execution and prevents race conditions during rapid typing.

## 2. Decouple Parser and Upload Pipeline
* **Classification**: **HIGH**
* **Description**: Separate the keyup handler into distinct stages:
  1. Parse/Resolve state update.
  2. Upload queue reconciliation (only enqueue changed/new prompts).
* **Benefit**: Prevents duplicate uploads of unchanged prompts and isolates the parsing logic for easier testing.

## 3. Implement Immutable Prompt Cache
* **Classification**: **MEDIUM**
* **Description**: Keep a key-value cache of parsed prompts (keyed by prompt text hash). If a prompt's text hasn't changed, reuse its resolved assets and upload status.
* **Benefit**: Ensures every prompt resolves assets exactly once and prevents duplicate resolves.

## 4. Bounded History Management
* **Classification**: **MEDIUM**
* **Description**: Impose a maximum size cap (e.g., 50 entries) on `window.__saUploadHistory` and implement automatic cleanup of cached assets for prompts no longer present in the textarea.
* **Benefit**: Prevents memory leaks in long-running automation sessions.

## 5. Consolidate Debug Instrumentation
* **Classification**: **LOW**
* **Description**: Remove duplicated debug instrumentation code from `assets/smart_assets.js` and rely entirely on the modular scripts under `debug/` when `window.DEBUG_MODE === true`.
* **Benefit**: Reduces production asset size and ensures a single source of truth for diagnostic tools.
