// ==========================================
// PHASE 0: RUNTIME INSTRUMENTATION V2 (DEBUG ONLY)
// ==========================================

window.__SA_FLAGS = {
    enablePromptResolver: false,
    enableUploadQueue: false,
    enableAutocompleteV2: false,
    enableDevPanelV2: false
};

window.__saMetrics = {
    parseTime: 0,
    resolveTime: 0,
    uploadTime: 0,
    renderTime: 0,
    listenerCount: 0,
    queueLength: 0,
    queueWaitTime: 0
};

// Diagnostics, validations, wrappers and dashboards are bound strictly to DEBUG_MODE (Goal 4 & Safe Mode)
if (window.DEBUG_MODE === true) {
    // 1. Memory Monitor
    setInterval(() => {
        if (performance && performance.memory) {
            window.__saMetrics.memoryUsed = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB';
        }
    }, 1000);

    // 2. Duplicate Listener Detector
    const _originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (['keyup', 'keydown', 'input', 'change'].includes(type)) {
            window.__saMetrics.listenerCount++;
            if (this.tagName === 'TEXTAREA' && this._registeredListeners && this._registeredListeners[type]) {
                console.warn(`[RUNTIME VALIDATION FAILED] Duplicate listener detected for ${type} on Textarea!`);
            }
            if (this.tagName === 'TEXTAREA') {
                this._registeredListeners = this._registeredListeners || {};
                this._registeredListeners[type] = true;
            }
        }
        return _originalAddEventListener.apply(this, arguments);
    };

    // 3. __saUploadHandler Tracer (Proxies timing metadata directly to diagnostics)
    let _originalUploadHandler = null;
    Object.defineProperty(window, '__saUploadHandler', {
        get() {
            return async function(eventArgs) {
                if (!_originalUploadHandler) {
                    console.warn("[RUNTIME VALIDATION FAILED] __saUploadHandler called but original is null");
                    return;
                }
                
                const startTime = performance.now();
                const timestamp = new Date().toISOString();
                const files = eventArgs?.target?.files || [];
                const filesList = Array.from(files).map(f => f.name).join(', ');
                
                if (files.length === 0) {
                    console.warn("[RUNTIME VALIDATION FAILED] Empty upload detected");
                }
                
                let promptIndex = "Unknown";
                if (window.__saResolvedAssets && window.__saResolvedAssets.length > 0) {
                    const match = window.__saResolvedAssets.find(p => p.fileObjects && p.fileObjects.some(f => filesList.includes(f.name)));
                    if (match) promptIndex = match.promptIndex;
                }

                console.log("----------------------------------");
                console.log("UPLOAD START");
                console.log(`Timestamp: ${timestamp}`);
                console.log(`Prompt Index: ${promptIndex}`);
                console.log(`Files: ${filesList}`);
                console.log(`ModelValue Before: ${window.__saUploadHistory ? window.__saUploadHistory.length : 0}`);
                
                let result;
                try {
                    result = await _originalUploadHandler.apply(this, arguments);
                } catch(e) {
                    console.error("Upload Failed", e);
                }
                
                const duration = performance.now() - startTime;
                window.__saMetrics.uploadTime = duration.toFixed(2);
                
                console.log(`ModelValue After: ${window.__saUploadHistory ? window.__saUploadHistory.length : 0}`);
                console.log(`Duration: ${duration.toFixed(2)} ms`);
                console.log("UPLOAD END");
                console.log("----------------------------------");
                
                return result;
            };
        },
        set(val) {
            if (typeof val === 'function') {
                _originalUploadHandler = val;
            }
        },
        configurable: true
    });

    // 4. Runtime Validator (Continuous integrity check)
    setInterval(() => {
        let failed = false;
        let reason = "";
        if (window.__saResolvedAssets) {
            window.__saResolvedAssets.forEach(p => {
                if (p.files && p.files.includes(undefined)) {
                    failed = true; reason = "Undefined assets found in prompt";
                }
                if (p.files && new Set(p.files).size !== p.files.length) {
                    failed = true; reason = "Duplicate files found in prompt resolve";
                }
            });
        }
        if (failed) {
            console.warn(`[RUNTIME VALIDATION FAILED] ${reason}`);
        }
    }, 2000);

    // 5. Live Metrics Dashboard UI Panel
    const saMetricsPanel = document.createElement('div');
    saMetricsPanel.id = "sa-metrics-panel";
    saMetricsPanel.style.position = "fixed";
    saMetricsPanel.style.top = "20px";
    saMetricsPanel.style.right = "20px";
    saMetricsPanel.style.backgroundColor = "rgba(0,0,255,0.8)";
    saMetricsPanel.style.color = "white";
    saMetricsPanel.style.padding = "10px";
    saMetricsPanel.style.zIndex = "999999";
    saMetricsPanel.style.pointerEvents = "none";
    document.body.appendChild(saMetricsPanel);

    setInterval(() => {
        if (window.__saUploadQueue) {
            window.__saMetrics.queueLength = window.__saUploadQueue.length;
        }
        saMetricsPanel.innerHTML = `
            <b>LIVE METRICS</b><br>
            Parse: ${window.__saMetrics.parseTime}ms<br>
            Resolve: ${window.__saMetrics.resolveTime}ms<br>
            Upload: ${window.__saMetrics.uploadTime}ms<br>
            Queue Wait: ${window.__saMetrics.queueWaitTime || 0}ms<br>
            Queue Length: ${window.__saMetrics.queueLength}<br>
            Listeners: ${window.__saMetrics.listenerCount}<br>
            Memory: ${window.__saMetrics.memoryUsed || 'N/A'}
        `;
    }, 1000);
}

