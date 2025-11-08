const API_KEY = "AIzaSyCpMa8WzbFlSG36Iuxd3oPGRpVaxX3PRVU"; // 🔒 Replace with your own key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export async function getGeminiResponse(prompt) {
  const contextPrompt = `
You are UniAssist, an AI helper for students dealing with admission, hostel, and fee payment issues.
Provide clear, helpful, step-by-step guidance with a friendly tone.
`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: contextPrompt + "\n\nUser: " + prompt }] }
        ]
      })
    });

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t get a response.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Error: Unable to reach Gemini API. Please try again.";
  }
}
