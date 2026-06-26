# PROJECT EXECUTION POLICY (MANDATORY)

## PRE-PHASE GATE

Before ANY code modification:

1. Run:
   * `node --check`
   * Existing test suite (if available)
   * Extension reload
   * Browser console verification

2. Verify:
   * No console errors
   * Rollback checkpoint exists
   * `CHECKPOINT_MANIFEST.md` updated
   * `DEBUG_MODE=false`
   * Zero runtime overhead
   * Parser unchanged
   * Upload pipeline unchanged
   * Autocomplete unchanged

3. Execute project skills:
   * `code-reviewer`
   * `code-testing-extensions`
   * `chrome-devtools` (when remote debugging is available)

4. Generate:
   * `PRE_PHASE_REPORT.md`

If ANY validation fails:
* STOP immediately.
* Do NOT modify project files.
* Do NOT auto-fix.
* Explain the failure.
* Wait for explicit user approval.

---

## POST-PHASE GATE

After completing a phase:

1. `node --check`
2. Runtime verification
3. Extension reload
4. No console errors
5. Generate:
   * `CHANGELOG.md`
   * `AUDIT.md`
   * `RUNTIME_REPORT.md`
6. Create checkpoint:
   ```
   checkpoints/
   phaseX/
   ├── smart_assets.js
   ├── CHANGELOG.md
   ├── AUDIT.md
   ├── RUNTIME_REPORT.md
   └── CHECKPOINT_MANIFEST.md
   ```

Never overwrite previous checkpoints.
Rollback must always be possible in under 30 seconds.

---

## SAFE MODE

The following components MUST NOT be modified unless the current phase explicitly requires it:
* Parser
* Upload Pipeline
* Prompt Resolver
* Autocomplete
* Asset Index

Debug functionality must only execute when:
`window.DEBUG_MODE === true`

When `DEBUG_MODE` is false:
* No `setInterval`
* No `setTimeout`
* No `requestAnimationFrame`
* No `MutationObserver`
* No Proxy wrapping
* No `Object.defineProperty` interception
* No `EventTarget` monkey patching
* No background timers
* No hidden listeners

Zero runtime overhead is mandatory.

---

## PHASE POLICY

Never automatically continue to the next phase.

At the end of every phase:
STOP.
Wait for explicit approval from the user.