// ==========================================
// PHASE 4: PER-PROMPT ASSET RESOLVER (REAL BROWSER RUNTIME)
// ==========================================

window.__saPromptQueue = window.__saPromptQueue || [];
window.__saResolvedAssets = window.__saResolvedAssets || [];
window.__saUploadHistory = window.__saUploadHistory || [];
window.__saLastUpload = null;
window.__saAttachedCharacters = window.__saAttachedCharacters || new Set();

// Developer Panel Setup
const devPanel = document.createElement('div');
devPanel.id = "sa-dev-panel";
devPanel.style.position = "fixed";
devPanel.style.bottom = "20px";
devPanel.style.right = "20px";
devPanel.style.width = "300px";
devPanel.style.backgroundColor = "rgba(0,0,0,0.9)";
devPanel.style.color = "#0f0";
devPanel.style.fontFamily = "monospace";
devPanel.style.fontSize = "12px";
devPanel.style.padding = "10px";
devPanel.style.borderRadius = "8px";
devPanel.style.zIndex = "999999";
devPanel.style.pointerEvents = "none";
devPanel.style.maxHeight = "400px";
devPanel.style.overflowY = "auto";
devPanel.innerHTML = "<b>Prompt Queue</b><hr style='border-color:#333'/><div id='sa-dev-content'>Waiting...</div>";
document.body.appendChild(devPanel);

// Autocomplete Setup
const acDropdown = document.createElement('div');
acDropdown.id = "sa-autocomplete";
acDropdown.style.position = "absolute";
acDropdown.style.backgroundColor = "#fff";
acDropdown.style.border = "1px solid #ccc";
acDropdown.style.borderRadius = "6px";
acDropdown.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
acDropdown.style.zIndex = "99999";
acDropdown.style.display = "none";
acDropdown.style.maxHeight = "300px";
acDropdown.style.overflowY = "auto";
acDropdown.style.width = "200px";
document.body.appendChild(acDropdown);

let acState = { active: false, textarea: null, items: [], selectedIndex: 0, prefix: '' };

function getCaretCoordinates(element, position) {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX };
}

function renderAutocomplete() {
    if (!acState.active || acState.items.length === 0) {
        acDropdown.style.display = 'none';
        return;
    }
    let html = '';
    let currentCategory = '';
    acState.items.forEach((item, idx) => {
        if (item.category !== currentCategory) {
            html += `<div style="padding:4px 8px; font-weight:bold; font-size:11px; background:#f0f0f0; color:#555;">${item.category}</div>`;
            currentCategory = item.category;
        }
        const bg = idx === acState.selectedIndex ? '#e6f2ff' : '#fff';
        html += `<div style="padding:6px 8px; cursor:pointer; font-size:13px; background:${bg}; border-bottom:1px solid #f0f0f0;">
            ${item.icon} ${item.label}
        </div>`;
    });
    acDropdown.innerHTML = html;
    acDropdown.style.display = 'block';
    const coords = getCaretCoordinates(acState.textarea, acState.textarea.selectionStart);
    acDropdown.style.top = coords.top + 'px';
    acDropdown.style.left = coords.left + 'px';
}

