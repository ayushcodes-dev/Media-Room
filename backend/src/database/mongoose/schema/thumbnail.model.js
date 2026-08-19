import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    projectID: {
      type: String,
      required: true,
    },
    thumbnailURL: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
    },
    customPrompt: {
      type: String,
    },
  },
  { timestamps: true },
);

const ThumbnailModel = mongoose.model("Thumbnail", thumbnailSchema);

export default ThumbnailModel;
