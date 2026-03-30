import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return this.signup === true;
    }
    minlength: 6
  },
  isAuthenticated: {
    type: Boolean,
    default: false
  },
  signup:{
    type: Boolean,
    default: false,
    0l
  }
  

}, {
  timestamps: true 
});

const User = mongoose.model("User", userSchema);

export default User;