import crypto from "crypto";
import PaymentModel from "#/database/mongoose/schema/paymentProcess.model.js";
import BillingModel from "#/database/mongoose/schema/billing.model.js";
import { plans } from "#/utility.js";
import { UsageModel } from "#/database/mongoose/schema/index.model.js";

async function updatePaymentProcess({ orderID, paymentID, planPurchased }) {
  try {
    const paymentProcess = await PaymentModel.findOne({ orderID: orderID });
    if (!paymentProcess) {
      return {
        success: false,
        message: "Payment process not found",
      };
    }
    paymentProcess.paymentID = paymentID;
    paymentProcess.paymentVerified = true;
    paymentProcess.planPurchased = planPurchased;
    if (planPurchased) {
      paymentProcess.purchaseDate = new Date();
    }
    await paymentProcess.save();
    return {
      success: true,
      data: paymentProcess,
      message: "Payment process updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

async function updateBillingPlan({ userID, planID, orderID }) {
  try {
    const plan = plans.find((plan) => plan.planID === planID);
    const data = {
      planID: planID,
      price: plan?.price || 0,
      orderID: orderID,
      credits: plan?.credits || 0,
      status: "purchased",
      seoDataCredit: plan.seoDataCredit,
      thumbnailCredit: plan.thumbnailCredit,
      purchaseDate: new Date(),
      expirydate: new Date(
        new Date().setMonth(new Date().getMonth() + parseInt(plan.validity)),
      ),
    };
    const billingPlan = await BillingModel.findOneAndUpdate(
      { userID },
      {
        $setOnInsert: {
          userID: userID,
          activePlan: planID,
        },

        $addToSet: { plans: data },
      },
      {
        upsert: true,
      },
    );
    

    return {
      success: true,
      data: billingPlan,
      message: "Billing plan updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
async function createusageDoc({userID,planID,orderID}){
  try{
     const plan = plans.find((plan) => plan.planID === planID);
const insert = await UsageModel.create({
  userID,
  planID,
  orderID,
  totalCredits: plan.credits,
  usedCredit:0
});
return({
  success:true
})
  }catch(err){
return ({success:false})
  }
}
async function verifyPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  userID
}) {
  try{
//  console.log("verifyPayment")
  //  console.log(order_id, payment_id, signature);
  const secret = process.env.RAZORPAY_API_SECRET;
  const hmac = crypto.createHmac("sha256", secret);

  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);

  const geneartedSignature = hmac.digest("hex");

  if (geneartedSignature === razorpay_signature) {
    const userPaymentProcess = await PaymentModel.findOne({
      orderID: razorpay_order_id,
    });
    if (!userPaymentProcess) {
      return {
        success: false,
        message: "Payment process not found",
      };
    }
   const [updateBillingPlanResult, usage] = await Promise.all([
     updateBillingPlan({
       userID,
       planID: userPaymentProcess.planID,
       orderID: razorpay_order_id,
     }),
     createusageDoc({
       userID,
       planID: userPaymentProcess.planID,
       orderID: razorpay_order_id,
     }),
   ]);

    if (!(updateBillingPlanResult.success&&usage.success)) {
     // console.log("updateBillingPlanResult", updateBillingPlanResult, usage);
      return {
        success: false,
        message: "an error occured during payment verification",
      };
    }
    const updatePaymentProcessResult = await updatePaymentProcess({
      orderID: razorpay_order_id,
      paymentID: razorpay_payment_id,
      planPurchased: true,
    });
    return {
      success: true,
      message: "payment verified",
    };
  } else {
    return {
      success: false,
      message: "payment verification failed",
    };
  }
}catch(err){
  console.log(err)
   return {
     success: false,
     message: "payment verification failed",

   };
}
}
export default verifyPayment;
