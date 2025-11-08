// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveChatToFirebase(chatHistory) {
  await setDoc(doc(db, "chats", "user1"), { chat: chatHistory });
}

export async function loadChatFromFirebase() {
  const docSnap = await getDoc(doc(db, "chats", "user1"));
  if (docSnap.exists()) return docSnap.data().chat;
  return null;
}
