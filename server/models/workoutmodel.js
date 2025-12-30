import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },

    exercises: [
      {
        name: { type: String, required: true },
        duration: { type: Number, default: 0 },
        caloriesBurned: { type: Number, default: 0 },
      },
    ],

    totalCaloriesBurned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", workoutSchema);
