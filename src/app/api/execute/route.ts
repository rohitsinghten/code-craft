import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { NextResponse } from "next/server";
import { api } from "../../../../convex/_generated/api";

const DEFAULT_JUDGE0_API_URL = "https://ce.judge0.com";

const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 93,
  typescript: 94,
  python: 92,
  java: 91,
  go: 106,
  rust: 108,
  cpp: 105,
  csharp: 51,
  ruby: 72,
  swift: 83,
};

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

export async function POST(request: Request) {
  const body = (await request.json()) as PistonExecuteRequest;
  const apiUrl = process.env.JUDGE0_API_URL ?? DEFAULT_JUDGE0_API_URL;
  const languageId = JUDGE0_LANGUAGE_IDS[body.language];
  const sourceCode = body.files?.[0]?.content ?? "";

  if (!languageId) {
    return NextResponse.json(
      { message: `Unsupported language for Judge0 execution: ${body.language}` },
      { status: 400 }
    );
  }

  if (body.language !== "javascript") {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: "Sign in to run this language." }, { status: 401 });
    }

    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await convex.query(api.users.getUser, { userId });

    if (!user?.isPro) {
      return NextResponse.json(
        { message: "Pro subscription required to use this language." },
        { status: 403 }
      );
    }
  }

  try {
    const response = await fetch(`${apiUrl}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
      }),
    });

    const data = (await response.json()) as Judge0Response;

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message ?? "Code execution request failed" },
        { status: response.status }
      );
    }

    const statusId = data.status?.id ?? 0;
    const statusDescription = data.status?.description ?? "Unknown execution status";

    if (statusId === 6) {
      const compileOutput = data.compile_output ?? data.stderr ?? statusDescription;
      return NextResponse.json({
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
      });
    }

    const output = data.stdout ?? "";
    const error = data.stderr ?? data.message ?? (statusId === 3 ? "" : statusDescription);

    return NextResponse.json({
      run: {
        code: statusId === 3 ? 0 : 1,
        stdout: output,
        stderr: error,
        output: output || error,
      },
    });
  } catch (error) {
    console.error("Code execution request failed:", error);

    return NextResponse.json(
      {
        message:
          "Code execution service is unavailable. Configure JUDGE0_API_URL with a Judge0-compatible endpoint.",
      },
      { status: 503 }
    );
  }
}
