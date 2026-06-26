# CHANGELOG

## [Repository Cleanup Phase] - 2026-06-26

### Added
* `debug/` directory to isolate diagnostic tools.
* `tests/` directory to isolate test harnesses.
* `tools/patches/` directory to archive historical patch files.
* `DIRECTORY_STRUCTURE.md` documenting the cleaned workspace tree.

### Changed
* Relocated `debug_api.js`, `debug_runtime.js`, `live_metrics.js`, and `runtime_validator.js` from `assets/` to `debug/`.
* Relocated `test_runtime.js`, `mock_run.js`, `mock_run2.js`, and `mock_run3.js` from root to `tests/`.
* Relocated 22 historical patch/utility scripts from root to `tools/patches/`.
* Updated `FILE_CLASSIFICATION.md` and `VALIDATION_TARGETS.md`.

### Removed
* Legacy backup files `assets/smart_assets.backup.js`, `assets/smart_assets.backup_debug.js`, and `assets/smart_assets.backup_ph1.js` (equivalent versions remain in formal checkpoints).
