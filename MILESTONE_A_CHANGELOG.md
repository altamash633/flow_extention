# MILESTONE A CHANGELOG

## [Phase 2 - Milestone A] - 2026-06-26

### Added
* `window.__saPromptCache` map cache in `assets/smart_assets.js` for persistent state and upload tracking.
* `window.__saUploadQueue` array for structured FIFO task management.
* `processUploadQueue` sequential asynchronous queue processor loop.
* Cache evacuation sweep loop on every ingestion cycle to automatically release deleted prompts from memory.
* Bounded array boundaries to restrict `window.__saUploadHistory` to a maximum length of 50.
* Integrated `queueWaitTime` metric capturing when `DEBUG_MODE=true`.

### Changed
* Refactored `executePipeline` to consume prompt data from the cache state instead of parsing and resolving all textarea segments eagerly on every keystroke.
* Rewired the upload execution block to use the safe non-blocking FIFO loop instead of executing uncoordinated uploads immediately.
* Integrated detailed performance duration tracking for parsing and resolving actions within the `DEBUG_MODE=true` metrics boundaries.
