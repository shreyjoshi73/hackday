import { getGeminiResponse } from './gemini.js';

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let chatHistory = JSON.parse(localStorage.getItem("uniassist_chat")) || [];

function renderChat() {
  chatBox.innerHTML = "";
  chatHistory.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("message", msg.sender);
    div.textContent = msg.text;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Add user message
  chatHistory.push({ sender: "user", text });
  renderChat();
  userInput.value = "";

  // Add AI "thinking" placeholder
  const thinkingMsg = { sender: "ai", text: "Thinking... 🤔" };
  chatHistory.push(thinkingMsg);
  renderChat();

  // Get Gemini response
  const reply = await getGeminiResponse(text);

  // Replace placeholder with actual response
  chatHistory[chatHistory.length - 1].text = reply;
  renderChat();

  localStorage.setItem("uniassist_chat", JSON.stringify(chatHistory));
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

renderChat();
