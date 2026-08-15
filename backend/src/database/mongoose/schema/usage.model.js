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
    totalCredits: {
      type: Number,
      required: true,
    },
    usedCredit: {
      type: Number,
    },
    usage: [
      {
        action: {
          type: String,
          enum: ["thumbnail", "seoData"],
        },
        date: {
          type: Date,
        },
        projectID:{
          type:String,

        },
        creditUsed:{
            type:Number
        }
      },
    ],
  },
  { timestamps: true },
);

const UsageModel = mongoose.model("Usage", usageSchema);

export default UsageModel;
