const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const targetStr = `    // Check uploaded files (Native Vue autoAddCharacter Images simulation)
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
    }`;

const newStr = `    // Check uploaded files (Native Vue autoAddCharacter Images simulation)
    const pLower = promptText.toLowerCase();
    const chars = window.smartAssetIndex?.characters || {};
    
    let matchedFiles = [];
    let matchedNames = [];
    
    for (const [name, variants] of Object.entries(chars)) {
        for (const [vName, f] of Object.entries(variants)) {
            const fNameNoExt = f.name.replace(/\\.[^/.]+$/, "").toLowerCase();
            // The user specifically requested "@ram" logic, but fallback to "ram" if no @ is used
            if (pLower.includes('@' + fNameNoExt) || pLower.includes(fNameNoExt)) {
                if (!matchedFiles.includes(f.name)) {
                    matchedFiles.push('Characters/' + f.name); // Using requested format "Characters/Ram.png"
                    matchedNames.push(name);
                }
            }
        }
    }
    
    if (matchedFiles.length > 0) {
        console.log("[Match]\\nCharacter:", matchedNames.join(", "), "\\nMatched File:", matchedFiles.join(", "));
        console.log("[Assign]\\nAssigned Images:", matchedFiles.length);
    } else {
        console.log("[Match]\\nCharacter: None\\nMatched File: None");
        console.log("[Assign]\\nAssigned Images: 0");
    }`;

if (txt.includes('if (matchedFile) break;')) {
    txt = txt.replace(targetStr, newStr);
    fs.writeFileSync(file, txt, 'utf8');
    console.log("Patched debug logger for multiple characters.");
} else {
    console.log("Debug logger target not found or already patched.");
}
