import "server-only";

import {
  getApprovals,
  getAuditEvents,
} from "@/lib/agentguard-data";

export type PublicTraceStep = {
  number: string;
  label: string;
  title: string;
  description: string;
  tone:
    | "success"
    | "warning"
    | "danger"
    | "blue"
    | "violet"
    | "neutral";
};

export type PublicDemoCase = {
  key: "approved" | "denied" | "scope";
  tabLabel: string;
  title: string;
  subtitle: string;
  status: string;
  statusTone:
    | "success"
    | "warning"
    | "danger"
    | "blue"
    | "violet"
    | "neutral";

  action: string;
  amount?: number;
  resource?: string;

  steps: PublicTraceStep[];
};

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

type AuditEventRow = {
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

function identityName(identity: string | null) {
  if (!identity) return "Unknown";

  if (identity.startsWith("acWr66")) {
    return "Sales Agent";
  }

  if (identity.startsWith("46Pv6Y")) {
    return "Finance Agent";
  }

  if (identity.startsWith("URssw3")) {
    return "Admin Runtime";
  }

  if (identity.startsWith("human:")) {
    return "Human Administrator";
  }

  return "Protected Identity";
}

function actionName(action: string) {
  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

export async function getPublicDemoCases(): Promise<
  PublicDemoCase[]
> {
  const [approvals, auditEvents] = (await Promise.all([
    getApprovals(),
    getAuditEvents(),
  ])) as [ApprovalRow[], AuditEventRow[]];

  const cases: PublicDemoCase[] = [];

  const approved =
    approvals.find(
      (approval) =>
        approval.status === "EXECUTED" &&
        approval.reviewed_by?.startsWith("human:")
    ) ?? null;

  const denied =
    approvals.find(
      (approval) =>
        approval.status === "DENIED" &&
        approval.reviewed_by?.startsWith("human:")
    ) ?? null;

  const scopeBlocked =
    auditEvents.find(
      (event) =>
        event.decision === "DENY" &&
        event.metadata?.security_event ===
          "authorization_failure"
    ) ?? null;

  if (approved) {
    const amount = approved.payload?.amount;

    cases.push({
      key: "approved",
      tabLabel: "Human Approved",
      title: "Human Approved",
      subtitle:
        "A sensitive agent action passed least-privilege authorization, triggered policy escalation, and was approved by an authenticated human before execution.",
      status: "EXECUTED",
      statusTone: "success",

      action: actionName(approved.action),
      amount,
      resource: approved.payload?.account_id,

      steps: [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(approved.requesting_identity),
          description: "Authenticated machine identity",
          tone: "violet",
        },
        {
          number: "02",
          label: "Scope Check",
          title: requiredScope(approved.action),
          description: "OAuth permission verified",
          tone: "success",
        },
        {
          number: "03",
          label: "Contextual Policy",
          title: "Approval Required",
          description:
            amount !== undefined
              ? `Refund $${amount} exceeds the $500 autonomous limit`
              : "Sensitive action requires human approval",
          tone: "warning",
        },
        {
          number: "04",
          label: "Human Review",
          title: "Approved",
          description: "Authenticated administrator approved the action",
          tone: "blue",
        },
        {
          number: "05",
          label: "Execution",
          title: "Action Executed",
          description: "Approved action executed once",
          tone: "success",
        },
      ],
    });
  }

  if (denied) {
    const amount = denied.payload?.amount;

    cases.push({
      key: "denied",
      tabLabel: "Human Denied",
      title: "Human Denied",
      subtitle:
        "The agent was authorized to request the action, but human review denied it and execution remained blocked.",
      status: "DENIED",
      statusTone: "danger",

      action: actionName(denied.action),
      amount,
      resource: denied.payload?.account_id,

      steps: [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(denied.requesting_identity),
          description: "Authenticated machine identity",
          tone: "violet",
        },
        {
          number: "02",
          label: "Scope Check",
          title: requiredScope(denied.action),
          description: "OAuth permission verified",
          tone: "success",
        },
        {
          number: "03",
          label: "Contextual Policy",
          title: "Approval Required",
          description:
            amount !== undefined
              ? `Refund $${amount} exceeds the $500 autonomous limit`
              : "Sensitive action requires human approval",
          tone: "warning",
        },
        {
          number: "04",
          label: "Human Review",
          title: "Denied",
          description: "Authenticated administrator denied the request",
          tone: "danger",
        },
        {
          number: "05",
          label: "Execution",
          title: "Execution Blocked",
          description: "Denied action cannot be executed",
          tone: "danger",
        },
      ],
    });
  }

  if (scopeBlocked) {
    const grantedScopes = Array.isArray(
      scopeBlocked.metadata?.granted_scopes
    )
      ? scopeBlocked.metadata.granted_scopes.join(", ")
      : "Restricted permissions";

    const missingScopes = Array.isArray(
      scopeBlocked.metadata?.missing_scopes
    )
      ? scopeBlocked.metadata.missing_scopes.join(", ")
      : scopeBlocked.required_scope || "Required permission";

    cases.push({
      key: "scope",
      tabLabel: "Scope Blocked",
      title: "Scope Blocked",
      subtitle:
        "Least-privilege authorization stopped the agent before contextual policy or human review was reached.",
      status: "DENY",
      statusTone: "danger",

      action: actionName(scopeBlocked.action),

      steps: [
        {
          number: "01",
          label: "Agent Identity",
          title: identityName(scopeBlocked.identity),
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
          description: "Request never reached human escalation",
          tone: "neutral",
        },
        {
          number: "05",
          label: "Execution",
          title: "Execution Blocked",
          description: "Least-privilege authorization prevented the action",
          tone: "danger",
        },
      ],
    });
  }

  return cases;
}