# ARCHITECTURE REPORT

## 1. Folder Structure
The repository layout segregates production bundles, source components, standalone diagnostics, safety snapshots, and test suites:
* **`assets/`**: Production-compiled assets containing core extension logic, styling, and vendor modules.
* **`debug/`**: Isolated diagnostics and runtime tools (`debug_api.js`, `live_metrics.js`, `runtime_validator.js`), completely bypassed in production.
* **`tests/`**: Test runners and mocking environments (`test_runtime.js`, `mock_run.js`, etc.) for local safety validation.
* **`tools/`**: Archived scripts, historical patch files, and command-line automation utilities.
* **`checkpoints/`**: Immutable, phase-by-phase rollback directories preserving system integrity.
* **`src/`**: Uncompiled source files (TypeScript modules, UI stylesheets, views).

## 2. Runtime Entry Points
* **Background Context**: `service-worker-loader.js` (delegates module registration and background service worker execution).
* **UI Context**: `src/ui/side-panel/index.html` (the active HTML container rendering the extension side panel).
* **Injected Content Script**: `assets/index.ts-CjccIiMW.js` (matches `*://labs.google/*` to hook into user interfaces).

## 3. Production Modules & Build Outputs
* **`assets/smart_assets.js`**: Core orchestration script for asset parsing, query resolution, and upload handling. Loaded synchronously in `index.html`.
* **`assets/index.html-B3dstwmb.js`**: Vue/UI interface logic for the extension panel.
* **`assets/catchUploadFile.ts-DJwIizxX.js`**: Injected script module executing within the host page context to hook standard web forms.
* **`assets/remoteConfig-CbIdrXch.js`**: Fetches configuration boundaries dynamically.
* **`assets/jszip.min.js`**: Third-party ZIP extraction engine.

## 4. Runtime-Only Files
* **`assets/smart_assets.js`**: Runs in the side-panel document context, attaching listeners to keyup events, managing local window properties, and communicating with form elements.
