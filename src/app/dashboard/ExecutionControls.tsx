import { cancelApproval, setExecutionPause } from "./actions";
import type { ExecutionControl } from "@/lib/agentguard-data";

export function ExecutionControls({ control, approved, recentAuthentication }: {
  control: ExecutionControl;
  approved: { id: string }[];
  recentAuthentication: boolean;
}) {
  const needsAuthentication = control.paused && !recentAuthentication;

  return (
    <section id="execution-controls" className="mt-8 scroll-mt-4 rounded-xl border border-white/10 p-5" aria-labelledby="execution-controls-heading">
      <h3 id="execution-controls-heading" className="text-lg font-semibold">Execution controls</h3>
      <p className="mt-2 text-sm text-zinc-300">Approval and resume require verified passkey or MFA authentication within five minutes. Signing in with a password alone does not authorize these actions.</p>
      <a className="mt-2 inline-block text-sm text-blue-300 underline focus-visible:outline-2" href="/auth/login?returnTo=%2Fdashboard&max_age=0">Re-authenticate with a passkey</a>
      <p className="mt-2 text-sm text-zinc-300">
        {control.paused ? "Refund execution is paused." : "Refund execution is enabled, subject to policy and approval."}
      </p>
      <p className="mt-2 text-xs text-zinc-400">Pausing blocks new simulated refund receipts, including approved refunds. It does not undo completed actions. Requests may still wait for review.</p>
      <form action={setExecutionPause} className="mt-4">
        <input type="hidden" name="paused" value={String(!control.paused)} />
        {needsAuthentication ? <p id="resume-authentication" className="mb-2 text-sm text-amber-200">Re-authenticate before resuming refund execution.</p> : null}
        <button type="submit" disabled={needsAuthentication} aria-describedby={needsAuthentication ? "resume-authentication" : undefined} className="rounded-lg border border-amber-500/40 px-4 py-2 text-sm text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 disabled:cursor-not-allowed disabled:border-white/10 disabled:text-zinc-400">
          {control.paused ? "Resume refund execution" : "Pause refund execution"}
        </button>
      </form>
      {approved.length > 0 && (
        <div className="mt-5">
          <h4 className="text-sm font-medium">Cancel a recently approved request</h4>
          <p className="mt-1 text-xs text-zinc-400">From the latest 50 requests. Cancellation succeeds only before execution.</p>
          <ul className="mt-3 space-y-2">
            {approved.map(({ id }) => (
              <li key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3">
                <span className="break-all font-mono text-xs">{id}</span>
                <form action={cancelApproval}>
                  <input type="hidden" name="approval_id" value={id} />
                  <button type="submit" className="rounded border border-red-500/30 px-3 py-2 text-sm text-red-300 focus-visible:outline-2">Cancel request {id}</button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
