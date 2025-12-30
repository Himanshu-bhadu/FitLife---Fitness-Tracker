import express from "express";
import { getDashboard ,getWeeklyAnalytics} from "../controllers/dashboardcontroller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const dashboardroute = express.Router();
dashboardroute.get("/analytics", verifyJWT, getWeeklyAnalytics);
dashboardroute.use(verifyJWT);
dashboardroute.get("/:date", getDashboard);

export default dashboardroute;
