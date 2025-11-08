// --- Content.js: Form Automation and Status Scraping ---

/**
 * Executes a one-click form fill on the current page.
 * (Addressing: Manual form filling, error-prone data entry)
 * @param {object} userData - Placeholder data that would be stored securely in Chrome storage.
 */
function autoFillForm(userData) {
    console.log("Running auto-fill script...");
    
    // --- Admission Form Automation Logic ---
    // Example: Find form fields by name, ID, or selector and populate them.
    
    // Note: Use the actual element selectors from the target university portal
    const nameInput = document.getElementById('applicant-name');
    if (nameInput) {
        nameInput.value = userData.fullName || 'John Doe';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    const emailInput = document.querySelector('input[name="email"]');
    if (emailInput) {
        emailInput.value = userData.email || 'john.doe@example.com';
        emailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // You can also handle dropdowns or checkboxes here.
    
    // Display a message to the user
    // (Using a custom modal instead of alert() as required)
    const message = "Uni-Assist: Form data has been automatically filled. Please review and submit.";
    displayCustomMessage(message);
}

/**
 * Scrapes the application status from the current page.
 * (Addressing: Inability to track application status in real-time)
 */
function scrapeApplicationStatus() {
    console.log("Scraping application status...");
    
    // --- Status Scraping Logic ---
    // Example: Find a key status element on the page
    const statusElement = document.querySelector('.application-status h3');
    let statusText = statusElement ? statusElement.textContent.trim() : 'Status element not found.';
    
    // If the status is found, send it back to the background script or storage
    if (statusElement) {
        chrome.runtime.sendMessage({ 
            action: "updateStatus", 
            status: statusText,
            timestamp: new Date().toISOString()
        });
    }

    displayCustomMessage(`Current Application Status: ${statusText}`);
}


/**
 * Displays a non-alert notification modal on the page.
 */
function displayCustomMessage(message) {
    let modal = document.getElementById('uni-assist-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'uni-assist-modal';
        modal.style.cssText = `
            position: fixed; top: 10px; right: 10px; z-index: 10000; 
            padding: 12px 20px; background-color: #4f46e5; color: white; 
            border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); 
            font-family: sans-serif; font-size: 14px; opacity: 0; 
            transition: opacity 0.5s, transform 0.5s; transform: translateY(-20px);
        `;
        document.body.appendChild(modal);
    }
    
    modal.textContent = 'Uni-Assist: ' + message;
    
    // Show the modal
    modal.style.opacity = '1';
    modal.style.transform = 'translateY(0)';
    
    // Hide after 4 seconds
    setTimeout(() => {
        modal.style.opacity = '0';
        modal.style.transform = 'translateY(-20px)';
    }, 4000);
}


// --- Message Listener for Communication from Popup/Background ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Message from the popup/background to perform an action on the page
    if (request.action === "autoFill") {
        // Dummy data for example. In a real app, this would come from chrome.storage.local
        const dummyUserData = {
            fullName: "Alice P. Johnson",
            email: "alice.johnson@example.com",
            dob: "1999-05-20"
        };
        autoFillForm(dummyUserData);
        sendResponse({ status: "Form filling attempted." });
    } 
    
    if (request.action === "trackStatus") {
        scrapeApplicationStatus();
        sendResponse({ status: "Status check initiated." });
    }
    
    if (request.action === "keepAliveCheck") {
        // Logic to make a small request to the server to refresh the session timeout
        // For a real portal, you'd need the actual URL/logic.
        console.log("Content script received keepAliveCheck. Pinging server...");
        // Example: making a dummy request to the same origin to refresh session
        fetch(window.location.href, { method: 'HEAD' })
            .then(() => console.log('Session ping successful.'))
            .catch(error => console.error('Session ping failed:', error));
        
        sendResponse({ status: "Keep-alive ping sent." });
    }
    
    return true; // Indicates we will send a response asynchronously
});

// Initial log to confirm content script is injected
console.log("Uni-Assist content script loaded on:", window.location.href);

