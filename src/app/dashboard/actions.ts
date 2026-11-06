"use server";

import { requireHumanAdmin, requireSensitiveAdmin } from "@/lib/admin-access";
import { revalidatePath } from "next/cache";

async function review(formData: FormData, decision: "APPROVED" | "DENIED") {
  const user = await (decision === "APPROVED" ? requireSensitiveAdmin() : requireHumanAdmin());
  const approvalId = String(formData.get("approval_id") ?? "");
  if (!/^apr_[a-zA-Z0-9_-]{1,100}$/.test(approvalId)) throw new Error("Invalid approval ID");
  if (!user.sub) throw new Error("Verified administrator identity is missing");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing");
  const response = await fetch(`${url}/rest/v1/rpc/review_approval`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({
      p_approval_id: approvalId,
      p_reviewer: `human:${user.sub}`,
      p_decision: decision,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Review could not be recorded. Refresh and try again.");
  const result = await response.json();
  if (result?.ok !== true) throw new Error("Request has expired, is no longer pending, or does not exist.");
  revalidatePath("/dashboard");
}

export async function approveApproval(formData: FormData) {
  await review(formData, "APPROVED");
}

export async function denyApproval(formData: FormData) {
  await review(formData, "DENIED");
}

async function controlOperation(name: "cancel_approval" | "set_execution_pause", args: Record<string, string | boolean>) {
  const user = await (name === "set_execution_pause" && args.p_paused === false ? requireSensitiveAdmin() : requireHumanAdmin());
  if (!user.sub) throw new Error("Verified administrator identity is missing");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing");
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ ...args, p_reviewer: `human:${user.sub}` }),
    cache: "no-store",
  });
  if (!response.ok || (await response.json())?.ok !== true) {
    throw new Error("Operation could not be completed. Refresh to check the current state.");
  }
  revalidatePath("/dashboard");
}

export async function cancelApproval(formData: FormData) {
  const id = String(formData.get("approval_id") ?? "");
  if (!/^apr_[a-zA-Z0-9_-]{1,100}$/.test(id)) throw new Error("Invalid approval ID");
  await controlOperation("cancel_approval", { p_approval_id: id });
}

export async function setExecutionPause(formData: FormData) {
  const value = formData.get("paused");
  if (value !== "true" && value !== "false") throw new Error("Invalid execution state");
  await controlOperation("set_execution_pause", { p_paused: value === "true" });
}
