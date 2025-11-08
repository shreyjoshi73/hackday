import { getData } from "./db.js";

// --- Autofill JAC Delhi ---
document.getElementById("autofill").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      chrome.storage.sync.get(["userData"], ({ userData }) => {
        if (!userData) return;
        document.querySelectorAll("input, select, textarea").forEach(el => {
          if (userData[el.name]) el.value = userData[el.name];
        });
      });
    }
  });
});

// --- Admission Status ---
document.getElementById("checkStatus").addEventListener("click", async () => {
  const div = document.getElementById("status");
  div.innerText = "Checking JAC Delhi status...";
  try {
    const res = await fetch("https://jacdelhi.admissions.nic.in/Applicant/Registration/CheckStatus", {
      credentials: "include"
    });
    const text = await res.text();
    if (text.includes("Seat Allotted")) div.innerText = "🎓 Seat Allotted!";
    else if (text.includes("Document Verification")) div.innerText = "📄 Document Verification in progress.";
    else div.innerText = "No update yet.";
  } catch {
    div.innerText = "Failed to fetch status.";
  }
});

// --- Hostel Availability ---
document.getElementById("showRooms").addEventListener("click", async () => {
  const roomsDiv = document.getElementById("rooms");
  roomsDiv.innerHTML = "Loading room data...";
  const data = await getData("hostelRooms");
  if (!data) {
    roomsDiv.innerHTML = "Visit hostels.dtu.ac.in first to scrape room info.";
    return;
  }
  const available = data.rooms.filter(r => r.vacant > 0);
  roomsDiv.innerHTML = `
    <h3>🏠 Available Rooms (${available.length})</h3>
    <div class="room-grid">
      ${available.map(r => `
        <div class="room-card">
          <h4>${r.name}</h4>
          <p>Type: ${r.type}</p>
          <p>Vacant: ${r.vacant}</p>
        </div>`).join("")}
    </div>`;
});

// --- Dark Mode ---
const darkToggle = document.getElementById("darkMode");
darkToggle.addEventListener("change", e => {
  document.body.classList.toggle("dark", e.target.checked);
  chrome.storage.sync.set({ darkMode: e.target.checked });
});
chrome.storage.sync.get(["darkMode"], ({ darkMode }) => {
  if (darkMode) {
    darkToggle.checked = true;
    document.body.classList.add("dark");
  }
});
