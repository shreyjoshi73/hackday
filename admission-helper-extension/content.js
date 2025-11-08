import { saveData } from "./db.js";

// --- Autofill JAC Delhi forms ---
chrome.storage.sync.get(["userData"], ({ userData }) => {
  if (!userData) return;
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (userData[el.name]) el.value = userData[el.name];
  });
});

// --- Auto-save to IndexedDB ---
document.querySelectorAll("input, select, textarea").forEach(el => {
  el.addEventListener("input", async () => {
    const formData = {};
    document.querySelectorAll("input, select, textarea").forEach(i => {
      formData[i.name] = i.value;
    });
    await saveData("formProgress", { time: Date.now(), formData });
  });
});

// --- AI-based validation with suggestions ---
function aiValidateForm() {
  const suggestions = [];
  document.querySelectorAll("input, textarea").forEach(el => {
    const val = el.value.trim();
    if (el.required && !val) {
      suggestions.push(`${el.name || "Unnamed"} field seems empty.`);
    }
    if (el.type === "email" && val && !val.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      suggestions.push(`Email "${val}" looks incorrect.`);
    }
    if (el.name && el.name.toLowerCase().includes("phone") && val.length < 10) {
      suggestions.push("Phone number seems too short.");
    }
  });
  if (suggestions.length) alert("⚠️ Form Suggestions:\n" + suggestions.join("\n"));
}
window.addEventListener("beforeunload", aiValidateForm);

// --- Hostel Table Scraper (runs only on DTU Hostel site) ---
if (location.hostname.includes("hostels.dtu.ac.in")) {
  const tables = document.querySelectorAll("table");
  if (tables.length > 0) {
    const rooms = [];
    tables.forEach(table => {
      table.querySelectorAll("tr").forEach(row => {
        const cells = [...row.querySelectorAll("td")].map(c => c.innerText.trim());
        if (cells.length >= 3 && cells[0].match(/\d/)) {
          rooms.push({
            name: cells[0],
            type: cells[1],
            vacant: parseInt(cells[2]) || 0
          });
        }
      });
    });
    saveData("hostelRooms", { time: Date.now(), rooms });
  }
}
