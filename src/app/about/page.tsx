import type { Metadata } from "next";
import Link from "next/link";
import { eyebrow, primary, SiteFrame } from "../SiteFrame";

export const metadata: Metadata = { title: "Creator case study", description: "Why Haisam Arshad built AgentGuard and how the refund workflow enforces human control." };

export default function CaseStudyPage() {
  return (
    <SiteFrame current="/about">
      <article className="max-w-3xl py-10 sm:py-14">
        <p className={eyebrow}>Creator case study · Haisam Arshad</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Putting a human decision between a tool call and its effect</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">AgentGuard uses a refund workflow to answer a concrete question: if an AI agent requests a financial action, who can actually authorize it, and how can an operator verify what happened?</p>
        <section className="mt-8 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-semibold">Identity is only the first check</h2>
          <p className="mt-3 leading-7 text-slate-300">Auth0 identifies each runtime. The MCP server checks permissions before evaluating the request. A shared budget stops smaller requests from bypassing the spending limit, and higher-risk requests wait for the operator.</p>
        </section>
        <section className="mt-8 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-semibold">Retries must not create extra effects</h2>
          <p className="mt-3 leading-7 text-slate-300">An agent can lose a response and retry. The request ID and stored payload let the database recognize the same request. Review and its audit event commit together; execution, receipt creation, and its audit event also commit together.</p>
        </section>
        <section className="mt-8 border-t border-white/10 pt-6">
          <h2 className="text-2xl font-semibold">Keep the evidence honest</h2>
          <p className="mt-3 leading-7 text-slate-300">The deployed test recorded a human-approved $755 simulated refund once, then rejected replay. The reference application keeps the payment effect in a sandbox so reviewers can inspect outcomes without moving money. The report identifies the precise builds, the trust boundary, and the tests still to run.</p>
        </section>
        <div className="mt-8 flex flex-wrap gap-5">
          <Link className={primary} href="/evidence">View the release evidence</Link>
          <a className="inline-flex min-h-11 items-center text-blue-300 underline" href="https://github.com/haisamar">Creator on GitHub</a>
        </div>
      </article>
    </SiteFrame>
  );
}
