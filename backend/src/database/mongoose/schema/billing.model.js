import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    plans: [
      {
        planName: {
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
        status: {
          type: String,
          required: true,
          enum: ["active" , "inactive", "expired", "cancelled"],
        },
        seoDataPrice:{
            type: Number,
            required: true,
        },
        thumbnailPrice:{
            type: Number,
            required: true,
        },
        purchaseDate:{
            type: Date,
            required: true,
        }
      },
    ],
  },
  { timestamps: true },
);

const BillingModel = mongoose.model("Billing", billingSchema);

export default BillingModel;
