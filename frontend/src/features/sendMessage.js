import api from "../../utils/axios";

const sendMessage = async (payload) => {
  try {
   const {data} = await api.post("/api/agent/chat",payload);
    return data;
  }catch (error) {
    console.log("Error sending message:", error);
    return null;
  }
}

export default sendMessage;

