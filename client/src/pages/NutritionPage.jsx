import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import api from "../api/axios";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

const NutritionPage = () => {
  const navigate = useNavigate();
  const [foodQuery, setFoodQuery] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const getTodayDate = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getTodayDate();

  useEffect(() => {
    fetchTodayNutrition();
  }, []);

  const fetchTodayNutrition = async () => {
    try {
      const response = await api.get(`/api/nutrition/${today}`);
      
      if (response.data.success) {
        const data = response.data.data;
        setTotals({
          calories: data.totalCalories || 0,
          protein: data.totalProtein || 0,
          fat: data.totalFat || 0,
          carbs: data.totalCarbs || 0,
        });
      }
    } catch (error) {
      console.log("No nutrition data for today yet");
    }
  };

  const fetchNutrition = async () => {
    if (!foodQuery) return toast.error("Enter a food item!");
    
    setLoading(true);
    try {
      const response = await api.post('/api/nutrition/search', {
        query: foodQuery
      });

      if (response.data.success) {
        setNutrition(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error fetching nutrition data.");
    } finally {
      setLoading(false);
    }
  };

  const addToDiet = async (item) => {
    try {
      let existingItems = [];
      try {
        const existing = await api.get(`/api/nutrition/${today}`);
        existingItems = existing.data.data.items || [];
      } catch (e) {
        // No existing data
      }

      const newItem = {
        name: item.name,
        calories: item.calories || 0,
        protein: item.protein || 0,
        fat: item.fat || 0,
        carbs: item.carbs || 0,
      };

      await api.post('/api/nutrition', {
        date: today,
        items: [...existingItems, newItem]
      });

      toast.success(`${item.name} added to your diet! ✅`);
      fetchTodayNutrition();
    } catch (error) {
      console.error("Error adding to diet:", error);
      toast.error(error.response?.data?.message || "Failed to add item to diet");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4 md:p-8">
      
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8">
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
          🍎 Nutrition Tracker
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Search for food and track your daily macros.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-lg flex flex-col sm:flex-row gap-2 border border-indigo-50">
          <input
            type="text"
            placeholder="e.g. 2 eggs, 1 apple, 1 cup rice"
            value={foodQuery}
            onChange={(e) => setFoodQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchNutrition()}
            className="flex-grow px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 placeholder-gray-400 bg-gray-50 border-none"
          />
          <button
            onClick={fetchNutrition}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Fetching..." : "Search"}
          </button>
        </div>
      </motion.div>

      {/* Summary Section */}
      {totals.calories > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto mt-10"
        >
          <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
             Your Intake Today ({today})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Calories", value: totals.calories, unit: "kcal", color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Protein", value: totals.protein, unit: "g", color: "text-green-600", bg: "bg-green-50" },
              { label: "Fat", value: totals.fat, unit: "g", color: "text-red-500", bg: "bg-red-50" },
              { label: "Carbs", value: totals.carbs, unit: "g", color: "text-yellow-600", bg: "bg-yellow-50" },
            ].map((stat, i) => (
              <div key={i} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition`}>
                <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl md:text-3xl font-bold ${stat.color} mt-1`}>
                  {stat.value.toFixed(0)} <span className="text-xs text-gray-400 font-normal">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-12">
          <CircularProgress size={50} sx={{ color: "indigo.600" }} />
        </div>
      )}

      {/* Results Grid */}
      {nutrition && nutrition.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-6xl mx-auto mt-12"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-6 px-2">Search Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nutrition.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full"
              >
                <div className="h-48 bg-gray-100 relative">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                      🍎
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-gray-800 capitalize">
                        {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4">
                    Serving: {item.servingQty} {item.servingUnit}
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center bg-gray-50 p-3 rounded-xl mb-6 border border-gray-100">
                    <div className="border-r border-gray-200">
                        <span className="block font-extrabold text-indigo-600 text-lg">{item.calories.toFixed(0)}</span>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Cals</span>
                    </div>
                    <div className="border-r border-gray-200">
                        <span className="block font-bold text-green-600">{item.protein.toFixed(0)}g</span>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Prot</span>
                    </div>
                    <div className="border-r border-gray-200">
                        <span className="block font-bold text-red-500">{item.fat.toFixed(0)}g</span>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Fat</span>
                    </div>
                    <div>
                        <span className="block font-bold text-yellow-600">{item.carbs.toFixed(0)}g</span>
                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wide">Carb</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToDiet(item)}
                    className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-md flex justify-center items-center gap-2 group"
                  >
                    <span>Add to Diet</span>
                    <span className="group-hover:scale-125 transition-transform duration-200">➕</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {nutrition && nutrition.length === 0 && !loading && (
        <div className="mt-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-700">No results found</h3>
          <p className="text-gray-500">Try searching for generic terms like "chicken breast" or "banana".</p>
        </div>
      )}
    </div>
  );
};

export default NutritionPage;

