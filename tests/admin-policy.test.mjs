import assert from "node:assert/strict";
import test from "node:test";
import { isHumanAdmin, hasFreshMfa, hasFreshSensitiveAuthentication, PASSKEY_ASSURANCE_CLAIM } from "../src/lib/admin-policy.ts";
import passkeyAction from "../auth0/agentguard-passkey-assurance.cjs";

const user = { sub: "auth0|synthetic-admin", email: "admin@example.test", email_verified: true };
test("admin requires configured subject and verified matching email", () => {
  assert.equal(isHumanAdmin(user, "ADMIN@example.test", user.sub), true);
  for (const changed of [null, {}, { ...user, sub: "auth0|other" }, { ...user, email_verified: false }, { ...user, email_verified: "true" }, { ...user, email: "other@example.test" }]) {
    assert.equal(isHumanAdmin(changed, user.email, user.sub), false);
  }
  assert.equal(isHumanAdmin(user, user.email, undefined), false);
  assert.equal(isHumanAdmin(user, undefined, user.sub), false);
});

test("sensitive actions require fresh provider assurance; a fresh password cannot renew an old passkey", () => {
  const withClaim = value => ({ [PASSKEY_ASSURANCE_CLAIM]: value, auth_time: 999, amr: ["pwd"] });
  assert.equal(hasFreshSensitiveAuthentication(withClaim({ method: "passkey", authenticated_at: 700 }), 1000), true);
  assert.equal(hasFreshSensitiveAuthentication({ amr: ["mfa"], auth_time: 999 }, 1000), true);
  for (const value of [undefined, true, [], "passkey", {}, { method: "pwd", authenticated_at: 999 }, { method: "passkey", authenticated_at: 699 }, { method: "passkey", authenticated_at: 1001 }, { method: "passkey", authenticated_at: "999" }, { method: "passkey", authenticated_at: NaN }, { method: "passkey", authenticated_at: 0 }]) {
    assert.equal(hasFreshSensitiveAuthentication(withClaim(value), 1000), false);
  }
  assert.equal(hasFreshSensitiveAuthentication({ user_metadata: { [PASSKEY_ASSURANCE_CLAIM]: { method: "passkey", authenticated_at: 999 } } }, 1000), false);
});

test("Auth0 Action scopes assurance to AgentGuard and preserves actual passkey method time", async () => {
  const timestamp = new Date(Date.now() - 1000).toISOString();
  const base = { client: { client_id: "JdpzFJJg0yofCylqSx8SAMlviQOrUY4f" }, connection: { id: "con_j8gAE9ch64oVjs5l" }, authentication: { methods: [{ name: "passkey", timestamp }] } };
  const claims = [];
  const api = { idToken: { setCustomClaim: (...args) => claims.push(args) } };
  await passkeyAction.onExecutePostLogin(base, api);
  assert.deepEqual(claims, [[PASSKEY_ASSURANCE_CLAIM, { method: "passkey", authenticated_at: Date.parse(timestamp) / 1000 }]]);
  for (const changed of [{ ...base, client: { client_id: "unrelated" } }, { ...base, connection: { id: "unrelated" } }, { ...base, authentication: undefined }, { ...base, authentication: { methods: { name: "passkey" } } }, ...[null, { name: "pwd", timestamp }, { name: "passkey", timestamp: "invalid" }, { name: "passkey", timestamp: 999 }, { name: "passkey", timestamp: new Date(Date.now() + 60000).toISOString() }, { name: "passkey", timestamp: new Date(Date.now() - 301000).toISOString() }].map(method => ({ ...base, authentication: { methods: [method] } }))]) {
    claims.length = 0;
    await passkeyAction.onExecutePostLogin(changed, api);
    assert.equal(claims.length, 0);
  }
});
test("fresh MFA requires verified method and authentication time, not token issuance", () => {
  assert.equal(hasFreshMfa({ amr: ["pwd", "mfa"], auth_time: 900 }, 1000), true);
  assert.equal(hasFreshMfa({ amr: ["mfa"], auth_time: 700 }, 1000), true);
  for (const changed of [{}, { amr: ["pwd"], auth_time: 999 }, { amr: ["mfa"], auth_time: 699 }, { amr: ["mfa"], auth_time: 1001 }, { amr: ["mfa"], auth_time: NaN }, { amr: ["mfa"], auth_time: "999" }, { amr: "mfa", auth_time: 999 }, { amr: ["mfa"], iat: 999 }]) {
    assert.equal(hasFreshMfa(changed, 1000), false);
  }
});
