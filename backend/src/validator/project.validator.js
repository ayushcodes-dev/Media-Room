import { body } from "express-validator";
export const createProjectValidator = [
  // Project Name
  body("projectName")
    .notEmpty()
    .withMessage("Project name is required")
    .isString()
    .withMessage("Project name must be a string")
    .trim()
    .isLength({ max: 30 })
    .withMessage("Project name must not exceed 30 characters"),
];

export const renameProjectValidator = [
  // Project Name
  body("newName")
    .notEmpty()
    .withMessage("New Project name is required")
    .isString()
    .withMessage("New Project name must be a string")
    .trim()
    .isLength({ max: 30 })
    .withMessage("New Project name must not exceed 30 characters"),
];

export const saveVideoDescValidator = [
  // video description
  body("description")
    .notEmpty()
    .withMessage("Video Description is required")
    .isString()
    .withMessage("Video Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Video Description not exceed 500 characters"),
];

export const saveCustomPromptValidator = [
  // video description
  body("prompt")
    .notEmpty()
    .withMessage("custom prompt is required")
    .isString()
    .withMessage("custom promptn must be a string")
    .isLength({ max: 200 })
    .withMessage("custom prompt not exceed 200 characters")
];