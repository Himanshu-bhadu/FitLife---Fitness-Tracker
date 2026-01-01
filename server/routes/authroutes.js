import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  forgotPassword, 
  resetPassword, 
  googleLogin 
} from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/google", googleLogin); // <--- This is the key line

export default router;