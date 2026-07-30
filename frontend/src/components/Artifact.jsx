import {
  Code2,
  Copy,
  Eye,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
function Artifact() {
  const [collapse, setCollapse] = useState(false);
  const [tab, setTab] = useState("code");
  const [selectedFile, setSelectedFile] = useState(0);
  const { artifacts } = useSelector((state) => state.message);

  if (artifacts.length == 0) {
    return;
  }

  const file = artifacts[0]?.files[selectedFile]?.content;
  const htmlContent = artifacts[0]?.files?.find((f) => f.name === "index.html");
  const cssContent = artifacts[0]?.files?.find((f) => f.name === "style.css");
  const jsContent = artifacts[0]?.files?.find((f) => f.name === "script.js");

  const canPreview = Boolean(htmlContent);

  const previewDoc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
${cssContent?.content || ""}
</style>
</head>
<body>
${htmlContent?.content || ""}
    <script>
        ${jsContent?.content || ""}
    </script>
</body>
</html>
`;

  return (
    <motion.div
      initial={{ width: 400 }}
      animate={{ width: collapse ? 48 : 400 }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
      className="hidden lg:flex h-full border-1 border-white/[0.06] flex-col overflow-hidden shrink-0"
    >
      {!collapse ? (
        <div className="flex flex-col h-full bg-[#0d0f14]">
          <div className="h-14 px-4 border-b border-white/[0.06] flex items-center gap-3 shrink-0">
            <button
              className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
              onClick={() => setCollapse(true)}
            >
              <PanelRightClose size={16} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                <Code2 className="text-indigo-400" size={12} />
              </div>
              <div className="text-[13px] font-medium text-slate-200 truncate">
                {artifacts[0]?.title}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] rounded-lg transition-colors duration-150 bg-transparent border-none cursor-pointer">
                <Copy size={15} />
              </button>
            </div>
            {canPreview && (
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-lg">
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150  ${tab === "code" ? "text-white bg-indigo-500" : "text-slate-500 hover:text-slate-200 "}`}
                >
                  <Code2 size={11} /> Code
                </button>
                <button
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors duration-150  ${tab === "preview" ? "text-white bg-indigo-500" : "text-slate-500 hover:text-slate-200 "}`}
                  onClick={() => setTab("preview")}
                >
                  <Eye size={11} /> Preview
                </button>
              </div>
            )}
          </div>
          {tab === "code" && (
            <div className=" flex h-auto border-b border-white/[0.06] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {artifacts[0]?.files?.map((f, index) => (
                <button
                  key={index}
                  className={`px-4 py-2.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 border-r border-white/[0.05] relative cursor-pointer bg-transparent ${selectedFile === index ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"}`}
                  onClick={() => setSelectedFile(index)}
                >
                  {f?.name}
                  {selectedFile === index && (
                    <div className="absolute bottom-0 left-0 right-0 rounded-t-full h-[2px] bg-indigo-500" />
                  )}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overhflow-hidden">
            {tab === "preview" && canPreview ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full h-full"
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <iframe
                  title="preview"
                  srcDoc={previewDoc}
                  sandbox="allow-scripts"
                  className="w-full h-full bg-white"
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              ></motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex border-1 h-full border-white/[0.06] bg-[#0d0f14] items-center flex-col py-4 gap-3 shrink-0">
          <button
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-colors duration-150 bg-transparent border-none cursor-pointer shrink-0"
            onClick={() => setCollapse(false)}
          >
            <PanelRightOpen size={16} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="text-[10px] font-medium text-slate-600 tracking-widest uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-lr",
                transform: "rotate(180deg)",
              }}
            >
              {artifacts[0]?.title}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Artifact;
