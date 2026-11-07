import Link from "next/link";
import { eyebrow, primary, secondary, SiteFrame } from "./SiteFrame";

const controls = [
  ["01", "Check permission", "A Sales agent can read CRM accounts. It cannot issue refunds."],
  ["02", "Check the budget", "Finance can record small simulated refunds within a shared $500 rolling 24-hour limit."],
  ["03", "Require human review", "Larger or over-budget requests wait for an operator to review the stored transaction."],
  ["04", "Record one effect", "Execution records one receipt. Replaying an executed approval cannot issue another refund."],
];

export default function Home() {
  return (
    <SiteFrame current="/">
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        <div>
          <p className={eyebrow}>Safety controls for AI agents</p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">An agent can request a refund. <span className="text-emerald-300">AgentGuard decides what can execute.</span></h1>
          <p className="mt-6 max-w-xl leading-7 text-slate-300 sm:text-lg">A tool call should never be the final word on a financial action. AgentGuard checks permissions and spending limits, then holds sensitive requests for human review.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/demo" className={primary}>Try the refund demo <span aria-hidden="true" className="ml-2">→</span></Link>
            <Link href="/evidence" className={secondary}>View verified results</Link>
          </div>
          <p className="mt-4 text-sm text-slate-400">No login for the demo. No money moves.</p>
        </div>
        <figure className="min-w-0 rounded-3xl border border-emerald-300/20 bg-[#101c22] p-5 shadow-2xl sm:p-7">
          <figcaption className="flex flex-wrap justify-between gap-2 border-b border-white/10 pb-4 text-sm"><span className="font-semibold">Example refund request</span><span className="text-slate-400">Illustration</span></figcaption>
          <div className="my-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-3xl font-semibold tabular-nums">$755.00 <span className="text-sm text-slate-400">USD</span></p>
            <span className="rounded-lg bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-200">Waiting for review</span>
          </div>
          <ol className="space-y-3 text-sm">
            <li className="rounded-xl border border-white/10 p-3"><span className="font-semibold text-emerald-300">01 · Identity</span><p className="mt-1 text-slate-300">Finance Agent has refund permission.</p></li>
            <li className="rounded-xl border border-white/10 p-3"><span className="font-semibold text-amber-200">02 · Policy</span><p className="mt-1 text-slate-300">The request exceeds the autonomous limit.</p></li>
            <li className="rounded-xl border border-white/10 p-3"><span className="font-semibold text-sky-200">03 · Effect</span><p className="mt-1 text-slate-300">No receipt until a human approves and the agent executes.</p></li>
          </ol>
        </figure>
      </section>
      <section aria-labelledby="controls-heading" className="border-t border-white/10 pt-10">
        <p className={eyebrow}>Where the checks happen</p>
        <h2 id="controls-heading" className="mt-3 text-3xl font-semibold tracking-tight">From request to receipt</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {controls.map(([number, title, body]) => (
            <li key={number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <span className="font-mono text-sm text-emerald-300">{number}</span>
              <h3 className="mt-3 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <p className={eyebrow}>Observed on November 6, 2026</p>
        <h2 className="mt-3 text-2xl font-semibold">One human approval. One simulated receipt. Replay denied.</h2>
        <p className="mt-3 max-w-2xl leading-7 text-slate-300">The deployed test also checked cancellation and pause/resume. The report records the exact builds, what passed, and what still needs testing.</p>
        <Link href="/evidence" className="mt-4 inline-flex min-h-11 items-center font-semibold text-emerald-300 underline underline-offset-4">Read the release evidence →</Link>
      </section>
    </SiteFrame>
  );
}
