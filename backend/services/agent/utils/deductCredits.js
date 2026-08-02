import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
export const deductCredits = async (userId,agent) => {
  try {
    const { data } = await axios.post(`${process.env.AUTH_SERVICE_URL}/deduct-credits`, { userId, agent });
    return data; 
  } catch (error) {
    console.log("Error fetching Chat-messages:", error);
    return [];
  }
};

