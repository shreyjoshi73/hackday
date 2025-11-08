// Background worker to poll admission status periodically
chrome.alarms.create("jacStatusCheck", { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "jacStatusCheck") return;

  try {
    const res = await fetch("https://jacdelhi.admissions.nic.in/Applicant/Registration/CheckStatus", {
      credentials: "include"
    });
    const text = await res.text();

    // Basic check for keywords in HTML
    if (text.includes("Seat Allotted")) {
      chrome.notifications.create({
        title: "🎓 JAC Delhi Update",
        message: "You’ve been allotted a seat! Check the portal.",
        type: "basic",
        iconUrl: "icon.png"
      });
    } else if (text.includes("Document Verification")) {
      chrome.notifications.create({
        title: "📄 JAC Delhi Update",
        message: "Document verification in progress.",
        type: "basic",
        iconUrl: "icon.png"
      });
    }
  } catch (e) {
    console.warn("Error fetching JAC Delhi status:", e);
  }
});
