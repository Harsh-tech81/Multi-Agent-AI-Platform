import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import Prism from "prismjs";
import { X } from "lucide-react";

function MessageBubble({ role, content, images }) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  const isUser = role === "user";
  const [lightBox, setLightBox] = useState(null);
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`w-fit max-w-[92vw] md:max-w-[72%] px-4 py-2.5 rounded-2xl break-words overflow-hidden leading-relaxed ${isUser ? "bg-gradient-to-br from-indigo-500 to-violet-700 text-white rounded-tr-sm" : " text-slate-200 rounded-tl-sm"}`}
      >
        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                loading="lazy"
                onClick={() => setLightBox(image)}
                onError={(e) => {
                  e.currentTarget.remove();
                }}
                className="w-40 h-28 rounded-xl object-cover border border-white/10 cursor-zoom-in hover:opacity-90 transition "
              />
            ))}
          </div>
        )}

        <Markdown>{content}</Markdown>
      </div>

      {lightBox && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 ">
          <button
            onClick={() => setLightBox(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 rounded-full p-2 "
          >
            <X />
          </button>
          <img
            src={lightBox}
            className="max-w-[90vw] max-h-[85vh] rounded-2xl border border-white/10 shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
