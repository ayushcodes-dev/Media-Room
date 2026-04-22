import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  projects: [
    {
      projectID: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      projectName: {
        type: String,
        required: true,
      },
      contentStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "unbegun"],
        default: "unbegun", // pending, processing, completed, failed, unbegun
      },
      thumbnailStatus: {
        type: String,
        enum: ["pending", "processing", "completed", "failed", "unbegun"],
        default: "unbegun", // pending, processing, completed, failed, unbegun
      },
      description: {
        type: String,
      },
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
