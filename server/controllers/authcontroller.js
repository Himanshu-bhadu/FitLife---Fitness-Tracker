import User from "../models/usermodel.js";
import { apierror } from "../utils/apierror.js";
import { apiresponse } from "../utils/apiresponse.js";
import { asynhandler } from "../utils/asynchandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

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

export const loginUser = asynhandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new apierror(400, "Email and password required");

  const user = await User.findOne({ email });
  if (!user) throw new apierror(404, "User not found");

  const match = await user.comparePassword(password);
  if (!match) throw new apierror(401, "Incorrect password");

  const token = user.generateToken();

  res
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new apiresponse(200, user, "Login successful"));
});

export const logoutUser = asynhandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.status(200).json(new apiresponse(200, {}, "Logged out successfully"));
});

export const checkAuth = asynhandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password"); // Don't send password
  return res.status(200).json(new apiresponse(200, user, "User verified"));
});