import express from "express";
import validate from "#/validator/index.validate.js";
import getUsage from "#/features/usage/get.usage.js";
const router = express.Router();

/**
 * @route   GET /usage
 * @desc    create new project
 * @access  Private
 */

router.get("/usage/:orderID", validate, async (req, res) => {
//console.log("fine")
 const { orderID } = req.params;
  const usage = await getUsage({userID:req.session.userID, orderID});
  if (usage.success) {
    return res.success({ ...usage });
  } else {
    return res.error({ ...usage });
  }
});


export default router 