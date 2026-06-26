export function initDebug() {
    window.__saMetrics = window.__saMetrics || {
        parseTime: 0,
        resolveTime: 0,
        uploadTime: 0,
        renderTime: 0,
        listenerCount: 0,
        queueLength: 0
    };

    setInterval(() => {
        if (window.__SA_FLAGS && window.__SA_FLAGS.DEBUG_MODE && performance && performance.memory) {
            window.__saMetrics.memoryUsed = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + ' MB';
        }
    }, 1000);

    if (!document.getElementById("sa-metrics-panel")) {
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
        saMetricsPanel.style.display = "none";
        document.body.appendChild(saMetricsPanel);

        setInterval(() => {
            if (!window.__SA_FLAGS || !window.__SA_FLAGS.DEBUG_MODE) {
                saMetricsPanel.style.display = "none";
                return;
            }
            saMetricsPanel.style.display = "block";
            let qLen = 0;
            if (window.__saPromptQueue) {
                qLen = window.__saPromptQueue.length;
            } else if (window.__saDebug && window.__saDebug.promptQueue) {
                qLen = window.__saDebug.promptQueue.length;
            }
            window.__saMetrics.queueLength = qLen;
            
            saMetricsPanel.innerHTML = `
                <b>LIVE METRICS</b><br>
                Parse: ${window.__saMetrics.parseTime}ms<br>
                Resolve: ${window.__saMetrics.resolveTime}ms<br>
                Upload: ${window.__saMetrics.uploadTime}ms<br>
                Render: ${window.__saMetrics.renderTime}ms<br>
                Queue: ${window.__saMetrics.queueLength}<br>
                Listeners: ${window.__saMetrics.listenerCount}<br>
                Memory: ${window.__saMetrics.memoryUsed || 'N/A'}
            `;
        }, 1000);
    }
}

if (window.DEBUG_MODE === true) {
    initDebug();
}
