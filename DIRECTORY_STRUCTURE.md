# DIRECTORY STRUCTURE

```
clean_extension/
├── .agents/
│   ├── skills/
│   └── AGENTS.md
├── assets/                  # Production build assets
│   ├── catchUploadFile.ts-DJwIizxX.js
│   ├── index.html-B3dstwmb.js
│   ├── index.ts-CjccIiMW.js
│   ├── index.ts-DoSGWp_j.js
│   ├── jszip.min.js
│   ├── remoteConfig-CbIdrXch.js
│   └── smart_assets.js
├── checkpoints/             # Safety rollback checkpoints
│   ├── phase0/
│   ├── phase1/
│   ├── phase1_1/
│   └── repository_cleanup/
├── debug/                   # Standalone diagnostic tools (not loaded in prod)
│   ├── debug_api.js
│   ├── debug_runtime.js
│   ├── live_metrics.js
│   └── runtime_validator.js
├── logo/
├── logo.png
├── manifest.json            # Extension manifest (unchanged)
├── package.json
├── package-lock.json
├── service-worker-loader.js # Background worker entry point (unchanged)
├── src/                     # Source TypeScript and UI files
│   ├── assets/
│   └── ui/
├── tests/                   # Mock execution and runtime test harnesses
│   ├── mock_run.js
│   ├── mock_run2.js
│   ├── mock_run3.js
│   └── test_runtime.js
└── tools/
    └── patches/             # Legacy patch scripts (archived)
```
