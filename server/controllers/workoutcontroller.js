import Workout from "../models/workoutmodel.js";
import { asynhandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import apiNinjasService from "../services/apininjas.service.js";

export const searchWorkout = asynhandler(async (req, res) => {
  const { activity, duration, weight } = req.body;

  if (!activity || !duration || !weight) {
    throw new apierror(400, "Activity, duration, and weight are required");
  }

  const workoutData = await apiNinjasService.getCaloriesBurned(
    activity,
    duration,
    weight
  );

  return res.status(200).json(
    new apiresponse(200, workoutData, "Workout data fetched successfully")
  );
});

export const addOrUpdateWorkout = asynhandler(async (req, res) => {
  const { date, exercises } = req.body;
  const userId = req.user._id;

  if (!date || !exercises || !Array.isArray(exercises)) {
    throw new apierror(400, "Date and exercises array are required");
  }

  const totalCaloriesBurned = exercises.reduce(
    (acc, ex) => acc + (ex.caloriesBurned || 0),
    0
  );

  const workout = await Workout.findOneAndUpdate(
    { user: userId, date },
    {
      user: userId,
      date,
      exercises,
      totalCaloriesBurned,
    },
    { new: true, upsert: true }
  );

  return res.status(200).json(
    new apiresponse(200, workout, "Workout saved successfully")
  );
});

export const getWorkoutByDate = asynhandler(async (req, res) => {
  const { date } = req.params;
  const userId = req.user._id;

  const workout = await Workout.findOne({ user: userId, date });
  
  if (!workout) {
    throw new apierror(404, "No workout data found for this date");
  }

  return res.status(200).json(
    new apiresponse(200, workout, "Workout data fetched successfully")
  );
});

export const getAllWorkouts = asynhandler(async (req, res) => {
  const userId = req.user._id;
  const data = await Workout.find({ user: userId }).sort({ date: -1 });
  
  return res.status(200).json(
    new apiresponse(200, data, "All workouts fetched successfully")
  );
});

export const deleteWorkout = asynhandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const workout = await Workout.findOne({ _id: id, user: userId });
  
  if (!workout) {
    throw new apierror(404, "Workout entry not found");
  }

  await Workout.findByIdAndDelete(id);
  
  return res.status(200).json(
    new apiresponse(200, {}, "Workout entry deleted successfully")
  );
});