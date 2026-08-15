import {
  UserModel,
  ProjectModel,
  ContentModel,
  BillingModel,
  PaymentModel,
  UsageModel,
} from "#/database/mongoose/schema/index.model.js";

async function handleDeleteAccount(req) {
  try {
    const userID = req.session?.userID;
    if (!userID) {
      return {
        success: false,
        statusCode: 401,
        message: "User is not authenticated",
        errorCode: "UNAUTHENTICATED",
        errors: null,
      };
    }

    // Permanently remove all user data across collections
    await Promise.allSettled([
      UserModel.deleteOne({ userID }),
      ProjectModel.deleteOne({ userID }),
      ContentModel.deleteMany({ userID }),
      BillingModel.deleteOne({ userID }),
      PaymentModel.deleteMany({ userID }),
      UsageModel.deleteMany({ userID }),
    ]);

    // Destroy session
    await new Promise((resolve) => {
      req.session.destroy(() => {
        resolve();
      });
    });

    return {
      success: true,
      statusCode: 200,
      message: "Account and associated data deleted permanently",
      errorCode: null,
      errors: null,
    };
  } catch (error) {
    console.error("Error during account deletion:", error);
    return {
      success: false,
      statusCode: 500,
      message: "Failed to delete account",
      errorCode: "DELETE_ACCOUNT_FAILED",
      errors: error.message,
    };
  }
}

export default handleDeleteAccount;
