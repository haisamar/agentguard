"use client";

import { useMemo, useState } from "react";

import { identityName } from "@/lib/agent-identities";

export type TraceApproval = {
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

export type TraceAuditEvent = {
  id: string;
  identity: string;
  action: string;
  decision: string;
  required_scope: string | null;
  reason: string | null;
  approval_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type TraceKey = "approved" | "denied" | "scope";

type Tone =
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "violet"
  | "neutral";

type TraceStep = {
  number: string;
  label: string;
  title: string;
  description: string;
  tone: Tone;
};


function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatTime(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function requiredScope(action: string) {
  switch (action) {
    case "issue_refund":
      return "finance:refund";

    case "search_accounts":
      return "crm:read";

    case "export_customer_data":
      return "customer:export";

    default:
      return "authorized scope";
  }
}

export function TraceExplorer({
  approvedApproval,
  deniedApproval,
  scopeBlockedEvent,
}: {
  approvedApproval: TraceApproval | null;
  deniedApproval: TraceApproval | null;
  scopeBlockedEvent: TraceAuditEvent | null;
}) {
  const availableTabs = useMemo(() => {
    const tabs: TraceKey[] = [];

    if (approvedApproval) tabs.push("approved");
    if (deniedApproval) tabs.push("denied");
    if (scopeBlockedEvent) tabs.push("scope");

    return tabs;
  }, [approvedApproval, deniedApproval, scopeBlockedEvent]);

  const [selected, setSelected] = useState<TraceKey>(
    availableTabs[0] ?? "approved"
  );

  const scenario = useMemo(() => {
    if (selected === "approved" && approvedApproval) {
      const amount = approvedApproval.payload?.amount;
      const approvedReviewer =
        approvedApproval.reviewed_by ||
        approvedApproval.approved_by;

      const steps: TraceStep[] = [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(approvedApproval.requesting_identity),
          description: "Authenticated machine identity",
          tone: "violet",
        },
        {
          number: "02",
          label: "Scope Check",
          title: requiredScope(approvedApproval.action),
          description: "OAuth permission verified",
          tone: "success",
        },
        {
          number: "03",
          label: "Contextual Policy",
          title: "Approval Required",
          description:
            amount !== undefined
              ? `Refund $${amount} exceeds $500 autonomous limit`
              : approvedApproval.reason || "Sensitive action detected",
          tone: "warning",
        },
        {
          number: "04",
          label: "Human Review",
          title: "Approved",
          description: approvedReviewer
            ? `Reviewed by ${identityName(approvedReviewer)}`
            : "Human approval verified",
          tone: "blue",
        },
        {
          number: "05",
          label: "Execution",
          title: "Action Executed",
          description: approvedApproval.executed_at
            ? `Completed ${formatTime(approvedApproval.executed_at)}`
            : "Authorized action completed",
          tone: "success",
        },
      ];

      return {
        title: "Human Approved",
        subtitle:
          "Sensitive action cleared by an authenticated human before execution.",
        reference: approvedApproval.id,
        status: "EXECUTED",
        statusTone: "success" as Tone,
        action: formatAction(approvedApproval.action),
        amount,
        resource: approvedApproval.payload?.account_id,
        steps,
      };
    }

    if (selected === "denied" && deniedApproval) {
      const amount = deniedApproval.payload?.amount;
      const deniedReviewer =
        deniedApproval.reviewed_by ||
        deniedApproval.approved_by;

      const steps: TraceStep[] = [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(deniedApproval.requesting_identity),
          description: "Authenticated machine identity",
          tone: "violet",
        },
        {
          number: "02",
          label: "Scope Check",
          title: requiredScope(deniedApproval.action),
          description: "OAuth permission verified",
          tone: "success",
        },
        {
          number: "03",
          label: "Contextual Policy",
          title: "Approval Required",
          description:
            amount !== undefined
              ? `Refund $${amount} exceeds $500 autonomous limit`
              : deniedApproval.reason || "Sensitive action detected",
          tone: "warning",
        },
        {
          number: "04",
          label: "Human Review",
          title: "Denied",
          description: deniedReviewer
            ? `Reviewed by ${identityName(deniedReviewer)}`
            : "Human administrator denied request",
          tone: "danger",
        },
        {
          number: "05",
          label: "Execution",
          title: "Execution Blocked",
          description: "Agent cannot execute the denied action",
          tone: "danger",
        },
      ];

      return {
        title: "Human Denied",
        subtitle:
          "The agent had permission to request the action, but human review stopped execution.",
        reference: deniedApproval.id,
        status: "DENIED",
        statusTone: "danger" as Tone,
        action: formatAction(deniedApproval.action),
        amount,
        resource: deniedApproval.payload?.account_id,
        steps,
      };
    }

    if (scopeBlockedEvent) {
      const missingScopes = Array.isArray(
        scopeBlockedEvent.metadata?.missing_scopes
      )
        ? scopeBlockedEvent.metadata.missing_scopes.join(", ")
        : scopeBlockedEvent.required_scope || "Required scope missing";

      const grantedScopes = Array.isArray(
        scopeBlockedEvent.metadata?.granted_scopes
      )
        ? scopeBlockedEvent.metadata.granted_scopes.join(", ")
        : "Limited agent permissions";

      const steps: TraceStep[] = [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(scopeBlockedEvent.identity),
          description: "Authenticated machine identity",
          tone: "violet",
        },
        {
          number: "02",
          label: "Scope Check",
          title: `Missing ${missingScopes}`,
          description: `Granted: ${grantedScopes}`,
          tone: "danger",
        },
        {
          number: "03",
          label: "Contextual Policy",
          title: "Not Evaluated",
          description: "Authorization failed before policy execution",
          tone: "neutral",
        },
        {
          number: "04",
          label: "Human Review",
          title: "Not Required",
          description: "Request was blocked before human escalation",
          tone: "neutral",
        },
        {
          number: "05",
          label: "Execution",
          title: "Execution Blocked",
          description: "Least-privilege authorization prevented the action",
          tone: "danger",
        },
      ];

      return {
        title: "Scope Blocked",
        subtitle:
          "Least-privilege authorization stopped the agent before policy or human review.",
        reference: scopeBlockedEvent.id,
        status: "DENY",
        statusTone: "danger" as Tone,
        action: formatAction(scopeBlockedEvent.action),
        amount: undefined,
        resource: undefined,
        steps,
      };
    }

    return null;
  }, [selected, approvedApproval, deniedApproval, scopeBlockedEvent]);

  if (!scenario) {
    return (
      <section className="mt-12">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <p className="text-sm text-zinc-400">
            No trace scenarios available yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold">
            Authorization Trace Explorer
          </h3>

          <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
            Persisted Cases
          </span>
        </div>

        <p className="mt-1 text-sm text-zinc-400">
          Explore real AgentGuard authorization outcomes from the audit and
          approval records.
        </p>
      </div>

      {/* SCENARIO TABS */}

      <div className="mb-4 flex flex-wrap gap-2">
        {approvedApproval && (
          <TraceTab
            active={selected === "approved"}
            onClick={() => setSelected("approved")}
            label="Human Approved"
            tone="success"
          />
        )}

        {deniedApproval && (
          <TraceTab
            active={selected === "denied"}
            onClick={() => setSelected("denied")}
            label="Human Denied"
            tone="danger"
          />
        )}

        {scopeBlockedEvent && (
          <TraceTab
            active={selected === "scope"}
            onClick={() => setSelected("scope")}
            label="Scope Blocked"
            tone="violet"
          />
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        {/* SCENARIO HEADER */}

        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/[0.07] px-6 py-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h4 className="text-lg font-medium text-zinc-100">
                {scenario.title}
              </h4>

              <StatusBadge
                status={scenario.status}
                tone={scenario.statusTone}
              />
            </div>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              {scenario.subtitle}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-zinc-400">
              Trace Reference
            </p>

            <p className="mt-1 max-w-[290px] break-all font-mono text-xs leading-5 text-zinc-400">
              {scenario.reference}
            </p>
          </div>
        </div>

        {/* FLOW */}

        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {scenario.steps.map((step) => (
              <TraceStepCard
                key={step.number}
                {...step}
              />
            ))}
          </div>

          {/* CONTEXT */}

          <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-white/[0.06] pt-5">
            <ContextValue
              label="Action"
              value={scenario.action}
            />

            {scenario.amount !== undefined && (
              <ContextValue
                label="Amount"
                value={`$${scenario.amount}`}
              />
            )}

            {scenario.resource && (
              <ContextValue
                label="Resource"
                value={scenario.resource}
                mono
              />
            )}

            <div className="ml-auto text-xs text-zinc-400">
              Real persisted security outcome
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TraceTab({
  active,
  onClick,
  label,
  tone,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone: Tone;
}) {
  const activeStyles: Record<Tone, string> = {
    success:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    danger:
      "border-red-500/30 bg-red-500/10 text-red-400",
    violet:
      "border-violet-500/30 bg-violet-500/10 text-violet-400",
    warning:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",
    blue:
      "border-blue-500/30 bg-blue-500/10 text-blue-400",
    neutral:
      "border-white/15 bg-white/5 text-zinc-300",
  };

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-xs font-medium transition ${
        active
          ? activeStyles[tone]
          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

function TraceStepCard({
  number,
  label,
  title,
  description,
  tone,
}: TraceStep) {
  const styles: Record<
    Tone,
    {
      border: string;
      bg: string;
      number: string;
      dot: string;
    }
  > = {
    success: {
      border: "border-emerald-500/15",
      bg: "bg-emerald-500/[0.035]",
      number: "text-emerald-400",
      dot: "bg-emerald-400",
    },

    warning: {
      border: "border-amber-500/15",
      bg: "bg-amber-500/[0.035]",
      number: "text-amber-400",
      dot: "bg-amber-400",
    },

    danger: {
      border: "border-red-500/15",
      bg: "bg-red-500/[0.035]",
      number: "text-red-400",
      dot: "bg-red-400",
    },

    blue: {
      border: "border-blue-500/15",
      bg: "bg-blue-500/[0.035]",
      number: "text-blue-400",
      dot: "bg-blue-400",
    },

    violet: {
      border: "border-violet-500/15",
      bg: "bg-violet-500/[0.035]",
      number: "text-violet-400",
      dot: "bg-violet-400",
    },

    neutral: {
      border: "border-white/10",
      bg: "bg-white/[0.02]",
      number: "text-zinc-400",
      dot: "bg-zinc-600",
    },
  };

  const selected = styles[tone];

  return (
    <div
      className={`min-w-0 rounded-xl border p-4 ${selected.border} ${selected.bg}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[10px] font-semibold ${selected.number}`}
        >
          {number}
        </span>

        <span
          className={`h-1.5 w-1.5 rounded-full ${selected.dot}`}
        />
      </div>

      <p className="mt-5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-zinc-200">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function ContextValue({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <>
      <span className="text-xs text-zinc-400">
        {label}
      </span>

      <span
        className={`rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs text-zinc-300 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </>
  );
}

function StatusBadge({
  status,
  tone,
}: {
  status: string;
  tone: Tone;
}) {
  const styles: Record<Tone, string> = {
    success:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",

    danger:
      "border-red-500/20 bg-red-500/10 text-red-400",

    warning:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",

    blue:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",

    violet:
      "border-violet-500/20 bg-violet-500/10 text-violet-400",

    neutral:
      "border-white/10 bg-white/[0.03] text-zinc-400",
  };

  return (
    <span
      className={`rounded-md border px-2 py-1 text-[10px] font-semibold ${styles[tone]}`}
    >
      {status}
    </span>
  );
}
