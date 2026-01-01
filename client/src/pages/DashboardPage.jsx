import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
} from "@mui/material";
import api from "../api/axios";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      await api.get("/api/auth/logout");
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]); 

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const userResponse = await api.get('/api/user/me');
      setUser(userResponse.data.data);
      
      const dashboardResponse = await api.get(`/api/dashboard/${selectedDate}`);
      const { nutrition, workout } = dashboardResponse.data.data;
      
      setTotals({
        calories: nutrition.totalCalories || 0,
        protein: nutrition.totalProtein || 0,
        fat: nutrition.totalFat || 0,
        carbs: nutrition.totalCarbs || 0,
      });
      
      setCaloriesBurned(workout.totalCaloriesBurned || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const netCalories = totals.calories - caloriesBurned;
  const profilePic = user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const getDisplayName = () => {
    if (!user) return 'Fitness Champ';
    const nameToCheck = user.name || user.email || '';
    
    if (nameToCheck.includes('@')) {
      return nameToCheck.split('@')[0];
    }
    return nameToCheck;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-indigo-700 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-white to-indigo-200">

      <nav className="bg-indigo-600 text-white px-4 md:px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/profile">
            <img
              src={profilePic}
              alt="profile"
              className="w-12 h-12 rounded-full cursor-pointer border-2 border-white shadow-md object-cover"
            />
          </Link>

          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            🏋️‍♂️ FitLife
          </h1>
        </div>

        <Button
          onClick={handleLogout}
          variant="contained"
          sx={{
            bgcolor: "brown",
            color: "indigo.600",
            "&:hover": { bgcolor: "brown.200" },
          }}
        >
          Logout
        </Button>
      </nav>

      <main className="flex-grow p-4 md:p-10 bg-gray-300">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-indigo-700 mb-2">
            Welcome, {getDisplayName()}! 💪
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-6 bg-white p-4 rounded-xl shadow-sm max-w-md mx-auto">
            <label className="text-lg font-semibold text-gray-700">📅 Viewing Data For:</label>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border-2 border-indigo-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 font-bold text-indigo-800 w-full md:w-auto"
            />
          </div>
        </motion.div>

        <Grid container spacing={4} justifyContent="center">
          {[
            {
              title: "Workouts",
              emoji: "🏋️‍♂️",
              desc: "Plan and record your workouts efficiently.",
              link: "/workouts",
              color: "from-purple-100 to-indigo-200",
            },
            {
              title: "Nutrition",
              emoji: "🍎",
              desc: "Track your meals and calories easily.",
              link: "/nutrition",
              color: "from-green-100 to-lime-200",
            },
            {
              title: "Progress",
              emoji: "📊",
              desc: "Monitor your progress with smart analytics.",
              link: "/progress", 
              color: "from-orange-100 to-pink-200",
            },
            {
              title: "AI Trainer",
              emoji: "🤖",
              desc: "Chat with AI for personalized plans.",
              link: "/ai-coach", 
              color: "from-blue-100 to-cyan-200",
            },
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Card
                  sx={{
                    borderRadius: "20px",
                    boxShadow: 6,
                    background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  }}
                  className={`bg-gradient-to-br ${card.color}`}
                >
                  <CardContent className="text-center">
                    <div className="text-5xl mb-3">{card.emoji}</div>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, mb: 2 }}
                    >
                      {card.desc}
                    </Typography>
                    <Link to={card.link}>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "indigo.600",
                          "&:hover": { bgcolor: "indigo.700" },
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        GO →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            mt: 8,
            maxWidth: "900px",
            mx: "auto",
            p: 4,
            bgcolor: "white",
            borderRadius: "20px",
            boxShadow: 5,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            className="text-center mb-6"
          >
            🍽️ Nutrition Summary ({selectedDate})
          </Typography>
          <Grid container spacing={3}>
            {[
              { name: "Calories", value: totals.calories, color: "text-indigo-600" },
              { name: "Protein", value: totals.protein, color: "text-green-600" },
              { name: "Fat", value: totals.fat, color: "text-red-500" },
              { name: "Carbs", value: totals.carbs, color: "text-yellow-500" },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="rounded-2xl shadow-md border border-gray-100">
                    <CardContent className="text-center">
                      <Typography variant="h6" className="text-gray-700 font-semibold">
                        {item.name}
                      </Typography>
                      <Typography variant="h4" className={`${item.color} font-bold`}>
                        {item.value.toFixed(1)}
                        {item.name === "Calories" ? " kcal" : " g"}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            mt: 8,
            maxWidth: "900px",
            mx: "auto",
            p: 4,
            bgcolor: "#f9fafb",
            borderRadius: "20px",
            boxShadow: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            color="secondary"
            className="text-center mb-6"
          >
            🔥 Calories Overview ({selectedDate})
          </Typography>

          <Grid container spacing={3}>
            {[
              { name: "Calories Intake", value: totals.calories, color: "text-indigo-600" },
              { name: "Calories Burned", value: caloriesBurned, color: "text-green-600" },
              {
                name: "Net Calories",
                value: netCalories,
                color: netCalories >= 0 ? "text-red-500" : "text-green-500",
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Card className="rounded-2xl shadow-md">
                    <CardContent className="text-center">
                      <Typography variant="h6" className="text-gray-700 font-semibold">
                        {item.name}
                      </Typography>
                      <Typography variant="h4" className={`${item.color} font-bold`}>
                        {item.value.toFixed(1)} kcal
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </main>

      <footer className="bg-indigo-600 text-white text-center py-4 text-sm mt-10">
        © {new Date().getFullYear()} FitLife. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;
