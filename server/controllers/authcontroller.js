import User from "../models/usermodel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynhandler } from "../utils/asynchandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// ... (Keep forgotPassword, resetPassword, and registerUser exactly as they are) ...
// ... (Paste them here if you are replacing the whole file) ...

export const forgotPassword = asynhandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new apierror(404, "User not found with this email");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request - Fitness App",
      url: resetUrl,
    });

    return res.status(200).json(
      new apiresponse(200, {}, `Email sent successfully to ${user.email}`)
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Email Error:", error);
    throw new apierror(500, "Email could not be sent. Please check your internet or try again.");
  }

  
  return res.status(200).json(
    new apiresponse(200, { link: resetUrl }, "Reset link generated (Check server console)")
  );
});

export const resetPassword = asynhandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new apierror(400, "Invalid or expired token");
  }

  user.password = password; 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return res.status(200).json(
    new apiresponse(200, {}, "Password updated successfully! Please login.")
  );
});

export const registerUser = asynhandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    throw new apierror(400, "All fields are required");

  const userExists = await User.findOne({ email });
  if (userExists) throw new apierror(409, "Email already exists");

  const user = await User.create({ name, email, password });

  return res.status(201).json(
    new apiresponse(201, user, "Registration successful")
  );
});

// --- UPDATED LOGIN FUNCTION ---
export const loginUser = asynhandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new apierror(400, "Email and password required");

  const user = await User.findOne({ email });
  if (!user) throw new apierror(404, "User not found");

  const match = await user.comparePassword(password);
  if (!match) throw new apierror(401, "Incorrect password");

  const token = user.generateToken();

  // FIX 1: Determine Environment
  const isProduction = process.env.NODE_ENV === "production";

  // FIX 2: Add Token to Response Body
  // We convert the mongoose document to a plain object so we can add the token
  const userResponse = user.toObject();
  userResponse.accessToken = token; 

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: isProduction,           // false on Localhost, true on Production
      sameSite: isProduction ? "none" : "lax", // 'lax' prevents loop on Localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new apiresponse(200, userResponse, "Login successful")); // Sending token in body
});

// --- UPDATED LOGOUT FUNCTION ---
export const logoutUser = asynhandler(async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,           // Must match the settings used to create the cookie
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json(new apiresponse(200, {}, "Logged out successfully"));
});