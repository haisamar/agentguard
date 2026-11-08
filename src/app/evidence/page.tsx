import type { Metadata } from "next";
import Link from "next/link";
import { eyebrow, primary, secondary, SiteFrame } from "../SiteFrame";
import localEvaluation from "../../../public/local-ledger-evaluation.json";

export const metadata: Metadata = { title: "Release evidence", description: "Dated deployment results, source revisions, and verification limits for AgentGuard." };

const evidenceCommit = "fbc1e6f52dea7aaf859d9685d6e0ffac08e18796";
const source = "https://github.com/haisamar/agentguard-mcp";
const snapshot = source + "/blob/" + evidenceCommit;
const comparison = [
  ["Unguarded", localEvaluation.matching_expected_effects.unguarded],
  ["Scope and per-request threshold", localEvaluation.matching_expected_effects.scope_and_threshold],
  ["AgentGuard database controls", localEvaluation.matching_expected_effects.agentguard_database],
] as const;
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
      <section aria-labelledby="results" className="rounded-3xl border border-white/10 bg-[#111c30] p-5 sm:p-7">
        <h2 id="results" className="text-2xl font-semibold">22 live assertions passed in one release trial</h2>
        <p className="mt-2 text-sm text-slate-300">These are checks within one trial, not 22 independent runs or a load test.</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map(([title, sample, result]) => <div key={title} className="rounded-xl border border-white/10 p-4"><dt className="font-semibold text-blue-300">{title}</dt><dd className="mt-2 text-sm leading-6 text-slate-300"><span className="block font-medium text-white">{sample}</span>{result}</dd></div>)}
        </dl>
      </section>
      <section aria-labelledby="local-results" className="mt-8 rounded-3xl border border-blue-300/20 bg-[#111c30] p-5 sm:p-7">
        <p className={eyebrow}>Separate local evaluation</p>
        <h2 id="local-results" className="mt-2 text-2xl font-semibold">Same requests, three sets of controls</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Each scenario checks the resulting receipt count and total amount. AgentGuard ran its actual SQL migrations against an empty in-memory database; both comparison baselines are intentionally limited local models.</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          {comparison.map(([name, passed]) => <div key={name} className="rounded-xl border border-white/10 p-4"><dt className="text-sm font-medium text-slate-300">{name}</dt><dd className="mt-2 text-2xl font-semibold tabular-nums text-blue-200">{passed} of {localEvaluation.cases.length}</dd><dd className="mt-1 text-sm text-slate-400">matched the expected effect</dd></div>)}
        </dl>
        <p className="mt-4 text-sm leading-6 text-slate-300">{localEvaluation.sql_assertion_files_passed.length} SQL assertion files also passed, including expiry and rollback checks. This single-connection run uses synthetic identities and does not test live authentication or concurrency.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/local-ledger-evaluation.json" className={secondary}>Inspect comparison results</a>
          <a href={source + "/tree/" + localEvaluation.source_commit + "/evaluation"} className={secondary}>Reproduce from source</a>
        </div>
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">Revisions tested</h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div><dt className="text-slate-400">Frontend commit</dt><dd><a className="break-all font-mono text-blue-300 underline" href="https://github.com/haisamar/agentguard/commit/5c469b4234451fb192c8692113bb0e8ceaf26f74">5c469b4234451fb192c8692113bb0e8ceaf26f74</a></dd></div>
            <div><dt className="text-slate-400">Backend commit</dt><dd><a className="break-all font-mono text-blue-300 underline" href={source + "/commit/65c3633fdbf1e3b43df9b17eb5a4946ef03a409b"}>65c3633fdbf1e3b43df9b17eb5a4946ef03a409b</a></dd></div>
            <div><dt className="text-slate-400">Database</dt><dd>Migrations 001–008</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-white/10 p-5">
          <h2 className="text-xl font-semibold">Reproduce the checks</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">Start with the backend setup, refund contract, and database tests. The release report separates local tests, database assertions, and the live trial.</p>
          <ul className="mt-3 flex flex-wrap gap-4 text-sm text-blue-300">
            <li><a className="underline" href={snapshot + "/DEPLOYMENT.md"}>Setup and hosting</a></li>
            <li><a className="underline" href={snapshot + "/REFUND-CONTRACT.md"}>Refund contract</a></li>
            <li><a className="underline" href={source + "/tree/" + evidenceCommit + "/database/tests"}>SQL checks</a></li>
          </ul>
        </div>
      </section>
      <section className="mt-8 rounded-2xl border border-white/10 p-5">
        <h2 className="text-xl font-semibold">What this evidence covers</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">The owner performed approval. Cancellation and pause/resume used the authenticated administrator interface during verification. No real payments moved. The application trusts its privileged server and database operators, so the audit trail is not a cryptographic guarantee against those operators.</p>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Separate local MCP tests exercise the real verifier with signed wrong-issuer, wrong-audience and expired tokens. They use fixture discovery and public keys. The full negative-authentication browser matrix and a fresh hosted Supabase/Auth0 rehearsal remain open.</p>
        <p className="mt-3 text-sm"><a className="text-blue-300 underline" href={source + "/blob/main/HOSTED-REHEARSAL.md"}>Read the hosted rehearsal guide</a></p>
        <Link href="/demo" className="mt-4 inline-flex min-h-11 items-center font-semibold text-blue-300 underline">Return to the walkthrough</Link>
      </section>
    </SiteFrame>
  );
}
