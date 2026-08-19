import express from "express";
import generateContent from "#/features/content/index.content.js";
import generateThumbnail from "#/features/thumbnail/index.thumbnail.js"
import { handleUserAuth_middle } from "#/middleware/auth.middleware.js";
import {
  generateSeoDataValidator,
  generateThumbnailValidator,
} from "#/validator/generate.validator.js";
import validate from "#/validator/index.validate.js";
import HandleUsage from "#/middleware/usage.middleware.js";

const router = express.Router();

/**
 * @route   POST /generate/seoData
 * @desc    generates content like tags, title, and description 
 * @access  private
 */
router.post(
  "/generate/seoData",
  handleUserAuth_middle,
  generateSeoDataValidator,
  validate,
  HandleUsage,
  async (req, res) => {
    const content = await generateContent(req, {
      projectID: req.body.projectID,
      videoDescription: req.body.videoDescription,
    });
    res.success({ ...content });
  },
);

/**
 * @route   POST /generate/thumbnail
 * @desc    generates thumbnail image for the video
 * @access  private
 */
router.post(
  "/generate/thumbnail",
  handleUserAuth_middle,
  generateThumbnailValidator,
  validate,
  HandleUsage,
  async (req, res) => {
    console.log("req on generate thumbnail")
    const customPrompt =
      req.body.customPrompt ||
      req.body.customThumbnailPrompt ||
      req.body.customprompt ||
      "";
    const desc = req.body.description || req.body.videoDescription || "";
    const projectID = req.body.projectID;
    const thumbnail = await generateThumbnail(req, {
      projectID,
      customPrompt,
      description: desc,
    });
    if (thumbnail.success) {
      return res.success({ ...thumbnail });
    } else {
      return res.error({ ...thumbnail });
    }
  },
);

export default router;