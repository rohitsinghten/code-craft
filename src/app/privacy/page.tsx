import NavigationHeader from "@/components/NavigationHeader";

const PRIVACY_SECTIONS = [
  {
    title: "Data CodeCraft uses",
    copy: "CodeCraft stores account profile data needed for sign-in, shared snippets, comments, stars, and saved execution history. Editor preferences such as theme, font size, selected language, and draft code are stored in your browser.",
  },
  {
    title: "Code execution",
    copy: "JavaScript executes locally in your browser. Other languages may be sent to the configured execution provider so the code can run and return output.",
  },
  {
    title: "Payments",
    copy: "Pro purchases are handled by the configured payment provider. CodeCraft stores only the customer and order identifiers needed to recognize Pro access.",
  },
  {
    title: "Your choices",
    copy: "You can clear browser-stored editor data from your browser settings. Signed-in users can delete snippets they created from the snippet card actions.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12 text-gray-100">
        <p className="mb-3 text-sm font-medium text-blue-300">Privacy</p>
        <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">Privacy Policy</h1>
        <p className="mb-10 max-w-2xl text-gray-400">
          This page explains the product behavior visible in this app. Keep it updated when storage,
          analytics, auth, or payment providers change.
        </p>

        <div className="space-y-4">
          {PRIVACY_SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-xl border border-white/10 bg-[#12121a] p-5"
            >
              <h2 className="mb-2 text-lg font-semibold text-white">{section.title}</h2>
              <p className="text-sm leading-6 text-gray-400">{section.copy}</p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
