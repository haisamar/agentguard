"use client";

import { useState } from "react";
import { primary, secondary } from "../SiteFrame";

const scenarios = [
  { id: "allow", label: "Routine refund", actor: "Finance Agent", action: "Issue refund", amount: "$100.00", decision: "Allowed", reason: "The agent has refund permission, and the request fits inside the remaining shared budget.", effect: "One simulated receipt. $400 remains in the example budget.", tone: "text-emerald-300" },
  { id: "scope", label: "Missing permission", actor: "Sales Agent", action: "Issue refund", amount: "$755.00", decision: "Denied", reason: "Sales has CRM access but lacks the finance:refund scope. The request is rejected before the budget check.", effect: "No approval or receipt is created.", tone: "text-rose-300" },
  { id: "human", label: "Human review", actor: "Finance Agent", action: "Issue refund", amount: "$755.00", decision: "Waiting for review", reason: "The refund exceeds the $500 autonomous limit. Execution requires an independent human decision on the stored request.", effect: "One pending approval. No receipt.", tone: "text-amber-200" },
  { id: "split", label: "Split the budget", actor: "Finance Agent", action: "Issue a second refund after $300 already used", amount: "$250.00", decision: "Waiting for review", reason: "Only $200 remains in the shared rolling 24-hour budget. Splitting a larger amount into smaller requests does not reset the budget.", effect: "The second request creates no receipt while pending.", tone: "text-amber-200" },
  { id: "self", label: "Machine self-approval", actor: "Admin Runtime", action: "Approve a pending refund via MCP", amount: "$755.00", decision: "Denied", reason: "The machine management scope does not grant human approval authority.", effect: "The request stays pending. No receipt.", tone: "text-rose-300" },
  { id: "change", label: "Change an existing request", actor: "Finance Agent", action: "Reuse the same request ID with a changed amount", amount: "$756.00", decision: "Denied", reason: "The ID already belongs to this agent’s $755 request. A different payload cannot reuse it.", effect: "The original transaction is unchanged. No extra receipt.", tone: "text-rose-300" },
  { id: "pause", label: "Execution paused", actor: "Finance Agent", action: "Issue refund while the operator pause is active", amount: "$1.00", decision: "Blocked", reason: "The database checks the execution pause before inserting a refund receipt.", effect: "No receipt or partial request is recorded.", tone: "text-rose-300" },
] as const;

type Stage = "ready" | "decision" | "approved" | "executed" | "replayed" | "cancelled";

const reviewStages = {
  approved: { decision: "Approved", reason: "The simulated operator approved this exact stored transaction. The agent must still execute it.", effect: "Approved request. No receipt yet.", tone: "text-sky-200" },
  executed: { decision: "Executed", reason: "The request is still approved, unexpired, and belongs to the requesting agent.", effect: "One simulated receipt for $755.00 USD.", tone: "text-emerald-300" },
  replayed: { decision: "Replay denied", reason: "The approval is already executed. It cannot authorize a second effect.", effect: "The ledger still contains exactly one simulated receipt.", tone: "text-rose-300" },
  cancelled: { decision: "Cancelled", reason: "The simulated operator cancelled the request before execution.", effect: "No receipt. This request can no longer execute.", tone: "text-rose-300" },
};

export function RefundWalkthrough() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("ready");
  const scenario = scenarios[index];
  const result = stage === "ready" ? null : stage === "decision" ? scenario : reviewStages[stage];
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <fieldset className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <legend className="px-2 text-sm font-semibold">Choose a scenario</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {scenarios.map((item, itemIndex) => (
            <label key={item.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-white/10 px-3 py-2 text-sm has-checked:border-emerald-300/45 has-checked:bg-emerald-300/10 hover:bg-white/5">
              <input className="accent-emerald-300" type="radio" name="scenario" checked={itemIndex === index} onChange={() => { setIndex(itemIndex); setStage("ready"); }} />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>
      <section aria-labelledby="request-heading" className="rounded-3xl border border-white/10 bg-[#101c22] p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Example request</p>
        <h2 id="request-heading" className="mt-2 text-2xl font-semibold">{scenario.label}</h2>
        <dl className="mt-5 grid gap-4 rounded-xl border border-white/10 p-4 text-sm sm:grid-cols-2">
          <div><dt className="text-slate-400">Requester</dt><dd className="mt-1 font-semibold">{scenario.actor}</dd></div>
          <div><dt className="text-slate-400">Destination account</dt><dd className="mt-1 font-mono">acct_001</dd></div>
          <div><dt className="text-slate-400">Requested action</dt><dd className="mt-1 font-semibold">{scenario.action}</dd></div>
          <div><dt className="text-slate-400">Amount</dt><dd className="mt-1 font-semibold tabular-nums">{scenario.amount} USD</dd></div>
        </dl>
        <div aria-live="polite" aria-atomic="true">
          {result ? (
            <div className="mt-5 rounded-xl border border-white/15 bg-black/20 p-4">
              <h3 className={"text-lg font-semibold " + result.tone}>{result.decision}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{result.reason}</p>
              <p className="mt-3 text-sm leading-6"><strong>Ledger effect:</strong> {result.effect}</p>
            </div>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className={primary} onClick={() => setStage("decision")}>{stage === "ready" ? "Show simulated decision" : "Restart this scenario"}</button>
          {scenario.id === "human" && stage === "decision" ? <button type="button" className={secondary} onClick={() => setStage("approved")}>Simulate human approval</button> : null}
          {scenario.id === "human" && (stage === "decision" || stage === "approved") ? <button type="button" className={secondary} onClick={() => setStage("cancelled")}>Simulate cancellation</button> : null}
          {scenario.id === "human" && stage === "approved" ? <button type="button" className={secondary} onClick={() => setStage("executed")}>Simulate execution</button> : null}
          {scenario.id === "human" && stage === "executed" ? <button type="button" className={secondary} onClick={() => setStage("replayed")}>Try replaying the approval</button> : null}
        </div>
      </section>
    </div>
  );
}
