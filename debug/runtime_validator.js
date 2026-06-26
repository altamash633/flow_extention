export function initDebug() {
    const _originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (window.__SA_FLAGS && window.__SA_FLAGS.DEBUG_MODE && ['keyup', 'keydown', 'input', 'change'].includes(type)) {
            if (window.__saMetrics) window.__saMetrics.listenerCount++;
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

    let _originalUploadHandler = null;
    if (!window.hasOwnProperty('__saUploadHandler_wrapped')) {
        Object.defineProperty(window, '__saUploadHandler_wrapped', { value: true });
        Object.defineProperty(window, '__saUploadHandler', {
            get() {
                return async function(eventArgs) {
                    if (!_originalUploadHandler) {
                        if (window.__SA_FLAGS && window.__SA_FLAGS.DEBUG_MODE) {
                            console.warn("[RUNTIME VALIDATION FAILED] __saUploadHandler called but original is null");
                        }
                        return;
                    }
                    
                    if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) {
                        return await _originalUploadHandler.apply(this, arguments);
                    }
                    
                    const startTime = performance.now();
                    const timestamp = new Date().toISOString();
                    const files = eventArgs?.target?.files || [];
                    const filesList = Array.from(files).map(f => f.name).join(', ');
                    
                    if (files.length === 0) {
                        console.warn("[RUNTIME VALIDATION FAILED] Empty upload detected");
                    }
                    
                    let promptIndex = "Unknown";
                    const resolvedAssets = window.__saResolvedAssets || (window.__saDebug ? window.__saDebug.resolvedAssets : []);
                    if (resolvedAssets && resolvedAssets.length > 0) {
                        const match = resolvedAssets.find(p => p.fileObjects && p.fileObjects.some(f => filesList.includes(f.name)));
                        if (match) promptIndex = match.promptIndex;
                    }

                    console.log("----------------------------------");
                    console.log("UPLOAD START");
                    console.log(`Timestamp: ${timestamp}`);
                    console.log(`Prompt Index: ${promptIndex}`);
                    console.log(`Files: ${filesList}`);
                    
                    let result;
                    try {
                        result = await _originalUploadHandler.apply(this, arguments);
                    } catch(e) {
                        console.error("Upload Failed", e);
                    }
                    
                    const duration = performance.now() - startTime;
                    if (window.__saMetrics) window.__saMetrics.uploadTime = duration.toFixed(2);
                    
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
    }

    setInterval(() => {
        if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return;
        
        let failed = false;
        let reason = "";
        const resolvedAssets = window.__saResolvedAssets || (window.__saDebug ? window.__saDebug.resolvedAssets : []);
        if (resolvedAssets) {
            resolvedAssets.forEach(p => {
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
}

if (window.DEBUG_MODE === true) {
    initDebug();
}
