import bcrypt from "bcryptjs";
import { UserModel } from "#/database/mongoose/schema/index.model.js";
import { signinWrongAttemptLimit, signinBlockTime } from "#/utility.js";
// function to compare password
async function checkPassword(inputPassword, storedPassword) {
    try{
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    return isMatch;
    }catch{
        return false
    }
}
async function handleWrongAttempt(user) {
    try{
    if (user.signinPasswordAttempt?.length >= signinWrongAttemptLimit-1) {
        // updating user and set block date
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    signinPasswordAttempt: [],
                    "blockSigninAttempt.blockDate": Date.now()
                }
            },
            { new: true, runValidators: true }
        );
        return false;
    } else {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email: user.email },
            {
                $push: { signinPasswordAttempt: { date: Date.now() } }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) return false;
        return true;
    }
}catch(err){
    return false
}
}
// function to check user is valid for signin or not
async function isUserValidForSignin(user) {
    const lastTime = Date.now() - signinBlockTime;
    // if user is blocked
    if (new Date(user.blockSigninAttempt?.blockDate).getTime() > lastTime) {
        return false;
    }
    return true;
}
//function to update user and make user authenticated in db
async function authenticateUser(email, Data) {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    isAuthenticated: true,
                    signin: true,
                    signinPasswordAttempt: [],
                    "blockSigninAttempt.blockDate": null
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
// function to authenticate User in Session
function authenticateInSession(req, Data) {
    req.session.username = Data.username;
    req.session.email = Data.email;
    req.session.userID = Data.userID;
    req.session.isAuthenticated = true;
    req.session.role = Data.role
}

// Handles Signin
async function handleSignin(req, Data) {
   
    const response = {
        success: false,
        statusCode: 404,
        message: "Email Or Password Is Invalid",
        errorCode: "INVALID_EMAIL_OR_PASSWORD",
        errors: null
    };
    // finding user from mongodb
    const user = await UserModel.findOne({ email: Data.email });
  
    if (!user) {
        return response;
    }
    const isValid = await isUserValidForSignin(user);
    if (!isValid) {
        return {
            success: false,
            statusCode: 403,
            message: "Too much Wrong Password. Try Again After Sometime",
            errorCode: "BLOCKED_USER",
            errors: null
        };
    }
    // comparing both password
    const check = await checkPassword(Data.password, user.password);
    if (!check) {
        await handleWrongAttempt(user);
        return response;
    }
    const authUser = await authenticateUser(user.email, Data);
    if (!authUser) {
        return {
            success: false,
            statusCode: 500,
            message: "Failed To Signin",
            errorCode: "FAILED_SIGNIN",
            errors: null
        };
    }
    // authenticating user in session
    Data.userID = user.userID;
    Data.role= user.role
    authenticateInSession(req, Data);
    return {
        success: true,
        statusCode: 200,
        message: "Signin Successfully",
        data:{
            userID: user.userID,
            email: user.email,
            username: user.username,
            isAuthenticated: true,
            role:user.role
        }
    };
}

export default handleSignin;
