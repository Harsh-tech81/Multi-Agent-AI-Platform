import api from "../../utils/axios";

const getCurrUser = async () => {
  try {
    const { data } = await api.get("/api/me",{
      withCredentials: true
    });
    return data;
  } catch (error) {
    if (error.response?.status !== 401) {
      console.error("Error fetching current user:", error);
    }
    return null;
  }
};

export default getCurrUser;