import type { Metadata } from "next";
import Link from "next/link";
import { eyebrow, secondary, SiteFrame } from "../SiteFrame";
import { RefundWalkthrough } from "./RefundWalkthrough";

export const metadata: Metadata = {
  title: "Refund safety demo",
  description: "Walk through refund permissions, shared budgets, human review, and replay protection using synthetic requests.",
};

export default function DemoPage() {
  return (
    <SiteFrame current="/demo">
      <section className="py-10 sm:py-14">
        <p className={eyebrow}>Interactive walkthrough</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">What happens when an agent asks for a refund?</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-300">Pick a request and inspect the decision and its effect. This guided simulation runs in your browser. It does not call the live MCP server, write records, or send payments.</p>
      </section>
      <RefundWalkthrough />
      <section className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-white/10 p-6">
        <div><h2 className="text-xl font-semibold">See what happened on the deployed system</h2><p className="mt-2 text-sm text-slate-300">Read the separately recorded results, including a real operator approving a simulated refund.</p></div>
        <Link href="/evidence" className={secondary}>View release evidence</Link>
      </section>
    </SiteFrame>
  );
}
