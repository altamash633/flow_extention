const fs = require('fs');

let sa = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

// The block to replace:
// from `const dropzone = fileInput.closest('div[class*="border-dashed"]');`
// to `zipInput.addEventListener('change', ... processZipFile ... }); }`

const targetStart = "const dropzone = fileInput.closest('div[class*=\"border-dashed\"]');";
const targetEnd = "zipInput.addEventListener('change', (e) => {\n                if (e.target.files.length > 0) {\n                    processZipFile(e.target.files[0], stats);\n                }\n            });\n        }";

const startIndex = sa.indexOf(targetStart);
const endIndex = sa.indexOf("        }", sa.indexOf(targetEnd)) + 9;

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find the UI injection block.");
    process.exit(1);
}

const newBlock = `const dropzone = fileInput.closest('div[class*="border-dashed"]');
        if (dropzone && !dropzone.hasAttribute('data-sa-injected')) {
            if (window.__SMART_ZIP_UI_INITIALIZED) return;
            window.__SMART_ZIP_UI_INITIALIZED = true;
            
            console.log('🔎 [Smart Asset Library] Detected original dropzone, injecting ZIP importer.');
            dropzone.setAttribute('data-sa-injected', 'true');
            
            // 1. Do NOT hide the injected/original dropzone container
            // Instead, hide its original children to replace them
            Array.from(dropzone.children).forEach(child => {
                child.style.display = 'none';
            });
            
            // Re-style the dropzone to fit our ZIP UI
            dropzone.style.display = "flex";
            dropzone.style.flexDirection = "column";
            dropzone.style.alignItems = "center";
            dropzone.style.justifyContent = "center";
            dropzone.style.padding = "20px";
            dropzone.style.textAlign = "center";
            dropzone.style.cursor = "pointer";
            dropzone.style.pointerEvents = "auto";
            
            // 3. Inner UI
            const icon = document.createElement('i');
            icon.className = "pi pi-file-zip text-primary text-2xl block";
            icon.style.marginBottom = "8px";
            icon.style.color = "#1a73e8";
            
            const title = document.createElement('p');
            title.innerHTML = "Click to import <b>Assets.zip</b><br/>or drag & drop ZIP file";
            title.style.margin = "0";
            title.style.color = "#333";
            
            const subtitle = document.createElement('p');
            subtitle.innerHTML = "Contains: Characters/, Backgrounds/, Props/";
            subtitle.style.margin = "8px 0 0 0";
            subtitle.style.fontSize = "12px";
            subtitle.style.color = "#666";
            
            dropzone.appendChild(icon);
            dropzone.appendChild(title);
            dropzone.appendChild(subtitle);
            
            // 4. File input for ZIP
            const zipInput = document.createElement('input');
            zipInput.type = "file";
            zipInput.accept = ".zip,application/zip";
            zipInput.id = "saZipInput";
            zipInput.style.display = "block";
            zipInput.style.position = "absolute";
            zipInput.style.opacity = "0";
            zipInput.style.width = "1px";
            zipInput.style.height = "1px";
            dropzone.appendChild(zipInput);
            
            // 5. Header and Stats
            const header = document.createElement('div');
            header.innerHTML = "📦 Smart Asset Library";
            header.style.fontSize = "14px";
            header.style.fontWeight = "bold";
            header.style.marginBottom = "10px";
            
            const stats = document.createElement('div');
            stats.id = "saStats";
            stats.style.fontSize = "12px";
            stats.style.color = "#666";
            stats.style.marginTop = "8px";
            stats.style.marginBottom = "16px";
            stats.innerHTML = "Status: Waiting for Assets.zip";
            
            dropzone.parentNode.insertBefore(header, dropzone);
            dropzone.parentNode.insertBefore(stats, dropzone.nextSibling);
            
            // Add Debug Logs requested by user
            console.log("[ZIP UI] created");
            console.log("[ZIP UI] inserted");
            console.log("[ZIP UI] visible", getComputedStyle(dropzone).display);
            
            // 6. Event Listeners directly on dropzone
            dropzone.addEventListener('click', (e) => {
                if (e.target === zipInput || e.target === fileInput) return;
                e.preventDefault();
                e.stopPropagation();
                zipInput.click();
            });
            
            dropzone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.style.backgroundColor = "rgba(26, 115, 232, 0.05)";
                dropzone.style.borderColor = "#1a73e8";
            });
            
            dropzone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.style.backgroundColor = "transparent";
                dropzone.style.borderColor = "";
            });
            
            dropzone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.style.backgroundColor = "transparent";
                dropzone.style.borderColor = "";
                
                const files = e.dataTransfer.files;
                if (files.length > 0 && files[0].name.toLowerCase().endsWith('.zip')) {
                    processZipFile(files[0], stats);
                }
            });
            
            zipInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    processZipFile(e.target.files[0], stats);
                }
            });
        }`;

sa = sa.substring(0, startIndex) + newBlock + sa.substring(endIndex);

fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', sa, 'utf8');
console.log("Patched UI");
