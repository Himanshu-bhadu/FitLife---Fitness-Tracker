import axios from "axios";

const API_NINJAS_URL = "https://api.api-ninjas.com/v1/caloriesburned";

class ApiNinjasService {
  
  async getCaloriesBurned(activity, duration, weight) {
    try {
      const apiKey = process.env.API_NINJAS_KEY;

      if (!apiKey) {
        throw new Error("API Ninjas key is missing from .env");
      }

      const response = await axios.get(API_NINJAS_URL, {
        params: {
          activity,
          duration: parseFloat(duration),
          weight: parseFloat(weight),
        },
        headers: {
          "X-Api-Key": apiKey,
        },
      });

      return response.data.map(item => ({
        name: item.name,
        durationMinutes: item.duration_minutes,
        totalCalories: item.total_calories,
        caloriesPerHour: item.calories_per_hour,
      }));
    } catch (error) {
      console.error("API Ninjas Error:", error.response?.data || error.message);
      throw new Error("Failed to fetch workout data");
    }
  }
}

export default new ApiNinjasService();