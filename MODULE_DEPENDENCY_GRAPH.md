# MODULE DEPENDENCY GRAPH

```
                  [ manifest.json ]
                         |
         +---------------+---------------+
         |                               |
[ service-worker-loader.js ]     [ src/ui/side-panel/index.html ]
                                         |
                       +-----------------+-----------------+
                       |                                   |
              [ assets/jszip.min.js ]           [ assets/smart_assets.js ]
                                                           |
                                                (window.smartAssetIndex)
                                                           |
                                                (window.__saUploadHandler)
                                                           |
                                                [ assets/catchUploadFile.ts... ]
```

## Relationship Details
* **Static Imports & Includes**:
  * `index.html` statically script-includes `assets/jszip.min.js` and `assets/smart_assets.js`.
  * `service-worker-loader.js` is independent, registering background extension boundaries.
* **Shared State Integration**:
  * `assets/smart_assets.js` reads `window.smartAssetIndex` to resolve query tokens.
  * `assets/smart_assets.js` references and overwrites `window.__saUploadHandler` to proxy resolved files to the host upload system.
* **Chrome Messaging**:
  * The production build utilizes minimal extension message passing; the primary data flow is executed directly in the shared DOM/window context of the side panel.
