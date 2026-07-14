import { MessageSquare, PanelLeftIcon, PenSquare, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversations } from "../features/getConversations";
import { createConversation } from "../features/createConversation";
import {
  setConversations,
  addConversation,
  setSelectedConversation,
} from "../redux/conversationSlice";

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector(
    (state) => state.conversation,
  );

  // I have used this conversations.conversations.length to check if there are any conversations in the state. If there are no conversations, it will display a message saying "No Recent Conversations". If there are conversations, it will display the list of conversations in a scrollable div.
  // which sir has used only conversations.length but it is not working because conversations is an object and it has a property called conversations which is an array. So we need to use conversations.conversations.length to get the length of the array.
  // in future if it gives error then we can use optional chaining operator to check if conversations is not null or undefined before accessing the length property. So we can use conversations?.conversations?.length instead of conversations.conversations.length.
  // console.log(conversations.conversations.length);
  useEffect(() => {
    const getConv = async () => {
      const data = await getConversations();
      dispatch(setConversations(data));
    };
    getConv();
  }, []);

  const handleCreateConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
  };

  return (
    <div className="fixed lg:static inset-y-0 left-0 z-50 w-[270px] h-screen shrink-0 bg-[#0d0f14] border-r border-white/[0.06] ">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-white/[0.06]">
          <div
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] cursor-pointer transition-colors duration-150 bg-transparent border-none"
            onClick={() => setCollapsed(true)}
          >
            <PanelLeftIcon />
          </div>
          <span className="text-[16px] font-semibold tracking-tight text-slate-100 flex-1 cursor-pointer">
            AgentFlow AI
          </span>
          <span className="text-[10px] font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full tracking-wide">
            free
          </span>
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] cursor-pointer transition-colors duration-150 bg-transparent border-none"
            onClick={handleCreateConversation}
          >
            <PenSquare size={14} />
          </button>
        </div>

        <div className="px-4 pt-4 pb-1">
          <button
            className="w-full flex items-center justify-center gap-3 text-sm font-medium text-white bg-linear-to-br from-indigo-500 to-violet-700 rounded-xl py-[10px] border-none cursor-pointer hover:opacity-90 transition-opacity duration-150"
            onClick={handleCreateConversation}
          >
            <Plus size={15} />
            New Chat
          </button>
        </div>

        {conversations?.conversations?.length === 0 ? (
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            No Recent Conversations
          </div>
        ) : (
          <div className="px-5 pt-4 pb-1.5 text-[10.5px] font-semibold uppercase tracking-widest text-slate-600">
            Recents
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2.5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {conversations?.conversations?.length > 0 &&
            conversations?.conversations?.map((conversation, id) => {
              const isActive = conversation?._id === selectedConversation?._id;
              return (
                <div
                  onClick={() =>
                    dispatch(setSelectedConversation(conversation))
                  }
                  key={id}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] mb-0.5 cursor-pointer border transition-colors duration-150 ${isActive ? "bg-indigo-500/10 border-indigo-500/[0.18] " : "bg-transparent border-transparent"}`}
                >
                  <MessageSquare />
                  <span>{conversation?.title || "New Chat"}</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default SideBar;
