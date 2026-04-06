import getPrompt from "./index.prompt.js"
import {
  GoogleGenAI
} from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY;

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function generateContent(userInput) {

  try {
    if (!userInput) {
      throw new Error("Invalid User Input");
    }
    const prompt = getPrompt(userInput);

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }

    const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

    
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error("No response from Gemini");
      }
      const cleanText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

      const data = JSON.parse(cleanText);

      return data;

    

    }

   catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw new Error("Failed to generate content");
  }
}

export default generateContent