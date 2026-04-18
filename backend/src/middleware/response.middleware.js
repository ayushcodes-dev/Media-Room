// Handle Response and send res in same Format
export const responseHandler = (req, res, next) => {
    // ✅ Success Response
    res.success = ({
        statusCode = 200,
        message = "Success",
        data = null,
        meta = null
    } = {}) => {
        return res.status(statusCode).json({
          success: true,
          statusCode: statusCode,
          message: message,
          data: data,
          error: {
            status: false,
            error: null,
          },
          meta: meta,
        });
    };

    // ❌ Error Response
    res.error = ({
        statusCode = 500,
        message = "Something went wrong",
        errorCode = "INTERNAL_ERROR",
        errors = null
    } = {}) => {
        return res.status(statusCode).json({
            success: false,
            statusCode: statusCode,
            message: message,
            error: {
                status: true,
                error: errors,
                errorCode: errorCode
            },
        });
    };

    next();
};
