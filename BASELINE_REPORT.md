# BASELINE REPORT

## Git Status
Not a Git repository. Snapshot represents the current local file system state.

## Production File List
* `service-worker-loader.js`
* `assets/catchUploadFile.ts-DJwIizxX.js`
* `assets/index.html-B3dstwmb.js`
* `assets/index.ts-CjccIiMW.js`
* `assets/index.ts-DoSGWp_j.js`
* `assets/jszip.min.js`
* `assets/remoteConfig-CbIdrXch.js`
* `assets/smart_assets.js`

## Validation Target List
Matches the Production File List exactly (as defined in `VALIDATION_TARGETS.md`).

## Active Checkpoints
* `checkpoints/phase0/`
* `checkpoints/phase1/`
* `checkpoints/phase1_1/`

## Rollback Commands
To rollback to Phase 1.1:
```powershell
Copy-Item -Path "checkpoints/phase1_1/smart_assets.js" -Destination "assets/smart_assets.js" -Force
# Plus any other files defined in the phase1_1 CHECKPOINT_MANIFEST.md
```

## DEBUG_MODE Status
`false` (Verified baseline state)

## Production Hashes (SHA-256)
* `service-worker-loader.js`: `158E32377DBC08AB7905E9408E97E8A03D6DF24CAC798EC02096115F44C859ED`
* `assets/catchUploadFile.ts-DJwIizxX.js`: `508BD40666F2E5C83FD82BA5BBEC774175188F5E6BDEF2B73308B82E105396B7`
* `assets/index.html-B3dstwmb.js`: `E0C8F6F95B2232C601073947C03817D1ECA70E011A4499F92F2D3B0B70F67AE9`
* `assets/index.ts-CjccIiMW.js`: `40C6A23772244D8DAF852DF445F48143BD5088E159B326A84DE28BE10C82A58F`
* `assets/index.ts-DoSGWp_j.js`: `CDC1597EE9783FB31DF9A406F9F171F33751D3EEEA21597024D06F49F2C96E4F`
* `assets/jszip.min.js`: `ACC7E41455A80765B5FD9C7EE1B8078A6D160BBBCA455AEAE854DE65C947D59E`
* `assets/remoteConfig-CbIdrXch.js`: `4297016A862BFA22C1B437319951A6B56AA71166EE3D85972B8BEBFC39327F4E`
* `assets/smart_assets.js`: `B55291A79EC0C1B7EF8DE6E65C3D5715C4A6C442E00719D80E656D20613D71A5`

## Extension Metadata
* **Extension Version**: 2.0.0
* **Manifest Version**: 3
* **Current Phase**: Phase 1.1

## Phase 2 Target Summary
Preparing for Phase 2 functional implementation over the verified Phase 1.1 baseline.
