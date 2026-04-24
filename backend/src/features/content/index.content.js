import getPrompt from "./index.prompt.js"
import {
  GoogleGenAI
} from "@google/genai";
import { OpenAI } from "openai";
import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";

const API_KEY = process.env.GEMINI_API_KEY;

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function GeminiGenerateContent(userInput) {

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

async function xAiGenerateContent(userInput){
try {
  if (!userInput) {
    throw new Error("Invalid User Input");
  }
  const prompt = getPrompt(userInput);

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Invalid prompt provided");
  }
console.log(process.env.XAI_API_KEY);
  const xai = createXai({
    apiKey: process.env.XAI_API_KEY,
  });

  const response = await generateText({
    model: xai("grok-4.20-reasoning"), // ✅ correct way
    system: "You are a helpful AI assistant.",
    prompt: "What is the meaning of life?",
  });

  console.log(response.text); // ✅ correct
  console.log("response  ", response);
  const rawText = response.text;
  // const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("No response from xAi");
  }
  /*
  const cleanText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const data = JSON.parse(cleanText);
*/
  return rawText;
} catch (error) {
  console.error("xAi Service Error:", error);
  throw new Error("Failed to generate content");
}



}

async function huggingGenerateContent(userInput){
  try {
    if (!userInput) {
      throw new Error("Invalid User Input");
    }
    const prompt = getPrompt(userInput);

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }
    console.log(process.env.XAI_API_KEY);
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HUGGING_FACE_API_KEY,
    });

    const chatCompletion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-R1:novita",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    const rawText = chatCompletion.choices[0].message.content
    console.log("data fetched")
    console.log(chatCompletion.choices[0].message);
    // const rawText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error("No response from xAi");
    }
    
  const cleanText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const data = JSON.parse(cleanText);

    return data;
  } catch (error) {
    console.error("xAi Service Error:", error);
    throw new Error("Failed to generate content");
  }

}
export default huggingGenerateContent;