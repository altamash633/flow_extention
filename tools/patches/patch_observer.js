const fs = require('fs');

let sa = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

const targetStart = "const observer = new MutationObserver((mutations) => {";
const targetEnd = "observer.observe(document.body, { childList: true, subtree: true });";

const startIndex = sa.indexOf(targetStart);
const endIndex = sa.indexOf(targetEnd);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find the observer block.");
    process.exit(1);
}

const newObserver = `const observer = new MutationObserver((mutations) => {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    for (let fileInput of fileInputs) {
        // Skip our injected inputs
        if (fileInput.id === 'saZipInput') continue;
        
        const dropzone = fileInput.closest('div[class*="border-dashed"]');
        if (dropzone) {
            if (dropzone.dataset.smartPatched) {
                // To avoid spamming, only log this if we actually care, but the user requested:
                // console.log("[PATCH] already patched"); 
                // Actually if I log this on every mutation it will freeze the console.
                // Let's just return/continue silently or log once.
                continue;
            }
            
            console.log("[PATCH] native dropzone found");
            dropzone.dataset.smartPatched = "true";
            
            // Hide its original children
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
            
            // 5. Header
            const header = document.createElement('div');
            header.innerHTML = "📦 Smart Asset Library";
            header.style.fontSize = "14px";
            header.style.fontWeight = "bold";
            header.style.marginBottom = "10px";
            
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
            
            const stats = document.createElement('div');
            stats.id = "saStats";
            stats.style.fontSize = "12px";
            stats.style.color = "#666";
            stats.style.marginTop = "8px";
            stats.style.marginBottom = "16px";
            stats.innerHTML = "Status: Waiting for Assets.zip";
            
            // Append everything inside dropzone. NO insertBefore/parentNode used.
            dropzone.appendChild(header);
            dropzone.appendChild(icon);
            dropzone.appendChild(title);
            dropzone.appendChild(subtitle);
            dropzone.appendChild(zipInput);
            dropzone.appendChild(stats);
            
            console.log("[PATCH] native dropzone updated");
            
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
        }
    }
});
\n`;

sa = sa.substring(0, startIndex) + newObserver + sa.substring(endIndex);

fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', sa, 'utf8');
console.log("Patched MutationObserver successfully.");
