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
  // custom thumbnail prompt
  // body("customThumbnailPrompt")
  //   .isString()
  //   .withMessage("custom thumbnail prompt must be a string")
  //   .trim()
  //   .isLength({ max: 500 })
  //   .withMessage("custom thumbnail prompt must not exceed 500 characters"),
];