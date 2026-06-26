const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const newPhase4 = `
// ==========================================
// PHASE 4: PROMPT ENGINE INTERCEPTOR (FIXED NATIVE ATTACHMENT)
// ==========================================
window.__saAttachedCharacters = window.__saAttachedCharacters || new Set();

document.addEventListener('input', async (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    
    const promptText = e.target.value;
    const chars = window.smartAssetIndex?.characters || {};
    
    // Parse every prompt for: @name and @name:variant
    const matches = promptText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\\s|$)/g);
    if (!matches) return;
    
    console.log("[ZIP PARSER] Checking prompt for matches...");
    
    let filesToAttach = [];
    
    for (const match of matches) {
        const parts = match.substring(1).toLowerCase().split(':');
        const name = parts[0];
        const variant = parts[1];
        
        if (chars[name]) {
            let selectedFile = null;
            
            if (variant) {
                const possibleKeys = [variant, \`\${name}_\${variant}\`, \`\${name}-\${variant}\`];
                for (const key of possibleKeys) {
                    if (chars[name][key]) {
                        selectedFile = chars[name][key];
                        break;
                    }
                }
            }
            
            if (!selectedFile) {
                selectedFile = Object.values(chars[name])[0];
            }
            
            if (selectedFile) {
                if (!window.__saAttachedCharacters.has(selectedFile.name)) {
                    filesToAttach.push(selectedFile);
                    window.__saAttachedCharacters.add(selectedFile.name);
                    console.log(\`[ZIP MATCH] \${name} -> \${selectedFile.name}\`);
                    console.log(\`[ZIP FILE] Name: \${selectedFile.name}, Type: \${selectedFile.type}\`);
                }
            }
        }
    }
    
    if (filesToAttach.length > 0) {
        console.log("[ZIP UPLOAD START] Simulating native attachment via file input...");
        
        // Find the specific file input for this prompt's dropzone
        let fileInput = null;
        let current = e.target;
        while (!fileInput && current.parentElement) {
            current = current.parentElement;
            fileInput = current.querySelector('input[type="file"]:not(#saZipInputNative)');
        }
        
        if (fileInput) {
            const dt = new DataTransfer();
            for (const file of filesToAttach) {
                dt.items.add(file);
            }
            fileInput.files = dt.files;
            
            // Dispatch a native change event so Vue handles it properly
            const changeEvent = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
            
            console.log("[ZIP UPLOAD SUCCESS] Native change event dispatched.");
            console.log("[ZIP ASSIGN SUCCESS] Files natively assigned to prompt!");
        } else {
            console.log("[ZIP UPLOAD ERROR] Could not find prompt file input.");
            // Fallback to window.__saUploadHandler if available
            if (typeof window.__saUploadHandler === 'function') {
                await window.__saUploadHandler({ target: { files: filesToAttach } });
                console.log("[ZIP UPLOAD SUCCESS] Fallback handler used.");
                console.log("[ZIP ASSIGN SUCCESS] Fallback assignment done.");
            }
        }
    }
}, true);
`;

const startIndex = txt.indexOf('// ==========================================\n// PHASE 4: PROMPT ENGINE INTERCEPTOR');
if (startIndex !== -1) {
    txt = txt.substring(0, startIndex) + newPhase4.trim();
} else {
    txt += '\n' + newPhase4.trim();
}

fs.writeFileSync(file, txt, 'utf8');
console.log('Patched phase 4 for native DOM event attachment.');
