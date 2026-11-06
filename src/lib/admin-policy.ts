export const PASSKEY_ASSURANCE_CLAIM = "https://agentguard-eight.vercel.app/passkey_assurance";
type AdminClaims = { sub?: unknown; email?: unknown; email_verified?: unknown; amr?: unknown; auth_time?: unknown; [key: string]: unknown };

export function isHumanAdmin(user: AdminClaims | null | undefined, email: string | undefined, subject: string | undefined): boolean {
  return !!user && !!email?.trim() && !!subject?.trim()
    && typeof user.email === "string" && user.email_verified === true
    && user.email.toLowerCase() === email.trim().toLowerCase()
    && typeof user.sub === "string" && user.sub === subject.trim();
}

export function hasFreshMfa(user: AdminClaims, nowSeconds = Date.now() / 1000): boolean {
  return Array.isArray(user.amr) && user.amr.includes("mfa")
    && typeof user.auth_time === "number" && Number.isFinite(user.auth_time)
    && user.auth_time <= nowSeconds && nowSeconds - user.auth_time <= 300;
}

export function hasFreshSensitiveAuthentication(user: AdminClaims, nowSeconds = Date.now() / 1000): boolean {
  if (hasFreshMfa(user, nowSeconds)) return true;
  const assurance = user[PASSKEY_ASSURANCE_CLAIM];
  if (!assurance || typeof assurance !== "object" || Array.isArray(assurance)) return false;
  const { method, authenticated_at: time } = assurance as Record<string, unknown>;
  return method === "passkey" && typeof time === "number" && Number.isFinite(time)
    && time > 0 && time <= nowSeconds && nowSeconds - time <= 300;
}
