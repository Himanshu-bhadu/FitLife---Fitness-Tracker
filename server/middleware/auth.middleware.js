import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";
import { apierror } from "../utils/apierror.js";
import { asynhandler } from "../utils/asynchandler.js";

const verifyJWT = asynhandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apierror(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const loggedInUser = await User.findById(decodedToken.id).select("-password");

  if (!loggedInUser) {
    throw new apierror(401, "Invalid access token");
  }

  req.user = loggedInUser;

  next();
});

export { verifyJWT };
