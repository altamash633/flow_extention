const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

// The new observer to handle ZIP Character Bible UI
const newObserver = `
// ==========================================
// PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE
// ==========================================
const bibleObserver = new MutationObserver((mutations) => {
    // Look for the element containing "No characters scanned yet"
    const pElements = document.querySelectorAll('p, span, div');
    for (let el of pElements) {
        if (el.innerText && el.innerText.includes('No characters scanned yet')) {
            const chars = window.smartAssetIndex?.characters || {};
            const charNames = Object.keys(chars);
            
            if (charNames.length > 0) {
                // We have characters, update the UI!
                if (el.dataset.biblePatched) continue;
                el.dataset.biblePatched = "true";
                
                // Hide the Scan Characters button if it exists nearby
                const container = el.closest('div');
                if (container) {
                    const btns = container.querySelectorAll('button');
                    btns.forEach(btn => {
                        if (btn.innerText && btn.innerText.includes('Scan Characters')) {
                            btn.style.display = 'none';
                        }
                    });
                }
                
                // Build the new UI list
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
                
                // Replace the element's content
                el.innerHTML = html;
                el.style.textAlign = 'left';
                el.style.padding = '12px';
                el.style.backgroundColor = 'rgba(26, 115, 232, 0.05)';
                el.style.borderRadius = '8px';
                el.style.border = '1px solid #1a73e8';
            }
        }
    }
    
    // Auto-resolve: if we want to ensure @ram works, we can also modify the prompt parsing debug logger
    // But since __saUploadHandler already uploads files, the Vue app handles filename matching natively!
});
bibleObserver.observe(document.body, { childList: true, subtree: true });
`;

if (!txt.includes('PHASE 3: ZIP CHARACTER BIBLE UI OVERRIDE')) {
    txt += '\n' + newObserver;
    fs.writeFileSync(file, txt, 'utf8');
    console.log('Successfully injected Character Bible UI Override');
} else {
    console.log('Already injected.');
}