function closeAutocomplete() {
    acState.active = false;
    acDropdown.style.display = 'none';
}

function insertText(text) {
    if (!acState.textarea) return;
    acState.textarea.focus();
    const val = acState.textarea.value;
    const start = acState.textarea.selectionStart;
    const atIndex = val.substring(0, start).lastIndexOf('@');
    if (atIndex !== -1) {
        acState.textarea.setSelectionRange(atIndex, start);
        document.execCommand('insertText', false, text + ' ');
    }
    closeAutocomplete();
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    if (acState.active) {
        if (e.key === 'ArrowDown') { e.preventDefault(); acState.selectedIndex = (acState.selectedIndex + 1) % acState.items.length; renderAutocomplete(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); acState.selectedIndex = (acState.selectedIndex - 1 + acState.items.length) % acState.items.length; renderAutocomplete(); }
        else if (e.key === 'Enter') { e.preventDefault(); const item = acState.items[acState.selectedIndex]; if (item) insertText('@' + item.value); }
        else if (e.key === 'Tab') { e.preventDefault(); const item = acState.items[acState.selectedIndex]; if (item) insertText('@' + item.value + (item.hasVariants ? ':fullbody' : '')); }
        else if (e.key === 'Escape') { closeAutocomplete(); }
    }
}, true);

let lastText = "";
let debounceTimeout = null;

document.addEventListener('keyup', (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key) && acState.active) return;
    
    const fullText = e.target.value;
    
    // Autocomplete dropdown UI processing (executed immediately for responsive UX)
    const index = window.smartAssetIndex || { characters: {}, backgrounds: {}, props: {} };
    const currentWord = fullText.substring(0, e.target.selectionStart).split(/\s+/).pop();
    if (currentWord.startsWith('@')) {
        acState.active = true;
        acState.textarea = e.target;
        acState.prefix = currentWord.substring(1).toLowerCase();
        let items = [];
        if (index.characters) Object.keys(index.characters).forEach(k => { if (k.toLowerCase().includes(acState.prefix)) items.push({ category: 'Characters', icon: '🧑', label: k, value: k, hasVariants: Object.keys(index.characters[k]).length > 1 }); });
        if (index.backgrounds) Object.keys(index.backgrounds).forEach(k => { if (k.toLowerCase().includes(acState.prefix)) items.push({ category: 'Backgrounds', icon: '🌄', label: k, value: k }); });
        if (index.props) Object.keys(index.props).forEach(k => { if (k.toLowerCase().includes(acState.prefix)) items.push({ category: 'Props', icon: '🗡', label: k, value: k }); });
        acState.items = items; acState.selectedIndex = 0; renderAutocomplete();
    } else { closeAutocomplete(); }

    // Execution pipeline: Debounced in DEBUG_MODE; immediate in production (DEBUG_MODE=false)
    if (window.DEBUG_MODE === true) {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            executePipeline(e, fullText, index);
        }, 300);
    } else {
        // Immediate execution on text change (0 background-timer overhead)
        if (fullText !== lastText) {
            lastText = fullText;
            executePipeline(e, fullText, index);
        }
    }
});

// Prompt cache to hold resolved states and upload statuses (Goal 2: Resolve assets exactly once)
// Key: prompt text. Value: { resolved: promptObject, uploaded: boolean, uploading: boolean }
window.__saPromptCache = window.__saPromptCache || new Map();
window.__saUploadQueue = window.__saUploadQueue || [];
let isProcessingQueue = false;

