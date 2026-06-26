# SMART ASSET ENGINE REPORT

## Engine Implementation

### 1. ZIP Loading & Extraction
* **Mechanism**: Handled via `JSZip` library. Side Panel imports `jszip.min.js`.
* **Flow**: User-provided ZIP archives are unzipped, mapping files to virtual paths. The asset index structure is updated dynamically in memory.

### 2. Asset Indexing
* **Structure**: `window.smartAssetIndex` classifies assets into:
  * `characters`: Maps names to variant-key/file-descriptor pairs.
  * `backgrounds`: Maps names directly to background file descriptors.
  * `props`: Maps names directly to prop file descriptors.
* **Access**: Case-insensitive queries that strip file extensions for robust matching.

### 3. Parsing & Tag Resolution
* **Grammar**: Matches tokens starting with `@` followed by alphanumeric characters, optional colons, and variant tags:
  ```javascript
  /@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\s|$)/g
  ```
* **Resolution Pipeline**:
  1. The regex extracts the name and variant.
  2. The name is matched against characters, backgrounds, and props.
  3. If a character variant matches (e.g., `fullbody`), the specific variant file is chosen. If no variant matches, the first available variant is selected.
  4. Resolved details (`files`, `fileObjects`) are stored in the prompt object.

### 4. Upload Orchestration
* **Mechanism**: Iterates over `window.__saResolvedAssets`.
* **Execution**: For every prompt object containing files, `window.__saUploadHandler` is invoked asynchronously:
  ```javascript
  await window.__saUploadHandler({ target: { files: pObj.fileObjects }, ... });
  ```
* **Issues**: Currently executed eagerly on keyup without debounce or queue synchronization.
