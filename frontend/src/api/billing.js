import api from "./axios";

export async function createOrderAPI({ planID }) {

  try {
    const response = await api.post("/billing/createOrder", {
      planID,
    });

    const data = response.data;
    return data;
  } catch (error) {
    //console.log("generate api",error.response.data)
    return {
      error: error.response.data.error
        ? {
            message: "An error occurred during creating order",
            error: error.response.data.error,
          }
        : error.response,
      success: false,
    };
  }
}


export async function verifyPaymentAPI({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) {
  try {
    const response = await api.post("/billing/verifyPayment", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    const data = response.data;
    console.log("verify payment api response", data);
    return data;
  } catch (error) {
    console.log("verify payment api error",error.response.data)
    return {
      error: error.response.data.error
        ? {
            message: "An error occurred during verifying payment",
            error: error.response.data.error,
          }
        : error.response,
      success: false,
    };
  }
}


export async function getPaymentHistoryAPI() {
  try {
    const response = await api.get("/billing/history");

    const data = response.data;
    return data;
  } catch (error) {
    //console.log("generate api",error.response.data)
    return {
      error: error.response.data.error
        ? {
            message: "An error occurred during getting payment history",
            error: error.response.data.error,
          }
        : error.response,
      success: false,
    };
  }
}


export async function updatePlanStatusAPI({orderID}) {
  try {
    const response = await api.patch("/billing/status",{orderID});

    const data = response.data;
    return data;
  } catch (error) {
    //console.log("generate api",error.response.data)
    return {
      error: error.response.data.error
        ? {
            message: "An error occurred during updating plan status",
            error: error.response.data.error,
          }
        : error.response,
      success: false,
    };
  }
}

