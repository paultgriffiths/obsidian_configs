```dataview
TABLE WITHOUT ID 
file.link AS "Project Dashboard", 
file.mtime AS "Last Worked On", 

regexreplace(file.folder, "10_Projects/", "") AS "Project Folder" 

FROM "10_Projects" WHERE contains(file.name, "Dashboard") SORT file.mtime DESC LIMIT 5 
```
