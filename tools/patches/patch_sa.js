const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

// 1. Remove duplicate block by removing the observer
txt = txt.replace(/const observer = new MutationObserver\(\(mutations\) => \{[\s\S]*?observer\.observe\(document\.body, \{ childList: true, subtree: true \}\);/, '');

// 2. Move inspector directly below prompt
txt = txt.replace(
    /const targetContainer = document\.querySelector\('\.mt-4\.p-4\.bg-muted\\\\\/10'\);[\s\S]*?else \{\s*textarea\.parentNode\.insertBefore\(inspector, textarea\.nextSibling\);\s*\}/,
    'textarea.parentNode.insertBefore(inspector, textarea.nextSibling);'
);

// 3. Compact cards layout for the Inspector HTML
txt = txt.replace(/let html = \`[\s\S]*inspector\.innerHTML = html;/m, `
    let html = \`<div style="font-size:16px; font-weight:bold; margin-bottom:12px; color:#1a73e8; display:flex; align-items:center; gap:8px;">🔍 Smart Prompt Inspector</div>\`;

    const cardStyle = "background-color:#fff; border:1px solid #eaeaea; border-radius:8px; padding:10px; margin-bottom:10px; box-shadow:0 1px 3px rgba(0,0,0,0.05); transition:transform 0.2s ease, box-shadow 0.2s ease;";
    const hoverCSS = "onmouseover=\\"this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.08)'\\" onmouseout=\\"this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.05)'\\"";

    html += \`<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">\`;

    if (characters.length > 0) {
        characters.forEach(c => {
            html += \`<div style="\${cardStyle} flex:1; min-width:200px;" \${hoverCSS}>\`;
            html += \`<div style="font-weight:bold; border-bottom:1px solid #f0f0f0; padding-bottom:5px; margin-bottom:5px;">👤 Character</div>\`;
            if (c.status === '✅') {
                html += \`<div style="font-size:14px;">\${c.status} \${c.originalName}</div>\`;
                if (c.variant) html += \`<div style="font-size:12px; color:#666; margin-top:4px;">Variant: <b>\${c.variant}</b></div>\`;
                html += \`<div style="font-size:11px; color:#888; margin-top:4px; word-break:break-all;">\${c.source}</div>\`;
            } else {
                html += \`<div style="font-size:14px;">\${c.status} \${c.fullMatch.substring(1)}</div>\`;
                html += \`<div style="font-size:12px; color:#e53e3e; margin-top:4px;">\${c.statusText}</div>\`;
            }
            html += \`</div>\`;
        });
    }

    if (backgrounds.length > 0) {
        backgrounds.forEach(c => {
            html += \`<div style="\${cardStyle} flex:1; min-width:200px;" \${hoverCSS}>\`;
            html += \`<div style="font-weight:bold; border-bottom:1px solid #f0f0f0; padding-bottom:5px; margin-bottom:5px;">🖼️ Background</div>\`;
            if (c.status === '✅') {
                html += \`<div style="font-size:14px;">\${c.status} \${c.originalName}</div>\`;
                html += \`<div style="font-size:11px; color:#888; margin-top:4px; word-break:break-all;">\${c.source}</div>\`;
            } else {
                html += \`<div style="font-size:14px;">\${c.status} \${c.originalName}</div>\`;
                html += \`<div style="font-size:12px; color:#e53e3e; margin-top:4px;">\${c.statusText}</div>\`;
            }
            html += \`</div>\`;
        });
    }

    if (props.length > 0) {
        props.forEach(c => {
            html += \`<div style="\${cardStyle} flex:1; min-width:200px;" \${hoverCSS}>\`;
            html += \`<div style="font-weight:bold; border-bottom:1px solid #f0f0f0; padding-bottom:5px; margin-bottom:5px;">🧸 Prop</div>\`;
            if (c.status === '✅') {
                html += \`<div style="font-size:14px;">\${c.status} \${c.originalName}</div>\`;
                html += \`<div style="font-size:11px; color:#888; margin-top:4px; word-break:break-all;">\${c.source}</div>\`;
            } else {
                html += \`<div style="font-size:14px;">\${c.status} \${c.originalName}</div>\`;
                html += \`<div style="font-size:12px; color:#e53e3e; margin-top:4px;">\${c.statusText}</div>\`;
            }
            html += \`</div>\`;
        });
    }
    html += \`</div>\`;

    html += \`<div style="display:flex; gap:10px; margin-top:5px;">\`;
    html += \`<div style="\${cardStyle} flex:1; background-color:#f8f9fa;" \${hoverCSS}>\`;
    html += \`<div style="font-weight:bold; border-bottom:1px solid #eaeaea; padding-bottom:5px; margin-bottom:5px;">📊 Upload Summary</div>\`;
    html += \`<div style="font-size:12px; display:grid; grid-template-columns:1fr 1fr; gap:4px;"><div>Chars: <b>\${charCount}</b></div><div>BGs: <b>\${bgCount}</b></div><div>Props: <b>\${propCount}</b></div><div>Files: <b>\${uniqueFileNames.size}</b></div></div>\`;
    html += \`</div>\`;

    html += \`<div style="\${cardStyle} flex:1; background-color:#f8f9fa;" \${hoverCSS}>\`;
    html += \`<div style="font-weight:bold; border-bottom:1px solid #eaeaea; padding-bottom:5px; margin-bottom:5px;">♻️ Deduplication</div>\`;
    html += \`<div style="font-size:12px; display:grid; grid-template-columns:1fr 1fr; gap:4px;"><div>Detected: <b>\${matches.length}</b> references</div><div>Uploading: <b>\${uniqueFileNames.size}</b> unique files</div></div>\`;
    html += \`</div>\`;
    html += \`</div>\`;

    inspector.innerHTML = html;
`);

fs.writeFileSync(file, txt, 'utf8');
console.log('Successfully patched smart_assets.js UI polish elements');
