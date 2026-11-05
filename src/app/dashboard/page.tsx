import {
  getApprovals,
  getAuditEvents,
  getPendingApprovals,
  getRefundReceipts,
  getAutonomousBudget,
  type AutonomousBudget,
  type RefundReceipt,
} from "@/lib/agentguard-data";

import { requireHumanAdmin } from "@/lib/admin-access";
import {
  identityName,
  identityType,
} from "@/lib/agent-identities";
import { ApprovalButtons } from "./ApprovalButtons";
import {
  SecurityActivity,
  type SecurityAuditEvent,
} from "./SecurityActivity";
import {
  TraceExplorer,
  type TraceApproval,
} from "./TraceExplorer";

export const dynamic = "force-dynamic";

type ApprovalRow = {
  id: string;
  requesting_identity: string;
  action: string;
  payload: {
    amount?: number;
    account_id?: string;
    reason?: string;
  };
  reason: string | null;
  status: string;

  reviewed_by: string | null;
  reviewed_at: string | null;

  approved_by: string | null;
  approved_at: string | null;

  created_at: string;
  executed_at: string | null;
};

const AGENTS = [
  {
    name: "Sales Agent",
    role: "Revenue Operations",
    scopes: ["crm:read", "crm:write", "support:read"],
    status: "Active",
  },
  {
    name: "Finance Agent",
    role: "Finance Operations",
    scopes: ["crm:read", "finance:read", "finance:refund"],
    status: "Active",
  },
  {
    name: "Admin Runtime",
    role: "Security Administrator",
    scopes: ["agent:manage"],
    status: "Active",
  },
];


