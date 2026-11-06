import "server-only";
import { readSupabaseJson } from "./supabase-read";

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

const supabaseUrl = requireEnv("SUPABASE_URL");
const supabaseSecretKey = requireEnv(
  "SUPABASE_SECRET_KEY"
);

async function supabaseQuery(path: string) {
  return readSupabaseJson(`${supabaseUrl}/rest/v1/${path}`, supabaseSecretKey);
}

export async function getApprovals() {
  return supabaseQuery(
    "approvals?select=*&order=created_at.desc&limit=50"
  );
}

export async function getAuditEvents() {
  return supabaseQuery(
    "audit_events?select=*&order=created_at.desc&limit=100"
  );
}

export async function getPendingApprovals() {
  return supabaseQuery(
    "approvals?select=*&status=eq.PENDING&order=created_at.desc"
  );
}

export type RefundReceipt = {
  id: string;
  approval_id: string | null;
  identity: string;
  account_id: string;
  amount_minor: number;
  currency: string;
  simulated: boolean;
  created_at: string;
};

export async function getRefundReceipts(): Promise<RefundReceipt[]> {
  const [approved, autonomous] = await Promise.all([
    supabaseQuery("refund_receipts?select=id,approval_id,identity,account_id,amount_minor,currency,simulated,created_at&order=created_at.desc&limit=50"),
    supabaseQuery("autonomous_refund_receipts?select=id,identity,account_id,amount_minor,currency,simulated,created_at&order=created_at.desc&limit=50"),
  ]);
  return [...approved, ...autonomous.map((row: Omit<RefundReceipt, "approval_id">) => ({ ...row, approval_id: null }))]
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(0, 50);
}

export type AutonomousBudget = { limit_minor: number; spent_minor: number; remaining_minor: number; currency: string; window_hours: number; as_of: string };
export async function getAutonomousBudget(): Promise<AutonomousBudget> {
  return supabaseQuery("rpc/autonomous_budget_status");
}

export type ExecutionControl = { paused: boolean; updated_at: string };
export async function getExecutionControl(): Promise<ExecutionControl> {
  const rows = await supabaseQuery("execution_control?id=eq.1&select=paused,updated_at");
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0].paused !== "boolean") {
    throw new Error("Execution control is unavailable");
  }
  return rows[0];
}
