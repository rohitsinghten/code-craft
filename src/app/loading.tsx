export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-16 rounded-lg bg-gray-800/50" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-[640px] rounded-xl bg-gray-800/40" />
          <div className="h-[640px] rounded-xl bg-gray-800/40" />
        </div>
      </div>
    </main>
  );
}
