"use client";

import { getExecutionResult, useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning, editor } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const handleRun = async () => {
    await runCode();
    const result = getExecutionResult();

    if (user && result) {
      await saveExecution({
        language,
        code: result.code,
        output: result.output || undefined,
        error: result.error || undefined,
      });
    }
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning || !editor}
      aria-label={isRunning ? "Executing code" : "Run Code"}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-4 sm:px-5
        disabled:cursor-not-allowed disabled:opacity-70
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
      `}
    >
      {/* bg wit gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 shadow-lg shadow-blue-500/20 transition-opacity group-hover:opacity-90" />

      <div className="relative flex items-center gap-2.5">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-sm font-medium text-white/90">Executing...</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-4 h-4">
              <Play className="w-4 h-4 text-white/90 transition-transform group-hover:scale-110 group-hover:text-white" />
            </div>
            <span className="text-sm font-medium leading-none text-white/90 group-hover:text-white">
              <span className="hidden sm:inline">Run Code</span>
              <span className="sm:hidden">Run</span>
            </span>
          </>
        )}
      </div>
    </motion.button>
  );
}
export default RunButton;
