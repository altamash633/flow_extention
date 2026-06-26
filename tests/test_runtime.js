const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM('<!DOCTYPE html><html><body><textarea id="prompt"></textarea></body></html>', { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

// Mock the globals
window.smartAssetIndex = {
    characters: {
        "Ram": { fullbody: { name: "Ram/fullbody.png", type: "image/png" } },
        "Sita": { fullbody: { name: "Sita/fullbody.png", type: "image/png" } }
    },
    backgrounds: {
        "RubyForest": { name: "RubyForest/main.png", type: "image/png" }
    },
    props: {
        "MagicSword": { name: "MagicSword/main.png", type: "image/png" }
    }
};

window.__saUploadHandler = async (e) => {
    // dummy handler
};

// Insert the patch code into the DOM
let patchCode = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

const scriptEl = document.createElement("script");
scriptEl.textContent = patchCode;
document.body.appendChild(scriptEl);

const textarea = document.getElementById('prompt');
textarea.value = "@ram walking with @sita\\n\\n@ram walking inside @rubyforest\\n\\n@sita holding @magicsword";

// Simulate keyup
const event = new window.KeyboardEvent('keyup', { key: ' ' });
textarea.dispatchEvent(event);

setTimeout(() => {
    console.log("==================================================");
    console.log("CONSOLE TABLE VERIFICATION (window.__saResolvedAssets)");
    console.log(JSON.stringify(window.__saResolvedAssets, null, 2));
    console.log("==================================================");
}, 500);
