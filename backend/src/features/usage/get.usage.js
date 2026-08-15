import { UsageModel } from "#/database/mongoose/schema/index.model.js";

async function getUsage({ userID,orderID}){
 
  //  console.log(orderID);
  const usage = await UsageModel.findOne({
    userID,
    orderID,
  });
  // console.log(usage,orderID);

  if (!usage) {
    return {
      success: false,
      message: "usage not found",
    };
  }
  return { 
    success: true,
    data: usage,
  };
}
export default getUsage;