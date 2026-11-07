import Link from "next/link";

export const primary = "inline-flex min-h-11 items-center rounded-xl bg-emerald-300 px-5 py-2.5 font-semibold text-[#071411] hover:bg-emerald-200";
export const secondary = "inline-flex min-h-11 items-center rounded-xl border border-white/20 px-5 py-2.5 font-semibold text-white hover:bg-white/10";
export const eyebrow = "text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300";
const container = "mx-auto w-full max-w-6xl px-5 sm:px-8";
const links = [["Demo", "/demo"], ["Evidence", "/evidence"], ["Case study", "/about"]] as const;

export function SiteFrame({ children, current }: { children: React.ReactNode; current: string }) {
  return (
    <div className="min-h-screen bg-[#080e13] text-slate-100">
      <a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-slate-900 focus:p-3" href="#content">Skip to content</a>
      <header className="border-b border-white/10">
        <div className={container + " flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3"}>
          <Link href="/" aria-current={current === "/" ? "page" : undefined} className="flex min-h-11 items-center gap-3 font-semibold">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg border border-emerald-300/35 bg-emerald-300/10 text-xs text-emerald-300">AG</span>
            AgentGuard
          </Link>
          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:gap-x-6">
            {links.map(([label, href]) => (
              <Link key={href} href={href} aria-current={current === href ? "page" : undefined} className="flex min-h-11 items-center text-slate-300 hover:text-white aria-[current=page]:text-emerald-300">{label}</Link>
            ))}
            <a href="/dashboard" className="flex min-h-11 items-center text-slate-300 hover:text-white">Admin</a>
          </nav>
        </div>
      </header>
      <main id="content" tabIndex={-1} className={container}>{children}</main>
      <footer className="mt-20 border-t border-white/10">
        <div className={container + " flex flex-wrap justify-between gap-4 py-7 text-sm text-slate-400"}>
          <p>AgentGuard · A simulated refund reference application</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a className="underline underline-offset-4" href="https://github.com/haisamar">By Haisam Arshad</a>
            <a className="underline underline-offset-4" href="https://github.com/haisamar/agentguard-mcp">Backend source</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
