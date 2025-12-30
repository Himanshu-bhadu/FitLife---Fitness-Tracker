import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

const WorkoutPage = () => {
  const [activity, setActivity] = useState("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!activity || !duration || !weight) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/workout/search', {
        activity,
        duration: parseFloat(duration),
        weight: parseFloat(weight),
      });

      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching workout data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWorkout = async (item) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      let existingExercises = [];
      try {
        const existing = await api.get(`/api/workout/${today}`);
        existingExercises = existing.data.data.exercises || [];
      } catch (e) {
        // No existing data
      }

      const newExercise = {
        name: item.name,
        duration: item.durationMinutes,
        caloriesBurned: item.totalCalories,
      };

      await api.post('/api/workout', {
        date: today,
        exercises: [...existingExercises, newExercise]
      });

      toast.success(`${item.name} added to your dashboard ✅`);
    } catch (error) {
      console.error("Error adding workout:", error);
      toast.error(error.response?.data?.message || "Failed to add workout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4 md:p-8">
      
      {/* Navigation Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-semibold shadow-sm hover:shadow-md transition border border-indigo-100 flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Dashboard
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-indigo-800 mb-2 text-center">
          🏋️ Workout Tracker
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Calculate calories burned and log your activities.
        </p>

        {/* Input Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-indigo-50">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Activity Name</label>
              <input
                type="text"
                placeholder="e.g. running, cycling, pushups"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Body Weight (kg)</label>
                <input
                  type="number"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Duration (min)</label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition bg-gray-50"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform active:scale-[0.99]"
            >
              {loading ? "Calculating..." : "Check Calories Burned"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-12">
          <CircularProgress size={50} sx={{ color: "indigo.600" }} />
        </div>
      )}

      {/* Results Section */}
      {result.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto mt-10"
        >
          <h2 className="text-xl font-bold text-gray-700 mb-4 px-2">Results Found</h2>
          <div className="space-y-4">
            {result.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 transition-all"
              >
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-800 capitalize">{item.name}</h3>
                  <p className="text-gray-500 text-sm">
                    Duration: <span className="font-medium text-gray-700">{item.durationMinutes} min</span>
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-indigo-600">{Math.round(item.totalCalories)}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">kcal</p>
                  </div>
                  
                  <div className="hidden sm:block h-10 w-px bg-gray-200"></div>

                  <div className="text-center hidden sm:block">
                    <p className="text-lg font-bold text-gray-600">{Math.round(item.caloriesPerHour)}</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">kcal/hr</p>
                  </div>

                  <button
                    onClick={() => handleAddWorkout(item)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-2 group"
                  >
                    <span>Add</span>
                    <span className="group-hover:scale-125 transition-transform">➕</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {result.length === 0 && !loading && (
        <div className="mt-12 text-center text-gray-400">
          <div className="text-5xl mb-3">👟</div>
          <p>Enter details above to see your calorie burn.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;