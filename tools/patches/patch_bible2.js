const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const newObserver = `
// ==========================================
// PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE
// ==========================================
const bibleObserver = new MutationObserver((mutations) => {
    const pElements = document.querySelectorAll('p, span, div');
    for (let el of pElements) {
        // Only target elements that have NO element children (leaf nodes)
        if (el.children.length > 0) continue;
        
        const text = el.textContent ? el.textContent.trim() : '';
        if (text && (text.includes('No characters scanned yet') || text.includes('character available') || text.includes('characters available'))) {
            const chars = window.smartAssetIndex?.characters || {};
            const charNames = Object.keys(chars);
            
            if (charNames.length > 0) {
                if (el.dataset.biblePatched) continue;
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
    }
});
bibleObserver.observe(document.body, { childList: true, subtree: true });
`;

if (txt.includes('PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE')) {
    txt = txt.replace(/\/\/ ==========================================\n\/\/ PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE[\s\S]*?bibleObserver\.observe\(document\.body, \{ childList: true, subtree: true \}\);/g, newObserver.trim());
} else {
    txt += '\n' + newObserver;
}
fs.writeFileSync(file, txt, 'utf8');
console.log('Patched UI override to prevent page freeze / black screen');
