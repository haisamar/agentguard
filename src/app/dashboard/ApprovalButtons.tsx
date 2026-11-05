import {
  approveApproval,
  denyApproval,
} from "./actions";

export function ApprovalButtons({
  approvalId,
}: {
  approvalId: string;
}) {
  return (
    <div>
      <p className="mt-4 text-xs text-zinc-500">Approval is valid for one hour from the request time. Expired requests must be submitted again.</p>
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
          className="w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/15"
        >
          Approve
        </button>
      </form>
      </div>
    </div>
  );
}