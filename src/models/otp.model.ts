import mongoose, {Schema } from "mongoose";

const userOtpVerificationSchema =  new Schema({
    userId: String,
    otpcode: String,
    createdAt: String,
    expiredAt: String,
});

export const userOtpVerificationmodel = mongoose.model("userOtpVerification", userOtpVerificationSchema);