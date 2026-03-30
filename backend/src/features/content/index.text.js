import prompt from "./index.prompt.js"

const API_KEY = process.env.GEMINI_API_KEY;

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

 async function generate() {
  try {

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Gemini API Error: ${response.status} - ${errorData.error?.message}`
      );
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return text;

  } catch (error) {
     console.error("Gemini Service Error:", error.message);
    throw new Error("Failed to generate content");
  }
}