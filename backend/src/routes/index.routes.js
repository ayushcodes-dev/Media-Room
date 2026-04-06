import express from "express";
import generateRouter from "./generate/generate.routes.js";
import authRouter from "./auth/auth.routes.js";
// router
const router = express.Router();

/**
 * @desc Mount auth routes
 * Any request coming to this router will be forwarded to auth router . it include ["/auth/signup","/auth/signin","/auth/signout"]
 * @route /auth/*
 */
router.use(authRouter);
/**
 * @desc Mount generate routes
 * Any request coming to this router will be forwarded to generateRouter
 * @route /generate/*
 */
router.use(generateRouter);

/**
 * @route   GET /
 * @desc    Fetch public home route
 * @access  Public
 */
router.get("/", (req, res) => {
    res.send({ message: "hello" });
});
router.get("/about", () => {});

export default router;
