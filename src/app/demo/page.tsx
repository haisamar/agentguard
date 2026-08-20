import Link from "next/link";

import { getPublicDemoCases } from "@/lib/public-demo-data";
import { PublicTraceExplorer } from "./PublicTraceExplorer";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const cases = await getPublicDemoCases();

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* NAV */}

      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">
              AG
            </div>

            <div>
              <p className="font-semibold">
                AgentGuard
              </p>

              <p className="text-xs text-zinc-600">
                Identity Security for AI Agents
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-600 sm:inline">
              Public read-only environment
            </span>

            <a
              href="/auth/login?returnTo=/dashboard"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Administrator Login
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="mx-auto max-w-[1450px] px-6 pb-10 pt-16 lg:px-10 lg:pt-24">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
              Interactive Security Demo
            </span>

            <span className="text-xs text-zinc-600">
              No login required
            </span>
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            See how AgentGuard controls
            <span className="text-zinc-500">
              {" "}what AI agents are allowed to do.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-500 md:text-lg">
            AgentGuard gives autonomous agents distinct identities,
            enforces least-privilege OAuth scopes, applies contextual
            policy, and requires authenticated human approval before
            sensitive actions can execute.
          </p>
        </div>
      </section>

      {/* ARCHITECTURE */}

      <section className="mx-auto max-w-[1450px] px-6 py-10 lg:px-10">
        <div className="grid gap-3 md:grid-cols-5">
          <ArchitectureStep
            number="01"
            title="Machine Identity"
            description="Each AI runtime receives its own identity."
          />

          <ArchitectureStep
            number="02"
            title="OAuth Authorization"
            description="Scopes enforce least-privilege access."
          />

          <ArchitectureStep
            number="03"
            title="Contextual Policy"
            description="Risk is evaluated using action context."
          />

          <ArchitectureStep
            number="04"
            title="Human Approval"
            description="Sensitive actions can require a real person."
          />

          <ArchitectureStep
            number="05"
            title="Audit + Execution"
            description="Every decision is persisted and traceable."
          />
        </div>
      </section>

      {/* DEMO */}

      <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">
        <div className="mb-7">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
            Security Scenarios
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Explore real authorization outcomes
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            These read-only traces are derived from persisted AgentGuard
            approval and audit records, with private identity details removed
            before they reach the browser.
          </p>
        </div>

        <PublicTraceExplorer cases={cases} />
      </section>

      {/* SECURITY MODEL */}

      <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">
        <div className="grid gap-5 lg:grid-cols-3">
          <FeatureCard
            eyebrow="IDENTITY"
            title="Every agent is accountable"
            description="Sales, finance, and administrative runtimes use distinct machine identities instead of sharing one privileged credential."
          />

          <FeatureCard
            eyebrow="AUTHORIZATION"
            title="Permission before automation"
            description="An agent cannot reach a protected MCP action unless its OAuth identity includes the required scope."
          />

          <FeatureCard
            eyebrow="HUMAN CONTROL"
            title="Autonomy has boundaries"
            description="Contextual rules can pause execution and require a separately authenticated human before the agent continues."
          />
        </div>
      </section>

      {/* TECH */}

      <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
            Built With
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              "Auth0",
              "OAuth 2.0",
              "MCP",
              "Next.js",
              "Python",
              "Supabase",
              "Contextual Policy",
              "Human-in-the-loop",
            ].map((item) => (
              <span
                key={item}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-[1450px] px-6 pb-24 pt-12 lg:px-10">
        <div className="rounded-3xl border border-blue-500/15 bg-blue-500/[0.035] px-7 py-10 md:px-10">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold">
                The admin console is separately protected.
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                Human approval controls, raw audit context, and protected
                identities remain behind Auth0 authentication.
              </p>
            </div>

            <a
              href="/auth/login?returnTo=/dashboard"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Administrator Login
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1450px] flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-zinc-700 lg:px-10">
          <span>
            AgentGuard · Identity Security for AI Agents
          </span>

          <span>
            Auth0 · MCP · OAuth · Human Approval
          </span>
        </div>
      </footer>
    </main>
  );
}

function ArchitectureStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <span className="font-mono text-xs text-blue-400">
        {number}
      </span>

      <h3 className="mt-5 font-medium text-zinc-200">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-[10px] font-medium tracking-[0.18em] text-blue-400">
        {eyebrow}
      </p>

      <h3 className="mt-4 text-lg font-medium">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}