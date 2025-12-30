import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userroute from "./routes/userroutes.js";
import nutritionroute from "./routes/nutritionroutes.js";
import workoutroute from "./routes/workoutroutes.js";
import authroutes from "./routes/authroutes.js";
import dashboardroute from "./routes/dashboardroute.js";
import airoutes from "./routes/airoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  console.log('Root route hit');
  res.send("HELLO");
});

app.use("/api/auth", authroutes);
app.use("/api/user", userroute);
app.use("/api/dashboard", dashboardroute);
app.use("/api/nutrition", nutritionroute);
app.use("/api/ai",airoutes);
app.use("/api/workout", workoutroute);

app.use((err, req, res, next) => {
  res.status(err.statuscode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.error
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));