import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setMessage("✅ Reset link sent! Check your email (or server console).");
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.message || "Error sending email"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-600 mb-4 md:mb-6">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-center mb-6 text-sm md:text-base">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
          
          {message && (
            <div className={`p-3 rounded-lg text-sm font-medium ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-70 shadow-md hover:shadow-lg"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition">
            ← Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;