import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import  getMessages from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";


function ChatArea() {
  const { selectedConversation } = useSelector((state) => state.conversation);
const dispatch = useDispatch();

  useEffect(() => {
    const getMsg = async () => {
      if (selectedConversation) {
        const data = await getMessages(selectedConversation._id);
        dispatch(setMessages(data));
      }
    };
    getMsg();
  },[selectedConversation]);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />
      <MessageList />
      <ChatInput />
    </div>
  );
}

export default ChatArea;
