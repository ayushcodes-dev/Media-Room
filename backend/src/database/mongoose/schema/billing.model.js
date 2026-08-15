import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    activePlan: {
      type: String,
    },
    plans: [
      {
        planID: {
          type: String,
          required: true,
        },
        orderID:{
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        credits: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: ["purchased","inactive","active"],
        },
        seoDataCredit: {
          type: Number,
          required: true,
        },
        thumbnailCredit: {
          type: Number,
          required: true,
        },
        purchaseDate: {
          type: Date,
          required: true,
        },
        expirydate: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const BillingModel = mongoose.model("Billing", billingSchema);

export default BillingModel;
