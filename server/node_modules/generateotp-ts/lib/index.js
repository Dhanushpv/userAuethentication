"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.generateOtp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const default_secret = crypto_1.default.randomBytes(32).toString("hex");
function generateOtp(digits, expiration = undefined, secret = "") {
    // Generate a random n-digit number
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const otp = Math.floor(min + Math.random() * (max - min + 1));
    // Create a payload containing the OTP
    const payload = { otp: bcrypt_1.default.hashSync(otp.toString(), 10) };
    // Encrypt the payload using JWT and set the desired expiration time
    const token = expiration
        ? jsonwebtoken_1.default.sign(payload, secret || default_secret, {
            expiresIn: expiration,
        })
        : jsonwebtoken_1.default.sign(payload, secret || default_secret);
    return { otp, token };
}
exports.generateOtp = generateOtp;
function verifyOtp(otp, token, secret = "") {
    try {
        // Verify and decode the OTP token using JWT
        const decodedPayload = jsonwebtoken_1.default.verify(token, secret || default_secret);
        // Check if the user-provided OTP matches the OTP in the payload
        if (bcrypt_1.default.compareSync(otp.toString(), decodedPayload.otp)) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.error("Error during OTP verification", error);
        return false;
    }
}
exports.verifyOtp = verifyOtp;
