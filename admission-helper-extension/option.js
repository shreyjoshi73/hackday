// --- Options.js: Load and Save Extension Settings ---

// Key used in Chrome storage
const STORAGE_KEY = 'uniAssistSettings';

/**
 * Saves the options form data to Chrome storage.
 * It uses chrome.storage.sync so settings are synced across user devices.
 */
function saveOptions() {
    const portalUrl = document.getElementById('portal-url').value;
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const dob = document.getElementById('dob').value;
    const hostelEnabled = document.getElementById('hostel-notifier-toggle').checked;

    const settings = {
        portalUrl: portalUrl,
        userData: {
            fullName: fullName,
            email: email,
            dob: dob
        },
        hostelMonitor: {
            enabled: hostelEnabled
        }
    };

    // Use chrome.storage.sync for persistence
    chrome.storage.sync.set({ [STORAGE_KEY]: settings }, () => {
        // Display status message
        const status = document.getElementById('status-message');
        status.textContent = 'Settings Saved!';
        status.style.opacity = '1';
        
        // Temporarily change button state and text
        const saveButton = document.getElementById('save-button');
        saveButton.textContent = 'Saved!';
        saveButton.disabled = true;

        // Hide status and revert button after 2 seconds
        setTimeout(() => {
            status.style.opacity = '0';
            saveButton.textContent = 'Save Settings';
            saveButton.disabled = false;
        }, 2000);

        // Notify background script if hostel monitoring state changed
        // This makes sure the alarm is started/stopped instantly when the user changes the setting.
        chrome.runtime.sendMessage({ 
            action: "updateHostelMonitor", 
            enabled: hostelEnabled
        });
    });
}

/**
 * Loads the options from Chrome storage and populates the form.
 */
function loadOptions() {
    chrome.storage.sync.get(STORAGE_KEY, (data) => {
        const settings = data[STORAGE_KEY];

        if (settings) {
            // Portal Setup
            document.getElementById('portal-url').value = settings.portalUrl || '';

            // Autofill Data
            document.getElementById('full-name').value = settings.userData?.fullName || '';
            document.getElementById('email').value = settings.userData?.email || '';
            document.getElementById('dob').value = settings.userData?.dob || '';

            // Hostel Monitor
            document.getElementById('hostel-notifier-toggle').checked = settings.hostelMonitor?.enabled || false;
        }
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    document.getElementById('options-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveOptions();
    });
});
