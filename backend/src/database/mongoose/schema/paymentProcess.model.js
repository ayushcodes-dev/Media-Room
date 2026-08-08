import mongoose from "mongoose";

const paymentProcessSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    planID: {
      type: String,
      required: true,
    },
  
    price: {
      type: Number,
      required: true,
    },
    orderID: {
      type: String,
      required: true,
    },
    orderCreated: {
      type: Boolean,
      default: false,
    },
    receiptID: {
      type: String,
      default: null,
    },
    paymentID: {
      type: String,
      default: null,
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },
    planPurchased: {
      type: Boolean,
      default: false,
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const PaymentModel = mongoose.model("PaymentProcess", paymentProcessSchema);

export default PaymentModel;
