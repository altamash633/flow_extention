# GLOBAL STATE REPORT

## State Variables

### 1. `window.smartAssetIndex`
* **Owner**: Local ZIP Extraction Pipeline / Side Panel Initialization.
* **Lifecycle**: Populated dynamically when ZIP archives are successfully ingested; persists for the duration of the side-panel lifecycle.
* **Readers**: `assets/smart_assets.js` (parser scans index categories: `characters`, `backgrounds`, `props`).
* **Writers**: External loading/unpacking controller.
* **Risks**: Missing or corrupted properties can cause parser/autocomplete lookup failures.

### 2. `window.__saUploadHandler`
* **Owner**: Injected Host Environment Bridge.
* **Lifecycle**: Assumed to be registered by host scripts; intercepted dynamically by `smart_assets.js` to hook the upload cycle.
* **Readers**: `assets/smart_assets.js` (triggers uploads for parsed items).
* **Writers**: Host runtime (initially), `assets/smart_assets.js` (overrides/wraps with tracer logic in `DEBUG_MODE`).
* **Risks**: Race conditions if the handler is invoked before it is fully registered by host scripts.

### 3. `window.__saPromptQueue`
* **Owner**: `assets/smart_assets.js`
* **Lifecycle**: Reset and rebuilt on every textarea keyup event.
* **Readers**: `assets/smart_assets.js`, `debug/live_metrics.js` (visualizing length).
* **Writers**: `assets/smart_assets.js` (writes array of prompt texts directly).
* **Risks**: Rapid key presses cause high-frequency overwriting of the array, leading to dropped or duplicate processing states.

### 4. `window.__saResolvedAssets`
* **Owner**: `assets/smart_assets.js`
* **Lifecycle**: Reset to an empty array and re-populated on every keyup event.
* **Readers**: `assets/smart_assets.js` (uses it to iterate and upload), `debug/runtime_validator.js`.
* **Writers**: `assets/smart_assets.js`.
* **Risks**: State is completely ephemeral and lacks immutability. If a prompt's text is changed while an upload is in progress, the index matching can drift.

### 5. `window.__saUploadHistory`
* **Owner**: `assets/smart_assets.js`
* **Lifecycle**: Persistent array tracking successful uploads.
* **Readers**: `debug/debug_api.js`, diagnostics.
* **Writers**: `assets/smart_assets.js` (appends metadata after successful uploads).
* **Risks**: Uncapped appends could lead to memory leaks in extremely long-running sessions.

### 6. `window.__saLastUpload`
* **Owner**: `assets/smart_assets.js`
* **Lifecycle**: Stores the file list of the most recent upload.
* **Readers**: Diagnostic modules.
* **Writers**: `assets/smart_assets.js` (sets it upon resolving/triggering `__saUploadHandler`).
* **Risks**: Extremely low; acts as a simple state flag.
