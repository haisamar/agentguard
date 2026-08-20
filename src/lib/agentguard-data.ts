import "server-only";

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
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${path}`,
    {
      headers: {
        apikey: supabaseSecretKey,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Supabase request failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
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