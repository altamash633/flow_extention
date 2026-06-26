const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const finalCode = `
// ==========================================
// PHASE 4: PER-PROMPT ASSET RESOLVER (V2 - PRECISE LOGGING)
// ==========================================

window.__saPromptQueue = window.__saPromptQueue || [];
window.__saResolvedAssets = window.__saResolvedAssets || [];
window.__saLastUpload = null;
window.__saAttachedCharacters = window.__saAttachedCharacters || new Set();

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
            html += \`<div style="padding:4px 8px; font-weight:bold; font-size:11px; background:#f0f0f0; color:#555;">\${item.category}</div>\`;
            currentCategory = item.category;
        }
        const bg = idx === acState.selectedIndex ? '#e6f2ff' : '#fff';
        html += \`<div style="padding:6px 8px; cursor:pointer; font-size:13px; background:\${bg}; border-bottom:1px solid #f0f0f0;">
            \${item.icon} \${item.label}
        </div>\`;
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

document.addEventListener('keyup', async (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key) && acState.active) return;
    
    const fullText = e.target.value;
    const index = window.smartAssetIndex || { characters: {}, backgrounds: {}, props: {} };
    
    const currentWord = fullText.substring(0, e.target.selectionStart).split(/\\s+/).pop();
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

    const prompts = fullText.split(/\\n\\s*\\n/).map(s => s.trim()).filter(s => s.length > 0);
    
    console.log("Prompt Count:", prompts.length);
    window.__saResolvedAssets = [];
    
    // Parse Phase
    prompts.forEach((pText, pIdx) => {
        const pNum = pIdx + 1;
        const promptObject = {
            prompt: pNum,
            characters: [],
            backgrounds: [],
            props: [],
            files: [],
            fileObjects: [] // raw memory files
        };
        
        const matches = pText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\\s|$)/g) || [];
        matches.forEach(match => {
            const parts = match.substring(1).split(':');
            const queryName = parts[0].toLowerCase();
            let queryVariant = parts[1] ? parts[1].toLowerCase() : null;
            let selectedFile = null, matchedType = null, matchedLabel = null;
            
            // Characters
            for (const [key, variants] of Object.entries(index.characters || {})) {
                if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
                    if (queryVariant && variants[queryVariant]) selectedFile = variants[queryVariant];
                    else selectedFile = Object.values(variants)[0];
                    if (selectedFile) { matchedType = 'characters'; matchedLabel = key; }
                    break;
                }
            }
            // Backgrounds
            if (!selectedFile) {
                for (const [key, file] of Object.entries(index.backgrounds || {})) {
                    if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
                        selectedFile = file; matchedType = 'backgrounds'; matchedLabel = key; break;
                    }
                }
            }
            // Props
            if (!selectedFile) {
                for (const [key, file] of Object.entries(index.props || {})) {
                    if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
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
        
        window.__saResolvedAssets.push(promptObject);
        
        console.log(\`--------------------------------\\nPROMPT \${pNum}\\nAssets:\\n\${[...promptObject.characters, ...promptObject.backgrounds, ...promptObject.props].join('\\n')}\\nFiles:\\n\${promptObject.files.join('\\n')}\\nTotal Files: \${promptObject.files.length}\\n--------------------------------\`);
        
        // UI Patch for "Resolved Assets" under textarea cards
        let resolvedHtml = '<div style="margin-top:8px; font-size:12px; border-top:1px dashed #ccc; padding-top:4px;"><b>Resolved Assets</b><br/>';
        const allMatched = [...promptObject.characters, ...promptObject.backgrounds, ...promptObject.props];
        if (allMatched.length > 0) {
            allMatched.forEach(m => { resolvedHtml += \`<span style="color:#28a745">✓ \${m}</span><br/>\`; });
        } else {
            resolvedHtml += '<span style="color:#999">No ZIP assets found</span>';
        }
        resolvedHtml += '</div>';
        
        // Assume Google Flow has a prompt card structure: we append to the closest parent
        const container = e.target.parentElement;
        let previewDiv = container.querySelector('.sa-asset-preview');
        if (!previewDiv) {
            previewDiv = document.createElement('div');
            previewDiv.className = 'sa-asset-preview';
            container.appendChild(previewDiv);
        }
        previewDiv.innerHTML = resolvedHtml;
    });

    // Upload Phase
    for (let pIdx = 0; pIdx < window.__saResolvedAssets.length; pIdx++) {
        const pObj = window.__saResolvedAssets[pIdx];
        if (pObj.fileObjects.length > 0) {
            console.log(\`Uploading Prompt \${pObj.prompt}\\nFiles:\\n\${pObj.files.join('\\n')}\`);
            
            if (typeof window.__saUploadHandler === 'function') {
                try {
                    await window.__saUploadHandler({ target: { files: pObj.fileObjects }, preventDefault: ()=>{}, stopPropagation: ()=>{} });
                    window.__saLastUpload = pObj.files;
                    console.log(\`ModelValue Length: \${pObj.files.length}\\nAssigned Images: \${window.__saAttachedCharacters.size}\\nPrompt Index: \${pObj.prompt}\\n\`);
                } catch (err) {
                    console.error(\`Upload Failed for Prompt \${pObj.prompt}\`, err);
                }
            }
        }
    }
});
`;

txt += '\n' + finalCode.trim();
fs.writeFileSync(file, txt, 'utf8');
console.log('Appended fully compliant per-prompt pipeline');
