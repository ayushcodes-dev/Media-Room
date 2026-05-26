import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        if(this.signup === true|| this.role=== "admin") return true;
      },
      minlength: 6,
    },
    role:{
      type: String,
      deafult: "user",
      enum:["user","admin"]
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    OTPsended: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: String,
      length: 6,
    },
    OTPsendDate: {
      type: Date,
      default: Date.now,
    },
    OTPAttempt: {
      type: Number,
      default: 0,
    },
    signinPasswordAttempt: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    blockSigninAttempt: {
      blockDate: {
        type: Date,
      },
    },
    signup: {
      type: Boolean,
      default: false,
    },
    signin: {
      type: Boolean,
      default: false,
    },
  
    
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
