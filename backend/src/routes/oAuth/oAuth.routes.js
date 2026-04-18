import express from "express";
import handleGoogleSignin  from "#/features/oAuth/google/signin.google.js";
import handleGoogleCallback from "#/features/oAuth/google/callback.google.js";
const router = express.Router();    


/**
 * @route   GET /oAuth/signin/google
 * @desc    signin with google route
 * @access  Public
 */
router.get("/oAuth/signin/google", async (req, res) => {
  const googleSignin = await handleGoogleSignin(req);
  if (googleSignin.success && googleSignin.redirect) {
    res.redirect(googleSignin.redirect_url);
  } else {
    res.error({
      ...googleSignin,
    });
  }
});



/**
 * @route   GET /oAuth/callback/google
 * @desc    google callback  route
 * @access  Public
 */

router.get("/oAuth/callback/google", async (req, res) => {
  const googleCallback = await handleGoogleCallback(req);
  if (googleCallback.success) {
    if (googleCallback.redirect) {
      res.redirect(googleCallback.redirect_url);
    } else {
      res.success({
        ...googleCallback,
      });
    }
  } else {
    res.error({
      ...googleCallback,
    });
  }
});





export default router;
