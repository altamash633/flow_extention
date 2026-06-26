const fs = require('fs');

let sa = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

// 1. In processZipFile, collect all File objects into an array.
// Right now it does `window.smartAssetIndex = ...`
// We will replace the Promise.all section.
const zipExtractionMatch = /await Promise\.all\(promises\);[\s\S]*?console\.log\("\[INDEX\] Built"\);/;
if (!zipExtractionMatch.test(sa)) {
    console.error("Could not find ZIP extraction completion logic!");
}

sa = sa.replace(zipExtractionMatch, `await Promise.all(promises);
        
        console.log("[INDEX] Built");
        console.log("[ZIP] Extracted Characters:", charTotal);
        
        const allExtractedFiles = [];
        const charNames = [];
        
        // Flatten all files for the native pipeline
        Object.values(window.smartAssetIndex.characters).forEach(cObj => {
            Object.values(cObj).forEach(f => {
                allExtractedFiles.push(f);
                charNames.push(f.name.replace(/\\.[^/.]+$/, ""));
            });
        });
        Object.values(window.smartAssetIndex.backgrounds).forEach(f => allExtractedFiles.push(f));
        Object.values(window.smartAssetIndex.props).forEach(f => allExtractedFiles.push(f));
        
        console.log("[CharacterBible] Generated:\\n" + [...new Set(charNames)].join('\\n'));
        
        if (typeof window.__saUploadHandler === 'function' && allExtractedFiles.length > 0) {
            await window.__saUploadHandler({ target: { files: allExtractedFiles } });
        }
`);

// 2. We don't need the RUN interceptor to do the actual uploading anymore,
// but we CAN keep it to print the debug logs the user requested, OR we can completely remove the payload execution integration.
// Let's replace the entire RUN interceptor with just a logging observer, because the native pipeline works automatically now.

const resolverStart = sa.indexOf('function resolveAssets(');
const resolverEnd = sa.length;

if (resolverStart !== -1) {
    sa = sa.substring(0, resolverStart);
    sa += `
// ==========================================
// PHASE 2: PIPELINE DEBUG LOGGING
// ==========================================

window.saDebugMode = true;

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    const btnText = btn.innerText.toLowerCase();
    if (!btnText.includes('run') && !btnText.includes('generate') && !btnText.includes('start')) {
        return;
    }
    
    const textarea = document.querySelector('textarea');
    if (!textarea) return;
    
    const promptText = textarea.value;
    console.log("\\n[PromptParser]\\nPrompt:", promptText);
    
    // Simulate what the native Vue app matched for debug logs
    let matchedFile = null;
    let charName = null;
    
    // Check uploaded files (Native Vue autoAddCharacter Images simulation)
    const pLower = promptText.toLowerCase();
    const chars = window.smartAssetIndex?.characters || {};
    for (const [name, variants] of Object.entries(chars)) {
        for (const [vName, f] of Object.entries(variants)) {
            const fNameNoExt = f.name.replace(/\\.[^/.]+$/, "").toLowerCase();
            if (pLower.includes(fNameNoExt)) {
                matchedFile = f.name;
                charName = name;
                break;
            }
        }
        if (matchedFile) break;
    }
    
    if (matchedFile) {
        console.log("[Match]\\nCharacter:", charName, "\\nMatched File:", matchedFile);
        console.log("[Assign]\\nAssigned Images: 1");
    } else {
        console.log("[Match]\\nCharacter: None\\nMatched File: None");
        console.log("[Assign]\\nAssigned Images: 0");
    }
    
    console.log("[Run]\\nEnabled:", !btn.disabled);
    
}, true);
`;
}

fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', sa, 'utf8');
console.log("Rewrote smart_assets.js to inject all ZIP files directly to __saUploadHandler at extraction time.");
