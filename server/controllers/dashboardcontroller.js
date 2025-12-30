import Nutrition from "../models/nutritionmodel.js";
import Workout from "../models/workoutmodel.js";
import { startOfDay, subDays, format } from 'date-fns';
import { asynhandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";

export const getWeeklyAnalytics = asynhandler(async (req, res) => {
  const currentUserId = req.user._id;

  const allNutrition = await Nutrition.find({ user: currentUserId });
  const allWorkouts = await Workout.find({ user: currentUserId });

  const toSimpleDate = (dateVal) => {
    if (!dateVal) return "N/A";
    if (typeof dateVal === 'string') return dateVal.substring(0, 10);
    const d = new Date(dateVal);
    return d.toLocaleDateString("en-CA"); 
  };

  const analytics = [];
  
  for (let i = 29; i >= 0; i--) {
    const d = subDays(new Date(), i); 
    const targetDateString = toSimpleDate(d); 
    const displayDate = format(d, 'MMM dd');

    const dayMeals = allNutrition.filter(n => toSimpleDate(n.date) === targetDateString);
    const dayWorkouts = allWorkouts.filter(w => toSimpleDate(w.date) === targetDateString);

    const totalCaloriesIn = dayMeals.reduce((acc, curr) => acc + (Number(curr.totalCalories) || 0), 0);
    const totalProtein = dayMeals.reduce((acc, curr) => acc + (Number(curr.totalProtein) || 0), 0);
    const totalCarbs = dayMeals.reduce((acc, curr) => acc + (Number(curr.totalCarbs) || 0), 0);
    const totalFat = dayMeals.reduce((acc, curr) => acc + (Number(curr.totalFat) || 0), 0);

    const totalCaloriesBurned = dayWorkouts.reduce((acc, curr) => acc + (Number(curr.totalCaloriesBurned) || 0), 0);

    analytics.push({
      date: displayDate,
      caloriesIn: totalCaloriesIn,
      caloriesBurned: totalCaloriesBurned,
      protein: totalProtein,
      carbs: totalCarbs,     
      fat: totalFat,         
      hasWorkout: dayWorkouts.length > 0,
    });
  }

  return res.status(200).json(
    new apiresponse(200, analytics, "Weekly analytics fetched")
  );
});

export const getDashboard = asynhandler(async (req, res) => {
  const userId = req.user._id;
  const { date } = req.params;

  const nutrition = await Nutrition.findOne({ user: userId, date });
  const workout = await Workout.findOne({ user: userId, date });

  return res.status(200).json(
    new apiresponse(200, {
      date,
      nutrition: nutrition || { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0 },
      workout: workout || { totalCaloriesBurned: 0 },
      netCalories:
        (nutrition?.totalCalories || 0) - (workout?.totalCaloriesBurned || 0),
    },
    "Dashboard data fetched")
  );
});
