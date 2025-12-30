import Nutrition from "../models/nutritionmodel.js";
import { asynhandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";
import nutritionixService from "../services/nutritionix.service.js";

export const searchFood = asynhandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    throw new apierror(400, "Food query is required");
  }

  const nutritionData = await nutritionixService.getNutritionInfo(query);

  return res.status(200).json(
    new apiresponse(200, nutritionData, "Nutrition data fetched successfully")
  );
});

export const addOrUpdateNutrition = asynhandler(async (req, res) => {
  const { date, items } = req.body;
  const userId = req.user._id;

  if (!date || !items || !Array.isArray(items)) {
    throw new apierror(400, "Date and items array are required");
  }

  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.fat += item.fat || 0;
      acc.carbs += item.carbs || 0;
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const nutrition = await Nutrition.findOneAndUpdate(
    { user: userId, date },
    {
      user: userId,
      date,
      items,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalFat: totals.fat,
      totalCarbs: totals.carbs,
    },
    { new: true, upsert: true }
  );

  return res.status(200).json(
    new apiresponse(200, nutrition, "Nutrition saved successfully")
  );
});

export const getNutritionByDate = asynhandler(async (req, res) => {
  const { date } = req.params;
  const userId = req.user._id;

  const nutrition = await Nutrition.findOne({ user: userId, date });
  
  if (!nutrition) {
    throw new apierror(404, "No nutrition data found for this date");
  }

  return res.status(200).json(
    new apiresponse(200, nutrition, "Nutrition data fetched successfully")
  );
});

export const getAllNutrition = asynhandler(async (req, res) => {
  const userId = req.user._id;
  const data = await Nutrition.find({ user: userId }).sort({ date: -1 });
  
  return res.status(200).json(
    new apiresponse(200, data, "All nutrition records fetched successfully")
  );
});

export const deleteNutrition = asynhandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const nutrition = await Nutrition.findOne({ _id: id, user: userId });
  
  if (!nutrition) {
    throw new apierror(404, "Nutrition entry not found");
  }

  await Nutrition.findByIdAndDelete(id);
  
  return res.status(200).json(
    new apiresponse(200, {}, "Nutrition entry deleted successfully")
  );
});