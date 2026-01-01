# 🏋️‍♂️ FitLife - AI-Powered Fitness & Nutrition Tracker

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![AI Powered](https://img.shields.io/badge/AI-Llama%203-purple)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://fit-life-fitness-tracker.vercel.app)

**FitLife** is a comprehensive fitness tracking application designed to help users monitor their daily nutrition, track workouts, and receive personalized advice from an AI Coach. Built with the **MERN Stack**, it features a fully responsive design, real-time data visualization, and robust third-party API integrations.

🔗 **Live Demo:** [https://fit-life-fitness-tracker.vercel.app](https://fit-life-fitness-tracker.vercel.app)

---

## 🚀 Key Features

* **📱 Fully Responsive Design:** Optimized for all devices. whether you are on a mobile phone, tablet, or desktop, the UI adapts perfectly for a seamless experience.
* **🔐 Full Token-Based Authentication:** Secure login system using **JWT (JSON Web Tokens)** that ensures persistent sessions and privacy protection across all browsers and incognito modes.
* **📊 Real-Time Dashboard:** Instantly view your net calorie balance, macronutrient breakdown (Protein/Carbs/Fat), and daily health summaries.
* **🍎 Advanced Nutrition Search:** Leverage the **FatSecret API** to search thousands of food items and retrieve accurate calorie and macro data.
* **🏃‍♂️ Smart Workout Logging:** Automatically calculate calories burned for any physical activity based on duration and body weight using **API Ninjas**.
* **🤖 AI Personal Coach:** Get instant, context-aware workout plans and diet advice from the integrated **Llama-3 AI** (via Groq).
* **📈 Visual Analytics:** Visualize your weight trends and calorie history over the last 30 days with interactive **Recharts** graphs.
* **📧 Secure Account Recovery:** Includes a complete "Forgot Password" flow with time-sensitive reset links sent via **Resend**.

---

## 🛠️ Tech Stack

### Frontend
* **React.js** (Vite)
* **Tailwind CSS** (Responsive Styling)
* **Framer Motion** (Animations)
* **Material UI** (Components)
* **Recharts** (Data Visualization)

### Backend
* **Node.js & Express.js**
* **MongoDB & Mongoose** (Database)
* **JWT & Bcrypt** (Auth & Security)

### External APIs & Services
* **Groq SDK** (AI Chat / Llama-3 Model)
* **FatSecret API** (Nutrition Data)
* **API Ninjas** (Burned Calories Data)
* **Resend** (Email Service)

---

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites
* **Node.js** (v14+)
* **MongoDB** (Local or Atlas URI)
* **Git**

### Installation

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/yourusername/fitlife-tracker.git](https://github.com/yourusername/fitlife-tracker.git)
   cd fitlife-tracker
