import Groq from "groq-sdk";

class AIService {
  async generateResponse(history) {
    try {
      const groq = new Groq({ 
        apiKey: process.env.GROQ_API_KEY 
      });

      const messages = [
        {
          role: "system",
          content: "You are an expert fitness trainer and nutritionist named 'FitLife Coach'. \
          You provide motivating, scientific, and concise advice. \
          If the user greets you, welcome them warmly. \
          If they ask for a plan, ask for their age/weight/goals first if you don't know it."
        },
        ...history 
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.1-8b-instant", 
        temperature: 0.7,
        max_tokens: 500,
      });

      return chatCompletion.choices[0]?.message?.content || "Let's train! 💪";

    } catch (error) {
      console.error("Groq AI Error:", error.message);
      
      if (error.message.includes("API Key")) {
        throw new Error("Server Error: Groq API Key is missing.");
      }
      
      throw new Error("Failed to fetch AI response");
    }
  }
}

export default new AIService();