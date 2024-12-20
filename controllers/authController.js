const User = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    statusCode: statusCode,
    status: "success",
    data: {
      token,
      user,
    },
  });
};

// List of dummy domains to check
const dummyDomains = [
  "example.com",
  "test.com",
  "dummy.com",
  "localhost",
  "invalid.com",
  // Add any other dummy domains you want to check here
];

function isEmail(email) {
  // Regular expression for validating email format
  const emailFormat = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$/;

  // Check if the email matches the format
  if (!emailFormat.test(email)) {
    console.log("Invalid email format");
    return false;
  }

  // Extract domain from email
  const domain = email.split("@")[1];

  // Check if the domain is in the list of dummy domains
  if (dummyDomains.includes(domain)) {
    console.log("Email domain is dummy");
    return false;
  }

  return true;
}

exports.signUp = async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);

    // Check if email is valid and not from a dummy domain
    if (!isEmail(req.body.email)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid email format or email domain is dummy",
      });
    }

    //const token = signToken(newUser._id);
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    res.status(409).json({
      statusCode: 409,
      status: "fail",
      message: "User already exists",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) check email n pwd exist
    if (!email || !password) {
      return next(new AppError("Please provide email or password !!!", 400));
    }

    // 2) check if user exists and pwd is correct
    const user = await User.findOne({ email }).select("+password");

    if (user === null) {
      return res.status(401).json({
        statusCode: 401,
        status: "fail",
        message: "User not found. Please signup",
      });
    }

    const correct = await user.correctPassword(password, user.password);

    if (!correct) {
      return res.status(401).json({
        statusCode: 401,
        status: "fail",
        message: "Incorrect Password",
      });
    }

    // 3) if everything oky, send token to client
    createSendToken(user, 200, req, res);
  } catch (err) {
    res.status(401).json({
      statusCode: 401,
      status: "fail",
      message: "Incorrect email or password!!!",
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if the token is available in the Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token is found, return an error
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        status: "fail",
        message: "You are not logged in! Please login to get access!",
      });
    }

    // 2) Verify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if the user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        statusCode: 401,
        status: "fail",
        message: "The user belonging to this token does not longer exist.",
      });
    }

    // Grant access to the protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        statusCode: 401,
        status: "fail",
        message: "Invalid token, please log in again.",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      status: "fail",
      message: "Something went wrong during token verification.",
    });
  }
};

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};
