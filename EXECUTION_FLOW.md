# EXECUTION FLOW

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant UI as Side Panel UI (smart_assets.js)
    participant AC as Autocomplete Dropdown
    participant Res as Asset Resolver
    participant QH as Upload Queue / Handler
    participant VM as Vue Model (Host Page)
    participant GF as Google Flow

    User->>UI: Types prompt in TEXTAREA (e.g., "@character:variant")
    rect rgba(0, 0, 255, 0.05)
        note right of UI: Keyup Handler / Autocomplete Scan
        UI->>AC: Check caret and prefix; render matches
        User->>AC: Select asset match (Arrow/Tab/Enter)
        AC-->>UI: Insert resolved token
    end

    rect rgba(0, 255, 0, 0.05)
        note right of UI: Prompt Parsing & Resolution
        UI->>UI: Split text into prompts by double newline
        UI->>Res: Match prompt tags against window.smartAssetIndex
        Res-->>UI: Populate prompt object (files, characters, backgrounds, props)
    end

    rect rgba(255, 165, 0, 0.05)
        note right of UI: Upload Pipeline Execution
        UI->>QH: Push to window.__saPromptQueue
        UI->>QH: Trigger window.__saUploadHandler
        QH->>VM: Apply fileObjects to Host Input Element
        VM->>GF: Update reactive state & start Google Flow upload
    end
```

## Detailed Execution Milestones
1. **Extension Initialization**: Browser loads `manifest.json`, starts the background service worker loader, and opens the side panel HTML rendering Vue UI.
2. **Textarea Interaction**: Keyup events trigger simultaneous autocomplete checks and full-text split arrays.
3. **Regex Ingestion**: The parser processes prompts looking for `@name:variant` syntax, querying `window.smartAssetIndex`.
4. **Queue Enqueue**: Resolved descriptors are pushed to `window.__saResolvedAssets` and raw texts added to `window.__saPromptQueue`.
5. **DOM Bridge**: Injected wrappers intercept file inputs and proxy file handles directly to target elements, executing the host application's native upload handlers.
