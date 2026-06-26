# RUNTIME LOAD MAP

## 1. assets/debug_api.js
* **Entry point**: None (Unreferenced in production)
* **Load method**: N/A
* **Execution condition**: N/A
* **Always loaded?**: NO
* **DEBUG_MODE dependency**: Statically checks `window.DEBUG_MODE === true` but the file itself is never loaded or executed.
* **Can this file be removed without affecting production?**: YES. It is completely unreferenced by the extension's manifest, content scripts, service worker, or HTML entry points.

## 2. assets/live_metrics.js
* **Entry point**: None (Unreferenced in production)
* **Load method**: N/A
* **Execution condition**: N/A
* **Always loaded?**: NO
* **DEBUG_MODE dependency**: Statically checks `window.DEBUG_MODE === true` but the file itself is never loaded or executed.
* **Can this file be removed without affecting production?**: YES. It is completely unreferenced by the extension's manifest, content scripts, service worker, or HTML entry points.

## 3. assets/runtime_validator.js
* **Entry point**: None (Unreferenced in production)
* **Load method**: N/A
* **Execution condition**: N/A
* **Always loaded?**: NO
* **DEBUG_MODE dependency**: Statically checks `window.DEBUG_MODE === true` but the file itself is never loaded or executed.
* **Can this file be removed without affecting production?**: YES. It is completely unreferenced by the extension's manifest, content scripts, service worker, or HTML entry points.

---

## Production Entry Points Audited
* **manifest.json**: Verified. No references to these files.
* **service-worker-loader.js**: Verified. No references or `importScripts` found.
* **src/ui/side-panel/index.html**: Verified. Only loads `jszip.min.js` and `smart_assets.js`.
* **assets/index.html-B3dstwmb.js** (Production build output): Verified. No references.
* **assets/index.ts-CjccIiMW.js** (Production content script): Verified. No references.
* **assets/catchUploadFile.ts-DJwIizxX.js**: Verified. No references.
