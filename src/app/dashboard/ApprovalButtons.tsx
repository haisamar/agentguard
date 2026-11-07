import {
  approveApproval,
  denyApproval,
  cancelApproval,
} from "./actions";

export function ApprovalButtons({
  approvalId,
  approveBlocked,
  needsAuthentication,
}: {
  approvalId: string;
  approveBlocked?: string;
  needsAuthentication: boolean;
}) {
  return (
    <div>
      {approveBlocked ? <p className="mt-4 text-sm text-amber-200">{approveBlocked}{needsAuthentication ? <>{" "}<a className="underline" href="/auth/login?returnTo=%2Fdashboard&max_age=0">Re-authenticate with a passkey</a></> : null}</p> : <p className="mt-4 text-sm text-zinc-300">Approval authorizes this stored transaction. A separate execution step records the simulated receipt.</p>}
      <div className="mt-5 grid grid-cols-2 gap-3">
      <form action={denyApproval}>
        <input
          type="hidden"
          name="approval_id"
          value={approvalId}
        />

        <button
          type="submit"
          className="w-full rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
        >
          Deny
        </button>
      </form>

      <form action={approveApproval}>
        <input
          type="hidden"
          name="approval_id"
          value={approvalId}
        />

        <button
          type="submit"
          disabled={Boolean(approveBlocked)}
          className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-zinc-400"
        >
          Approve
        </button>
      </form>
      <form action={cancelApproval} className="col-span-2">
        <input type="hidden" name="approval_id" value={approvalId} />
        <button type="submit" className="w-full rounded-lg border border-white/20 px-4 py-2 text-sm text-zinc-300 focus-visible:outline-2">Cancel this request</button>
      </form>
      </div>
    </div>
  );
}
