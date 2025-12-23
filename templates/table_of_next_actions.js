
```dataviewjs
// --- CONFIGURATION ---
const targetTag = "#➡️"; 
// ---------------------

// 1. Get all files containing the tag, EXCLUDING the current file
const currentFilePath = dv.current().file.path;
const files = dv.pages(targetTag).where(p => p.file.path !== currentFilePath);

let rows = [];

for (let page of files) {
    // 2. Load file content
    const content = await app.vault.read(app.vault.getAbstractFileByPath(page.file.path));
    const lines = content.split("\n");
    
    let inCodeBlock = false;

    lines.forEach((line, index) => {
        // 3. Check for code block fences (detects ```dataviewjs, ```js, etc.)
        if (line.trim().startsWith("```")) {
            inCodeBlock = !inCodeBlock;
            return;
        }

        // 4. Skip lines if we are inside a code block
        if (inCodeBlock) return;

        // 5. If line has the tag, process it
        if (line.includes(targetTag)) {
            // Strip the tag out for clean display
            const cleanLine = line.replace(targetTag, "").trim();
            
            rows.push([
                page.file.link, 
                cleanLine, 
                index + 1
            ]);
        }
    });
}

// 6. Render
dv.header(2, "➡️ Action Items");
dv.table(["Source Note", "Content", "Line"], rows);
```
