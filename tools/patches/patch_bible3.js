const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const newObserver = `
// ==========================================
// PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE (PERFORMANCE FIXED)
// ==========================================
let bibleTimer = null;

function processBibleUI() {
    const chars = window.smartAssetIndex?.characters || {};
    const charNames = Object.keys(chars);
    if (charNames.length === 0) return;

    // Use XPath for extreme performance and precision (only matches text nodes with the exact substrings)
    const xPath = "//text()[contains(., 'No characters scanned yet') or contains(., 'character available') or contains(., 'characters available')]";
    const textNodes = document.evaluate(xPath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    
    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const node = textNodes.snapshotItem(i);
        const el = node.parentElement;
        
        if (!el || el.dataset.biblePatched) continue;
        el.dataset.biblePatched = "true";
        
        // Hide the Scan Characters button if it exists nearby
        const container = el.closest('div[class*="flex"], div[class*="grid"], div');
        if (container) {
            const btns = container.querySelectorAll('button');
            btns.forEach(btn => {
                if (btn.textContent && btn.textContent.includes('Scan Characters')) {
                    btn.style.display = 'none';
                }
            });
        }
        
        let html = '<div style="font-weight:bold; margin-bottom:8px; color:#1a73e8; font-size:14px;">📦 ZIP Characters</div>';
        html += '<div style="display:flex; flex-direction:column; gap:6px;">';
        charNames.forEach(name => {
            const CapitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
            html += \`<div style="display:flex; align-items:center; gap:8px; font-size:13px; color:#333;">
                <span style="color:#28a745; font-weight:bold;">✓</span>
                <span>\${CapitalizedName}</span>
            </div>\`;
        });
        html += '</div>';
        
        el.innerHTML = html;
        el.style.textAlign = 'left';
        el.style.padding = '12px';
        el.style.backgroundColor = 'rgba(26, 115, 232, 0.05)';
        el.style.borderRadius = '8px';
        el.style.border = '1px solid #1a73e8';
    }
}

const bibleObserver = new MutationObserver((mutations) => {
    // Debounce the DOM processing to avoid freezing the UI on heavy Vue renders
    if (bibleTimer) clearTimeout(bibleTimer);
    bibleTimer = setTimeout(() => {
        processBibleUI();
    }, 100);
});
bibleObserver.observe(document.body, { childList: true, subtree: true });
`;

if (txt.includes('PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE')) {
    txt = txt.replace(/\/\/ ==========================================\n\/\/ PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE(?: \([A-Z ]+\))?[\s\S]*?bibleObserver\.observe\(document\.body, \{ childList: true, subtree: true \}\);/g, newObserver.trim());
} else {
    txt += '\n' + newObserver;
}
fs.writeFileSync(file, txt, 'utf8');
console.log('Patched UI override with Debounce and XPath for optimal performance');
