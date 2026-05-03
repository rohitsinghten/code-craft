import { CodeEditorState } from "./../types/index";
import { LANGUAGE_CONFIG, MAX_CODE_LENGTH, isSupportedLanguage } from "@/lib/editor-config";
import { create } from "zustand";
import { Monaco } from "@monaco-editor/react";
import { io } from "socket.io-client";

const runJavaScriptLocally = (code: string) =>
  new Promise<{ output: string; error: string | null }>((resolve) => {
    const workerSource = `
      const format = (value) => {
        if (typeof value === "string") return value;
        try {
          return JSON.stringify(value);
        } catch {
          return String(value);
        }
      };

      const logs = [];
      console.log = (...args) => logs.push(args.map(format).join(" "));
      console.error = (...args) => logs.push(args.map(format).join(" "));

      self.onmessage = async (event) => {
        try {
          const userCode = event.data;
          const execute = new Function(
            "return (async () => {\\n" + userCode + "\\n})()"
          );
          const result = await (async () => {
            return execute();
          })();

          if (result !== undefined) logs.push(format(result));
          self.postMessage({ output: logs.join("\\n"), error: null });
        } catch (error) {
          self.postMessage({
            output: logs.join("\\n"),
            error: error instanceof Error ? error.message : String(error),
          });
        }
      };
    `;

    const blob = new Blob([workerSource], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    const timeout = window.setTimeout(() => {
      worker.terminate();
      resolve({ output: "", error: "Execution timed out after 5 seconds" });
    }, 5000);

    worker.onmessage = (event: MessageEvent<{ output: string; error: string | null }>) => {
      window.clearTimeout(timeout);
      worker.terminate();
      resolve(event.data);
    };

    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      resolve({ output: "", error: event.message });
    };

    worker.postMessage(code);
  });

type OnlineCompilerSocketResult = {
  output?: string;
  error?: string;
  status?: string;
  exit_code?: number;
};

const runWithOnlineCompilerSocket = (compiler: string, code: string) =>
  new Promise<{ output: string; error: string | null }>((resolve, reject) => {
    const apiKey = process.env.NEXT_PUBLIC_ONLINECOMPILER_WS_KEY;

    if (!apiKey) {
      reject(new Error("OnlineCompiler WebSocket key is not configured."));
      return;
    }

    const socket = io("wss://api.onlinecompiler.io", {
      auth: { token: apiKey },
      transports: ["websocket"],
      reconnection: false,
      timeout: 2500,
    });

    const timeout = window.setTimeout(() => {
      socket.disconnect();
      reject(new Error("OnlineCompiler WebSocket execution timed out."));
    }, 6000);

    const finish = (result: { output: string; error: string | null }) => {
      window.clearTimeout(timeout);
      socket.disconnect();
      resolve(result);
    };

    socket.on("connect", () => {
      socket.emit("runcode", {
        api_key: apiKey,
        compiler,
        code,
        input: "",
      });
    });

    socket.on("connect_error", (error) => {
      window.clearTimeout(timeout);
      socket.disconnect();
      reject(error);
    });

    socket.on("codeoutput", (result: OnlineCompilerSocketResult) => {
      const output = result.output ?? "";
      const error = result.error ?? "";
      const exitCode = result.exit_code ?? (result.status === "success" ? 0 : 1);

      finish({
        output: output.trim(),
        error: exitCode === 0 ? null : error || output || "Execution failed",
      });
    });
  });

const getInitialState = () => {
  // if we're on the server, return default values
  if (typeof window === "undefined") {
    return {
      language: "javascript",
      fontSize: 16,
      theme: "vs-dark",
    };
  }

  // if we're on the client, return values from local storage bc localStorage is a browser API.
  const savedLanguage = localStorage.getItem("editor-language") || "javascript";
  const savedTheme = localStorage.getItem("editor-theme") || "vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") || 16;

  return {
    language: isSupportedLanguage(savedLanguage) ? savedLanguage : "javascript",
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  };
};

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState();

  return {
    ...initialState,
    output: "",
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    getCode: () => get().editor?.getValue() || "",

    setEditor: (editor: Monaco) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`);
      if (savedCode) editor.setValue(savedCode);

      set({ editor });
    },

    setTheme: (theme: string) => {
      localStorage.setItem("editor-theme", theme);
      set({ theme });
    },

    setFontSize: (fontSize: number) => {
      localStorage.setItem("editor-font-size", fontSize.toString());
      set({ fontSize });
    },

    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },

    loadSnippetIntoEditor: (language: string, code: string) => {
      if (!isSupportedLanguage(language)) return;

      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);
      localStorage.setItem(`editor-code-${language}`, code);

      get().editor?.setValue(code);

      set({
        language,
        output: "",
        error: null,
        executionResult: null,
      });
    },

    runCode: async () => {
      const { language, getCode, editor } = get();

      if (!editor) {
        set({ error: "Editor is still loading. Try again in a moment." });
        return;
      }

      const code = getCode();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      if (code.length > MAX_CODE_LENGTH) {
        set({ error: `Code must be ${MAX_CODE_LENGTH} characters or less` });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        if (language === "javascript") {
          const result = await runJavaScriptLocally(code);

          if (result.error) {
            set({
              error: result.error,
              output: result.output.trim(),
              executionResult: { code, output: result.output.trim(), error: result.error },
            });
            return;
          }

          set({
            output: result.output.trim(),
            error: null,
            executionResult: { code, output: result.output.trim(), error: null },
          });
          return;
        }

        const languageConfig = LANGUAGE_CONFIG[language];

        if (languageConfig.onlineCompilerId && process.env.NEXT_PUBLIC_ONLINECOMPILER_WS_KEY) {
          try {
            const result = await runWithOnlineCompilerSocket(languageConfig.onlineCompilerId, code);

            if (result.error) {
              set({
                error: result.error,
                output: result.output,
                executionResult: { code, output: result.output, error: result.error },
              });
              return;
            }

            set({
              output: result.output,
              error: null,
              executionResult: { code, output: result.output, error: null },
            });
            return;
          } catch (error) {
            console.warn("OnlineCompiler WebSocket failed; falling back to API route:", error);
          }
        }

        const runtime = languageConfig.pistonRuntime;
        const response = await fetch("/api/execute", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        });

        const responseText = await response.text();
        const data = responseText
          ? JSON.parse(responseText)
          : { message: "Code execution failed with an empty server response." };

        console.log("data back from code execution API:", data);

        // handle API-level errors
        if (data.message) {
          const message =
            response.status === 429
              ? "The free Judge0 service is rate limited right now. Try again shortly or configure JUDGE0_API_URL with a dedicated Judge0 endpoint."
              : data.message;
          set({ error: message, executionResult: { code, output: "", error: message } });
          return;
        }

        // handle compilation errors
        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output;
          set({
            error,
            executionResult: {
              code,
              output: "",
              error,
            },
          });
          return;
        }

        // if we get here, execution was successful
        const output = data.run.output;

        set({
          output: output.trim(),
          error: null,
          executionResult: {
            code,
            output: output.trim(),
            error: null,
          },
        });
      } catch (error) {
        console.log("Error running code:", error);
        set({
          error: "Error running code",
          executionResult: { code, output: "", error: "Error running code" },
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () => useCodeEditorStore.getState().executionResult;
