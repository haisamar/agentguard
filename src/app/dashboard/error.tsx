"use client";

export default function DashboardError({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080d18] px-6 text-white">
      <div className="max-w-lg">
        <h1 className="text-2xl font-semibold">Dashboard temporarily unavailable</h1>
        <p className="mt-3 text-zinc-400">We couldn’t load the current approval queue and audit records. Try again in a moment. If this continues, check the database and authentication service status.</p>
        <button onClick={() => retry()} className="mt-6 rounded-lg bg-blue-600 px-5 py-3">Try again</button>
        <a href="/demo" className="ml-5 text-blue-400">View public demo</a>
      </div>
    </main>
  );
}
