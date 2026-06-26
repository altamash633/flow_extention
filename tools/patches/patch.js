const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/index.html-B3dstwmb.js';
let txt = fs.readFileSync(file, 'utf8');

const target = 'return ns(),rs(Xr,null,[ps("div",{class:"rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-3 text-center transition-colors hover:bg-muted/20 cursor-pointer",onDragover:m,onDrop:g,onClick:b},';

const injectedUI = `ps("div", { class: "rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-3 text-center transition-colors hover:bg-muted/20 cursor-pointer", style: "margin-bottom: 20px;", onClick: (e) => { if(e.target.id === "saZipInputNative") return; document.getElementById("saZipInputNative").click(); }, onDragover: (e) => { e.preventDefault(); }, onDrop: (e) => { e.preventDefault(); const files = e.dataTransfer.files; if(files.length > 0) window.processZipFile(files[0]); } }, [ ps("p", { style: "margin: 0; color: #333; font-weight: bold; font-size: 14px; margin-bottom: 8px;" }, "📦 Smart Asset Library"), ps("p", { style: "margin: 0; color: #333;" }, "Click to import Assets.zip or drag & drop ZIP file"), ps("input", { id: "saZipInputNative", type: "file", accept: ".zip", style: "display:none", onChange: (e) => { if(e.target.files.length > 0) window.processZipFile(e.target.files[0]); } }), ps("div", { id: "saStatsNative", style: "font-size: 12px; color: #666; margin-top: 8px;" }, "Status: Waiting for Assets.zip") ]), `;

const newTarget = 'return ns(),rs(Xr,null,[' + injectedUI + 'ps("div",{class:"rounded-lg border-2 border-dashed border-border/60 bg-muted/10 p-3 text-center transition-colors hover:bg-muted/20 cursor-pointer",onDragover:m,onDrop:g,onClick:b},';

if (!txt.includes(target)) {
    console.log('Target not found!');
    process.exit(1);
}

txt = txt.replace(target, newTarget);

const globalInjection = `window.smartAssetIndex = { characters: {}, backgrounds: {}, props: {}, manifest: null };
window.processZipFile = async function(file) {
    const statsEl = document.getElementById('saStatsNative');
    if (!file.name.toLowerCase().endsWith('.zip')) {
        if(statsEl) { statsEl.innerHTML = '❌ Please select a valid .zip file'; statsEl.style.color = 'red'; }
        return;
    }
    if(statsEl) { statsEl.innerHTML = '⏳ Extracting Assets in memory...'; statsEl.style.color = '#1a73e8'; }
    try {
        const zip = new window.JSZip();
        const zipData = await zip.loadAsync(file);
        window.smartAssetIndex = { characters: {}, backgrounds: {}, props: {}, manifest: null };
        const promises = [];
        let charCount = 0, bgCount = 0, propCount = 0;
        zipData.forEach((relativePath, zipEntry) => {
            if (zipEntry.dir) return;
            const lowerPath = relativePath.toLowerCase();
            const fileName = relativePath.split('/').pop();
            const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')).toLowerCase();
            const ext = fileName.split('.').pop().toLowerCase();
            if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
                promises.push(zipEntry.async('blob').then(blob => {
                    const assetFile = new File([blob], fileName, { type: \`image/\${ext === 'jpg' ? 'jpeg' : ext}\` });
                    if (lowerPath.includes('characters/') || lowerPath.includes('character/')) {
                        const parts = lowerPath.split('/');
                        let charName = 'unknown';
                        for(let j=0; j<parts.length; j++) {
                            if((parts[j] === 'characters' || parts[j] === 'character') && j+1 < parts.length) { charName = parts[j+1]; break; }
                        }
                        if (!window.smartAssetIndex.characters[charName]) window.smartAssetIndex.characters[charName] = {};
                        window.smartAssetIndex.characters[charName][nameWithoutExt] = assetFile;
                        charCount++;
                    } else if (lowerPath.includes('backgrounds/') || lowerPath.includes('background/')) {
                        window.smartAssetIndex.backgrounds[nameWithoutExt] = assetFile;
                        bgCount++;
                    } else if (lowerPath.includes('props/') || lowerPath.includes('prop/')) {
                        window.smartAssetIndex.props[nameWithoutExt] = assetFile;
                        propCount++;
                    }
                }));
            }
        });
        await Promise.all(promises);
        if(statsEl) {
            statsEl.innerHTML = \`✅ Loaded: <b>\${charCount}</b> Characters | <b>\${bgCount}</b> Backgrounds | <b>\${propCount}</b> Props\`;
            statsEl.style.color = '#28a745';
        }
    } catch(err) {
        if(statsEl) { statsEl.innerHTML = '❌ Failed to read ZIP.'; statsEl.style.color = 'red'; }
    }
};
`;

txt = globalInjection + txt;
fs.writeFileSync(file, txt, 'utf8');
console.log('Successfully patched index.html-B3dstwmb.js');
