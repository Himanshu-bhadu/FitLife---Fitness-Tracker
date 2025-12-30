import express from "express";
import {
  searchWorkout,           
  addOrUpdateWorkout,
  getWorkoutByDate,
  getAllWorkouts,
  deleteWorkout,
} from "../controllers/workoutcontroller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const workoutroute = express.Router();

workoutroute.use(verifyJWT);

workoutroute.post("/search", searchWorkout);

workoutroute.post("/", addOrUpdateWorkout);
workoutroute.get("/:date", getWorkoutByDate);
workoutroute.get("/", getAllWorkouts);
workoutroute.delete("/:id", deleteWorkout);

export default workoutroute;