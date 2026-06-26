const fs = require('fs');

let sa = fs.readFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', 'utf8');

const targetStart = `            zipInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    processZipFile(e.target.files[0], stats);
                }
            });
        });`;

const startIndex = sa.indexOf(targetStart);
if (startIndex !== -1) {
    const startOfBad = startIndex + targetStart.indexOf('        });');
    
    // We want to delete from `        });` down to just before `observer.observe`
    const observerIndex = sa.indexOf('observer.observe(document.body');
    if (observerIndex !== -1) {
        // The proper closing for the MutationObserver block is:
        //         }
        //     }
        // });
        const replacement = `        }\n    }\n});\n\n`;
        sa = sa.substring(0, startOfBad) + replacement + sa.substring(observerIndex);
        fs.writeFileSync('C:/chorome_extention/reference/location/clean_extension/assets/smart_assets.js', sa, 'utf8');
        console.log("Fixed syntax block.");
    }
}
