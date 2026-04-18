import { UserModel } from "#/database/mongoose/schema/index.model.js";
import { v4 as uuidv4 } from "uuid";
import sendSignupOTP from "./signup.mail.js";
import { OTPValidationTime } from "#/utility.js";
import bcrypt from "bcryptjs";
// function to insert new user in db
async function createUser(Data) {
    try {
        const user = new UserModel({
            userID: Data.userID,
            username: Data.username,
            email: Data.email,
            password: Data.password,
            OTPsended: Data.OTPsended,
            OTP: Data.OTP,
            OTPAttempt: 0
        });

        const savedUser = await user.save();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
//function to update user and make user authenticated in db
async function authenticateUser(email, Data) {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    isAuthenticated: true,
                    signup: true
                }
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedUser) return false;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
// function to Update OTP in db
async function updateOTP(email, Data) {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    OTPsended: Data.OTPsended,
                    OTP: Data.OTP,
                    OTPsendDate: Data.OTPsendDate,
                    OTPAttempt: 0
                }
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedUser) return false;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
// function to Update OTP in db
async function increaseOTPAttempt(email, Data) {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
                $inc: { OTPAttempt: 1 }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return false;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}
// function To Hash Password
async function hashPassword(password) {
    const saltRounds = 10; // security level
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
// function to authenticate User in Session
function authenticateInSession(req, user) {
    req.session.username = user.username;
    req.session.email = user.email;
    req.session.userID = user.userID;
    req.session.isAuthenticated = true;
}
async function HandleSignup(req, Data) {
    // finding user from mongodb
    const user = await UserModel.findOne({ email: Data.email });
    // comparing otp sended time
    const compare =
        Date.now() - (user ? new Date(user.OTPsendDate).getTime() : 0);
    // if user not created. sends OTP
    if (!user) {
        // user id is created
        const userID = uuidv4();
        // Generating OTP
        const OTP = Math.floor(100000 + Math.random() * 900000);
        Data.OTP = OTP;

        // sending OTP
        const sendMail = await sendSignupOTP(Data.email, OTP);
        if (!sendMail) {
            return {
                success: false,
                statusCode: 409,
                message: "E-mail is invalid",
                errorCode: "INVALID_EMAIL",
                errors: null
            };
        }

        Data.userID = userID;
        // hashing Password
        Data.password = await hashPassword(Data.password);
        // creating User or Inserting User Data In MongoDB
        const insert = await createUser(Data);
        if (!insert) {
            return {
                success: false,
                statusCode: 500,
                message: "Unable Insert User In Database",
                errorCode: "FAILED_TO_INSERT",
                errors: null
            };
        }
        return {
            success: true,
            statusCode: 200,
            message: "OTP Sended Successfully"
        };
    }
    // if user already authenticated
    if (user.signup === true) {
        return {
            success: false,
            statusCode: 409,
            message: "User Already Exits",
            errorCode: "USER_ALREADY_EXITS",
            errors: null
        };
    }
    // if  OTP expired. sends OTP
    if (compare > OTPValidationTime) {
        // Generating OTP
        const OTP = Math.floor(100000 + Math.random() * 900000);

        // sending OTP
        const sendMail = await sendSignupOTP(user.email, OTP);
        if (!sendMail) {
            return {
                success: false,
                statusCode: 409,
                message: "E-mail is invalid",
                errorCode: "INVALID_EMAIL",
                errors: null
            };
        }
        // Updating User or Updating OTP In MongoDB
        const Data = {
            OTP: OTP,
            OTPsended: true,
            OTPsendDate: Date.now()
        };
        const update = await updateOTP(user.email, Data);
        if (!update) {
            return {
                success: false,
                statusCode: 409,
                message: "Unable To Update User In Database",
                errorCode: "FAILED_TO_UPDATE",
                errors: null
            };
        }

        return {
            success: true,
            statusCode: 200,
            message: "OTP Sended Successfully"
        };
    }
    // if user not found OTP && OTP IS not expired.
    if (!Data.OTPsended && compare < OTPValidationTime) {
        return {
            success: false,
            statusCode: 409,
            message:
                "OTP Has Been Already Sended. Try again after " +
                OTPValidationTime / (1000 * 60) +
                " minutes",
            errorCode: "ALREADY_OTP_SENDED",
            errors: null
        };
    }
    // if OTP Attempt Limit Crossed
    if (user.OTPAttempt > 0) {
        return {
            success: false,
            statusCode: 409,
            message:
                "Try again after " +
                OTPValidationTime / (1000 * 60) +
                " minutes",
            errorCode: "OTP_ATTEMPT_LIMIT_COSSED",
            errors: null
        };
    }
    // if Otp is wrong
    if (user.OTP !== Data.OTP) {
        const incre = await increaseOTPAttempt(user.email);
        if (!incre) {
            return {
                success: false,
                statusCode: 500,
                message: "Error To Update User",
                errorCode: "UPDATE_ERROR",
                errors: null
            };
        }
        return {
            success: false,
            statusCode: 401,
            message:
                "OTP Is Wrong. Retry Again After " +
                OTPValidationTime / (1000 * 60) +
                " minutes",
            errorCode: "INVALID_OTP",
            errors: null
        };
    }
    // updating user and making user authenticated
    const authUser = await authenticateUser(user.email);
    if (!authUser) {
        return {
            success: false,
            statusCode: 500,
            message: "Failed To Signup",
            errorCode: "SIGNUP_FAILED",
            errors: null
        };
    }
    // authenticating user in sessions
    authenticateInSession(req, user);
    return {
        success: true,
        statusCode: 200,
        message: "Signup Successfully"
    };
}
export default HandleSignup;
