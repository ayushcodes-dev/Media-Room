import { validationResult } from "express-validator";


 const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
   return res.error({
    statusCode : 500,
        message : "Validation Error",
        errorCode : "VALIDATION_ERROR",
        errors : errors.array()
   })
  }

  next();
};
export default validate