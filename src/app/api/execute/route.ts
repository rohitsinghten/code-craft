import { NextResponse } from "next/server";

const DEFAULT_PISTON_API_URL = "https://emkc.org/api/v2/piston";

export async function POST(request: Request) {
  const body = await request.json();
  const apiUrl = process.env.PISTON_API_URL ?? DEFAULT_PISTON_API_URL;

  try {
    const response = await fetch(`${apiUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Code execution request failed:", error);

    return NextResponse.json(
      {
        message:
          "Code execution service is unavailable. Configure PISTON_API_URL with a self-hosted Piston-compatible endpoint.",
      },
      { status: 503 }
    );
  }
}
