import { verifyPaymentAPI } from "@/api/billing.js";

async function verifyPayment({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}) {
    console.log("verify payment called with:", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }); // Log the received payment verification data for debugging
  try {
    const response = await verifyPaymentAPI({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });
//    console.log("verify payment response", response);
    return response;
  } catch {
    //console.log("generate api",error.response.data)
    return null;
  }
}
export default verifyPayment;
