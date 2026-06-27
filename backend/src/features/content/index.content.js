import getPrompt from "./index.prompt.js";
import { GoogleGenAI } from "@google/genai";
import { OpenAI } from "openai";

import {
  ProjectModel,
  ContentModel,
} from "#/database/mongoose/schema/index.model.js";
// generating content using gemini api
async function GeminiGenerateContent(prompt) {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const BASE_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

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
  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw new Error("Failed to generate content");
  }
}

//. genertating content using hugging face api
async function huggingface(prompt) {
  try {
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
    const rawContent = chatCompletion.choices[0].message.content;

    if (!rawContent) {
      throw new Error("No response from xAi");
    }
    const cleanContent = rawContent
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const contentData = JSON.parse(cleanContent);
    return {
      success: true,
      statusCode: 500,
      message: "successfully got content ",
      error: null,
      data: {
        content: contentData,
        reasoning_content: chatCompletion.choices[0].message.reasoning_content,
      },
    };
  } catch (error) {
    console.log("error in hugging face gen content ", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
//. genertating content using my deployed gemini ai api
async function mygeminiservice(prompt) {
  try {
    const res = await fetch(
      "https://api-service-d2wo.onrender.com/api/gemini/gen",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      },
    );
    if (!res) {
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }
    if (!res.ok) {
      console.log("Error from Gemini service:", res);
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }
    const data = await res.json();

    if (!data.data) {
      console.log("Invalid response from Gemini service:", data);
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }

    return {
      success: true,
      statusCode: 500,
      message: "successfully got content ",
      error: null,
      data: {
        content: data.data,
        reasoning_content: null,
      },
    };
  } catch (error) {
    console.log("error in local gemii gen content ", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

async function AI_Bazzar_Gemini_service(prompt) {
  try {
    const res = await fetch("https://ai-bazaar-dhvh.onrender.com/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    if (!res) {
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }
    if (!res.ok) {
      console.log("Error from Gemini service:", res);
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }
    const resdata = await res.json();

    if (!resdata.data) {
      console.log("Invalid response from AI Bazaar service:", resdata);
      return {
        success: false,
        statusCode: 500,
        message: "failed to fetch data",
        errorCode: "FAILED_TO_FETCH",
        errors: null,
      };
    }
    if(resdata.data.success){
      const rawContent= resdata.data.response
    //console.log(resdata);
    let data = rawContent;
  
    try {
      data = JSON.parse(rawContent)
    } catch {
      const cleanText = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      data = JSON.parse(cleanText);
    }

    return {
      success: true,
      statusCode: 500,
      message: "successfully got content ",
      error: null,
      data: {
        content: data,
        reasoning_content: null,
      },
    };
  }
  else{
    throw new Error("failed to get data")
  }
  } catch (error) {
    console.log("error in ai bazaar gemini gen content ", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
// chnages status of project in project collection
async function changeProjectStatus(userID, Data) {
  try {
    const result = await ProjectModel.updateOne(
      {
        userID,
        "projects.projectID": Data.projectID,
      },
      {
        $set: {
          "projects.$.contentStatus": Data.contentStatus,
        },
      },
    );

    if (result.matchedCount === 0 || result.modifiedCount === 0) {
      console.error("error in change project status", result);
      return {
        success: false,
        statusCode: 404,
        message: "Failed to change project status",
        errorCode: "FAILED_TO_UPDATE",
        errors: null,
      };
    }
    return {
      success: true,
      statusCode: 200,
      message: "successfully updated status",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("error in change project status", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}
async function storeContent(userID, projectID, Data) {
  try {
   const newContent = await ContentModel.create({
     userID,
     projectID,
     title: Data.title,
     description: Data.description,
     tags: Data.tags,
     thumbnailDescription: Data.thumbnailDescription,
   });
    return {
      success: true,
      statusCode: 200, // 200 is appropriate for updates, 201 for new creations
      message: "Content saved successfully",
      data: newContent,
    };
  } catch (error) {
    console.error("Error in upserting content:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: error.message,
    };
  }
}
async function generateContent(req, Data) {
  const userID = req.session.userID;
  const { projectID, videoDescription } = Data;
  try {
    const vedieoDesc = videoDescription
      ? videoDescription
      : `my vedieo is about web dev roadmap ensures that it is not old and future proof I suggest them to learn mern for next step learn nextjs I told every parts in  detail whatlearner have to do`;
    // changing project status to processing
    const change = await changeProjectStatus(userID, {
      projectID,
      contentStatus: "processing",
    });
    if (!change.success) throw new Error("Failed to update status");
    const prompt = getPrompt(vedieoDesc);
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt provided");
    }
    // getting content
    const content = await AI_Bazzar_Gemini_service(prompt);
    if (!content.success) {
      throw new Error("Failed to fetch data");
    }
    // creating content in db
 const finalData = {
   title: content.data.content.title.data,
   description: content.data.content.description.data,
   tags: content.data.content.tags.data,
   thumbnailDescription: content.data.content.thumbnailDescription.data,
 };
//  console.log(content.data.content);
//  console.log(finalData)
    const created = await storeContent(userID, projectID, finalData);
    if (created.success) {
      // changing project status to processing
      const change = await changeProjectStatus(userID, {
        projectID,
        contentStatus: "completed",
      });
      if (!change.success) throw new Error("Failed to update status");
      return {
        success: true,
        statusCode: 200,
        message: "successfully created content",
        data: finalData,
      };
    }
  } catch (error) {
   console.log("generate Error:", error);
    // changing project status to failed
    const change = await changeProjectStatus(userID, {
      projectID,
      contentStatus: "failed",
    });
    return {
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errorCode: "INTERNAL_SERVER_ERROR",
      errors: null,
    };
  }
}

export default generateContent; 
