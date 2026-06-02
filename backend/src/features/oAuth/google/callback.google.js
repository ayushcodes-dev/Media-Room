import axios from "axios";
import { UserModel } from "#/database/mongoose/schema/index.model.js";
import { v4 as uuidv4 } from "uuid";

// function to insert new user in db
async function createUser(Data) {
  try {
    const user = new UserModel({
      userID: Data.userID,
      username: Data.username,
      email: Data.email,
      isAuthenticated: true,
    });

    const savedUser = await user.save();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
// function to creare user or update user that user is authenticated with google
async function authenticateUserInDB(userData) {
  try {
    const result = await UserModel.findOneAndUpdate(
      { userID: userData.userID },
      {
        $set: {
          isAuthenticated: true,
          oAuth: { status: true, provider: "google" },
        },
        $setOnInsert: {
          userID: userData.userID,
          email: userData.email,
          name: userData.name,
        },
      },
      {
        upsert: true,
      },
    );

    if (!result) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}
// function to get usser data from google with access token
async function getGoogleUserData(access_token) {
  try {
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const user = userRes.data;
    /*
if (user.aud !== process.env.GOOGLE_CLIENT_ID) {
  return {
    success: false,
    data: null,
    message: "Failed to authenticate with Google",
    errorCode: "GOOGLE_USER_DATA_FETCH_FAILED",
    errors: error,
  };
}*/
    if (!user || !user.id || !user.email || !user.name) {
      return {
        success: false,
        data: null,
        message: "Failed to authenticate with Google",
        errorCode: "GOOGLE_USER_DATA_FETCH_FAILED",
        errors: error,
      };
    }
    return {
      success: true,
      data: user,
      message: "User data fetched successfully from Google",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Failed to authenticate with Google",
      errorCode: "GOOGLE_USER_DATA_FETCH_FAILED",
      errors: error,
    };
  }
}
// function to authenticate User in Session
function authenticateInSession(req, user) {
  req.session.username = user.name;
  req.session.email = user.email;
  req.session.userID = user.userID;
  req.session.isAuthenticated = true;
  req.session.role = "user";
  return true;
}

async function handleGoogleCallback(req) {
  const code = req.query.code;
  let tokenRes;

  try {
    // exchanging code for access token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.FRONTEND_BASE_URL + "/oAuth/callback/google",
      grant_type: "authorization_code",
    });

    const access_token = tokenRes.data.access_token;

    // if access token is not received
    if (!access_token) {
      return {
        success: false,
        statusCode: 500,
        message: "failed to authenticate with Google",
        errorCode: "GOOGLE_AUTH_FAILED",
        errors: null,
      };
    }
    // getting data from google with access token
    const userData = await getGoogleUserData(access_token);

    if (!userData.success) {
      return {
        success: false,
        statusCode: 500,
        message: "failed to authenticate with Google",
        errorCode: "GOOGLE_AUTH_FAILED",
        errors: null,
      };
    }
   
    // finding user in database
    const user = await UserModel.findOne({ email: userData.data.email });

    // user id is created
    const userID = uuidv4();
    // if user not exit . create user in database
    if (!user) {
      const Data = {
        userID: userID,
        username: userData.data.name,
        email: userData.data.email,
      };
      const create = await createUser(Data);
      if (!create) {
        return {
          success: false,
          statusCode: 500,
          message: "failed to authenticate with Google",
          errorCode: "GOOGLE_AUTH_FAILED",
          errors: null,
        };
      }
    }

    const authenticateDB = await authenticateUserInDB({
      ...userData.data,
      userID: user ? user.userID : userID,
    });

    if (!authenticateDB) {
      return {
        success: false,
        statusCode: 500,
        message: "failed to authenticate with Google",
        errorCode: "GOOGLE_AUTH_FAILED",
        errors: null,
      };
    }

    // authenticate user in session
   authenticateInSession(req, {
      ...userData.data,
      userID: user ? user.userID : userID,
    });

    return {
      success: true,
      statusCode: 200,
      message: "User authenticated successfully with Google",
      data: {
        ...userData.data,
        userID: user ? user.userID : userID,
        username: userData.data.name,
        isAuthenticated: true,
        role: "user",
      },
    };
  } catch (error) {
   // console.log(error);
    return {
      success: false,
      statusCode: 500,
      message: "failed to authenticate with Google",
      errorCode: "GOOGLE_AUTH_FAILED",
      errors: null,
    };
  }
}

export default handleGoogleCallback;
