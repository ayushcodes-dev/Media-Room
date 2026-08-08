import { body } from "express-validator";

export const createOrderValidator = [
  // Name
  body("planID")
    .notEmpty()
    .withMessage("Plan ID is required")
    .isString()
    .withMessage("Plan ID must be a string"),
];

export const verifyOrderValidator = [
  // razorpay_payment_id
  body("razorpay_payment_id")
    .notEmpty()
    .withMessage("razorpay_payment_id is required")
    .isString()
    .withMessage("razorpay_payment_id must be a string"),
  // Password
  body("razorpay_order_id")
    .notEmpty()
    .withMessage("razorpay_order_id is required")
    .isString()
    .withMessage("razorpay_order_id must be a string")
    .trim(),
  body("razorpay_signature")
    .notEmpty()
    .withMessage("razorpay_signature is required")
    .isString()
    .withMessage("razorpay_signature must be a string")
    .trim(),
];

export const updatePlanStatusValidator = [
  // razorpay_payment_id
  body("orderID")
    .notEmpty()
    .withMessage("order id is required")
    .isString()
    .withMessage("order id must be a string"),
];