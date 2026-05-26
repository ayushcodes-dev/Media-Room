import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],


}, { timestamps: true });

const ContentModel = mongoose.model("Content", contentSchema);

export default ContentModel;
