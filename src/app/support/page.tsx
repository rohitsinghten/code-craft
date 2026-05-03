import NavigationHeader from "@/components/NavigationHeader";
import Link from "next/link";

const SUPPORT_TOPICS = [
  {
    title: "Account and sign-in",
    copy: "Use the same Clerk account you used for CodeCraft. If sign-in loops, confirm your Clerk publishable and secret keys come from the same Clerk instance and that your system clock is synced.",
  },
  {
    title: "Code execution",
    copy: "JavaScript runs locally in the browser. Other languages use the configured execution providers and may be rate limited by the free endpoint.",
  },
  {
    title: "Snippets and history",
    copy: "Shared snippets, stars, comments, and execution history are stored in Convex. Run the Convex sync command after changing backend functions.",
  },
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12 text-gray-100">
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-blue-300">Support</p>
          <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">Get CodeCraft working smoothly</h1>
          <p className="max-w-2xl text-gray-400">
            Start with the checks below for the most common local setup, auth, and execution issues.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {SUPPORT_TOPICS.map((topic) => (
            <section
              key={topic.title}
              className="rounded-xl border border-white/10 bg-[#12121a] p-5"
            >
              <h2 className="mb-2 text-base font-semibold text-white">{topic.title}</h2>
              <p className="text-sm leading-6 text-gray-400">{topic.copy}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
          <h2 className="mb-2 text-base font-semibold text-blue-100">Still stuck?</h2>
          <p className="text-sm leading-6 text-blue-100/80">
            Include your browser console message, the route you were on, and whether Convex is synced.
            The local setup guide in the README lists the exact commands to check first.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Back to editor
          </Link>
        </div>
      </main>
    </div>
  );
}
