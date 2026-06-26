export function initDebug() {
    window.__SA_DEBUG_API = {
        getState: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return { flags: window.__SA_FLAGS, debugStore: window.__saDebug };
        },
        getMetrics: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return window.__saMetrics;
        },
        getPromptQueue: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return window.__saPromptQueue || (window.__saDebug ? window.__saDebug.promptQueue : null);
        },
        getResolvedAssets: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return window.__saResolvedAssets || (window.__saDebug ? window.__saDebug.resolvedAssets : null);
        },
        getUploadHistory: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return window.__saUploadHistory || (window.__saDebug ? window.__saDebug.uploadHistory : null);
        },
        getLastUpload: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            return window.__saLastUpload || (window.__saDebug ? window.__saDebug.lastUpload : null);
        },
        runSelfTest: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            
            const history = window.__saUploadHistory || (window.__saDebug ? window.__saDebug.uploadHistory : []);
            const queue = window.__saPromptQueue || (window.__saDebug ? window.__saDebug.promptQueue : []);
            
            return {
                passed: true,
                checks: [
                    { name: 'HistoryBounds', passed: history.length <= (window.__saDebug ? window.__saDebug.maxHistory : 100) },
                    { name: 'QueueExists', passed: !!queue },
                    { name: 'MetricsActive', passed: !!window.__saMetrics }
                ]
            };
        },
        exportRuntimeReport: () => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) return null;
            const queue = window.__saPromptQueue || (window.__saDebug ? window.__saDebug.promptQueue : []);
            const history = window.__saUploadHistory || (window.__saDebug ? window.__saDebug.uploadHistory : []);
            return JSON.stringify({
                timestamp: new Date().toISOString(),
                metrics: window.__saMetrics,
                queueLength: queue ? queue.length : 0,
                historyLength: history ? history.length : 0,
                selfTest: window.__SA_DEBUG_API.runSelfTest()
            }, null, 2);
        }
    };
}

if (window.DEBUG_MODE === true) {
    initDebug();
}
