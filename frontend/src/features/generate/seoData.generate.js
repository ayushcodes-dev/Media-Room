import { generate_SEO_DataAPI } from "@/api/generate.js";
import { saveVideoDesc_API } from "@/api/project.js";

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

// function to generate seodata
async function generateSEOData(
  { videoDescription, projectID },
  {
    setToasterData,
    setProjectData,
    setSeoButtonDisable,
    setActiveSEOData,
    setBillingErrorModalData,
    currentProjectData,
  },
) {
  setSeoButtonDisable(true);
  saveVideoDesc_API({ description: videoDescription, projectID })
    .then((data) => {
      if (!data.success) {
        console.warn("Error saving video description:", data.message);
      }
    })
    .catch((err) => {
      console.warn("Error saving video description:", err);
    });

  // generating seo data
  const data = await generate_SEO_DataAPI({ videoDescription, projectID });
  if (!data.success) {
    const errorMsg = data.message || data.error?.message || "";
    const errorCode = data.error?.errorCode || data.errorCode || "";

    if (isPaymentOrBillingError(data, errorMsg, errorCode) && setBillingErrorModalData) {
      setBillingErrorModalData({
        isOpen: true,
        errorCode,
        message: errorMsg,
      });
      setSeoButtonDisable(false);
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
      setSeoButtonDisable(false);
      return;
    }

    setToasterData([
      {
        status: "error",
        info: errorMsg || "Failed to generate SEO data",
        duration: 7000,
      },
    ]);
    setSeoButtonDisable(false);
    return;
  }

  setToasterData([
    {
      status: "success",
      info: "SEO Data Generated successfully!",
    },
  ]);

  const GeneratedData = {
    title: data.data?.title,
    description: data.data?.description,
    tags: data.data?.tags,
    thumbnailDescription: data.data?.thumbnailDescription,
  };
  setProjectData((prev) => {
    const findProject = prev.find((d) => d.projectID === projectID);
    if (!findProject) {
      const newdata = {
        projectID,
        seoData: [GeneratedData],
      };
      return [...prev, newdata];
    }
    const updated = prev.map((d) => {
      if (d.projectID === projectID) {
        return {
          ...d,
          seoData: [...(d.seoData || []), GeneratedData],
        };
      }
      return d;
    });
    return updated;
  });
  setSeoButtonDisable(false);
  setActiveSEOData(currentProjectData?.seoData?.length || 0);
  return GeneratedData;
}
export default generateSEOData;
