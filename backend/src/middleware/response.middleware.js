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
            error: {
                status: false,
                error: null
            },
            message: message,
            data: {},
            meta: meta
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
            error: {
                status: true,
                error: errors,
                errorCode: errorCode
            },
            message: message
        });
    };

    next();
};
