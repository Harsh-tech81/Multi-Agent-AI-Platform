import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
},
role : {
    enum: ["user", "assistant"],
    type: String,
},
content: {
    type: String,
},
images:[
    String
]
},{
    timestamps: true
})

const Message = mongoose.model("Message", messageSchema);
export default Message;