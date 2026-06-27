import express from "express"
import generateContent from "#/features/content/index.content.js"
import {handleUserAuth_middle} from "#/middleware/auth.middleware.js"
import { generateSeoDataValidator } from "#/validator/generate.validator.js";
import validate from "#/validator/index.validate.js";
const router = express.Router();


/**
 * @route   GET /generate/content
 * @desc    generates content like tags, title, and description 
 * @access  private
 */
router.post(
  "/generate/seoData",
  handleUserAuth_middle,
  generateSeoDataValidator,
  validate,
  async (req, res) => {
    const content = await generateContent(req, {
      projectID: req.body.projectID,
      videoDescription: req.body.videoDescription,
      customThumbnailPrompt: req.body.customThumbnailPrompt,
    });
    res.success({ ...content });
  },
);


/**
 * @route   GET /generate/thumbnail
 * @desc    generates thumbnail image for the video
 * @access  private
 */
router.get('/generate/thumbnail',handleUserAuth_middle, async (req, res) => {
  const userInp= `my vedieo is about web dev roadmap ensures that it is not old and future proof I suggest them to learn mern for next step learn nextjs I told every parts in  detail whatlearner have to do`
  const content= await generateContent(userInp)
  res.success({message:"content generated", content:content});
});

export default router