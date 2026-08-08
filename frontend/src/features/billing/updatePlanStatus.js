import { updatePlanStatusAPI } from "@/api/billing.js";

async function updatePlanStatus({orderID}) {
  const update = await updatePlanStatusAPI({orderID});
  
}

export default updatePlanStatus;
