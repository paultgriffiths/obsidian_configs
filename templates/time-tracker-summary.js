// --- CONFIGURATION ---
// looks for entries in the current notebook headed by date and then computes time spent on each bullet
// e.g. 1130-1230 Faff uselessly on dataview will appear in a summary table

// 1. Date format in your headings (e.g., ## 2023-10-27)
const headerDateFormat = "YYYY-MM-DD"; 

// 2. FILTER RANGE (YYYY-MM-DD)
// Set to null to show everything.
// Example: const startDateFilter = "2023-12-01";
const startDateFilter = "2025-12-10"; 
const endDateFilter   = null;

// --- MAIN LOGIC ---

// Get the file object for the note this script is currently inside
const file = app.vault.getAbstractFileByPath(dv.current().file.path);

// Read the raw text content of THIS file
const content = await app.vault.read(file);
const lines = content.split("\n");

let dateMap = new Map();
let currentDate = null;

// Regex to find the Date in a Level 2 header (## )
const headerRegex = /^##\s+(.*)/; 

// Regex to find time entries: 0730-1056 Description
const timeRegex = /(\d{2}\d{2})-(\d{2}\d{2})\s+(.*)/;

for (let line of lines) {
    // 1. Check for Header
    const headerMatch = line.match(headerRegex);
    if (headerMatch) {
        let potentialDate = moment(headerMatch[1], headerDateFormat, true);
        if (potentialDate.isValid()) {
            currentDate = potentialDate.format("YYYY-MM-DD");
            if (!dateMap.has(currentDate)) {
                dateMap.set(currentDate, { totalMinutes: 0, tasks: [] });
            }
        } else {
            currentDate = null;
        }
        continue;
    }

    // 2. Check for Time Entry (only if under a valid date header)
    if (currentDate) {
        const timeMatch = line.match(timeRegex);
        if (timeMatch) {
            const startStr = timeMatch[1];
            const endStr = timeMatch[2];
            const taskDesc = timeMatch[3];

            const start = moment(startStr, "HH:mm");
            const end = moment(endStr, "HH:mm");
            
            // Handle cross-midnight
            if (end.isBefore(start)) end.add(1, 'day');

            const durationMins = end.diff(start, 'minutes');

            let data = dateMap.get(currentDate);
            data.totalMinutes += durationMins;
            data.tasks.push(`${startStr}-${endStr} ${taskDesc} (**${formatDuration(durationMins)}**)`);
        }
    }
}

// Helper: Format minutes
function formatDuration(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
}

// Filter and Build Table
let tableData = [];
let totalRangeMinutes = 0; 

for (let [dateStr, data] of dateMap) {
    let entryDate = moment(dateStr);

    // Filter Logic
    let isAfterStart = startDateFilter ? entryDate.isSameOrAfter(startDateFilter) : true;
    let isBeforeEnd  = endDateFilter   ? entryDate.isSameOrBefore(endDateFilter)  : true;

    if (isAfterStart && isBeforeEnd) {
        tableData.push([
            dateStr, 
            formatDuration(data.totalMinutes), 
            data.tasks.join("<br>") 
        ]);
        totalRangeMinutes += data.totalMinutes;
    }
}

// Sort by date (descending)
tableData.sort((a, b) => b[0].localeCompare(a[0]));

// Render
dv.header(3, `⏱️ Time Log Summary`);
if (startDateFilter || endDateFilter) {
    dv.paragraph(`Showing: **${startDateFilter || "Start"}** to **${endDateFilter || "End"}**`);
}
dv.paragraph(`**Grand Total:** ${formatDuration(totalRangeMinutes)}`);
dv.table(["Date", "Total Time", "Activities"], tableData);
