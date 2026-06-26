# CHANGELOG

## [Phase 0] - Runtime Instrumentation V2
### Added
- `assets/smart_assets.backup.js` created as a safety measure.
- `window.__SA_FLAGS` to control future phase rollouts (all disabled initially).
- `window.__saMetrics` to store real-time performance and listener data.
- Global `setInterval` memory monitor (1000ms).
- `EventTarget.prototype.addEventListener` wrapper to track listener counts and warn on textarea duplication.
- `Object.defineProperty` proxy on `window.__saUploadHandler` to intercept execution without modifying underlying logic. Captures timestamp, files, duration, and ModelValue history.
- Runtime validator looping every 2000ms checking for undefined or duplicate assets in `window.__saResolvedAssets`.
- Live Metrics Dashboard (`#sa-metrics-panel`) injected into DOM to visualize parser, resolver, and upload latency.

### Changed
- `smart_assets.js` syntax error fixed by stripping broken Node.js wrapper to make it a valid browser-executable script.
- Pre-pended Phase 0 instrumentation block to `assets/smart_assets.js`.

### Removed
- Node.js `fs` import wrapper in `smart_assets.js`.
