import api from '../../utils/axios.js';


const getMessages = async (conversationId) => {
  try {
    const {data} = await api.get(`/api/chat/get-messages/${conversationId}`);
    return data?.messages ?? [];
  } catch (error) {
    console.log("Error fetching Chat-messages:", error);
    return [];
  }
};

export default getMessages;