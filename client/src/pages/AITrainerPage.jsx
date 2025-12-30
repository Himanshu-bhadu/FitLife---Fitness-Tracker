import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const AITrainerPage = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { 
      sender: "ai", 
      text: "Hello! I'm your AI Personal Trainer. Ask me for a workout plan, diet tips, or how to perform an exercise! 💪" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUiMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, newUiMessage];
    
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = updatedMessages.map(msg => ({
        role: msg.sender === "ai" ? "assistant" : "user",
        content: msg.text
      }));

      const response = await api.post('/api/ai/chat', { 
        history: historyPayload 
      });
      
      const aiResponse = response.data.data.reply;

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);

    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => [...prev, { sender: "ai", text: "I'm having trouble connecting. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-indigo-600 p-3 md:p-4 text-white flex justify-between items-center shadow-md z-10">
        <h1 className="text-lg md:text-xl font-bold flex items-center gap-2">
          🤖 <span className="hidden md:inline">AI Fitness Coach</span>
          <span className="md:hidden">AI Coach</span>
        </h1>
        <button 
          onClick={() => navigate("/dashboard")}
          className="text-xs md:text-sm bg-indigo-500 hover:bg-indigo-700 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition shadow-sm border border-indigo-400"
        >
          Exit
        </button>
      </div>

      <div className="flex-grow p-2 md:p-4 overflow-y-auto bg-gray-50">
        <div className="flex flex-col gap-3 md:gap-4 max-w-4xl mx-auto">
          
          {messages.map((msg, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={index}
              className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-800 self-start rounded-bl-none border border-gray-200"
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
              ))}
            </motion.div>
          ))}

          {loading && (
            <div className="self-start bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 text-gray-500 text-sm italic">
              Thinking... 💭
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-3 md:p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about workouts, diet, etc..."
            disabled={loading}
            className="flex-grow p-3 text-sm md:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 md:px-8 py-2 rounded-full font-semibold transition disabled:opacity-50 text-sm md:text-base shadow-md"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
};

export default AITrainerPage;