// Simulated API polling for real-time status
chrome.alarms.create("statusCheck", { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== "statusCheck") return;

  try {
    const res = await fetch("https://api.universityportal.edu/application/status");
    const data = await res.json();

    if (data.statusChanged) {
      chrome.notifications.create({
        title: "🎓 Application Update",
        message: `Your new status: ${data.newStatus}`,
        iconUrl: "icon.png",
        type: "basic"
      });
    }
  } catch (err) {
    console.warn("Status API check failed:", err);
  }
});

