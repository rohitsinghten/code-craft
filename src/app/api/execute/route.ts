import { NextResponse } from "next/server";
import {
  EXECUTION_TIMEOUT_MS,
  MAX_CODE_LENGTH,
  getLanguageConfig,
} from "@/lib/editor-config";

export const runtime = "edge";
export const preferredRegion = "bom1";
export const dynamic = "force-dynamic";

const DEFAULT_JUDGE0_API_URL = "https://ce.judge0.com";
const DEFAULT_ONLINECOMPILER_API_URL = "https://api.onlinecompiler.io";
const ONLINECOMPILER_TIMEOUT_MS = 3_500;

type PistonExecuteRequest = {
  language: string;
  version: string;
  files: Array<{ content: string }>;
};

type Judge0Response = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status?: {
    id: number;
    description: string;
  };
};

type ExecutionResponse = {
  compile?: {
    code: number;
    stdout: string;
    stderr: string;
    output: string;
  };
  run: {
    code: number;
    stdout: string;
    stderr: string;
    output: string;
  };
};

type OnlineCompilerResponse = {
  output?: string;
  error?: string;
  status?: "success" | "error" | string;
  exit_code?: number;
  signal?: number | null;
};

function isExecuteRequest(value: unknown): value is PistonExecuteRequest {
  if (!value || typeof value !== "object") return false;

  const body = value as Partial<PistonExecuteRequest>;
  return (
    typeof body.language === "string" &&
    Array.isArray(body.files) &&
    body.files.length > 0 &&
    body.files.every((file) => file && typeof file.content === "string")
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Response(text, { status: response.status || 502 });
  }
}

async function executeWithJudge0({
  apiUrl,
  sourceCode,
  languageId,
}: {
  apiUrl: string;
  sourceCode: string;
  languageId: number;
}): Promise<ExecutionResponse> {
  const response = await fetchWithTimeout(
    `${apiUrl}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
      }),
    },
    EXECUTION_TIMEOUT_MS
  );

  const data = await parseJsonResponse<Judge0Response>(response);

  if (!response.ok) {
    throw new Response(data.message ?? "Code execution request failed", {
      status: response.status,
    });
  }

  const statusId = data.status?.id ?? 0;
  const statusDescription = data.status?.description ?? "Unknown execution status";

  if (statusId === 6) {
    const compileOutput = data.compile_output ?? data.stderr ?? statusDescription;
    return {
      compile: {
        code: 1,
        stdout: "",
        stderr: compileOutput,
        output: compileOutput,
      },
      run: {
        code: 0,
        stdout: "",
        stderr: "",
        output: "",
      },
    };
  }

  const output = data.stdout ?? "";
  const error = data.stderr ?? data.message ?? (statusId === 3 ? "" : statusDescription);

  return {
    run: {
      code: statusId === 3 ? 0 : 1,
      stdout: output,
      stderr: error,
      output: output || error,
    },
  };
}

async function executeWithOnlineCompiler({
  apiUrl,
  apiKey,
  compiler,
  sourceCode,
}: {
  apiUrl: string;
  apiKey: string;
  compiler: string;
  sourceCode: string;
}): Promise<ExecutionResponse> {
  const response = await fetchWithTimeout(
    `${apiUrl}/api/run-code-sync/`,
    {
      method: "POST",
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler,
        code: sourceCode,
        input: "",
      }),
    },
    ONLINECOMPILER_TIMEOUT_MS
  );

  const data = await parseJsonResponse<OnlineCompilerResponse & { message?: string }>(response);

  if (!response.ok) {
    throw new Response(data.message ?? data.error ?? "OnlineCompiler request failed", {
      status: response.status,
    });
  }

  const output = data.output ?? "";
  const error = data.error ?? "";
  const exitCode = data.exit_code ?? (data.status === "success" ? 0 : 1);

  return {
    run: {
      code: exitCode === 0 ? 0 : 1,
      stdout: output,
      stderr: error,
      output: output || error,
    },
  };
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isExecuteRequest(body)) {
    return NextResponse.json({ message: "Invalid execution request payload." }, { status: 400 });
  }

  const judge0ApiUrl = process.env.JUDGE0_API_URL ?? DEFAULT_JUDGE0_API_URL;
  const onlineCompilerApiUrl =
    process.env.ONLINECOMPILER_API_URL ?? DEFAULT_ONLINECOMPILER_API_URL;
  const onlineCompilerApiKey = process.env.ONLINECOMPILER_API_KEY;
  const languageConfig = getLanguageConfig(body.language);
  const sourceCode = body.files?.[0]?.content ?? "";

  if (!languageConfig) {
    return NextResponse.json(
      { message: `Unsupported language for Judge0 execution: ${body.language}` },
      { status: 400 }
    );
  }

  if (!sourceCode.trim()) {
    return NextResponse.json({ message: "Please enter some code." }, { status: 400 });
  }

  if (sourceCode.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { message: `Code must be ${MAX_CODE_LENGTH} characters or less.` },
      { status: 413 }
    );
  }

  try {
    const judge0Execution = executeWithJudge0({
      apiUrl: judge0ApiUrl,
      sourceCode,
      languageId: languageConfig.judge0LanguageId,
    });

    if (onlineCompilerApiKey && languageConfig.onlineCompilerId) {
      const onlineCompilerExecution = executeWithOnlineCompiler({
        apiUrl: onlineCompilerApiUrl,
        apiKey: onlineCompilerApiKey,
        compiler: languageConfig.onlineCompilerId,
        sourceCode,
      });

      const result = await Promise.any([onlineCompilerExecution, judge0Execution]);

      return NextResponse.json(result);
    }

    const result = await judge0Execution;

    return NextResponse.json(result);
  } catch (error) {
    console.error("Code execution request failed:", error);

    if (error instanceof Response) {
      return NextResponse.json({ message: await error.text() }, { status: error.status });
    }

    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(
        { message: "Code execution timed out. Try a smaller program or run it again." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Code execution service is unavailable. Configure JUDGE0_API_URL with a Judge0-compatible endpoint.",
      },
      { status: 503 }
    );
  }
}
