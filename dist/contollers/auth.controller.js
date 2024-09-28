"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessAndRefreshTokens = exports.refreshAccessToken = exports.verifyOTP = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const ApiError_1 = require("../utils/ApiError");
const AsyncHandler_1 = require("../utils/AsyncHandler");
const ApiResponse_1 = require("../utils/ApiResponse");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = require("../models/user.model.js");
const nodemailer_js_1 = __importDefault(require("../utils/nodemailer.js"));
const otp_model_1 = require("../models/otp.model");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env')
});
nodemailer_js_1.default.verify((error) => {
    if (error) {
        console.log("Nodemailer error from auth controller", error);
    }
    else {
        console.log("Conneted to Nodemailer..");
    }
});
const generateAccessAndRefreshTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_js_1.Usermodel.findById(userId);
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        yield user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw new ApiError_1.ApiError(500, "Something went wrong while generating refresh and Access Token");
    }
});
exports.generateAccessAndRefreshTokens = generateAccessAndRefreshTokens;
const registerUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Executing RegisterUser function `);
        const { name, email, password } = req.body;
        if (name === undefined && email === undefined && password === undefined) {
            throw new ApiError_1.ApiError(400, "Please provide all the input fields for registering a user,");
        }
        console.log(`name: ${name} email: ${email} password: ${password}`);
        const existedUser = yield user_model_js_1.Usermodel.findOne({
            $or: [{ name }, { email }]
        });
        if (existedUser) {
            throw new ApiError_1.ApiError(409, "User with email or username already exists");
        }
        console.log("Creating User ");
        const user = yield user_model_js_1.Usermodel.create({
            username: name.toLowerCase(),
            email,
            password,
        });
        const createdUser = yield user_model_js_1.Usermodel.findById(user._id).select("-password -refreshToken");
        if (!createdUser) {
            throw new ApiError_1.ApiError(500, "Something went wrong while registering the user");
        }
        // const otpResult = await sendOtpVerificationCode(user);
        // console.log(`OTP result: ${otpResult}`);
        // if (otpResult.status === 'FAILED') {
        //     return res.status(500).json(new ApiResponse(500, null, 'Failed to send OTP code'));
        // }
        return res.status(201).json(new ApiResponse_1.ApiResponse(201, createdUser, "User registered successfully"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
}));
exports.registerUser = registerUser;
const loginUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Executing Loginuser controller');
        const { name, email, password } = req.body;
        console.log("name", name);
        console.log("email", email);
        console.log("password", password);
        if (!name && !email) {
            throw new ApiError_1.ApiError(400, "Please provide either username or email");
        }
        const user = yield user_model_js_1.Usermodel.findOne({
            $or: [
                { username: name },
                { email }
            ]
        });
        if (!user) {
            throw new ApiError_1.ApiError(401, "User does not exist");
        }
        const isPasswordValid = yield user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError_1.ApiError(401, "Invalid user credentials");
        }
        const { accessToken, refreshToken } = yield generateAccessAndRefreshTokens(user._id);
        const loggedInUser = yield user_model_js_1.Usermodel.findById(user._id).select("-password -refreshToken");
        const options = {
            httpOnly: true,
            // secure: true
        };
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User logged in successfully"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
}));
exports.loginUser = loginUser;
const logoutUser = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield user_model_js_1.Usermodel.findByIdAndUpdate(req.user._id, {
            $unset: {
                refreshToken: 1
            }
        }, {
            new: true
        });
        const options = {
            httpOnly: true,
            secure: true
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse_1.ApiResponse(200, {}, "User logged out"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
}));
exports.logoutUser = logoutUser;
const refreshAccessToken = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError_1.ApiError(401, "Unauthorized request");
        }
        const decodedToken = jsonwebtoken_1.default.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = yield user_model_js_1.Usermodel.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id);
        if (!user) {
            throw new ApiError_1.ApiError(401, "Invalid refresh token");
        }
        if (incomingRefreshToken !== (user === null || user === void 0 ? void 0 : user.refreshToken)) {
            throw new ApiError_1.ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: true
        };
        const { accessToken, refreshToken } = yield generateAccessAndRefreshTokens(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse_1.ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.statusCode || 500, error.message || "Invalid refresh token");
    }
}));
exports.refreshAccessToken = refreshAccessToken;
const verifyOTP = (0, AsyncHandler_1.AsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            throw new ApiError_1.ApiError(400, "Empty OTP details are not allowed");
        }
        const user = yield user_model_js_1.Usermodel.findOne({ email });
        if (!user) {
            throw new ApiError_1.ApiError(404, "User not found");
        }
        const userOtpVerificationRecords = yield otp_model_1.userOtpVerificationmodel.find({
            userId: user._id,
        });
        console.log(userOtpVerificationRecords);
        if (userOtpVerificationRecords.length <= 0) {
            throw new ApiError_1.ApiError(404, "Account record doesn’t exist or has been verified already, please sign up or sign in");
        }
        const { expiredAt, otpcode } = userOtpVerificationRecords[0];
        // Debugging: Log otpCode to ensure it is retrieved correctly
        console.log(`Retrieved otpCode: ${otpcode}`);
        if (new Date(expiredAt) < new Date()) {
            yield otp_model_1.userOtpVerificationmodel.deleteMany({ userId: user._id });
            throw new ApiError_1.ApiError(400, "Code has expired, please request one more time");
        }
        if (!otpcode) {
            throw new ApiError_1.ApiError(500, "OTP code not found in the database");
        }
        const validOtp = bcrypt_1.default.compareSync(otp, otpcode);
        if (!validOtp) {
            throw new ApiError_1.ApiError(400, "Invalid code passed, check your email");
        }
        yield user_model_js_1.Usermodel.updateOne({ _id: user._id }, { verified: true });
        yield otp_model_1.userOtpVerificationmodel.deleteMany({ userId: user._id });
        return res.json(new ApiResponse_1.ApiResponse(200, null, "User email verified successfully"));
    }
    catch (error) {
        throw new ApiError_1.ApiError(error.statusCode || 500, error.message || "Internal Server Error");
    }
}));
exports.verifyOTP = verifyOTP;
