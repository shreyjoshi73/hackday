// --- Background.js: Persistent Tasks and Inter-Script Communication ---

// 1. Session Refresh Logic (Addressing: Frequent website timeouts, lost session data)
const SESSION_REFRESH_INTERVAL_MINUTES = 10;
chrome.alarms.create("sessionRefresh", {
    delayInMinutes: 1, // Start soon after installation
    periodInMinutes: SESSION_REFRESH_INTERVAL_MINUTES 
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "sessionRefresh") {
        console.log("Attempting session refresh...");
        // In a real scenario, this would involve silently navigating an iframe 
        // or making an AJAX request to a known 'keep-alive' endpoint of the portal
        // to prevent session timeout.
        // For security reasons, this function is a placeholder and requires deep knowledge 
        // of the target portal's authentication flow.
        
        // Example: If the user is on the portal, refresh its tab
        chrome.tabs.query({ url: "*://*.university-portal.edu/*" }, (tabs) => {
            if (tabs.length > 0) {
                // Send a message to the content script in that tab to perform the check
                chrome.tabs.sendMessage(tabs[0].id, { action: "keepAliveCheck" });
            }
        });
    }

    // 2. Hostel Allotment Notifier (Addressing: Lack of notifications)
    if (alarm.name === "hostelCheck") {
        console.log("Checking for hostel allotment updates...");
        // TODO: Implement web scraping logic or API call to check hostel status.
        // Example logic:
        // fetch('hostel-status-api-or-page')
        // .then(response => response.json())
        // .then(data => {
        //     if (data.status === 'ALLOTTED') {
        //         showNotification("Hostel Update", "Congratulations! Your hostel room has been allotted.");
        //         // Stop the alarm once allotted to save resources
        //         chrome.alarms.clear("hostelCheck");
        //     }
        // });
    }
});

// Function to show a Chrome notification
function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon-48.png',
        title: title,
        message: message
    });
}


// 3. Listener for Hostel Check Request from Popup.html
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startHostelMonitor") {
        // The popup requests monitoring to start
        
        // Create an alarm to check every hour (adjust as needed)
        chrome.alarms.create("hostelCheck", {
            periodInMinutes: 60
        });
        
        sendResponse({ status: "Hostel monitoring started." });
    }
    
    // Always return true to indicate you want to send a response asynchronously
    return true; 
});

