import { body } from "express-validator";

export const generateSeoDataValidator = [
  // Project ID
  body("projectID")
    .notEmpty()
    .withMessage("Project ID is required")
    .isString()
    .withMessage("Project ID must be a string")
    .trim(),
  // video description
  body("videoDescription")
    .notEmpty()
    .withMessage("video description is required")
    .isString()
    .withMessage("video description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("video description must not exceed 500 characters"),
];

export const generateThumbnailValidator = [
  // Project ID
  body("projectID")
    .notEmpty()
    .withMessage("Project ID is required")
    .isString()
    .withMessage("Project ID must be a string")
    .trim(),

  // Custom Prompt (completely optional - can be empty, null, or omitted)
  body("customPrompt")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("custom prompt must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("custom prompt must not exceed 500 characters"),

  body("customThumbnailPrompt")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("custom prompt must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("custom prompt must not exceed 500 characters"),

  body("customprompt")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("custom prompt must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("custom prompt must not exceed 500 characters"),

  // Video Description (optional)
  body("description")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("video description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("video description must not exceed 500 characters"),

  body("videoDescription")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("video description must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("video description must not exceed 500 characters"),
];