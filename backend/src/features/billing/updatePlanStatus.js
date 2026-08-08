import BillingModel from "#/database/mongoose/schema/billing.model.js";

async function updatePlanStatus({ userID, orderID }) {
  try {
    const billing = await BillingModel.findOne({ userID });
    if (!billing) {
      return {
        success: false,
        message: "No payment found of the user",
      };
    }
    if(billing.plans?.length===0){
         return {
           success: false,
           message: "No payment found of the user",
         };
    }
    billing.plans.forEach((plan) => {
      plan.status = plan.orderID === orderID ? "active" : "inactive";
    });
 
   await billing.save()
    return { success: true, data: null };
  } catch (error) {
    console.error("Error occurred while updating plan status", error);
    return { success: false, message: "Failed to update plan status" };
  }
}
export default updatePlanStatus;
  