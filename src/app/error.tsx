"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-gray-100">
      <section className="max-w-md rounded-xl border border-red-500/20 bg-[#12121a] p-6 text-center">
        <p className="mb-2 text-sm font-medium text-red-300">Something went wrong</p>
        <h1 className="mb-3 text-2xl font-semibold">CodeCraft hit a runtime error.</h1>
        <p className="mb-6 text-sm text-gray-400">{error.message || "Try again in a moment."}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
