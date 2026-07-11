import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const createConversation = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("User ID from header:", userId);
    const conversation = await Conversation.create({
      userId: userId,
    });
    return res.status(200).json({ conversation });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating conversation", error: err.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    console.log("User ID from header:", userId);
    const conversations = await Conversation.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    return res.status(200).json({ conversations });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching conversations", error: err.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id, title } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(id, { title });
    return res.status(200).json({ conversation });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating conversation", error: err.message });
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { conversationId, content, role } = req.body;
    const message = await Message.create({
      conversationId,
      content,
      role,
    });

    return res.status(200).json({ message });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in saving message", error: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ messages });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
};
