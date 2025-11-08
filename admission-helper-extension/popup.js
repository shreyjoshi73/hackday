// --- Popup.js: UI Logic, Gemini API, and Chrome Message Handlers ---

// Constants (Must be defined here for the popup script execution)
const apiKey = ""; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
const MAX_RETRIES = 3;

// --- Utility Functions (Copied from previous inline script) ---

/**
 * Converts a markdown string to HTML for display in the chat.
 */
function markdownToHtml(markdownText) {
    let html = markdownText
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br>'); // Newlines
    return html;
}

/**
 * Simulates an API call with exponential backoff.
 */
async function fetchWithRetry(payload) {
    let lastError = null;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            lastError = error;
            if (i < MAX_RETRIES - 1) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error(`API failed after ${MAX_RETRIES} attempts: ${lastError.message}`);
}

/**
 * Appends a message to the chat container.
 */
function appendMessage(text, isUser, sources = []) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    const baseClasses = "max-w-[85%] text-sm p-2 rounded-xl shadow";
    bubble.className = isUser
        ? `${baseClasses} bg-indigo-600 text-white rounded-br-none`
        : `${baseClasses} bg-indigo-100 text-indigo-900 rounded-tl-none`;

    bubble.innerHTML = markdownToHtml(text);

    messageDiv.appendChild(bubble);
    chatContainer.appendChild(messageDiv);

    if (sources.length > 0 && !isUser) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = "text-xs text-gray-500 mt-1 space-y-1 ml-2";
        sourcesDiv.innerHTML = '<strong>Sources:</strong>';
        sources.forEach(source => {
            const link = document.createElement('a');
            link.href = source.uri;
            link.textContent = source.title || source.uri;
            link.target = '_blank';
            link.className = 'block truncate hover:text-indigo-600';
            sourcesDiv.appendChild(link);
        });
        bubble.appendChild(sourcesDiv);
    }
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Displays a temporary loading indicator.
 */
function showLoading() {
    const chatContainer = document.getElementById('chat-container');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.className = 'flex justify-start';
    loadingDiv.innerHTML = `
        <div class="max-w-[80%] bg-indigo-100 text-indigo-900 text-sm p-2 rounded-xl rounded-tl-none shadow">
            <div class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Thinking...</span>
            </div>
        </div>
    `;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return loadingDiv;
}

/**
 * Main function to send the user's message to the Gemini API.
 */
async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const errorMessageDiv = document.getElementById('error-message');
    const userQuery = inputElement.value.trim();

    if (!userQuery) return;

    appendMessage(userQuery, true);
    inputElement.value = '';

    sendButton.disabled = true;
    inputElement.disabled = true;
    errorMessageDiv.classList.add('hidden');
    const loadingIndicator = showLoading();

    try {
        const systemPrompt = "You are Uni-Assist, a friendly and accurate university student assistant. Your goal is to provide concise, factual, and helpful information. Use the available tools (Google Search) to ground your answers in real-time information when necessary. Keep your responses under 3 sentences unless complex explanation is required.";

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            tools: [{ "google_search": {} }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        const result = await fetchWithRetry(payload);
        const candidate = result.candidates?.[0];
        let generatedText = "Sorry, I encountered an issue retrieving the information.";
        let sources = [];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            generatedText = candidate.content.parts[0].text;
            const groundingMetadata = candidate.groundingMetadata;
            if (groundingMetadata && groundingMetadata.groundingAttributions) {
                sources = groundingMetadata.groundingAttributions
                    .map(attribution => ({
                        uri: attribution.web?.uri,
                        title: attribution.web?.title,
                    }))
                    .filter(source => source.uri && source.title);
            }
        }
        
        loadingIndicator.remove();
        appendMessage(generatedText, false, sources);

    } catch (error) {
        console.error("Gemini API Error:", error);
        loadingIndicator.remove();
        errorMessageDiv.textContent = 'Connection error. Please check your network and try again.';
        errorMessageDiv.classList.remove('hidden');
        appendMessage("I'm having trouble connecting right now. Please try again in a moment.", false);
    } finally {
        sendButton.disabled = false;
        inputElement.disabled = false;
        inputElement.focus();
    }
}

// --- Chrome Extension Interaction Handlers ---

/**
 * Finds the currently active tab in the current window.
 * @returns {Promise<chrome.tabs.Tab | undefined>}
 */
async function getCurrentTab() {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

/**
 * Handles the click for the Admission Automator button.
 * Sends a message to the content script on the active tab.
 */
async function handleAdmissionAutomator() {
    const tab = await getCurrentTab();
    if (tab && tab.url && tab.url.includes("university-portal.edu")) { // Check if we are on the target domain
        chrome.tabs.sendMessage(tab.id, { action: "autoFill" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to content script:", chrome.runtime.lastError.message);
                appendMessage("Error: Please make sure you are on the university application portal page to use the Admission Automator.", false);
            } else if (response && response.status) {
                appendMessage(`Success: Form filling status received from page: ${response.status}`, false);
            }
        });
    } else {
        appendMessage("Action Failed: The Admission Automator can only run when you are viewing the university portal.", false);
    }
}

/**
 * Handles the click for the Hostel Notifier button.
 * Sends a message to the background service worker to start monitoring.
 */
function handleHostelNotifier() {
    // Send a message to background.js
    chrome.runtime.sendMessage({ action: "startHostelMonitor" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error starting Hostel Monitor:", chrome.runtime.lastError.message);
            appendMessage("Error: Could not start hostel monitoring service. Check background script.", false);
        } else if (response && response.status) {
            appendMessage(`Hostel Monitor: ${response.status} The service will check the portal every hour for updates.`, false);
        }
    });
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners to the feature buttons
    document.querySelector('.admission-button').addEventListener('click', handleAdmissionAutomator);
    document.querySelector('.hostel-button').addEventListener('click', handleHostelNotifier);
    
    // Attach event listener for the AI Assistant's Send button and Enter key
    document.getElementById('send-button').addEventListener('click', sendMessage);
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
