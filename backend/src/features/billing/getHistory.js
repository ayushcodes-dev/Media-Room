import BillingModel from "#/database/mongoose/schema/billing.model.js";

async function getPaymentHistory({ userID }) {
  try {
    const billingHistory = await BillingModel.findOne({ userID });
    if (!billingHistory) {
      return { success: false, message: "No payment history found for the user" };
    }
    const sort = billingHistory.plans.sort((p1,p2)=>{
return p2.purchaseDate - p1.purchaseDate;
    })
    return { success: true, data: billingHistory };
  } catch (error) {
    console.error("Error occurred while fetching payment history:", error);
    return { success: false, message: "Failed to fetch payment history" };
  }
}
export default getPaymentHistory;