function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(value: string | null) {
  if (!value) {
    return "â€”";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusStyles(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-500/20 bg-amber-500/10 text-amber-400";

    case "APPROVED":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "EXECUTED":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";

    case "DENIED":
      return "border-red-500/20 bg-red-500/10 text-red-400";

    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-400";
  }
}

function identityTypeStyles(type: string) {
  switch (type) {
    case "Human":
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";

    case "Machine":
      return "border-violet-500/20 bg-violet-500/10 text-violet-400";

    case "System":
      return "border-zinc-500/20 bg-zinc-500/10 text-zinc-400";

    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-400";
  }
}

function approvalReviewer(
  approval: ApprovalRow
) {
  return (
    approval.reviewed_by ||
    approval.approved_by ||
    null
  );
}


function approvalReviewTime(
  approval: ApprovalRow
) {
  return (
    approval.reviewed_at ||
    approval.approved_at ||
    null
  );
}

export default async function DashboardPage() {
  const humanAdmin = await requireHumanAdmin();

  const [approvals, auditEvents, pendingApprovals, receipts, budget] = (await Promise.all([
    getApprovals(),
    getAuditEvents(),
    getPendingApprovals(),
    getRefundReceipts(),
    getAutonomousBudget(),
  ])) as [
    ApprovalRow[],
    SecurityAuditEvent[],
    ApprovalRow[],
    RefundReceipt[],
    AutonomousBudget,
  ];

  const deniedEvents = auditEvents.filter(
    (event) => event.decision === "DENY"
  );

  const humanApprovedApproval =
    approvals.find(
      (approval) =>
        approval.status === "EXECUTED" &&
        identityType(
          approvalReviewer(
            approval
          )
        ) === "Human"
    ) ?? null;


  const humanDeniedApproval =
    approvals.find(
      (approval) =>
        approval.status === "DENIED" &&
        identityType(
          approvalReviewer(
            approval
          )
        ) === "Human"
    ) ?? null;

  const scopeBlockedEvent =
    auditEvents.find(
      (event) =>
        event.decision === "DENY" &&
        event.metadata?.security_event ===
          "authorization_failure"
    ) ?? null;

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* HEADER */}

        <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/10 pb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">
              AG
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                AgentGuard
              </h1>

              <p className="text-sm text-zinc-500">
                Identity Security for AI Agents
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-200">
                {humanAdmin?.name ||
                  humanAdmin?.email ||
                  "Authenticated Admin"}
              </p>

              <p className="text-xs text-zinc-600">
                Human Administrator
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Protection Active
            </div>

            <a
              href="/auth/logout"
              className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              Sign out
            </a>
          </div>
        </header>

        {/* INTRO */}

        <section className="mt-10">
          <p className="text-sm font-medium text-blue-400">
            SECURITY OVERVIEW
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Agent activity and authorization
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Monitor AI identities, permission decisions, sensitive actions,
            human approvals, and security events across connected tools.
          </p>
        </section>

        {/* METRICS */}

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Active Agents"
            value={AGENTS.length}
            description="Protected identities"
          />

          <MetricCard
            label="Pending Approvals"
            value={pendingApprovals.length}
            description="Waiting for review"
          />

          <MetricCard
            label="Security Events"
            value={auditEvents.length}
            description="Recorded decisions"
          />

          <MetricCard
            label="Blocked Actions"
            value={deniedEvents.length}
            description="Prevented before execution"
          />
        </section>

        {/* MACHINE IDENTITIES */}

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">
                  Machine Identities
                </h3>

                <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-violet-400">
                  AI / M2M
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Least-privilege OAuth permissions assigned to autonomous
                runtimes.
              </p>
            </div>

            <span className="text-sm text-zinc-600">
              {AGENTS.length} identities
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold">
                      {agent.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="font-medium">
                        {agent.name}
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {agent.role}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 text-xs text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {agent.status}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                    Granted scopes
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {agent.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="rounded-md border border-white/10 bg-white/[0.035] px-2.5 py-1 text-xs text-zinc-400"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HUMAN OPERATOR */}

        <section className="mt-8">
          <div className="mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">
                Human Operator
              </h3>

              <span className="rounded-md border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-blue-400">
                Auth0 User
              </span>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Authenticated human identity responsible for reviewing
              sensitive agent actions.
            </p>
          </div>

          <div className="max-w-3xl rounded-2xl border border-blue-500/15 bg-blue-500/[0.025] p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-semibold text-blue-400">
                  HU
                </div>

                <div>
                  <p className="font-medium">
                    {humanAdmin?.name ||
                      humanAdmin?.email ||
                      "Human Administrator"}
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    Human Administrator
                  </p>
                </div>
              </div>

              <span className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Authenticated
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  Identity Provider
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  Auth0
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                  Responsibility
                </p>

                <p className="mt-1 text-sm text-zinc-300">
                  Approval Authority
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TRACE EXPLORER */}

        <TraceExplorer
          approvedApproval={
            humanApprovedApproval as TraceApproval | null
          }
          deniedApproval={
            humanDeniedApproval as TraceApproval | null
          }
          scopeBlockedEvent={scopeBlockedEvent}
        />

        {/* PENDING + SECURITY ACTIVITY */}

        <section className="mt-12 grid items-start gap-6 xl:grid-cols-[0.9fr_1.4fr]">
          {/* PENDING APPROVALS */}

          <div>
            <div className="mb-5">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold">
                  Pending Approvals
                </h3>

                <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/[0.07] px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Live Review Queue
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Sensitive actions requiring human review.
              </p>
            </div>

            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    âœ“
                  </div>

                  <p className="mt-4 text-sm text-zinc-300">
                    No pending approvals
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    All sensitive actions have been reviewed.
                  </p>
                </div>
              ) : (
                pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.035] p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-400">
                          APPROVAL REQUIRED
                        </span>

                        <h4 className="mt-4 font-medium">
                          {formatAction(approval.action)}
                        </h4>

                        <p className="mt-1 text-sm text-zinc-500">
                          Requested by{" "}
                          <span className="text-zinc-300">
                            {identityName(
                              approval.requesting_identity
                            )}
                          </span>
                        </p>
                      </div>

                      {approval.payload?.amount !== undefined && (
                        <div className="text-right">
                          <p className="text-xl font-semibold">
                            ${approval.payload.amount}
                          </p>

                          <p className="text-xs text-zinc-600">
                            Refund
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 rounded-xl border border-white/5 bg-black/20 p-3">
                      <p className="text-xs text-zinc-500">
                        {approval.reason}
                      </p>
                    </div>

                    <ApprovalButtons approvalId={approval.id} />

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-xs text-zinc-600">
                        {approval.id}
                      </span>

                      <span className="text-xs text-zinc-600">
                        {formatTime(approval.created_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* SECURITY ACTIVITY */}

          <SecurityActivity
            events={auditEvents.slice(0, 10)}
            totalCount={auditEvents.length}
          />
        </section>

        {/* APPROVAL HISTORY */}

        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                Approval History
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Full lifecycle of sensitive actions reviewed by AgentGuard.
              </p>
            </div>

            <span className="text-sm text-zinc-600">
              {approvals.length} total
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.02] text-[11px] uppercase tracking-wider text-zinc-600">
                    <th className="px-5 py-4 font-medium">
                      Approval
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Requested By
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Action
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Reviewed By
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Created
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Executed
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {approvals.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-12 text-center text-sm text-zinc-600"
                      >
                        No approval history yet.
                      </td>
                    </tr>
                  ) : (
                    approvals.slice(0, 20).map((approval) => (
                      <tr
                        key={approval.id}
                        className="border-b border-white/[0.05] transition last:border-b-0 hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-xs text-zinc-500">
                            {approval.id}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <div>
                            <p className="text-sm text-zinc-300">
                              {identityName(
                                approval.requesting_identity
                              )}
                            </p>

                            <span className="mt-1 inline-flex rounded border border-violet-500/20 bg-violet-500/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-violet-400">
                              Machine
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <p className="text-sm text-zinc-300">
                            {formatAction(approval.action)}
                          </p>

                          {approval.payload?.account_id && (
                            <p className="mt-1 font-mono text-[11px] text-zinc-600">
                              {approval.payload.account_id}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <span className="text-sm font-medium text-zinc-300">
                            {approval.payload?.amount !== undefined
                              ? `$${approval.payload.amount}`
                              : "â€”"}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${statusStyles(
                              approval.status
                            )}`}
                          >
                            {approval.status}
                          </span>
                        </td>

                        <td className="px-5 py-3.5">
                          {approvalReviewer(approval) ? (
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm text-zinc-400">
                                  {identityName(
                                    approvalReviewer(approval)
                                  )}
                                </p>

                                <span
                                  className={`rounded border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide ${identityTypeStyles(
                                    identityType(
                                      approvalReviewer(approval)
                                    )
                                  )}`}
                                >
                                  {identityType(
                                    approvalReviewer(approval)
                                  )}
                                </span>
                              </div>

                              {approvalReviewTime(approval) && (
                                <p className="mt-1 text-[11px] text-zinc-600">
                                  {formatTime(
                                    approvalReviewTime(approval)
                                  )}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-zinc-600">
                              â€”
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-xs text-zinc-500">
                          {formatTime(approval.created_at)}
                        </td>

                        <td className="px-5 py-4 text-xs text-zinc-500">
                          {formatTime(approval.executed_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="receipt-heading">
          <h3 id="receipt-heading" className="text-lg font-semibold">Sandbox refund receipts</h3>
          <p className="mt-2 text-sm text-zinc-400">Persisted ledger entries for simulated refunds. No real money is transferred. Human-reviewed and autonomous refunds are shown separately below.</p>
          <div className="mt-5 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
            <h4 className="font-medium">Shared autonomous refund budget</h4>
            <p className="mt-2 text-sm text-zinc-300">${(budget.spent_minor / 100).toFixed(2)} used · ${(budget.remaining_minor / 100).toFixed(2)} remaining of ${(budget.limit_minor / 100).toFixed(2)} USD</p>
            <p className="mt-2 text-xs text-zinc-500">Rolling {budget.window_hours} hours across all agents and accounts. Requests exceeding the remaining budget require human approval. Human-reviewed refunds use a separate authorization path.</p>
            <p className="mt-2 text-xs text-zinc-500">Snapshot: {formatTime(budget.as_of)}. Refresh to update; execution rechecks the budget atomically.</p>
          </div>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[850px] text-left text-sm">
              <caption className="sr-only">Latest 50 sandbox refund receipts</caption>
              <thead className="bg-white/5 text-zinc-400">
                <tr>{["Receipt / approval", "Account", "Amount", "Execution identity", "Recorded"].map(label => <th key={label} scope="col" className="px-5 py-4 font-medium">{label}</th>)}</tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? <tr><td colSpan={5} className="px-5 py-8 text-zinc-500">No sandbox receipts recorded yet.</td></tr> : receipts.map(receipt => (
                  <tr key={receipt.id} className="border-t border-white/5">
                    <td className="px-5 py-4"><p className="font-mono text-xs">{receipt.id}</p><p className="mt-1 font-mono text-xs text-zinc-500">{receipt.approval_id ?? "Autonomous · rolling budget"}</p><p className="mt-1 text-xs text-blue-400">{receipt.simulated ? "SIMULATED" : "Review receipt type"}</p></td>
                    <td className="px-5 py-4 font-mono text-xs">{receipt.account_id}</td>
                    <td className="px-5 py-4">{new Intl.NumberFormat("en-US", { style: "currency", currency: receipt.currency }).format(receipt.amount_minor / 100)} {receipt.currency}</td>
                    <td className="px-5 py-4 text-zinc-400">{identityName(receipt.identity)}</td>
                    <td className="px-5 py-4 text-zinc-400">{formatTime(receipt.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="mt-14 border-t border-white/10 py-6 text-xs text-zinc-700">
          AgentGuard Â· Auth0 identity controls Â· MCP authorization Â·
          contextual policy Â· human approval Â· immutable audit
        </footer>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-600">
        {description}
      </p>
    </div>
  );
}