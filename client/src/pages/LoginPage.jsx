import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import fitnessImg from "../images/fitness.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // New state to prevent the form from flashing before we check auth
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // We call the 'me' endpoint. If the browser has a cookie, this will succeed.
        const response = await api.get('/api/user/me');
        
        if (response.data.success) {
          // User is already logged in! Restore session and go to dashboard.
          sessionStorage.setItem('user', JSON.stringify(response.data.data));
          navigate("/dashboard");
        }
      } catch (err) {
        // If this fails (401 Error), it just means they really DO need to log in.
        // We stop loading and show the form.
        setCheckingAuth(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkLoggedIn();
  }, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await api.post('/api/auth/login', {
      email,
      password
    });

    if (response.data.success) {
      // 1. Save User Data
      sessionStorage.setItem('user', JSON.stringify(response.data.data));
      
      // 2. CRITICAL: Save the Token separately!
      // Your axios.js is looking for 'token' in sessionStorage
      if (response.data.data.accessToken) {
        sessionStorage.setItem('token', response.data.data.accessToken);
      }

      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // While we are checking if the user is logged in, show a spinner
  // instead of the login form so it doesn't look glitchy.
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      {/* Left Side - Image (Desktop Only) */}
      <div 
        className="hidden md:flex w-1/2 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${fitnessImg})` }}
      >
        {/* Subtle overlay to blend with the theme */}
        <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full md:w-1/2 justify-center items-center px-6 py-12 bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-indigo-50"
        >
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
            Welcome Back 👋
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign in to continue your fitness journey.
          </p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder=""
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  Logging in...
                </span>
              ) : "Log In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;