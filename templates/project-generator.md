<%*
/* GRIF-LAB PROJECT GENERATOR
   This script creates the standard folder structure and moves this file
   to become the Dashboard.
*/

// 1. Prompt for the Project Name
const inputName = await tp.system.prompt("Enter Project Name (e.g. RAMIP_Aerosols):");

// Exit if the user cancels the prompt
if (inputName == null || inputName == "") { return; }

// 2. Standardize the naming (Adds PROJ_ prefix if you didn't type it)
const cleanName = inputName.replace(/[\\/:*?"<>|]/g, ""); // Remove illegal chars
const projName = cleanName.startsWith("PROJ_") ? cleanName : "PROJ_" + cleanName;
const rootPath = `10_Projects/${projName}`;

// 3. Define the Grif-Lab Subfolders
const subfolders = [
    "01_Admin_and_Meetings",
    "02_Experiments_and_Data",
    "03_Literature_Review",
    "04_Drafts_and_Output",
    "99_Archive"
];

// 4. Create the Folders (using Obsidian API)
// Create Root
if (!(await app.vault.adapter.exists(rootPath))) {
    await app.vault.createFolder(rootPath);
}

// Create Subfolders
for (const folder of subfolders) {
    const folderPath = `${rootPath}/${folder}`;
    if (!(await app.vault.adapter.exists(folderPath))) {
        await app.vault.createFolder(folderPath);
    }
}

// 5. Move and Rename THIS note to be the Dashboard
const dashboardName = `00_${projName}_Dashboard`;
await tp.file.move(`${rootPath}/${dashboardName}`);

// 6. Rename the file in the UI (optional, ensures title bar updates)
await tp.file.rename(dashboardName);

%># 🚀 Dashboard: <% projName %>

**Status:** 🟡 Active
**Goal:** [Define the finished state of this project]

---

## 📌 Quick Links
* [[<% rootPath %>/01_Admin_and_Meetings|01_Admin_and_Meetings]]
* [[<% rootPath %>/02_Experiments_and_Data|02_Experiments_and_Data]]
* [[<% rootPath %>/03_Literature_Review|03_Literature_Review]]
* [[<% rootPath %>/04_Drafts_and_Output|04_Drafts_and_Output]]

## ✅ Next Actions
- [ ] Review project goals
- [ ] Move relevant existing notes into the sub-folders

## 🧠 Scratchpad
*Capture quick thoughts here...*
