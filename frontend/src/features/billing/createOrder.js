import {createOrderAPI} from "@/api/billing.js"

async function createOrder({planID}){
  try {
    const response = await createOrderAPI({ planID });
    console.log("create order response", response)
    return response
  } catch{
    //console.log("generate api",error.response.data)
   
  }
}
export default createOrder