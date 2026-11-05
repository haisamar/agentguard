"use server";

import { auth0 } from "@/lib/auth0";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const adminEmail = process.env.AGENTGUARD_ADMIN_EMAIL;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error("Supabase server configuration is missing");
}

async function requireHumanAdmin() {
  const session = await auth0.getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  if (!session.user.email) {
    throw new Error("Authenticated user has no email");
  }

  if (
    !adminEmail ||
    session.user.email.toLowerCase() !== adminEmail.toLowerCase()
  ) {
    throw new Error("Forbidden: administrator access required");
  }

  return session.user;
}

async function writeAuditEvent(event: {
  identity: string;
  action: string;
  decision: string;
  reason: string;
  approval_id: string;
  metadata: Record<string, unknown>;
}) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/audit_events`,
    {
      method: "POST",
      headers: {
        apikey: supabaseSecretKey!,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(event),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to write audit event: ${await response.text()}`
    );
  }
}

export async function approveApproval(formData: FormData) {
  const user = await requireHumanAdmin();

  const approvalId = String(
    formData.get("approval_id") ?? ""
  );

  if (!approvalId.startsWith("apr_")) {
    throw new Error("Invalid approval ID");
  }

  const humanIdentity = `human:${user.sub}`;
  const reviewedAt = new Date().toISOString();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/approvals?id=eq.${encodeURIComponent(
      approvalId
    )}&status=eq.PENDING&created_at=gt.${encodeURIComponent(new Date(Date.now() - 60 * 60 * 1000).toISOString())}`,
    {
      method: "PATCH",
      headers: {
        apikey: supabaseSecretKey!,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "APPROVED",

        reviewed_by: humanIdentity,
        reviewed_at: reviewedAt,

        approved_by: humanIdentity,
        approved_at: reviewedAt,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to approve action: ${await response.text()}`
    );
  }

  const updated = await response.json();

  if (!Array.isArray(updated) || updated.length === 0) {
    throw new Error(
      "Approval has expired, is no longer pending, or does not exist"
    );
  }

  await writeAuditEvent({
    identity: humanIdentity,
    action: "approve_action",
    decision: "APPROVED",
    reason: "Human administrator approved the requested action.",
    approval_id: approvalId,
    metadata: {
      source: "agentguard_dashboard",
      actor_type: "human",
      admin_email: user.email,
      admin_name: user.name ?? null,
    },
  });

  revalidatePath("/dashboard");
}

export async function denyApproval(formData: FormData) {
  const user = await requireHumanAdmin();

  const approvalId = String(
    formData.get("approval_id") ?? ""
  );

  if (!approvalId.startsWith("apr_")) {
    throw new Error("Invalid approval ID");
  }

  const humanIdentity = `human:${user.sub}`;
  const reviewedAt = new Date().toISOString();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/approvals?id=eq.${encodeURIComponent(
      approvalId
    )}&status=eq.PENDING`,
    {
      method: "PATCH",
      headers: {
        apikey: supabaseSecretKey!,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "DENIED",

        reviewed_by: humanIdentity,
        reviewed_at: reviewedAt,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to deny action: ${await response.text()}`
    );
  }

  const updated = await response.json();

  if (!Array.isArray(updated) || updated.length === 0) {
    throw new Error(
      "Approval is no longer pending or does not exist"
    );
  }

  await writeAuditEvent({
    identity: humanIdentity,
    action: "deny_action",
    decision: "DENY",
    reason: "Human administrator denied the requested action.",
    approval_id: approvalId,
    metadata: {
      source: "agentguard_dashboard",
      actor_type: "human",
      admin_email: user.email,
      admin_name: user.name ?? null,
    },
  });

  revalidatePath("/dashboard");
}