import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  deleteMyAccount,
} from "../controllers/usercontroller.js";

const userroute = express.Router();

userroute.use(verifyJWT); 

userroute.get("/me", getMyProfile);
userroute.put("/me", updateMyProfile);
userroute.put("/me/password", updateMyPassword);
userroute.delete("/me", deleteMyAccount);

export default userroute;
