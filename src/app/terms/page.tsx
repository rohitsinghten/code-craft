import NavigationHeader from "@/components/NavigationHeader";

const TERMS_SECTIONS = [
  {
    title: "Use of the editor",
    copy: "You are responsible for the code you run or share. Do not run or publish code intended to harm services, devices, accounts, or other users.",
  },
  {
    title: "Community snippets",
    copy: "Shared snippets should have clear titles, useful code, and no placeholder or abusive content. Low-quality or unsafe content can be removed.",
  },
  {
    title: "Pro access",
    copy: "Pro unlocks the product features shown on the pricing page. Future features should not be treated as included until they appear in the app.",
  },
  {
    title: "Availability",
    copy: "Some code execution providers have limits or outages. CodeCraft may temporarily disable a provider or language to protect reliability.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12 text-gray-100">
        <p className="mb-3 text-sm font-medium text-blue-300">Terms</p>
        <h1 className="mb-4 text-3xl font-semibold sm:text-4xl">Terms of Use</h1>
        <p className="mb-10 max-w-2xl text-gray-400">
          These terms are written to match what CodeCraft currently does: edit code, run snippets,
          save history, and share community examples.
        </p>

        <div className="space-y-4">
          {TERMS_SECTIONS.map((section) => (
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
