// Auth0 Post Login Action. Deploy and bind to Login; not executed by Next.js.
// This client ID is a public application identifier, not a credential.
const CLIENT_ID = "JdpzFJJg0yofCylqSx8SAMlviQOrUY4f";
const CONNECTION_ID = "con_j8gAE9ch64oVjs5l";
const CLAIM = "https://agentguard-eight.vercel.app/passkey_assurance";

exports.onExecutePostLogin = async (event, api) => {
  if (event.client?.client_id !== CLIENT_ID || event.connection?.id !== CONNECTION_ID) return;
  const methods = event.authentication?.methods;
  if (!Array.isArray(methods)) return;
  const now = Date.now() / 1000;
  const times = methods
    .filter(method => method?.name === "passkey" && typeof method.timestamp === "string")
    .map(method => Date.parse(method.timestamp) / 1000)
    .filter(time => Number.isFinite(time) && time > 0 && time <= now && now - time <= 300);
  if (!times.length) return;
  // Preserve the actual method time. A password login or token refresh cannot
  // turn an old passkey event into a newly completed passkey authentication.
  api.idToken.setCustomClaim(CLAIM, { method: "passkey", authenticated_at: Math.max(...times) });
};
