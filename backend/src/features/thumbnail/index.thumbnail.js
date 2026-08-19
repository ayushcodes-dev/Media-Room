import genPrompt from "./prompt.thumbnail.js";
import cloudinary, { configureCloudinary } from "#/config/cloudinary.config.js";
import { AI_Bazzar_Gemini_service } from "#/features/content/index.content.js";
import {
  ProjectModel,
  ThumbnailModel,
  UsageModel,
} from "#/database/mongoose/schema/index.model.js";

/**
 * Generates an image buffer using NVIDIA NIM Visual Generative AI (FLUX.1-dev)
 * @param {string} prompt - Prompt for the image model
 * @returns {Promise<Buffer>} - Image buffer
 */
async function genimg(prompt) {
  try {
    const apiKey =
      process.env.NVIDIA_API_KEY ||
      process.env.NVIDIA_NIM_API_KEY ||
      process.env.NGC_API_KEY;

    if (!apiKey) {
      throw new Error(
        "NVIDIA API Key is missing. Please set NVIDIA_API_KEY in backend/.env.local",
      );
    }

    console.log("Generating image with NVIDIA NIM FLUX.1-dev...");
    const response = await fetch(
      "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey.trim()}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          mode: "base",
          cfg_scale: 3.5,
          steps: 25,
          seed: 0,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error Response:", response.status, errorText);
      throw new Error(
        `NVIDIA API request failed with status ${response.status}: ${errorText}`,
      );
    }

    const data = await response.json();

    const base64Data =
      data?.artifacts?.[0]?.base64 ||
      data?.data?.[0]?.b64_json ||
      data?.images?.[0];

    if (!base64Data) {
      throw new Error("No image artifact received from NVIDIA API response");
    }

    const buffer = Buffer.from(base64Data, "base64");
    console.log("Successfully generated image with NVIDIA FLUX.1-dev");
    return buffer;
  } catch (error) {
    console.error("Error in genimg (NVIDIA):", error);
    throw new Error("Failed to generate image from NVIDIA AI: " + error.message);
  }
}

/**
 * Step 2 helper: Uploads image buffer to Cloudinary in a separate function
 * @param {Buffer|string} imageInput - Buffer or image string/URL
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<string>} - Cloudinary secure URL
 */
async function uploadToCloudinary(imageInput, folder = "thumbnails") {
  try {
    // Re-verify Cloudinary configuration
    configureCloudinary();

    const hasKeys =
      process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== "your_cloudinary_cloud_name" &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
        process.env.CLOUDINARY_API_SECRET &&
        process.env.CLOUDINARY_API_SECRET !== "your_cloudinary_api_secret");

    if (!hasKeys) {
      console.warn("Cloudinary credentials not configured. Using data URI fallback.");
      if (Buffer.isBuffer(imageInput)) {
        return `data:image/jpeg;base64,${imageInput.toString("base64")}`;
      } else if (typeof imageInput === "string") {
        return imageInput;
      }
    }

    if (Buffer.isBuffer(imageInput)) {
      return new Promise((resolve) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.warn("Cloudinary upload failed, falling back to data URI:", error.message);
              return resolve(`data:image/jpeg;base64,${imageInput.toString("base64")}`);
            }
            resolve(result.secure_url || result.url);
          }
        );
        uploadStream.end(imageInput);
      });
    } else if (typeof imageInput === "string") {
      const result = await cloudinary.uploader.upload(imageInput, {
        folder: folder,
        resource_type: "image",
      });
      return result.secure_url || result.url;
    } else {
      throw new Error("Invalid image input format for Cloudinary upload");
    }
  } catch (error) {
    console.warn("Error in uploadToCloudinary, falling back to data URI:", error.message);
    if (Buffer.isBuffer(imageInput)) {
      return `data:image/jpeg;base64,${imageInput.toString("base64")}`;
    }
    throw error;
  }
}

/**
 * Changes thumbnail status of a project in Project collection
 * @param {string} userID 
 * @param {{ projectID: string, thumbnailStatus: string }} data 
 */
async function changeProjectThumbnailStatus(userID, { projectID, thumbnailStatus }) {
  try {
    const result = await ProjectModel.updateOne(
      {
        userID,
        "projects.projectID": projectID,
      },
      {
        $set: {
          "projects.$.thumbnailStatus": thumbnailStatus,
        },
      }
    );

    if (result.matchedCount === 0) {
      console.warn("No matching project found to update thumbnail status for projectID:", projectID);
    }
    return {
      success: true,
      statusCode: 200,
      message: "Successfully updated thumbnail status",
    };
  } catch (error) {
    console.error("Error in changeProjectThumbnailStatus:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update project status",
      errorCode: "FAILED_TO_UPDATE",
      errors: error.message,
    };
  }
}

/**
 * Step 3 helper: Stores thumbnail record in Thumbnail collection
 * @param {string} userID 
 * @param {string} projectID 
 * @param {string} thumbnailURL 
 * @param {string} prompt
 * @param {string} customPrompt
 */
async function storeThumbnail(userID, projectID, thumbnailURL, prompt = "", customPrompt = "") {
  try {
    const newThumbnail = await ThumbnailModel.create({
      userID,
      projectID,
      thumbnailURL,
      prompt,
      customPrompt,
    });
    return {
      success: true,
      statusCode: 200,
      message: "Thumbnail saved successfully",
      data: newThumbnail,
    };
  } catch (error) {
    console.error("Error in storeThumbnail:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to save thumbnail in database",
      errorCode: "FAILED_TO_SAVE",
      errors: error.message,
    };
  }
}

/**
 * Updates credits usage
 * @param {string} userID 
 * @param {{ orderID: string, action: string, projectID: string, creditUsed: number }} data 
 */
