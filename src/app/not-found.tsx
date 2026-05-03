import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 text-gray-100">
      <section className="max-w-md rounded-xl border border-white/10 bg-[#12121a] p-6 text-center">
        <p className="mb-2 text-sm font-medium text-blue-300">404</p>
        <h1 className="mb-3 text-2xl font-semibold">That page does not exist.</h1>
        <p className="mb-6 text-sm text-gray-400">
          Head back to the editor and keep building from there.
        </p>
        <Link
          href="/"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Open editor
        </Link>
      </section>
    </main>
  );
}
