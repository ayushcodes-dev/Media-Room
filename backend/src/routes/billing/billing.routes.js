import express from "express";
import validate from "#/validator/index.validate.js";
import { handleUserAuth_middle } from "#/middleware/auth.middleware.js";
import {
  createOrderValidator,
  verifyOrderValidator,
  updatePlanStatusValidator,
} from "#/validator/billing.validator.js";
import razorpayCreateOrder from "#/features/billing/createOrder.js";
import verifyPayment from "#/features/billing/verify.js";
import getPaymentHistory from "#/features/billing/getHistory.js";
import updatePlanStatus from "#/features/billing/updatePlanStatus.js";
const router = express.Router();

/**
 * @route   POST /billing/createOrder
 * @desc    creates a new billing order
 * @access  private
 */
router.post(
  "/billing/createOrder",
  handleUserAuth_middle,
  createOrderValidator,
  validate,
  async (req, res) => {
    const { planID } = req.body;
    const order = await razorpayCreateOrder({
      planID,
      userID: req.session.userID,
    });

    if (order && order.success) {
      res.status(200).json({
        success: true,
        data: order.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          order && order.message ? order.message : "Failed to create order",
      });
    }
  },
);

/**
 * @route   POST /billing/verifyPayment
 * @desc    verifies the payment for a created order
 * @access  private
 */
router.post(
  "/billing/verifyPayment",
  handleUserAuth_middle,
  verifyOrderValidator,
  validate,
  async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;
    const order = await verifyPayment({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userID: req.session.userID,
    });

    if (order && order.success) {
      res.status(200).json({
        success: true,
        data: order.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          order && order.message ? order.message : "Failed to verify payment",
      });
    }
  },
);

/**
 * @route   GET /billing/history
 * @desc    retrieves the billing history for the user
 * @access  private
 */
router.get("/billing/history", handleUserAuth_middle, async (req, res) => {
  const order = await getPaymentHistory({ userID: req.session.userID });

  if (order && order.success) {
    res.status(200).json({
      success: true,
      data: order.data,
    });
  } else {
    res.status(400).json({
      success: false,
      message:
        order && order.message
          ? order.message
          : "Failed to Get Payment History",
    });
  }
});

/**
 * @route   PATCh /billing/status
 * @desc   change payment status - activate plan
 * @access  private
 */
router.patch(
  "/billing/status",
  handleUserAuth_middle,
  updatePlanStatusValidator,
  async (req, res) => {
    const { orderID } = req.body;
    const update = await updatePlanStatus(req,{
      userID: req.session.userID,
      orderID,
    });

    if (update && update.success) {
      res.status(200).json({
        success: true,
        data: update.data,
      });
    } else {
      res.status(400).json({
        success: false,
        message:
          update && update.message
            ? update.message
            : "Failed to update plan status",
      });
    }
  },
);

export default router;
