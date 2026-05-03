"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "@/lib/editor-config";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import useMounted from "@/hooks/useMounted";
import ShareSnippetDialog from "./ShareSnippetDialog";

const Editor = dynamic(() => import("@monaco-editor/react").then((mod) => mod.Editor), {
  ssr: false,
  loading: () => <EditorPanelSkeleton />,
});

type EditorPanelProps = {
  className?: string;
};

function EditorPanel({ className = "" }: EditorPanelProps) {
  const clerk = useClerk();
  const { isSignedIn } = useUser();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor, runCode } =
    useCodeEditorStore();

  const mounted = useMounted();

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  useEffect(() => {
    if (!editor) return;
    if (sessionStorage.getItem("codecraft-run-on-load") !== "true") return;

    sessionStorage.removeItem("codecraft-run-on-load");
    window.setTimeout(() => {
      void runCode();
    }, 0);
  }, [editor, language, runCode]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  const handleShareClick = () => {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    setIsShareDialogOpen(true);
  };

  if (!mounted) {
    return (
      <div className={`relative min-w-0 ${className}`}>
        <div className="relative flex h-full min-h-[420px] flex-col rounded-xl border border-white/[0.05] bg-[#12121a]/90 p-3 backdrop-blur sm:min-h-[600px] sm:p-6">
          <EditorPanelSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-w-0 ${className}`}>
      <div className="relative flex h-full min-w-0 flex-col bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-3 sm:p-6">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="truncate text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:flex sm:w-auto sm:gap-3">
            {/* Font Size Slider */}
            <label className="flex min-w-0 items-center gap-2 px-2.5 sm:px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                <input
                  type="range"
                  aria-label="Editor font size"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="codecraft-slider min-w-0 flex-1 cursor-pointer sm:w-20 sm:flex-none"
                />
                <span className="min-w-[1.75rem] text-center text-xs font-medium text-gray-400 sm:min-w-[2rem] sm:text-sm">
                  {fontSize}
                </span>
              </div>
            </label>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="flex h-10 w-10 items-center justify-center bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShareClick}
              aria-label="Share snippet"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 px-3 sm:px-4 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="hidden text-sm font-medium text-white sm:inline">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group min-h-[420px] min-w-0 flex-1 rounded-xl overflow-hidden ring-1 ring-white/[0.05] sm:min-h-[600px]">
          {clerk.loaded && (
            <Editor
              height="100%"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                wordWrap: "on",
                fixedOverflowWidgets: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />}
    </div>
  );
}
export default EditorPanel;
