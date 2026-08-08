import { createRazorpayInstance } from "#/config/razorpay.config.js";
import PaymentModel from "#/database/mongoose/schema/paymentProcess.model.js";
import { plans } from "#/utility.js";
import { v4 as uuidv4 } from "uuid";
import BillingModel from "#/database/mongoose/schema/billing.model.js";

async function createPaymentProcess({
  userID,
  planID,
  price,
  orderID,
  receiptID,

}) {
  try {
    const paymentProcess = new PaymentModel({
      userID,
      planID,
      price,
      orderID,
      receiptID,
      orderCreated: true,
    });
    await paymentProcess.save();
    return {
      success: true,
      data: paymentProcess,
      message: "Payment process created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.message,
    };
  }
}

async function razorpayCreateOrder({ planID, userID }) {
  return new Promise((resolve) => {
    // console.log("req on create order");

    const plan = plans.find((p) => {
      if (p.planID === planID) return p;
    });
    if (!plan) {
      resolve({
        success: false,
        message: "plan not found",
      });
    }
    if (plan) {
      const options = {
        amount: plan.price * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_${plan.planID}_${Date.now()}`,
      };
      try {
        const instance = createRazorpayInstance();

        instance.orders.create(options, async (err, order) => {
        //  console.log("razorpay order", order);
          if (err) {
            resolve({
              success: false,
              message: error.message,
            });
          }
          const paymentProcess = await createPaymentProcess({
            userID: userID,
            planID: plan.planID,
            price: order.amount / 100,
            orderID: order.id,
            receiptID: order.receipt,
           
          });
          if (paymentProcess.success) {
            
            resolve({
              success: true,
              data: { order },
              message: "successfully created order",
            });
          } else {
            resolve({
              success: false,
              message: "failed to create order"
            });
          }
        });
      } catch (error) {
        console.log(error);
        resolve({
          success: false,
          message: error.message,
        });
      }
    }
  });
}

export default razorpayCreateOrder;
