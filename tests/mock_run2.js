const index = {
    characters: {
        "Ram": { fullbody: { name: "Ram/fullbody.png" } },
        "Sita": { fullbody: { name: "Sita/fullbody.png" } }
    },
    backgrounds: {
        "RubyForest": { name: "RubyForest/main.png" }
    },
    props: {
        "MagicSword": { name: "MagicSword/main.png" }
    }
};

const fullText = "@ram walking with @sita\\n\\n@ram walking inside @rubyforest\\n\\n@sita holding @magicsword";

const prompts = fullText.split(/\\n\\s*\\n/).map(s => s.trim()).filter(s => s.length > 0);
console.log("Prompt Count: " + prompts.length);

const __saResolvedAssets = [];

prompts.forEach((pText, pIdx) => {
    const pNum = pIdx + 1;
    const promptObject = {
        prompt: pNum,
        characters: [],
        backgrounds: [],
        props: [],
        files: []
    };
    
    const matches = pText.match(/@([a-zA-Z0-9_-]+)(?::([a-zA-Z0-9_-]+))?(?=\\s|$)/g) || [];
    matches.forEach(match => {
        const parts = match.substring(1).split(':');
        const queryName = parts[0].toLowerCase();
        let queryVariant = parts[1] ? parts[1].toLowerCase() : null;
        let selectedFile = null, matchedType = null, matchedLabel = null;
        
        for (const [key, variants] of Object.entries(index.characters || {})) {
            if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
                if (queryVariant && variants[queryVariant]) selectedFile = variants[queryVariant];
                else selectedFile = Object.values(variants)[0];
                if (selectedFile) { matchedType = 'characters'; matchedLabel = key; }
                break;
            }
        }
        if (!selectedFile) {
            for (const [key, file] of Object.entries(index.backgrounds || {})) {
                if (key.toLowerCase() === queryName || key.replace(/\\.[^/.]+$/, "").toLowerCase() === queryName) {
                    selectedFile = file; matchedType = 'backgrounds'; matchedLabel = key; break;
                }
            }
        }
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
        }
    });
    
    __saResolvedAssets.push(promptObject);
    
    console.log("--------------------------------");
    console.log("PROMPT " + pNum);
    console.log("Assets:");
    const assets = [].concat(promptObject.characters).concat(promptObject.backgrounds).concat(promptObject.props);
    console.log(assets.join('\\n'));
    console.log("Files:");
    console.log(promptObject.files.join('\\n'));
    console.log("Total Files: " + promptObject.files.length);
    console.log("--------------------------------");
});

console.log("");

__saResolvedAssets.forEach(pObj => {
    console.log("Uploading Prompt " + pObj.prompt);
    console.log("Files:");
    console.log(pObj.files.join('\\n'));
    console.log("");
});

console.log("");

__saResolvedAssets.forEach(pObj => {
    console.log("ModelValue Length: " + pObj.files.length);
    console.log("Assigned Images: " + pObj.files.length);
    console.log("Prompt Index: " + pObj.prompt);
    console.log("");
});

console.log("==================================================");
console.log(JSON.stringify(__saResolvedAssets, null, 2));
console.log("==================================================");
