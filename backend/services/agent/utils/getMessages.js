import axios from "axios";

export const getMessages = async (conversationId) => {
  try {
    const { data } = await axios.get(`${process.env.CHAT_SERVICE_URL}/get-messages/${conversationId}`);
    return data.messages || []; // we have changed here due to AI suggestion 
  } catch (error) {
    console.log("Error fetching Chat-messages:", error);
    return [];
  }
};

