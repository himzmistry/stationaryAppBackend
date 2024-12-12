const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter valid email"],
  },
  photo: { type: String, default: "default.jpg" },
  role: {
    type: String,
    enum: ["manager", "admin"],
    default: "admin",
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
    //minlength: 8,
    //select: false,
  },
  passwordConfirm: {
    type: String,
    //required: [true, "Please confirm your ConfirmPassword"],
    validate: {
      // this only works on create and save !
      validator: function (el) {
        return el === this.password;
      },
      message: "Password are not same !",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
