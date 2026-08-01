import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type:String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
 amount: {
    type: Number,
    required: true,
  },
  credits:{
    type: Number,
  },
  plan: {
    type: String,
  },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);