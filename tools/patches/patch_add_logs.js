const fs = require('fs');

// Patch smart_assets.js
let sa = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

sa = sa.replace('console.log("[INDEX] Built");', `console.log("[INDEX] Built");
        console.log("[DEBUG] characterIndex.size: " + Object.keys(window.smartAssetIndex.characters).length);
        console.log("[DEBUG] character names loaded: " + Object.keys(window.smartAssetIndex.characters).join(', '));
`);

// Also log prompt parser details
sa = sa.replace('console.log("🔍 [PARSER] Prompt parsed details:", promptText);', `console.log("🔍 [PARSER] Prompt parsed details:", promptText);
    console.log("[DEBUG] prompt parsed name:", promptText);
`);

sa = sa.replace('const { resolvedFiles, missingAssets } = resolveAssets(promptText);', `const { resolvedFiles, missingAssets } = resolveAssets(promptText);
    console.log("[DEBUG] matched filename:", resolvedFiles.map(f => f.name).join(', '));
    console.log("[DEBUG] assigned image count:", resolvedFiles.length);
`);

fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', sa, 'utf8');


// Patch index.html-B3dstwmb.js
let vue = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/index.html-B3dstwmb.js', 'utf8');

// Log scanCharacters execution
vue = vue.replace('scanCharacters:async()=>{', 'scanCharacters:async()=>{console.log("[DEBUG] scanCharacters() execution");');

// Wait, where is autoAddCharacter? The user says "autoAddCharacter() execution".
// I will just add it before 'autoAddCharacterImages:Ds(' because that's part of the composable.
// Actually, let's find `allPromptsHaveImages:S` and see if there's a function there.
// If not, I'll log `autoAddCharacterImages` logic inside `M=async()=>{`.
vue = vue.replace('M=async()=>{const t=n.settings.autoAddCharacterImages', 'M=async()=>{console.log("[DEBUG] autoAddCharacter() execution");const t=n.settings.autoAddCharacterImages');
vue = vue.replace('T=async()=>{if(0===a.value.length&&!n.settings.autoAddCharacterImages', 'T=async()=>{console.log("[DEBUG] autoAddCharacter() execution");if(0===a.value.length&&!n.settings.autoAddCharacterImages');

fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/index.html-B3dstwmb.js', vue, 'utf8');

console.log("Patched files with debug logs.");
