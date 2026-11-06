import "server-only";
import { auth0 } from "./auth0";
import { hasFreshSensitiveAuthentication, isHumanAdmin } from "./admin-policy";

export async function requireHumanAdmin() {
  const session = await auth0.getSession();
  const user = session?.user;
  if (!user) throw new Error("Unauthorized");
  if (!isHumanAdmin(user, process.env.AGENTGUARD_ADMIN_EMAIL, process.env.AGENTGUARD_ADMIN_SUB)) {
    throw new Error("Forbidden: verified administrator access required");
  }
  return user;
}

export async function requireSensitiveAdmin() {
  const user = await requireHumanAdmin();
  if (!hasFreshSensitiveAuthentication(user)) throw new Error("Recent passkey or MFA authentication is required. Re-authenticate from the dashboard before approving or resuming execution.");
  return user;
}
