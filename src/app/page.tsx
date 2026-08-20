import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08090b] text-white">
      {/* NAV */}

      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:block"
            >
              Security Demo
            </Link>

            <a
              href="/auth/login?returnTo=/dashboard"
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Admin Login
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="relative">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[140px]" />

        <div className="relative mx-auto max-w-[1450px] px-6 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-36">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Identity-aware AI authorization
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-[-0.04em] md:text-6xl lg:text-7xl">
              AI agents need identities,
              <span className="text-zinc-500">
                {" "}permissions and boundaries.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-base leading-8 text-zinc-500 md:text-lg">
              AgentGuard protects AI agents with distinct machine identities,
              least-privilege OAuth scopes, contextual authorization,
              authenticated human approval, and a complete security audit
              trail.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Explore Security Demo
              </Link>

              <a
                href="/auth/login?returnTo=/dashboard"
                className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06]"
              >
                Administrator Login
              </a>
            </div>
          </div>

          {/* PRODUCT MODEL */}

          <div className="mt-24 overflow-hidden rounded-3xl border border-white/10 bg-[#0c0e11] p-5 shadow-2xl md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                  AgentGuard Control Plane
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Identity → authorization → policy → human control → audit
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Protection Active
              </div>
            </div>

            <div className="grid gap-3 pt-6 md:grid-cols-5">
              <ProductStep
                number="01"
                label="Identity"
                title="Finance Agent"
                tone="violet"
              />

              <ProductStep
                number="02"
                label="OAuth Scope"
                title="finance:refund"
                tone="success"
              />

              <ProductStep
                number="03"
                label="Policy"
                title="Refund > $500"
                tone="warning"
              />

              <ProductStep
                number="04"
                label="Human Review"
                title="Approval Required"
                tone="blue"
              />

              <ProductStep
                number="05"
                label="Execution"
                title="Controlled"
                tone="success"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1450px] px-6 py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
              Security Model
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Agent autonomy without unlimited authority.
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-500">
              Authentication alone is not enough. AgentGuard combines
              identity, authorization, contextual policy and human control
              before sensitive tools can execute.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ValueCard
              title="Distinct identities"
              description="Agents operate as separate machine identities instead of sharing broad credentials."
            />

            <ValueCard
              title="Least privilege"
              description="OAuth scopes determine which tools each agent can reach before application policy even runs."
            />

            <ValueCard
              title="Human-in-the-loop"
              description="High-risk actions can pause and require an authenticated human decision before execution."
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[1450px] px-6 py-24 lg:px-10">
          <div className="flex flex-col justify-between gap-8 rounded-3xl border border-white/10 bg-white/[0.025] p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="text-2xl font-semibold">
                Explore the authorization lifecycle.
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                View approved, denied, and least-privilege blocked security
                scenarios without needing administrator access.
              </p>
            </div>

            <Link
              href="/demo"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Open Interactive Demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1450px] flex-wrap justify-between gap-4 px-6 py-7 text-xs text-zinc-700 lg:px-10">
          <span>
            AgentGuard · Identity Security for AI Agents
          </span>

          <span>
            Auth0 · OAuth · MCP · Next.js · Python · Supabase
          </span>
        </div>
      </footer>
    </main>
  );
}

function ProductStep({
  number,
  label,
  title,
  tone,
}: {
  number: string;
  label: string;
  title: string;
  tone:
    | "success"
    | "warning"
    | "blue"
    | "violet";
}) {
  const styles = {
    success:
      "border-emerald-500/15 bg-emerald-500/[0.035] text-emerald-400",
    warning:
      "border-amber-500/15 bg-amber-500/[0.035] text-amber-400",
    blue:
      "border-blue-500/15 bg-blue-500/[0.035] text-blue-400",
    violet:
      "border-violet-500/15 bg-violet-500/[0.035] text-violet-400",
  };

  return (
    <div
      className={`rounded-xl border p-5 ${styles[tone]}`}
    >
      <span className="font-mono text-[10px]">
        {number}
      </span>

      <p className="mt-6 text-[10px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-200">
        {title}
      </p>
    </div>
  );
}

function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <h3 className="font-medium text-zinc-200">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        {description}
      </p>
    </div>
  );
}