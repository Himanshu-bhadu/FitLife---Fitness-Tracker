import aiService from "../services/groq.service.js"; 
import { asynhandler } from "../utils/asynchandler.js";
import { apiresponse } from "../utils/apiresponse.js";
import { apierror } from "../utils/apierror.js";

export const getAIChat = asynhandler(async (req, res) => {
  const { history } = req.body; 

  if (!history || !Array.isArray(history)) {
    throw new apierror(400, "Chat history is required");
  }

  const reply = await aiService.generateResponse(history);

  return res.status(200).json(
    new apiresponse(200, { reply }, "AI response fetched")
  );
});