import { saveData, getData } from "./db.js";

// --- Auto-fill ---
chrome.storage.sync.get(["userData"], async ({ userData }) => {
  if (!userData) return;
  document.querySelectorAll("input, select, textarea").forEach(el => {
    if (userData[el.name]) el.value = userData[el.name];
  });
});

// --- Auto-save using IndexedDB ---
document.querySelectorAll("input, select, textarea").forEach(el => {
  el.addEventListener("input", async () => {
    const formData = {};
    document.querySelectorAll("input, select, textarea").forEach(i => {
      formData[i.name] = i.value;
    });
    await saveData("currentForm", { timestamp: Date.now(), formData });
  });
});

// --- AI-based form validation ---
function aiCheckForm() {
  const invalids = [];
  document.querySelectorAll("input[required]").forEach(input => {
    if (!input.value || input.value.trim() === "") {
      invalids.push(input.name);
    }
    if (input.type === "email" && !input.value.includes("@")) {
      invalids.push(input.name);
    }
  });
  if (invalids.length)
    alert("⚠️ Potential errors found in fields: " + invalids.join(", "));
}
window.addEventListener("beforeunload", aiCheckForm);