async function executePipeline(e, fullText, index) {
    const parseStart = window.DEBUG_MODE === true ? performance.now() : 0;
    const prompts = fullText.split(/\n\s*\n/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Create a set of current prompts to clean up the cache (Goal 5: Bounded active memory)
    const currentPrompts = new Set(prompts);
    for (const cachedPrompt of window.__saPromptCache.keys()) {
        if (!currentPrompts.has(cachedPrompt)) {
            window.__saPromptCache.delete(cachedPrompt);
        }
    }

    // Goal 5: Synchronize prompt queue state with current textarea prompts
    window.__saPromptQueue = prompts;

    let resolveDuration = 0;
    
    // Parse and Resolve Phase
    for (let pIdx = 0; pIdx < prompts.length; pIdx++) {
        const pNum = pIdx + 1;
        const pText = prompts[pIdx];
        
        // Goal 2: Every prompt resolves assets exactly once. Reuse cache if present.
        if (window.__saPromptCache.has(pText)) {
            const cacheEntry = window.__saPromptCache.get(pText);
            // Update the index number dynamically since order of prompts in textarea might shift
            cacheEntry.resolved.promptIndex = pNum;
            continue;
        }

        const resolveStart = window.DEBUG_MODE === true ? performance.now() : 0;
        
        const promptObject = {
            promptIndex: pNum,
            promptText: pText,
            characters: [],
            backgrounds: [],
            props: [],
            files: [],
            fileObjects: []
        };
        
        const matches = pText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\s|$)/g) || [];
        matches.forEach(match => {
            const parts = match.substring(1).split(':');
            const queryName = parts[0].toLowerCase();
            let queryVariant = parts[1] ? parts[1].toLowerCase() : null;
            let selectedFile = null, matchedType = null, matchedLabel = null;
            
            for (const [key, variants] of Object.entries(index.characters || {})) {
                if (key.toLowerCase() === queryName || key.replace(/\.[^/.]+$/, "").toLowerCase() === queryName) {
                    if (queryVariant && variants[queryVariant]) selectedFile = variants[queryVariant];
                    else selectedFile = Object.values(variants)[0];
                    if (selectedFile) { matchedType = 'characters'; matchedLabel = key; }
                    break;
                }
            }
            if (!selectedFile) {
                for (const [key, file] of Object.entries(index.backgrounds || {})) {
                    if (key.toLowerCase() === queryName || key.replace(/\.[^/.]+$/, "").toLowerCase() === queryName) {
                        selectedFile = file; matchedType = 'backgrounds'; matchedLabel = key; break;
                    }
                }
            }
            if (!selectedFile) {
                for (const [key, file] of Object.entries(index.props || {})) {
                    if (key.toLowerCase() === queryName || key.replace(/\.[^/.]+$/, "").toLowerCase() === queryName) {
                        selectedFile = file; matchedType = 'props'; matchedLabel = key; break;
                    }
                }
            }
            if (selectedFile) {
                promptObject[matchedType].push(matchedLabel);
                promptObject.files.push(selectedFile.name);
                promptObject.fileObjects.push(selectedFile);
                window.__saAttachedCharacters.add(selectedFile.name);
            }
        });
        
        if (window.DEBUG_MODE === true) {
            resolveDuration += (performance.now() - resolveStart);
        }

        // Cache the newly resolved prompt (Goal 2: Immutable after completion)
        window.__saPromptCache.set(pText, {
            resolved: promptObject,
            uploaded: false,
            uploading: false
        });
    }
    
    // Sync resolved assets array (for legacy diagnostics)
    window.__saResolvedAssets = [];
    let devHtml = '';
    for (let pIdx = 0; pIdx < prompts.length; pIdx++) {
        const pText = prompts[pIdx];
        const cacheEntry = window.__saPromptCache.get(pText);
        if (cacheEntry) {
            window.__saResolvedAssets.push(cacheEntry.resolved);
            
            devHtml += `<div style="margin-bottom:12px;">`;
            devHtml += `<div style="color:#fff;font-weight:bold;">Prompt ${cacheEntry.resolved.promptIndex}</div>`;
            const allMatched = [...cacheEntry.resolved.characters, ...cacheEntry.resolved.backgrounds, ...cacheEntry.resolved.props];
            if (allMatched.length > 0) {
                allMatched.forEach(m => { devHtml += `<div style="color:#28a745">✓ ${m}</div>`; });
            } else {
                devHtml += `<div style="color:#999">No assets</div>`;
            }
            devHtml += `</div>`;
        }
    }

    if (window.DEBUG_MODE === true && window.__saMetrics) {
        window.__saMetrics.parseTime = (performance.now() - parseStart).toFixed(2);
        window.__saMetrics.resolveTime = resolveDuration.toFixed(2);
    }
    
    const devContent = document.getElementById('sa-dev-content');
    if (devContent) {
        devContent.innerHTML = devHtml;
    }

    // Goal 1: Populate structured FIFO upload queue. Avoid duplicates or re-enqueueing.
    for (let pIdx = 0; pIdx < prompts.length; pIdx++) {
        const pText = prompts[pIdx];
        const cacheEntry = window.__saPromptCache.get(pText);
        if (cacheEntry && cacheEntry.resolved.fileObjects.length > 0) {
            if (!cacheEntry.uploaded && !cacheEntry.uploading) {
                const alreadyQueued = window.__saUploadQueue.some(job => job.promptText === pText);
                if (!alreadyQueued) {
                    cacheEntry.uploading = true;
                    // Goal 4: Track queue wait duration in DEBUG_MODE
                    const queueJob = {
                        promptText: pText,
                        promptIndex: cacheEntry.resolved.promptIndex,
                        fileObjects: cacheEntry.resolved.fileObjects,
                        files: cacheEntry.resolved.files,
                        characters: cacheEntry.resolved.characters,
                        backgrounds: cacheEntry.resolved.backgrounds,
                        props: cacheEntry.resolved.props,
                        enqueuedAt: window.DEBUG_MODE === true ? performance.now() : 0
                    };
                    window.__saUploadQueue.push(queueJob);
                }
            }
        }
    }

    // Start consuming the queue asynchronously in a safe FIFO loop
    processUploadQueue();
}

