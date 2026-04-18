import express from "express"
import generateContent from "#/features/content/index.content.js"

const router = express.Router();


/**
 * @route   GET /generate/content
 * @desc    generates content like tags, title, and description 
 * @access  private
 */
router.get('/generate/content', async (req, res) => {
  const userInp= `my vedieo is about web dev roadmap ensures that it is not old and future proof I suggest them to learn mern for next step learn nextjs I told every parts in  detail whatlearner have to do`
  const content= await generateContent(userInp)
  res.success({message:"content generated", content:content});
});


/**
 * @route   GET /generate/thumbnail
 * @desc    generates thumbnail image for the video
 * @access  private
 */
router.get('/generate/thumbnail', async (req, res) => {
  const userInp= `my vedieo is about web dev roadmap ensures that it is not old and future proof I suggest them to learn mern for next step learn nextjs I told every parts in  detail whatlearner have to do`
  const content= await generateContent(userInp)
  res.success({message:"content generated", content:content});
});

export default router