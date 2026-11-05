import "server-only";
import { auth0 } from "./auth0";

export async function requireHumanAdmin() {
  const session = await auth0.getSession();
  const user = session?.user;
  const allowedEmail = process.env.AGENTGUARD_ADMIN_EMAIL?.trim().toLowerCase();
  if (!user) throw new Error("Unauthorized");
  if (!allowedEmail || !user.email || user.email_verified !== true || user.email.toLowerCase() !== allowedEmail) {
    throw new Error("Forbidden: verified administrator access required");
  }
  return user;
}
