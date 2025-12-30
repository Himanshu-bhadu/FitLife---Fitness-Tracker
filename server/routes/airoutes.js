import express from "express";
import { getAIChat } from "../controllers/aicontroller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT); 
router.post("/chat", getAIChat);

export default router;