import User from "../models/usermodel.js";
import { asynhandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import Nutrition from "../models/nutritionmodel.js"; 
import Workout from "../models/workoutmodel.js";

export const getMyProfile = asynhandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new apierror(404, "User not found");

  return res
    .status(200)
    .json(new apiresponse(200, user, "User profile fetched successfully"));
});

export const updateMyProfile = asynhandler(async (req, res) => {
  const { name, email, profilePic } = req.body;

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (profilePic) updateData.profilePic = profilePic;

  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
  }).select("-password");

  if (!user) throw new apierror(404, "User not found");

  return res
    .status(200)
    .json(new apiresponse(200, user, "Profile updated successfully"));
});

export const updateMyPassword = asynhandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new apierror(400, "Old and new password are required");
  }

  const user = await User.findById(req.user._id);
  if (!user) throw new apierror(404, "User not found");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) throw new apierror(400, "Incorrect old password");

  user.password = newPassword;
  await user.save(); 

  return res
    .status(200)
    .json(new apiresponse(200, {}, "Password updated successfully"));
});

export const deleteMyAccount = asynhandler(async (req, res) => {
  const userId = req.user._id;

  await Nutrition.deleteMany({ user: userId });
  await Workout.deleteMany({ user: userId });

  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new apiresponse(200, {}, "Account and all data deleted successfully"));
});