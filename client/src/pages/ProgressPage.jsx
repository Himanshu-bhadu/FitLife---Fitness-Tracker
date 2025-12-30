import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const ProgressPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/api/dashboard/analytics");
      
      const cleanData = response.data.data.map(item => ({
        ...item,
        caloriesIn: Number(item.caloriesIn) || 0,
        caloriesBurned: Number(item.caloriesBurned) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0,
        date: item.date || ""
      }));
      
      setData(cleanData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Could not load progress data");
    } finally {
      setLoading(false);
    }
  };

  const last7Days = data.slice(-7);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4 md:p-8">
      
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
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
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-800 mb-8 text-center">
          📊 Your Progress
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-50"
          >
            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">🔥</span> Calories Balance
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="caloriesIn" name="Intake" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="caloriesBurned" name="Burned" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-3xl shadow-lg border border-indigo-50"
          >
            <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <span className="bg-green-100 p-2 rounded-lg text-green-600">🥗</span> Macro Trends
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{fontSize: 12, fill: '#6b7280'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="protein" name="Protein (g)" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="carbs" name="Carbs (g)" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="fat" name="Fat (g)" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-3xl shadow-lg border border-indigo-50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2 mb-4 md:mb-0">
              <span className="bg-orange-100 p-2 rounded-lg text-orange-600">🏋️</span> Workout Consistency
            </h2>
            <div className="flex gap-4 text-sm bg-gray-50 px-4 py-2 rounded-full">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-200 block"></span> Rest
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 block"></span> Workout
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 sm:grid-cols-7 md:grid-cols-14 gap-3 justify-center">
            {data.map((day, index) => (
              <div key={index} className="flex flex-col items-center group relative cursor-pointer">
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl transition-all duration-300 ${
                    day.hasWorkout 
                      ? "bg-green-500 shadow-lg shadow-green-200 scale-100 ring-2 ring-green-100" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                ></div>
                <span className="text-[10px] text-gray-400 mt-2 font-medium">{day.date}</span>
                
                <div className="absolute bottom-full mb-3 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-10 transition-opacity">
                  {day.hasWorkout ? "Workout Done! 🔥" : "Rest Day"}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default ProgressPage;