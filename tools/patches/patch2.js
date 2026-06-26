const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/index.html-B3dstwmb.js';
let txt = fs.readFileSync(file, 'utf8');

// 2. Multiline loaded text
txt = txt.replace(
    /statsEl\.innerHTML = \`✅ Loaded:.*?Props\`;/,
    "statsEl.innerHTML = `<div style='text-align: left; padding: 10px;'><div style='font-weight:bold; margin-bottom:5px'>✅ Loaded:</div><div>${charCount} Characters</div><div>${bgCount} Backgrounds</div><div>${propCount} Props</div></div>`;"
);

// 3. Hide the original PNG dropzone but keep it in the DOM
if (!txt.includes('sa-hide-original')) {
    txt += "\nif(typeof document!=='undefined'){const s=document.createElement('style');s.id='sa-hide-original';s.innerHTML='div:has(input[accept*=\"image/\"]:not(#saZipInputNative)) { display: none !important; }';document.head.appendChild(s);}";
}

fs.writeFileSync(file, txt, 'utf8');
console.log('Successfully patched index.html-B3dstwmb.js for Phase 3 UI Polish');
