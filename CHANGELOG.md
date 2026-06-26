# Changelog

## [1.0.1] - 2026-06-21

### Added
- **Event-driven upload sync**: Generation now triggers dynamically using `MutationObserver` by actively reading Vue reactivity, eliminating arbitrary 500ms timeouts and race conditions.
- **Variant warning UI**: Missing requested variants (e.g. `@Character:typo`) now render an inline yellow warning box detailing the fallback image selected instead of silently passing.
- **Asset validation**: Importing `Assets.zip` now strictly evaluates the structure and prints an inline summary describing duplicates, empty folders, and missing primary variants.
- **Performance profiling**: Added comprehensive `performance.now()` analytics measuring ZIP ingestion, index building, string parsing, object resolution, and pipeline injection logic.

### Changed
- Converted noisy developer logs into production-safe output hidden behind a strict `window.saDebugMode` configuration boolean. 
- Disabled debug-mode by default.

### Fixed
- Fixed race conditions across slower hardware architectures during DOM payload handoffs by relying on direct container mutations.
