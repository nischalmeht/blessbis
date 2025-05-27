const Validator = require("validatorjs");
const { ErrorHandler } = require("../middleware/errorHandler");
const generateToken = require("../utils/generateToken");
const {catchAsyncErrors} = require("../middleware/catchAsyncErrors");
// const sequelize = require('../utils/sql');
const { Sequelize, DataTypes } = require('sequelize');
const { config } = require('dotenv');
const jwt = require("jsonwebtoken");


config();
if (!process.env.DB_URL) {
    throw new Error('DATABASE_URL is not set');
}
const sequelize = new Sequelize(process.env.DB_URL, {
    dialectOptions: {
        ssl: {
            require: true,
        },
    },
});
const User  = require("../models/user")(sequelize, DataTypes); // Adjust path as needed
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.JWT_SEC, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};
const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "development",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "development",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

class AuthController {
  static registerUser = async (req, res, next) => {
    const rules = {
      name: "required|string",
      email: "required|email",
      password: "required|string",
    };
  
    const validation = new Validator(req.body, rules);
    if (!validation.passes()) {
      const errorResponse = {};
      for (let key in rules) {
        const error = validation.errors.get(key);
        if (error.length) {
          errorResponse[key] = error;
        }
      }
      return next(new ErrorHandler(errorResponse, 400));
    }
  
    const { name, email, password } = req.body;
  
    try {
      // Check if user already exists (uncomment if needed)
      // const isRegistered = await User.findOne({ where: { email } });
      // if (isRegistered) {
      //   return next(new ErrorHandler("User already registered.", 400));
      // }
  
      // console.log("Creating user with data:", { name, email, password: '***hidden***' });
  
      const newUser = await User.create({ name, email, password });
      // console.log("User created successfully:", newUser.id);
  
      generateToken(newUser, "User Registered.", 201, res);
    } catch (error) {
      console.error("Error creating user:", error);
      return next(new ErrorHandler("Failed to register user.", 500));
    }
  };
  

  static loginUser = (async (req, res, next) => {
    const rules = {       
        email: "required|string",
        password: "required|string",
      };
  
      const validation = new Validator(req.body, rules);
      if (!validation.passes()) {
        const errorResponse = {};
        for (let key in rules) {
          const error = validation.errors.get(key);
          if (error.length) {
            errorResponse[key] = error;
          }
        }
        return next(new ErrorHandler(errorResponse, 400));
      }
      const {email,password}=req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password.", 401));
    }

    generateToken(user, "User logged in successfully.", 200, res);
  });
}

module.exports = AuthController;
