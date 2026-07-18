import api from "../../utils/axios";

export const updateConversation = async (payload) => {
  try {
    const { data } = await api.post(`/api/chat/update-conversation`, payload);
    // console.log("Conversation updated:", data);
    return data;
  } catch (error) {
    console.log("Error updating conversation:", error);
    return [];
  }
};
