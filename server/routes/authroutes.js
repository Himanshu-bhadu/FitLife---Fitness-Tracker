import express from "express";
import { registerUser, loginUser, logoutUser , forgotPassword,resetPassword,checkAuth} from "../controllers/authcontroller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = express.Router();


router.route("/check-auth").get(verifyJWT, checkAuth);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

export default router;
