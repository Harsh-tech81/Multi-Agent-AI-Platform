import api from "../../utils/axios";

export const createOrder = async (plan) => {
  try {
    const { data } = await api.post("/api/billing/create", { plan });
    console.log("Billing order created:", data);
    return data;
  } catch (error) {
    console.log("Error creating billing order:", error);
    throw error;
  }
};
