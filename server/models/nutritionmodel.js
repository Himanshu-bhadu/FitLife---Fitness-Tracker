import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, 
    items: [
      {
        name: { type: String, required: true },
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
      },
    ],

    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Nutrition", nutritionSchema);
