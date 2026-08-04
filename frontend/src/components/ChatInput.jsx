import {
  Code2,
  FileText,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Presentation,
  Send,
  X,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import sendMessage from "../features/sendMessage";
import { useSelector, useDispatch } from "react-redux";
import {
  addMessage,
  setMessages,
  setArtifacts,
  setIsLoading,
} from "../redux/messageSlice";
import { createConversation } from "../features/createConversation";
import {
  setSelectedConversation,
  addConversation,
  setConversationTitle,
} from "../redux/conversationSlice";

import { updateConversation } from "../features/updateConversation";
function ChatInput() {
  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState("Auto");
  const dispatch = useDispatch();
  const [listen, setListen] = useState(false);
  const recognitionRef = useRef(null);
  const fileRef = useRef(null);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { isLoading } = useSelector((state) => state.message);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setValue(transcript);
    };

    recognition.onend = () => {
      setListen(false);
    };
    recognitionRef.current = recognition;
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition is not supported in this browser.");
    }
    if (listen) {
      recognitionRef.current.stop();
      setListen(false);
    } else {
      recognitionRef.current.start();
      setListen(true);
    }
  };

  const handleSendMessage = async () => {
    dispatch(setIsLoading(true)); // Set loading state to true when sending a message
    let conversation = selectedConversation;
    if (!conversation) {
      const conver = await createConversation(); // Create a new conversation if none is selected
      dispatch(setMessages([]));
      dispatch(setSelectedConversation({ ...conver, isNew: true })); // Set the newly created conversation as selected
      dispatch(addConversation(conver)); // Add the user's message to the new conversation
      conversation = conver;
    }

    if (conversation.title === "New Chat") {
      await updateConversation({ id: conversation?._id, title: value.trim() });
      dispatch(
        setConversationTitle({
          conversationId: conversation._id,
          title: value.slice(0, 40),
        }),
      );
    }

    console.log("Selected File:", selectedFile);
    const formData = new FormData();
    formData.append("prompt", value.trim());
    formData.append("conversationId", conversation?._id);
    formData.append("agent", selectedAgent.toLowerCase());
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    dispatch(addMessage({ role: "user", content: value.trim() }));
    setValue("");
    const data = await sendMessage(formData);
    dispatch(setIsLoading(false)); // Set loading state to false after receiving the response
    setSelectedFile(null);
    if (!data) {
      dispatch(
        addMessage({
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        }),
      );
      return;
    }

    dispatch(setArtifacts(data?.artifacts || []));
    dispatch(
      addMessage({
        role: "assistant",
        content: data?.answer,
        images: data?.images,
      }),
    );
    console.log("Message sent:", data);
  };

  const agents = [
    {
      id: "auto",
      icon: Zap,
      label: "Auto",
    },
    {
      id: "chat",
      icon: MessageSquare,
      label: "Chat",
    },
    {
      id: "coding",
      icon: Code2,
      label: "Coding",
    },
    {
      id: "pdf",
      icon: FileText,
      label: "PDF",
    },
    {
      id: "ppt",
      icon: Presentation,
      label: "PPT",
    },
    {
      id: "vision",
      icon: ImageIcon,
      label: "Vision",
    },
    {
      id: "search",
      icon: Globe,
      label: "Search",
    },
  ];

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#111215]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <div className="flex w-[80%] gap-2 pr-2 flex-wrap">
          {agents.map((agent, id) => {
            const isActive = selectedAgent === agent.label;
            const Icon = agent.icon;
            return (
              <div
                onClick={() => setSelectedAgent(agent.label)}
                key={id}
                className={`
  flex-shrink-0
  inline-flex
  cursor-pointer
  items-center
  gap-1.5
  px-3
  py-2
  rounded-full
  text-xs
  font-medium
  border
  transition-all

${
  isActive
    ? "bg-emerald-600 text-white border-transparent shadow-[0_1px_8px_rgba(16,185,129,.25)] "
    : "bg-white/[0.03] text-slate-400 border-white/[0.06] hover:bg-white/[0.07]"
}
  `}
              >
                <Icon
                  size={14}
                  // key={agent.label}
                  className={isActive ? "text-white" : "text-slate-500"}
                />
                {agent.label}
              </div>
            );
          })}
        </div>

        {selectedFile && (
          <div className="my-3">
            <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              {selectedFile?.type === "application/pdf" ? (
                <FileText size={16} className="text-red-400" />
              ) : (
                selectedFile?.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-10 h-10 object-cover rounded-xl mt-3"
                  />
                )
              )}

              <div>
                <p className="text-xs text-white">{selectedFile?.name}</p>
                <p className="text-[10px] text-slate-500">
                  {Math.ceil(selectedFile?.size / 1024)} KB
                </p>
              </div>

              <button
                className="ml-2"
                onClick={() => {
                  setSelectedFile(null);
                  fileRef.current.value = null;
                }}
              >
                <X size={14} className="text-slate-500 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        <textarea
          placeholder="Ask Anything..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileRef}
          hidden
          onChange={(e) => setSelectedFile(e.target.files[0] || null)}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer"
            >
              <Paperclip size={16} />
            </button>
            <button
              onClick={toggleMic}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150 cursor-pointer
                ${listen ? "bg-red-500 text-white" : "text-slate-600 hover:bg-white/[0.05"}
                
                `}
            >
              {listen ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          </div>

          <button
            disabled={!value.trim() && isLoading}
            onClick={() => {
              handleSendMessage();
            }}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer transition-all duration-150 ${value.trim() ? "bg-emerald-600 hover:bg-emerald-500 text-white" : "bg-white/[0.05] text-slate-600 cursor-not-allowed"} `}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
