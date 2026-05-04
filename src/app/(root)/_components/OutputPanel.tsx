"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import RunningCodeSkeleton from "./RunningCodeSkeleton";

type OutputPanelProps = {
  className?: string;
};

function OutputPanel({ className = "" }: OutputPanelProps) {
  const { output, error, isRunning, executionResult } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = Boolean(error || output);
  const copiedText = error && output ? `${output}\n${error}` : error || output;
  const isTimeout = Boolean(error && /timed?\s*out|timeout/i.test(error));
  const hasSilentSuccess = Boolean(executionResult && !executionResult.error && !output);

  const handleCopy = async () => {
    if (!copiedText) return;
    await navigator.clipboard.writeText(copiedText);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`relative flex min-w-0 flex-col bg-[#181825] rounded-xl p-3 ring-1 ring-gray-800/50 sm:p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            type="button"
            aria-label="Copy output"
            className="flex min-h-8 items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e]
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copied. Receipts saved.</span>
                <span className="sm:hidden">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Output Area */}
      <div className="relative min-h-[300px] flex-1 sm:min-h-[600px]">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-full overflow-auto font-mono text-sm"
          aria-live="polite"
        >
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="space-y-4 text-red-400">
              <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                <div className="space-y-1">
                  <div className="font-medium">
                    {isTimeout ? "Timeout Detected" : "Execution Error"}
                  </div>
                  <p className="max-w-xl text-xs leading-5 text-red-300/80">
                    {isTimeout
                      ? "The code kept the mic too long. Try a smaller loop or a shorter nap."
                      : "The compiler filed a complaint. Here is the evidence."}
                  </p>
                </div>
              </div>

              {output && (
                <div className="rounded-lg border border-red-400/10 bg-black/20 p-3">
                  <div className="mb-2 text-xs font-medium text-red-300/70">
                    What printed before things got dramatic
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
                </div>
              )}

              <div className="rounded-lg border border-red-400/10 bg-red-950/20 p-3">
                <pre className="whitespace-pre-wrap text-red-300/90">{error}</pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-3">
              <div className="mb-3 flex items-start gap-3 text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <div className="space-y-1">
                  <span className="block font-medium">Execution Successful</span>
                  <p className="max-w-xl text-xs leading-5 text-emerald-300/80">
                    It ran. Try not to look too powerful.
                  </p>
                </div>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          ) : hasSilentSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-400/20 mb-4">
                <CheckCircle className="w-6 h-6 text-emerald-300" />
              </div>
              <p className="text-center font-medium text-gray-300">Ran clean. Said nothing.</p>
              <p className="mt-2 max-w-sm text-center text-sm leading-6">
                No output is still an output choice. Bold, minimalist, slightly mysterious.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center font-medium text-gray-300">No output yet</p>
              <p className="mt-2 max-w-sm text-center text-sm leading-6">
                Run something. stdout is pretending not to care.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
