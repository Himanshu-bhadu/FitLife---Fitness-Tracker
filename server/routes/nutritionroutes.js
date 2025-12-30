import express from "express";
import {
  searchFood,              
  addOrUpdateNutrition,
  getNutritionByDate,
  getAllNutrition,
  deleteNutrition,
} from "../controllers/nutritioncontroller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const nutritionroute = express.Router();

nutritionroute.use(verifyJWT);

nutritionroute.post("/search", searchFood);

nutritionroute.post("/", addOrUpdateNutrition);
nutritionroute.get("/:date", getNutritionByDate);
nutritionroute.get("/", getAllNutrition);
nutritionroute.delete("/:id", deleteNutrition);

export default nutritionroute;