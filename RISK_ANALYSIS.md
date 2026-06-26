# RISK ANALYSIS

## 1. Tight Coupling
* **Issue**: The parser, resolver, and upload logic are tightly bound inside a single keyup event listener in `assets/smart_assets.js` (lines 257-378).
* **Impact**: You cannot test or validate the parser or resolver without triggering the upload pipeline.

## 2. Duplicated Logic
* **Issue**: The `EventTarget.prototype.addEventListener` monkeypatching and `__saUploadHandler` wrapper logic are defined both inside the `DEBUG_MODE === true` block of `assets/smart_assets.js` and inside `debug/runtime_validator.js`.
* **Impact**: Increases code footprint and introduces potential conflicts if both scripts run in a debug session.

## 3. Large Modules
* **Issue**: `assets/smart_assets.js` spans 378 lines and contains autocomplete UI management, caret math, DOM injections, regex parsing, file resolution, and async upload loops.
* **Impact**: Difficult to maintain and highly susceptible to regression errors during stabilization changes.

## 4. Hidden Dependencies & Global State Leakage
* **Issue**: Multiple components read/write directly to `window.__saPromptQueue` and `window.__saResolvedAssets`.
* **Impact**: Since there is no module isolation, any external script running in the panel or host page can corrupt these arrays.

## 5. Performance Risks
* **Issue**: **Eager execution on keyup**. The entire document text is split, parsed, resolved, and uploaded on every single keystroke.
* **Impact**: Massive CPU overhead, duplicate upload requests, and severe race conditions if the user types rapidly.
