const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const finalCode = `
// ==========================================
// PHASE 4: ZIP PROMPT ENGINE (DEBUGGED & INSTRUMENTED)
// ==========================================

// Developer Panel Setup
const devPanel = document.createElement('div');
devPanel.id = "sa-dev-panel";
devPanel.style.position = "fixed";
devPanel.style.bottom = "20px";
devPanel.style.right = "20px";
devPanel.style.width = "250px";
devPanel.style.backgroundColor = "rgba(0,0,0,0.85)";
devPanel.style.color = "#0f0";
devPanel.style.fontFamily = "monospace";
devPanel.style.fontSize = "12px";
devPanel.style.padding = "10px";
devPanel.style.borderRadius = "8px";
devPanel.style.zIndex = "999999";
devPanel.style.pointerEvents = "none";
devPanel.innerHTML = "<b>ZIP Prompt Debug</b><hr style='border-color:#333'/><div id='sa-dev-content'>Waiting...</div>";
document.body.appendChild(devPanel);

function updateDevPanel(data) {
    const c = document.getElementById('sa-dev-content');
    if (!c) return;
    c.innerHTML = \`
Prompt:<br/>\${data.prompt || 'None'}<br/><br/>
Regex:<br/>\${data.regex || 'None'}<br/><br/>
Matched:<br/>\${data.matched || 'None'}<br/><br/>
Upload:<br/>\${data.upload || 'None'}<br/><br/>
Assigned:<br/>\${data.assigned || '0'}<br/><br/>
Handler:<br/>\${data.handler || 'None'}<br/><br/>
ModelValue:<br/>\${data.modelValue || '0'}
    \`;
}

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

window.__saAttachedCharacters = window.__saAttachedCharacters || new Set();

let acState = {
    active: false,
    textarea: null,
    items: [],
    selectedIndex: 0,
    prefix: ''
};

function getCaretCoordinates(element, position) {
    // Basic approximation for dropdown positioning
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY + 30,
        left: rect.left + window.scrollX
    };
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
    
    // find the @ symbol before cursor
    const beforeCursor = val.substring(0, start);
    const atIndex = beforeCursor.lastIndexOf('@');
    
    if (atIndex !== -1) {
        acState.textarea.setSelectionRange(atIndex, start);
        // Use document.execCommand to safely insert text and trigger native framework events
        document.execCommand('insertText', false, text + ' ');
    }
    closeAutocomplete();
}

// Intercept keydown for Autocomplete navigation
document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    
    if (acState.active) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            acState.selectedIndex = (acState.selectedIndex + 1) % acState.items.length;
            renderAutocomplete();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            acState.selectedIndex = (acState.selectedIndex - 1 + acState.items.length) % acState.items.length;
            renderAutocomplete();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = acState.items[acState.selectedIndex];
            if (item) insertText('@' + item.value);
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const item = acState.items[acState.selectedIndex];
            if (item) insertText('@' + item.value + (item.hasVariants ? ':fullbody' : ''));
        } else if (e.key === 'Escape') {
            closeAutocomplete();
        }
    }
}, true);

// Use keyup for processing to strictly avoid synthetic input recursion
document.addEventListener('keyup', async (e) => {
    if (e.target.tagName !== 'TEXTAREA') return;
    
    // Ignore navigation keys
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'].includes(e.key) && acState.active) return;
    
    console.log("[STEP 1] textarea input detected (keyup)");
    const promptText = e.target.value;
    console.log("[STEP 2] prompt text:", promptText);
    
    const index = window.smartAssetIndex || { characters: {}, backgrounds: {}, props: {} };
    
    // Autocomplete Logic
    const start = e.target.selectionStart;
    const beforeCursor = promptText.substring(0, start);
    const words = beforeCursor.split(/\\s+/);
    const currentWord = words[words.length - 1];
    
    if (currentWord.startsWith('@')) {
        acState.active = true;
        acState.textarea = e.target;
        acState.prefix = currentWord.substring(1).toLowerCase();
        
        let items = [];
        
        if (index.characters) {
            Object.keys(index.characters).forEach(k => {
                if (k.toLowerCase().includes(acState.prefix)) {
                    const variants = Object.keys(index.characters[k]).length > 1;
                    items.push({ category: 'ZIP Characters', icon: '🧑', label: k, value: k, hasVariants: variants });
                }
            });
        }
        if (index.backgrounds) {
            Object.keys(index.backgrounds).forEach(k => {
                if (k.toLowerCase().includes(acState.prefix)) {
                    items.push({ category: 'ZIP Backgrounds', icon: '🌄', label: k, value: k });
                }
            });
        }
        if (index.props) {
            Object.keys(index.props).forEach(k => {
                if (k.toLowerCase().includes(acState.prefix)) {
                    items.push({ category: 'ZIP Props', icon: '🗡', label: k, value: k });
                }
            });
        }
        
        acState.items = items;
        acState.selectedIndex = 0;
        renderAutocomplete();
    } else {
        closeAutocomplete();
    }

    // Pipeline Logic
    const matches = promptText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\\s|$)/g);
    
    const debugData = {
        prompt: promptText,
        regex: 'None',
        matched: 'None',
        upload: 'None',
        assigned: window.__saAttachedCharacters.size,
        handler: typeof window.__saUploadHandler === 'function' ? 'EXISTS' : 'MISSING',
        modelValue: 'Unknown'
    };
    
    if (!matches) {
        updateDevPanel(debugData);
        return;
    }
    
    debugData.regex = matches.join(', ');
    console.log("[STEP 3] regex result:", matches);
    
    let filesToAttach = [];
    
    for (const match of matches) {
        const parts = match.substring(1).split(':');
        const queryName = parts[0].toLowerCase();
        const queryVariant = parts[1] ? parts[1].toLowerCase() : null;
        
        console.log("[STEP 4] character lookup:", queryName);
        
        // Robust lookup regardless of case
        let selectedObj = null;
        let selectedKeyName = null;
        
        if (index.characters) {
            for (const [key, variants] of Object.entries(index.characters)) {
                if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
                    selectedObj = variants;
                    selectedKeyName = key;
                    break;
                }
            }
        }
        
        if (selectedObj) {
            let selectedFile = null;
            if (queryVariant) {
                const possibleKeys = [
                    queryVariant,
                    \`\${queryName}_\${queryVariant}\`,
                    \`\${selectedKeyName}_\${queryVariant}\`
                ];
                for (const pk of possibleKeys) {
                    for (const vk of Object.keys(selectedObj)) {
                        if (vk.toLowerCase() === pk) {
                            selectedFile = selectedObj[vk];
                            break;
                        }
                    }
                    if (selectedFile) break;
                }
            }
            if (!selectedFile) selectedFile = Object.values(selectedObj)[0];
            
            if (selectedFile) {
                console.log("[STEP 5] matched asset:", selectedFile.name);
                console.log("[STEP 6] creating File object (reusing memory blob):", selectedFile.type);
                
                if (!window.__saAttachedCharacters.has(selectedFile.name)) {
                    filesToAttach.push(selectedFile);
                    window.__saAttachedCharacters.add(selectedFile.name);
                    debugData.matched = selectedFile.name;
                }
            }
        }
    }
    
    if (filesToAttach.length > 0) {
        console.log("[STEP 7] calling __saUploadHandler with native payload");
        debugData.handler = "CALLED";
        
        if (typeof window.__saUploadHandler === 'function') {
            try {
                // Simulate exact drop event target properties
                const mockEvent = {
                    target: { files: filesToAttach },
                    preventDefault: () => {},
                    stopPropagation: () => {}
                };
                
                await window.__saUploadHandler(mockEvent);
                
                console.log("[STEP 8] upload returned successfully");
                debugData.upload = "SUCCESS";
                
                // Assume 1 assigned initially for log, since we don't hook Vue's internal array
                console.log("[STEP 9] modelValue length before: (unknown from outside)");
                console.log("[STEP 10] modelValue length after: (unknown from outside)");
                console.log("[STEP 11] assigned images updated natively!");
                
                debugData.assigned = window.__saAttachedCharacters.size;
                debugData.modelValue = filesToAttach.length;
                
            } catch (err) {
                console.error("[ZIP] Upload Error:", err);
                debugData.upload = "ERROR";
            }
        } else {
            console.error("[ZIP] __saUploadHandler is missing!");
            debugData.upload = "FAILED (No Handler)";
        }
    }
    
    updateDevPanel(debugData);
});
`;

txt += '\n' + finalCode.trim();
fs.writeFileSync(file, txt, 'utf8');
console.log('Appended final debugged payload');