async function updateCredit(userID, data) {
  try {
    const result = await UsageModel.updateOne(
      {
        userID,
        orderID: data.orderID,
      },
      {
        $inc: { usedCredit: data.creditUsed },
        $push: {
          usage: {
            action: data.action,
            date: new Date(),
            projectID: data.projectID,
            creditUsed: data.creditUsed,
          },
        },
      }
    );
    return {
      success: true,
      statusCode: 200,
      message: "Successfully updated credit usage",
    };
  } catch (error) {
    console.error("Error in updateCredit for thumbnail:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to update credit usage",
      errorCode: "FAILED_TO_UPDATE_CREDIT",
      errors: error.message,
    };
  }
}

/**
 * Main generateThumbnail handler:
 * 1. Calls AI Bazaar (Gemini) with video description & custom prompt to generate the optimal high-CTR image prompt.
 * 2. Concurrently marks project thumbnailStatus as 'processing' and calls genimg (NVIDIA FLUX.1-dev) with the generated prompt.
 * 3. Saves generated image to Cloudinary in a separate function.
 * 4. Creates a doc in the Thumbnail collection with the image link.
 * 5. Updates project status to 'completed' and deducts usage credits.
 * 6. Returns the image link.
 */
async function generateThumbnail(req, { projectID, description, customPrompt }) {
  const userID = req.session?.userID;
  try {
    console.log("Request received to generate thumbnail for project:", projectID);

    // Update project thumbnail status to "processing"
    await changeProjectThumbnailStatus(userID, {
      projectID,
      thumbnailStatus: "processing",
    });

    // 1. Build meta-prompt to craft the best SEO & high-CTR prompt
    const metaPrompt = genPrompt({
      description: description || "High engagement, high CTR YouTube video",
      customPrompt: customPrompt || "",
    });

    // 2. Call AI Bazaar Gemini service to generate the optimal image prompt
    console.log("Calling AI Bazaar to generate optimized thumbnail prompt...");
    const aiResponse = await AI_Bazzar_Gemini_service(metaPrompt);
    console.log(aiResponse)
    let imagePrompt = "";
    let aiMetadata = null;

    if (aiResponse?.success && aiResponse?.data?.content) {
      const content = aiResponse.data.content;
      aiMetadata = content;
      if (typeof content === "object" && content?.thumbnailPrompt) {
        imagePrompt = content.thumbnailPrompt;
      } else if (typeof content === "string") {
        try {
          const parsed = JSON.parse(content);
          imagePrompt = parsed.thumbnailPrompt || content;
        } catch {
          imagePrompt = content;
        }
      } else {
        imagePrompt = JSON.stringify(content);
      }
    }

    if (!imagePrompt || typeof imagePrompt !== "string" || imagePrompt.trim().length === 0) {
      console.warn("AI Bazaar returned no valid prompt, falling back to structured prompt");
      const topic = description || customPrompt || "Engaging viral YouTube video";
      imagePrompt = `Ultra high CTR 16:9 photorealistic YouTube thumbnail for ${topic}. Featuring an expressive, emotionally engaged primary subject with sharp studio lighting, high contrast visual separation, and massive bold stylized high-contrast typography displaying the text "MUST WATCH", 8k resolution, clean composition, top-tier thumbnail art direction.`;
    }

    // Step 1: Call NVIDIA genimg func asynchronously with the generated prompt
    const imageBuffer = await genimg(imagePrompt);

    if (!imageBuffer) {
      throw new Error("No image buffer received from NVIDIA image generation");
    }

    // Step 2: If we get image then save it to Cloudinary using separate function
    const thumbnailURL = await uploadToCloudinary(imageBuffer);
    if (!thumbnailURL) {
      throw new Error("Failed to obtain thumbnail URL from Cloudinary");
    }

    // Step 3: Create a doc in thumbnail collection and store link of image with prompt
    const stored = await storeThumbnail(
      userID,
      projectID,
      thumbnailURL,
      imagePrompt,
      customPrompt || "",
    );
    if (!stored.success) {
      throw new Error("Failed to store thumbnail document in database");
    }

    // Step 4: When we get image and upload it to Cloudinary then update status in project collection to completed
    await changeProjectThumbnailStatus(userID, {
      projectID,
      thumbnailStatus: "completed",
    });

    // Deduct usage credits if active plan/order exists
    if (req.orderID && req.thumbnailCredit) {
      await updateCredit(userID, {
        orderID: req.orderID,
        action: "thumbnail",
        projectID: projectID,
        creditUsed: req.thumbnailCredit,
      });
    }

    // Fetch all thumbnails for this project so frontend receives the complete history
    const allThumbnails = await ThumbnailModel.find({ userID, projectID }).sort({
      createdAt: -1,
    });

    // Step 5: If everything is fine then send the image link and all project thumbnails
    return {
      success: true,
      statusCode: 200,
      message: "Thumbnail generated successfully",
      data: {
        thumbnailURL,
        projectID,
        imagePrompt,
        aiMetadata,
        thumbnailDoc: stored.data,
        thumbnails: allThumbnails,
      },
      thumbnailURL,
      thumbnails: allThumbnails,
    };
  } catch (error) {
    console.error("Error in generateThumbnail:", error.message);

    // Update project thumbnailStatus to "failed" in project collection
    if (userID && projectID) {
      await changeProjectThumbnailStatus(userID, {
        projectID,
        thumbnailStatus: "failed",
      });
    }

    return {
      success: false,
      statusCode: 500,
      message: error.message || "Failed to generate thumbnail",
      errorCode: "THUMBNAIL_GENERATION_FAILED",
      errors: error.message,
    };
  }
}

export default generateThumbnail;
export { uploadToCloudinary, genimg, storeThumbnail, changeProjectThumbnailStatus };