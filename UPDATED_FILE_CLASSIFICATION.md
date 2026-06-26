# UPDATED FILE CLASSIFICATION

This document provides the post-cleanup classification of all JavaScript files in the workspace.

## 1. Production Runtime
These files are executed by the extension in production:
* `service-worker-loader.js` (Root)
* `assets/catchUploadFile.ts-DJwIizxX.js`
* `assets/index.html-B3dstwmb.js`
* `assets/index.ts-CjccIiMW.js`
* `assets/index.ts-DoSGWp_j.js`
* `assets/jszip.min.js`
* `assets/remoteConfig-CbIdrXch.js`
* `assets/smart_assets.js`

## 2. Development Only
* None

## 3. Debug Only
Diagnostic modules relocated to the `/debug` directory:
* `debug/debug_api.js`
* `debug/debug_runtime.js`
* `debug/live_metrics.js`
* `debug/runtime_validator.js`

## 4. Test Only
Mock frameworks and test runners relocated to `/tests`:
* `tests/test_runtime.js`
* `tests/mock_run.js`
* `tests/mock_run2.js`
* `tests/mock_run3.js`

## 5. Backup
Rollback checkpoints stored under `/checkpoints`:
* `checkpoints/phase0/smart_assets.js`
* `checkpoints/phase1/smart_assets.js`
* `checkpoints/phase1_1/debug_api.js`
* `checkpoints/phase1_1/live_metrics.js`
* `checkpoints/phase1_1/runtime_validator.js`
* `checkpoints/phase1_1/smart_assets.js`

## 6. Generated
* None

## 7. Legacy
One-off development/patching scripts archived to `tools/patches/`:
* `tools/patches/add_logs.js`
* `tools/patches/fix_syntax.js`
* `tools/patches/search.js`
* `tools/patches/patch.js`
* `tools/patches/patch2.js`
* `tools/patches/patch4.js`
* `tools/patches/patch_add_logs.js`
* `tools/patches/patch_bible.js`
* `tools/patches/patch_bible2.js`
* `tools/patches/patch_bible3.js`
* `tools/patches/patch_final.js`
* `tools/patches/patch_final2.js`
* `tools/patches/patch_final3.js`
* `tools/patches/patch_flow.js`
* `tools/patches/patch_logger.js`
* `tools/patches/patch_observer.js`
* `tools/patches/patch_prompt_engine.js`
* `tools/patches/patch_prompt_engine2.js`
* `tools/patches/patch_prompt_engine3.js`
* `tools/patches/patch_sa.js`
* `tools/patches/patch_ui.js`
* `tools/patches/patch_zip_pipeline.js`
