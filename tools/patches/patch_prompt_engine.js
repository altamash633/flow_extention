const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const interceptor = `
// ==========================================
// PHASE 4: PROMPT ENGINE INTERCEPTOR
// ==========================================
window.__saAttachedCharacters = window.__saAttachedCharacters || new Set();

document.addEventListener('input', async (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    
    const promptText = e.target.value;
    const chars = window.smartAssetIndex?.characters || {};
    
    // Parse every prompt for: @name and @name:variant
    const matches = promptText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?/g);
    if (!matches) return;
    
    let filesToAttach = [];
    
    for (const match of matches) {
        const parts = match.substring(1).toLowerCase().split(':');
        const name = parts[0];
        const variant = parts[1];
        
        if (chars[name]) {
            let selectedFile = null;
            
            if (variant) {
                // Try to find the specific variant
                const possibleKeys = [
                    variant, 
                    \`\${name}_\${variant}\`,
                    \`\${name}-\${variant}\`
                ];
                for (const key of possibleKeys) {
                    if (chars[name][key]) {
                        selectedFile = chars[name][key];
                        break;
                    }
                }
            }
            
            if (!selectedFile) {
                // Fallback to the first available image for this character
                selectedFile = Object.values(chars[name])[0];
            }
            
            if (selectedFile) {
                // Only attach if we haven't already attached it
                if (!window.__saAttachedCharacters.has(selectedFile.name)) {
                    filesToAttach.push(selectedFile);
                    window.__saAttachedCharacters.add(selectedFile.name);
                    console.log(\`[ZIP MATCH] \${name} -> \${selectedFile.name}\`);
                }
            }
        }
    }
    
    if (filesToAttach.length > 0) {
        console.log("[ZIP UPLOADED]");
        if (typeof window.__saUploadHandler === 'function') {
            await window.__saUploadHandler({ target: { files: filesToAttach } });
            console.log("[ZIP ATTACHED]");
        }
    }
}, true);
`;

if (!txt.includes('PHASE 4: PROMPT ENGINE INTERCEPTOR')) {
    txt += '\n' + interceptor;
    fs.writeFileSync(file, txt, 'utf8');
    console.log('Patched prompt engine interceptor');
} else {
    console.log('Already patched.');
}
