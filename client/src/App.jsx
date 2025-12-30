import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Register from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutPage from "./pages/WorkoutPages";
import NutritionPage from "./pages/NutritionPage";
import ProfilePage from "./pages/ProfilePage";
import AITrainerPage from "./pages/AITrainerPage";
import ProgressPage from "./pages/ProgressPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
    <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register/>} />
      <Route path="/dashboard" element={<DashboardPage/>} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ai-coach" element={<AITrainerPage/>}/>
      <Route path="/workouts" element={<WorkoutPage/>} />
      <Route path="/nutrition" element={<NutritionPage/>} />
      <Route path="/progress" element={<ProgressPage/>}/>
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    </Routes>
    </>
  );
}

export default App;
