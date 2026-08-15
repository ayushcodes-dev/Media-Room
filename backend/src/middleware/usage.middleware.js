import getPaymentHistory from "#/features/billing/getHistory.js"
import getUsage from "#/features/usage/get.usage.js";

async function getPlan(userID) {
  const plans = await getPaymentHistory({ userID });
  if (!plans.success) return plans;
  //console.log(plans)
  const plan = plans.data.plans.find((p) => {
    if (p.status === "active") return true;
  });
  if (new Date() > new Date(plan.expirydate)) {
    return {
      success: false,
      message: "plan is expired",
    };
  }

  if (plan) {
    return {
      success: true,
      data: plan,
    };
  } else {
    return {
      success: false,
      error: "no active plan found",
    };
  }
}

async function HandleUsage(req, res, next) {

  let generate;
  if (
    req.route.path.split("/")[req.route.path.split("/").length - 1] ===
    "seoData"
  )
    generate = "seoData";
  if (
    req.route.path.split("/")[req.route.path.split("/").length - 1] ===
    "thumbnail"
  )
    generate = "thumbnail";
   
  const plan = await getPlan(req.session.userID);
  if (!plan.success)
   return res.error({
      success: false,
      message: "No Active Plan Found",
    });

  const usage = await getUsage({userID:req.session.userID, orderID:plan.data.orderID});
  if (
    !(
      plan.data.credits >=
      usage.data.usedCredit +
        [generate === "seoData" ? plan.data.seoDataCredit : plan.data.thumbnailCredit]
    )
  ) {
    

   return res.error({
      success: false,
      message: "No Enough credit Found",
    });
  }
  //console.log(plan,usage)
  req.orderID = plan.data.orderID;
  req.seoDataCredit = plan.data.seoDataCredit;
  req.thumbnailCredit = plan.data.thumbnailCredit;
  req.totalCredits = usage.data.totalCredits;
  req.usedCredit = usage.data.usedCredit;
  req.planID = plan.data.planID;
 
  next()
}

export default HandleUsage;
