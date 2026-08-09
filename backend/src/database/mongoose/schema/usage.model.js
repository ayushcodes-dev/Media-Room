import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    planID: {
      type: String,
      required: true,
    },
    orderID: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    totalCredits: {
      type: Number,
      required: true,
    },
    usedCredit:{
         type: Number
    },
    dailyLimit: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true },
);

const BillingModel = mongoose.model("Usage", usageSchema);

export default BillingModel;
