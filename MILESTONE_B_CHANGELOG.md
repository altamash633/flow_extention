# MILESTONE B CHANGELOG

## [Phase 2 - Milestone B] - 2026-06-26

### Added
* Configured `queueWaitTime` variable inside `window.__saMetrics` structure to capture queue latency under diagnostic mode.

### Changed
* Refactored the runtime diagnostics section in `assets/smart_assets.js` to strictly bind `setInterval` monitors, listener hook wrappers, input hook configurations, validator updates, and the live metrics dashboard panel to `window.DEBUG_MODE === true`.
* Reconfigured the live metrics UI dashboard to output `Queue Wait` latency metrics, consuming from the newly integrated structured timer properties.
* Adjusted the live metrics dashboard's queue tracker to reference `window.__saUploadQueue.length` instead of the legacy `window.__saPromptQueue.length` for accurate, real-time pending task monitoring.
