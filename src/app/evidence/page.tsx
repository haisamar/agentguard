import type { Metadata } from "next";
import Link from "next/link";
import { eyebrow, primary, secondary, SiteFrame } from "../SiteFrame";

export const metadata: Metadata = { title: "Release evidence", description: "Dated deployment results, source revisions, and verification limits for AgentGuard." };

const evidenceCommit = "fbc1e6f52dea7aaf859d9685d6e0ffac08e18796";
const source = "https://github.com/haisamar/agentguard-mcp";
const snapshot = source + "/blob/" + evidenceCommit;
const rows = [
  ["Human review and execution", "$755.00 simulated refund", "Owner approved after passkey reauthentication; exactly one simulated receipt and one human-review audit event."],
  ["Approval replay", "Second execution attempt", "Denied. The same approval still has only one receipt."],
  ["Request retries", "Identical and changed payloads", "Identical retry returned the original result; a changed amount with the same request ID was denied."],
  ["Cancellation", "Pending request cancelled", "One cancellation audit, zero receipts; execution denied."],
  ["Pause and resume", "Simulated one-cent refund", "Blocked while paused with no partial request; a new request succeeded after resume."],
  ["Permissions", "Real Auth0 machine tokens", "Sales could read CRM, could not issue refunds; the machine administrator could not approve."],
];

export default function EvidencePage() {
  return (
    <SiteFrame current="/evidence">
      <section className="py-10 sm:py-14">
        <p className={eyebrow}>Recorded verification · November 6, 2026</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">What the deployed system did</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">These results come from a dated release trial using real Auth0 identities and AgentGuard’s simulated ledger. The public walkthrough uses separate scripted examples.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/release-evidence-2026-11-06.json" className={primary}>Inspect the JSON evidence</a>
          <a href={snapshot + "/RELEASE-VERIFICATION-2026-11-06.md"} className={secondary}>Full report on GitHub</a>
        </div>
      </section>
      <section aria-labelledby="results" className="rounded-3xl border border-white/10 bg-[#101c22] p-5 sm:p-7">
        <h2 id="results" className="text-2xl font-semibold">22 live assertions passed in one release trial</h2>
        <p className="mt-2 text-sm text-slate-300">These are checks within one trial, not 22 independent runs or a load test.</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map(([title, sample, result]) => <div key={title} className="rounded-xl border border-white/10 p-4"><dt className="font-semibold text-emerald-300">{title}</dt><dd className="mt-2 text-sm leading-6 text-slate-300"><span className="block font-medium text-white">{sample}</span>{result}</dd></div>)}
        </dl>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">Revisions tested</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div><dt className="text-slate-400">Frontend commit</dt><dd><a className="break-all font-mono text-emerald-300 underline" href="https://github.com/haisamar/agentguard/commit/5c469b4234451fb192c8692113bb0e8ceaf26f74">5c469b4234451fb192c8692113bb0e8ceaf26f74</a></dd></div>
            <div><dt className="text-slate-400">Backend commit</dt><dd><a className="break-all font-mono text-emerald-300 underline" href={source + "/commit/65c3633fdbf1e3b43df9b17eb5a4946ef03a409b"}>65c3633fdbf1e3b43df9b17eb5a4946ef03a409b</a></dd></div>
            <div><dt className="text-slate-400">Database</dt><dd>Migrations 001–008</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">Reproduce the checks</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Start with the backend setup, refund contract, and database tests. The release report separates local tests, database assertions, and the live trial.</p>
          <ul className="mt-3 flex flex-wrap gap-4 text-sm text-emerald-300">
            <li><a className="underline" href={snapshot + "/DEPLOYMENT.md"}>Setup and hosting</a></li>
            <li><a className="underline" href={snapshot + "/REFUND-CONTRACT.md"}>Refund contract</a></li>
            <li><a className="underline" href={source + "/tree/" + evidenceCommit + "/database/tests"}>SQL checks</a></li>
          </ul>
        </div>
      </section>
      <section className="mt-8 rounded-2xl border border-white/10 p-5">
        <h2 className="text-xl font-semibold">What this evidence covers</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">The owner performed approval. Cancellation and pause/resume used the authenticated administrator interface during verification. No real payments moved. The application trusts its privileged server and database operators, so the audit trail is not a cryptographic guarantee against those operators.</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">The full negative-authentication browser matrix, independently signed wrong-issuer/audience and expired tokens, and a portable fresh-setup rehearsal remain open.</p>
        <Link href="/demo" className="mt-4 inline-flex min-h-11 items-center font-semibold text-emerald-300 underline">Return to the walkthrough</Link>
      </section>
    </SiteFrame>
  );
}
