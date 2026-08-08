import express from "express";
import generateRouter from "./generate/generate.routes.js";
import authRouter from "./auth/auth.routes.js";
import projectRouter  from "./project/project.routes.js";
import oAuthRouter from "./oAuth/oAuth.routes.js";
import billingRouter from "./billing/billing.routes.js"
// router
const router = express.Router();

/**
 * @desc Mount auth routes
 * Any request coming to this router will be forwarded to auth router .
 * @route /auth/*
 */
router.use(authRouter);
/**
 * @desc Mount oAuth routes
 * Any request coming to this router will be forwarded to oAuthRouter
 * @route /oAuth/*
 */
router.use(oAuthRouter);
/**
 * @desc Mount generate routes
 * Any request coming to this router will be forwarded to generateRouter
 * @route /generate/*
 */
router.use(generateRouter);
/**
 * @desc Mount project routes
 * Any request coming to this router will be forwarded to projectRouter
 * @route /project/*
 */
router.use(projectRouter);

/**
 * @desc Mount billing routes
 * Any request coming to this router will be forwarded to billingRouter
 * @route /billing/*
 */
router.use(billingRouter);

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
