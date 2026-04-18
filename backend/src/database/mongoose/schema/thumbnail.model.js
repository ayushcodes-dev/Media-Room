import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
  },
  desccription:{
    type: String,
    required: true,
  },
  


}, { timestamps: true });

const ContentModel = mongoose.model("Content", contentSchema);

export default ContentModel;
