import { body } from "express-validator";
export const createProjectValidator = [
  // Project Name
  body("projectName")
    .notEmpty()
    .withMessage("Project name is required")
    .isString()
    .withMessage("Project name must be a string")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Project name must not exceed 300 characters"),
];