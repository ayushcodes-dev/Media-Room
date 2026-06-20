import express from "express";
import {
  signupValidator,
  signinValidator,
} from "#/validator/auth.validator.js";
import validate from "#/validator/index.validate.js";
import handleSignup from "#/features/auth/signup/signup.auth.js";
import handleSignin from "#/features/auth/signin/signin.auth.js";
import handleSignout from "#/features/auth/signout/signout.auth.js";
import handleStatus from "#/features/auth/status/status.auth.js";
//import handleStatus from "#/features/auth/status/status.auth.js"; import handleUserAuth_middle from "#/middleware/auth.middleware.js";
const router = express.Router();
/**
 * @route   POST /auth/signin
 * @desc    signin route
 * @access  Public
 */
router.post("/auth/signin", signinValidator, validate, async (req, res) => {
  const body = req.body;

  const Data = {
    email: body.email,
    password: body.password,
  };
  const signin = await handleSignin(req, Data);
  if (signin) {
  
    
    res.success({ ...signin });
  } else {
    res.error({ ...signin });
  }
});
/**

 * @route   POST /auth/signup
 * @desc    signin route
 * @access  Public
 */
router.post("/auth/signup", signupValidator, validate, async (req, res) => {
  const body = req.body;
  const Data = {
    username: body.username,
    email: body.email,
    password: body.password,
    OTPsended: body.OTPsended,
    OTP: body.OTP,
  };
  try {
    // handles signup
    const signup = await handleSignup(req, Data);
    if (signup.success) {
      res.success({
        ...signup,
      });
    } else {
      res.error({
        ...signup,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "error" });
  }
});
/**
 * @route   POST /auth/signout
 * @desc    signin route
 * @access  Private
 */
router.post("/auth/signout", async (req, res) => {
  const signout = await handleSignout(req);
  if (signout.success) {
    res.success({
      ...signout,
    });
  } else {
    res.error({
      ...signout,
    });
  }
});


/**
 * @route   POST /auth/status
 * @desc    user auth status route
 * @access  Public
 */
router.get("/auth/status", async (req, res) => {
  const status = await handleStatus(req);
  if (status.success) {
    res.success({
      ...status,
    });
  } else {
    res.error({
      ...status,
    });
  }
});

export default router;
