const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

// 8. Wrap debug logs in saDebugMode
txt = txt.replace(
    'console.log("[DEBUG] resolvedFiles.length: " + resolvedFiles.length);',
    'if (window.saDebugMode) console.log("[DEBUG] resolvedFiles.length: " + resolvedFiles.length);'
);

txt = txt.replace(
    'console.log("[DEBUG] DataTransfer.files.length: " + dt.files.length);',
    'if (window.saDebugMode) console.log("[DEBUG] DataTransfer.files.length: " + dt.files.length);'
);

txt = txt.replace(
    /console\.log\(\{\s*modelValueLengthBefore: modelValueBefore,[\s\S]*?dataDisabled: btn \? btn\.getAttribute\("data-p-disabled"\) : null\s*\}\);/g,
    'if (window.saDebugMode) { $& }'
);

txt = txt.replace(
    /requestAnimationFrame\(\(\) => \{\s*console\.log\(\s*"\[DEBUG\] Image Mode DOM",[\s\S]*?console\.log\("Run button not found in DOM"\);\s*\}\s*\}\);\s*const injEnd/g,
    'if (window.saDebugMode) { $& } const injEnd'
);


// 7. Show Assigned Images card with thumbnail + uploaded filename.
const replacementHTML = `
    if (uniqueFiles.size > 0) {
        html += \`<div style="margin-top:10px;">\`;
        html += \`<div style="\${cardStyle} background-color:#f0fdf4; border-color:#bbf7d0;" \${hoverCSS}>\`;
        html += \`<div style="font-weight:bold; border-bottom:1px solid #dcfce7; padding-bottom:5px; margin-bottom:5px; color:#166534;">✅ Assigned Images</div>\`;
        html += \`<div style="display:flex; flex-wrap:wrap; gap:10px;">\`;
        uniqueFiles.forEach(f => {
            const url = URL.createObjectURL(f);
            html += \`<div style="display:flex; align-items:center; gap:8px; background:#fff; padding:4px 8px; border-radius:4px; border:1px solid #e2e8f0; font-size:12px; max-width:100%; overflow:hidden;">\`;
            html += \`<img src="\${url}" style="width:24px; height:24px; object-fit:cover; border-radius:3px; flex-shrink:0;" />\`;
            html += \`<span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${f.name}</span>\`;
            html += \`</div>\`;
        });
        html += \`</div></div></div>\`;
    }

    inspector.innerHTML = html;
`;

txt = txt.replace(/inspector\.innerHTML = html;/g, replacementHTML);

fs.writeFileSync(file, txt, 'utf8');
console.log('Successfully applied Development Mode v1.2.4 UI Cleanup');
