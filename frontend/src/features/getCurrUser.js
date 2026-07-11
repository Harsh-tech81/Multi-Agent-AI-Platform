import api from "../../utils/axios";

const getCurrUser = async () => {
  try {
    const { data } = await api.get("/api/me",{
      withCredentials: true
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

export default getCurrUser;