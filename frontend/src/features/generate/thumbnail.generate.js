import { generate_Thumbnail_API } from "@/api/generate.js";
import { saveCustomPrompt_API, saveVideoDesc_API } from "@/api/project.js";

// Helper to detect payment, plan, credit, or subscription errors
const isPaymentOrBillingError = (data, errorMsg, errorCode) => {
  const code = (errorCode || "").toUpperCase();
  const msg = (errorMsg || "").toLowerCase();
  return (
    data?.statusCode === 402 ||
    code === "NO_ACTIVE_PLAN" ||
    code === "INSUFFICIENT_CREDITS" ||
    code === "PLAN_EXPIRED" ||
    code === "PAYMENT_REQUIRED" ||
    code === "USAGE_CHECK_FAILED" ||
    msg.includes("plan") ||
    msg.includes("credit") ||
    msg.includes("payment") ||
    msg.includes("subscription") ||
    msg.includes("expire") ||
    msg.includes("not enough") ||
    msg.includes("limit")
  );
};

// function to generate thumbnail
async function generateThumbnail(
  { customPrompt, videoDescription, projectID },
  {
    setToasterData,
    setProjectData,
    setThumbnailButtonDisable,
    setprojectStatus,
    setActiveThumbnail,
    setBillingErrorModalData,
    currentProjectData,
  },
) {
  if (setThumbnailButtonDisable) setThumbnailButtonDisable(true);

  // Save video description directly on /project/:projectID/videoDescription
  if (videoDescription && videoDescription.trim()) {
    saveVideoDesc_API({ projectID, description: videoDescription.trim() })
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to save video description:", data.error);
        }
      })
      .catch((err) => {
        console.warn("Error saving video description:", err);
      });
  }

  // If customPrompt is present, request on /project/:projectID/customPrompt and save the custom prompt
  if (customPrompt && customPrompt.trim()) {
    saveCustomPrompt_API({ projectID, prompt: customPrompt.trim() })
      .then((data) => {
        if (!data.success) {
          console.warn("Failed to save custom prompt:", data.error);
        }
      })
      .catch((err) => {
        console.warn("Error saving custom prompt:", err);
      });
  }

  // Mark status as processing in state
  if (setprojectStatus) {
    setprojectStatus((prev) =>
      prev.map((proj) =>
        proj.projectID === projectID
          ? { ...proj, thumbnailStatus: "processing" }
          : proj,
      ),
    );
  }

  // Call /generate/thumbnail to generate thumbnail
  const data = await generate_Thumbnail_API({
    projectID,
    customPrompt: customPrompt && customPrompt.trim() ? customPrompt.trim() : undefined,
    videoDescription: videoDescription && videoDescription.trim() ? videoDescription.trim() : undefined,
    description: videoDescription && videoDescription.trim() ? videoDescription.trim() : undefined,
  });

  if (!data.success) {
    if (setprojectStatus) {
      setprojectStatus((prev) =>
        prev.map((proj) =>
          proj.projectID === projectID
            ? { ...proj, thumbnailStatus: "failed" }
            : proj,
        ),
      );
    }

    const errorMsg = data.message || data.error?.message || "";
    const errorCode = data.error?.errorCode || data.errorCode || "";

    if (isPaymentOrBillingError(data, errorMsg, errorCode) && setBillingErrorModalData) {
      setBillingErrorModalData({
        isOpen: true,
        errorCode,
        message: errorMsg,
      });
      if (setThumbnailButtonDisable) setThumbnailButtonDisable(false);
      return;
    }

    if (data && data?.error?.errorCode === "VALIDATION_ERROR") {
      const messages = Array.isArray(data.error.error)
        ? data.error.error.map((detail) => detail.msg).join(".\n")
        : errorMsg;
      setToasterData([
        {
          status: "error",
          info: messages,
          duration: 9000,
        },
      ]);
      if (setThumbnailButtonDisable) setThumbnailButtonDisable(false);
      return;
    }

    setToasterData([
      {
        status: "error",
        info: errorMsg || "Failed to generate thumbnail",
        duration: 7000,
      },
    ]);
    if (setThumbnailButtonDisable) setThumbnailButtonDisable(false);
    return;
  }

  setToasterData([
    {
      status: "success",
      info: "Thumbnail generated successfully!",
    },
  ]);

  const thumbnailURL = data.data?.thumbnailURL || data.thumbnailURL;
  const imagePrompt = data.data?.imagePrompt;
  const thumbnailDoc = data.data?.thumbnailDoc || {
    thumbnailURL,
    prompt: imagePrompt,
    customPrompt,
    createdAt: new Date(),
  };

  // Update projectData in context
  if (setProjectData) {
    setProjectData((prev) => {
      const exists = prev.find((proj) => proj.projectID === projectID);
      if (!exists) {
        return [
          ...prev,
          {
            projectID,
            thumbnailStatus: "completed",
            thumbnail: thumbnailURL,
            thumbnails: [thumbnailDoc],
            imagePrompt: imagePrompt,
            customPrompt: customPrompt,
            videoDescription: videoDescription,
          },
        ];
      }

      return prev.map((proj) => {
        if (proj.projectID === projectID) {
          const currentThumbnails = Array.isArray(proj.thumbnails) ? proj.thumbnails : [];
          const updatedThumbnails = [...currentThumbnails, thumbnailDoc];
          return {
            ...proj,
            thumbnailStatus: "completed",
            thumbnail: thumbnailURL,
            thumbnails: updatedThumbnails,
            imagePrompt: imagePrompt || proj.imagePrompt,
            customPrompt: customPrompt || proj.customPrompt,
            videoDescription: videoDescription || proj.videoDescription,
          };
        }
        return proj;
      });
    });
  }

  // Set the active thumbnail index to the newly created thumbnail
  if (setActiveThumbnail && currentProjectData) {
    const nextIndex = Array.isArray(currentProjectData.thumbnails)
      ? currentProjectData.thumbnails.length
      : 0;
    setActiveThumbnail(nextIndex);
  }

  // Update projectStatus in status context
  if (setprojectStatus) {
    setprojectStatus((prev) =>
      prev.map((proj) =>
        proj.projectID === projectID
          ? { ...proj, thumbnailStatus: "completed" }
          : proj,
      ),
    );
  }

  if (setThumbnailButtonDisable) setThumbnailButtonDisable(false);
  return data;
}

export default generateThumbnail;
