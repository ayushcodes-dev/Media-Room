import getPaymentHistory from "#/features/billing/getHistory.js";
import getUsage from "#/features/usage/get.usage.js";

async function getPlan(userID) {
  try {
    const plans = await getPaymentHistory({ userID });
    if (!plans || !plans.success || !plans.data?.plans) {
      return {
        success: false,
        errorCode: "NO_ACTIVE_PLAN",
        message: plans?.message || "No active subscription plan found. Please choose a plan.",
      };
    }

    const plan = plans.data.plans.find((p) => p.status === "active");
    if (!plan) {
      return {
        success: false,
        errorCode: "NO_ACTIVE_PLAN",
        message: "No active subscription plan found. Please purchase credits to proceed.",
      };
    }

    if (plan.expirydate && new Date() > new Date(plan.expirydate)) {
      return {
        success: false,
        errorCode: "PLAN_EXPIRED",
        message: "Your subscription plan has expired. Please renew your plan.",
      };
    }

    return {
      success: true,
      data: plan,
    };
  } catch (error) {
    console.error("Error in getPlan:", error);
    return {
      success: false,
      errorCode: "PLAN_VERIFICATION_ERROR",
      message: "Failed to verify plan status",
    };
  }
}

async function HandleUsage(req, res, next) {
  try {
    const pathSegments = (req.baseUrl + req.path).split("/");
    const action = pathSegments[pathSegments.length - 1] === "thumbnail" ? "thumbnail" : "seoData";

    const userID = req.session?.userID || req.userID;
    if (!userID) {
      return res.error({
        statusCode: 401,
        success: false,
        message: "User session expired or unauthorized",
        errorCode: "UNAUTHORIZED",
      });
    }

    const planResult = await getPlan(userID);
    if (!planResult.success || !planResult.data) {
      return res.error({
        statusCode: 402,
        success: false,
        message:
          planResult.message ||
          "No active plan found. Please purchase credits to generate content.",
        errorCode: planResult.errorCode || "NO_ACTIVE_PLAN",
      });
    }

    const plan = planResult.data;
    const usageResult = await getUsage({
      userID,
      orderID: plan.orderID,
    });

    const usedCredit =
      usageResult?.success && usageResult?.data
        ? usageResult.data.usedCredit || 0
        : 0;
    const totalCredits = plan.credits || 0;
    const creditRequired =
      action === "thumbnail"
        ? plan.thumbnailCredit || 20
        : plan.seoDataCredit || 5;

    if (totalCredits < usedCredit + creditRequired) {
      return res.error({
        statusCode: 402,
        success: false,
        message: `Not enough credits. You need ${creditRequired} credits but only have ${Math.max(0, totalCredits - usedCredit)} remaining.`,
        errorCode: "INSUFFICIENT_CREDITS",
      });
    }

    req.orderID = plan.orderID;
    req.seoDataCredit = plan.seoDataCredit || 5;
    req.thumbnailCredit = plan.thumbnailCredit || 20;
    req.totalCredits = totalCredits;
    req.usedCredit = usedCredit;
    req.planID = plan.planID;

    next();
  } catch (error) {
    console.error("Error in HandleUsage middleware:", error);
    return res.error({
      statusCode: 500,
      success: false,
      message: "Failed to verify credit usage: " + error.message,
      errorCode: "USAGE_CHECK_FAILED",
    });
  }
}

export default HandleUsage;
