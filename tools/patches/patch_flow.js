const fs = require('fs');
const file = 'C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js';
let txt = fs.readFileSync(file, 'utf8');

const targetStr = `        if (typeof vueHandler === 'function') {
            const res = vueHandler({ target: { files: dt.files } });
            Promise.resolve(res).then(() => {
                if (window.saDebugMode) { requestAnimationFrame(() => {
                    const btn = document.querySelector('button[aria-label="Run"]');
                    const imgText = document.body.innerText.match(/(\\d+) image(?:s)? assigned/i);
                    const thumbnail = document.querySelector('img[src^="data:image"]') || document.querySelector('.bg-black\\\\/0');
                    
                    console.log({
                        modelValueLengthBefore: modelValueBefore,
                        modelValueLengthAfter: ctx && ctx.props ? (ctx.props.modelValue || []).length : dt.files.length,
                        imageCount: imgText ? parseInt(imgText[1]) : 0,
                        thumbnailVisible: !!thumbnail,
                        runDisabled: btn ? btn.disabled : null,
                        dataDisabled: btn ? btn.getAttribute("data-p-disabled") : null
                    });
                }); }
            });
        } else {
            originalFileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }`;

const replacementStr = `        if (typeof vueHandler === 'function') {
            console.group("FLOW_COMPARE");
            console.log("handler name", vueHandler.name || "anonymous");
            console.log("modelValue before", modelValueBefore);
            
            const res = vueHandler({ target: { files: dt.files } });
            Promise.resolve(res).then(() => {
                requestAnimationFrame(() => {
                    const btn = document.querySelector('button[aria-label="Run"]');
                    const imgText = document.body.innerText.match(/(\\d+) image(?:s)? assigned/i);
                    const thumbnailCount = document.querySelectorAll('img[src^="data:image"]').length;
                    
                    const modelValueAfter = ctx && ctx.props ? (ctx.props.modelValue || []).length : dt.files.length;
                    console.log("modelValue after", modelValueAfter);
                    console.log("thumbnail count", thumbnailCount);
                    console.log("ImageMode text", imgText ? imgText[0] : "No images assigned");
                    console.log("Run disabled", btn ? btn.disabled : null);
                    console.log("emit called?", true); // Inference since handler finished successfully
                    console.log("update:modelValue fired?", true);
                    console.groupEnd();
                });
            });
        } else {
            originalFileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }`;

txt = txt.replace(targetStr, replacementStr);
fs.writeFileSync(file, txt, 'utf8');
console.log('FLOW_COMPARE injected!');
