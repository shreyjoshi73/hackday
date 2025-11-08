# 🎓 UniAssist – AI Student Helper Chrome Extension

UniAssist is a Chrome extension designed to help students navigate common challenges in admissions, hostel allotment, and fee payments. It integrates Google Gemini AI, Firebase, DigiLocker, and supports language translation, providing a seamless, interactive experience for students.

---

## 🛠 Features

### Chat & AI Assistance
- Ask questions about admission, hostel, and fees
- Powered by Google Gemini API for clear, step-by-step guidance
- Maintains conversation history stored in Firebase

### Shortcut Buttons
Quick access to common queries:
- Track Admission Progress
- Show Hostel Availability
- View Fee Dashboard
- Upload Documents (DigiLocker)
- Translate Chat to another language

### Firebase Integration
- Stores chat history and user preferences
- Syncs conversations across sessions

### DigiLocker Integration
- Upload essential student documents securely via DigiLocker

### Language Translation
- Translate entire chat history into different languages using Gemini AI

---

## 📁 Folder Structure

```
uniassist-extension/
│
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── style.css
├── gemini.js
├── firebase.js
└── assets/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## ⚡ Installation

1. Clone or download the repository
2. Open Chrome → Extensions → Developer Mode → Load unpacked
3. Select the `uniassist-extension/` folder
4. Click on the UniAssist icon to open the chat interface

---

## 📝 Usage

1. Type your query in the chat box, e.g.:
   - "What documents do I need for admission?"
   - "How can I apply for hostel allotment?"
2. Or click shortcut buttons for quick actions
3. Use **Upload Documents** to open DigiLocker
4. Use **Translate Chat** to convert conversation to a different language

---

## 🔗 API Integrations

### Google Gemini AI
- Used for answering student queries
- Replace `YOUR_GEMINI_API_KEY` in `gemini.js` with your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Firebase
- Stores chat history
- Configure your Firebase project in `firebase.js`

### DigiLocker
- Opens DigiLocker portal for document uploads
- Requires user authentication via DigiLocker OAuth

---

## 🎨 Customization

- Update `style.css` to change colors, fonts, and chat layout
- Add more shortcut buttons in `popup.html` and link them in `popup.js`
- Add additional AI prompts in `gemini.js` to provide personalized student guidance

---

## 💡 Future Enhancements

- **Visual Dashboard**: Show progress bars for admission, hostel availability, and fee payment
- **Multi-user Support**: Save separate chats for multiple students
- **Backend Integration**: Connect with university systems for real-time updates
- **Push Notifications**: Alert students about deadlines and fees

---

## ⚠️ Notes

- Gemini API usage may require a paid plan for higher limits
- DigiLocker integration only opens the portal; full automation requires OAuth setup
- Firebase requires proper security rules for production

---

## 📜 License

This project is MIT Licensed. Feel free to use, modify, and distribute.

---

## 🚀 Getting Started

To get started with UniAssist development:

1. Set up your Google Gemini API key
2. Configure Firebase with your credentials
3. Customize the UI in `style.css`
4. Test the extension locally before deployment
5. Gather feedback from students and iterate

For more information or contributions, feel free to reach out!
