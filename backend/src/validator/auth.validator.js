import { body } from "express-validator";

export const signupValidator = [
  // Name
  body("username")
    .notEmpty().withMessage("username is required")
    .isString().withMessage("username must be string")
    .isLength({ min: 3, max: 32 })
    .withMessage("username must be between 3 to 32 characters"),

  // Email
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter valid email"),

  // Password
  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 3, max: 32 })
    .withMessage("Password must be between 3 to 32 characters"),

  // OTP (optional but if present must be 6 digit number)
  body("OTP")
    .optional()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric().withMessage("OTP must be number"),

  // OTP Sent (Boolean required)
  body("OTPsended")
    .notEmpty().withMessage("OTPsended is required")
    .isBoolean().withMessage("OTPsended must be Boolean"),
];



export const signinValidator = [
  // Email 
  body("email")
    .notEmpty().withMessage("Email is required")
    .isString().withMessage("Email must be a string")
    .trim()
    .isEmail().withMessage("Invalid email format"),
    

  // Password
  body("password")
    .notEmpty().withMessage("Password is required")
    .isString().withMessage("Password must be a string")
    .trim()
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
];