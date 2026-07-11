import api from "../../utils/axios";

const getCurrUser = async () => {
  try {
    const { data } = await api.get("/api/me",{
      withCredentials: true
    });
   return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getCurrUser;