async function processUploadQueue() {
    if (isProcessingQueue) return;
    isProcessingQueue = true;

    while (window.__saUploadQueue.length > 0) {
        const job = window.__saUploadQueue[0]; // Peek at FIFO head
        const cacheEntry = window.__saPromptCache.get(job.promptText);

        // If the prompt was deleted from the active cache during typing, discard the job
        if (!cacheEntry) {
            window.__saUploadQueue.shift();
            continue;
        }

        if (!cacheEntry.uploaded) {
            if (typeof window.__saUploadHandler === 'function') {
                const uploadStart = window.DEBUG_MODE === true ? performance.now() : 0;
                
                try {
                    // Goal 4: Measure queue wait time in DEBUG_MODE
                    if (window.DEBUG_MODE === true && window.__saMetrics) {
                        const waitTime = performance.now() - job.enqueuedAt;
                        window.__saMetrics.queueWaitTime = waitTime.toFixed(2);
                    }

                    await window.__saUploadHandler({
                        target: { files: job.fileObjects },
                        preventDefault: () => {},
                        stopPropagation: () => {}
                    });

                    cacheEntry.uploaded = true;
                    window.__saLastUpload = job.files;

                    const historyEntry = {
                        promptIndex: job.promptIndex,
                        promptText: job.promptText,
                        characters: job.characters,
                        backgrounds: job.backgrounds,
                        props: job.props,
                        files: job.files,
                        modelValueLength: job.files.length,
                        assignedImageCount: window.__saAttachedCharacters.size,
                        timestamp: new Date().toISOString()
                    };
                    
                    window.__saUploadHistory.push(historyEntry);

                    // Goal 5: Maintain strictly bounded history queue
                    if (window.__saUploadHistory.length > 50) {
                        window.__saUploadHistory.shift();
                    }

                } catch (err) {
                    console.error(`Upload Failed for Prompt ${job.promptIndex}`, err);
                } finally {
                    if (window.DEBUG_MODE === true && window.__saMetrics) {
                        const duration = performance.now() - uploadStart;
                        window.__saMetrics.uploadTime = duration.toFixed(2);
                    }
                }
            }
        }

        // Dequeue task (FIFO progression)
        window.__saUploadQueue.shift();
        cacheEntry.uploading = false;
    }

    isProcessingQueue = false;
}