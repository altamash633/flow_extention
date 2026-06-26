# DEAD CODE REPORT

This report classifies all JavaScript files in the workspace and evaluates the non-production files for archiving, deletion, or reorganization under `/debug` or `/tools`.

## Classifications

### 1. Production Runtime
* `service-worker-loader.js`
* `assets/catchUploadFile.ts-DJwIizxX.js`
* `assets/index.html-B3dstwmb.js`
* `assets/index.ts-CjccIiMW.js`
* `assets/index.ts-DoSGWp_j.js`
* `assets/jszip.min.js`
* `assets/remoteConfig-CbIdrXch.js`
* `assets/smart_assets.js`

### 2. Development Only
* None

### 3. Debug Only
* `assets/debug_api.js` (Unused at runtime)
* `assets/debug_runtime.js` (Unused at runtime)
* `assets/live_metrics.js` (Unused at runtime)
* `assets/runtime_validator.js` (Unused at runtime)

### 4. Test Only
* `test_runtime.js`
* `mock_run.js`
* `mock_run2.js`
* `mock_run3.js`

### 5. Backup
* `assets/smart_assets.backup.js`
* `assets/smart_assets.backup_debug.js`
* `assets/smart_assets.backup_ph1.js`
* `checkpoints/phase0/smart_assets.js`
* `checkpoints/phase1/smart_assets.js`
* `checkpoints/phase1_1/debug_api.js`
* `checkpoints/phase1_1/live_metrics.js`
* `checkpoints/phase1_1/runtime_validator.js`
* `checkpoints/phase1_1/smart_assets.js`

### 6. Generated
* None

### 7. Legacy
* `add_logs.js`
* `fix_syntax.js`
* `patch.js`
* `patch2.js`
* `patch4.js`
* `patch_add_logs.js`
* `patch_bible.js`
* `patch_bible2.js`
* `patch_bible3.js`
* `patch_final.js`
* `patch_final2.js`
* `patch_final3.js`
* `patch_flow.js`
* `patch_logger.js`
* `patch_observer.js`
* `patch_prompt_engine.js`
* `patch_prompt_engine2.js`
* `patch_prompt_engine3.js`
* `patch_sa.js`
* `patch_ui.js`
* `patch_zip_pipeline.js`
* `search.js`

### 8. Dead / Unused
* `assets/debug_api.js`
* `assets/debug_runtime.js`
* `assets/live_metrics.js`
* `assets/runtime_validator.js`

---

## Non-Production Files Evaluation

### Debug Modules (`assets/debug_api.js`, `assets/live_metrics.js`, `assets/runtime_validator.js`, `assets/debug_runtime.js`)
* **Why it exists**: Created in previous phases to modularize and support `DEBUG_MODE` diagnostics, validation, and dashboard metrics.
* **Who references it**: Only `.agents/AGENTS.md`, documentation, and phase plans. No executable code imports or loads them.
* **Can this be archived**: Yes.
* **Whether it should be deleted**: No (they contain valuable diagnostic patterns for debugging sessions).
* **Target location**: `/debug` (e.g., `debug/debug_api.js`, etc.) to keep the `assets/` directory clean.

### Test Harnesses (`test_runtime.js`, `mock_run.js`, `mock_run2.js`, `mock_run3.js`)
* **Why it exists**: Mocking, parsing, and execution validation.
* **Who references it**: User command line or local test executions.
* **Can this be archived**: Yes.
* **Whether it should be deleted**: No, they serve as the local regression safety suite.
* **Target location**: `/tools` or `/tests` directory.

### Legacy Patch Scripts (All `patch*.js`, `add_logs.js`, `fix_syntax.js`, `search.js`)
* **Why it exists**: Ad-hoc node scripts used during earlier phases to inject logic, patch patterns, and fix syntax in `smart_assets.js`.
* **Who references it**: None. One-off executions.
* **Can this be archived**: Yes, completely.
* **Whether it should be deleted**: Yes, they are redundant history since all changes are preserved in Git or phase checkpoints.
* **Target location**: Archivable to a `legacy/` or `tools/patches/` subfolder if deletion is not desired, but they are safe to delete.

### Root-level and Asset Backups (`assets/smart_assets.backup*`)
* **Why it exists**: Safety snapshots created before major code updates.
* **Who references it**: None.
* **Can this be archived**: Yes.
* **Whether it should be deleted**: Yes, because formal checkpoints exist under `checkpoints/`.
* **Target location**: Safe to delete.
