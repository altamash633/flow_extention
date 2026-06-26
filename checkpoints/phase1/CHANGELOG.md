# CHANGELOG - Phase 1

## [Phase 1] - Stabilization

### Added
- Created `DebugStore` class to handle application state with bounded memory (maxHistory = 100).
- Created `uploadHistoryProxy` to intercept `window.__saUploadHistory.push()` calls and seamlessly enforce size limits for backward compatibility.
- Implemented `debounce` utility function to delay execution of heavy parsing by 300ms.
- Introduced `attachTextareaListeners()` to explicitly bind `keydown` and `keyup` events directly to `<textarea>` elements, avoiding document-level event propagation.
- Created interval polling mechanism that applies `attachTextareaListeners` to unattached TextAreas automatically.

### Changed
- Replaced direct instantiation of global arrays (`__saPromptQueue`, `__saResolvedAssets`, `__saUploadHistory`, `__saAttachedCharacters`) with dynamically proxied getters and setters linked to `window.__saDebug`.
- Split legacy `keyup` event into two handlers: `handleKeyupImmediate` for responsive Autocomplete behavior and `handleKeyupDebounced` for non-blocking Asset parsing/upload loops.

### Removed
- Removed global `document.addEventListener('keydown', ...)` listener.
- Removed global `document.addEventListener('keyup', ...)` listener.
