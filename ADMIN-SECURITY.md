# Administrator authorization and release prerequisites

The dashboard requires both `AGENTGUARD_ADMIN_EMAIL` and
`AGENTGUARD_ADMIN_SUB`. The latter is the exact subject of the intended human
administrator's verified Auth0 session. Missing configuration, a different
subject, unverified email, or a mismatched email denies access. Do not infer the
subject from an email or copy a machine application's client ID.

Before deployment, securely configure the intended subject in local/Vercel
environments and verify it against an actual login. Do not publish the value.
The intended subject and verified email were inspected in Auth0 on November 6,
2026. The subject was configured in local and Vercel environments. Fresh passkey
login, approval, and resume succeeded in the November 6 production verification.

## Sensitive actions

Approving requests and resuming execution accept either the recent verified
passkey assurance described below, or a verified session carrying
`amr` with `mfa` and a finite `auth_time` within the last 300 seconds. Missing,
future, stale, or incorrectly typed authentication time is rejected. Token
issuance time (`iat`) is never treated as proof of recent authentication.

The SDK session hook retains verified claims alongside default identity claims.
The dashboard uses `max_age=0` to prompt fresh sign-in; the active deployment
uses the passkey path below. URL parameters alone do not prove authentication
method or recency. Missing required assurance blocks approval and resume.

Denying, cancelling, and pausing still require the pinned administrator session;
they do not require fresh MFA, so an administrator can stop activity promptly.
MFA does not by itself prove that the correct transaction was reviewed, nor
protect against a compromised privileged backend/database administrator.

## Deployment checklist

1. Configure and verify the administrator subject using a real Auth0 login.
2. Check existing Auth0 MFA entitlement/factors; obtain actual-price approval
   before any paid change. Scope any tenant Action to AgentGuard's client ID.
3. Confirm no-MFA and stale-MFA approval/resume attempts are rejected.
4. Confirm a fresh passkey or MFA login permits approval and resume.
5. Confirm non-admin and unverified users cannot call any server action.
6. Verify the new dashboard pause/cancel UI and backend workflow together.

Policy and Action tests cover malformed and stale claims. The positive passkey
flow and its receipt were verified in production. Local HTTP verification also
rejected direct approval and resume submissions under five disallowed states
before any write. The complete live negative browser matrix (non-admin,
unverified, stale and password-only) remains open. See the [evidence index](https://github.com/haisamar/agentguard-mcp/blob/main/SUBMISSION-EVIDENCE.md).

References:
- https://auth0.com/docs/secure/multi-factor-authentication/step-up-authentication
- https://auth0.com/docs/authenticate/login/max-age-reauthentication

## Free-plan passkey path — November 6, 2026

The owner chose to remain on Free. Auth0 displayed authenticator-app MFA under
Essentials at US$35/month plus taxes for 500 MAU; no plan change or purchase was
made. Native passkeys are included on Free. Identifier First was saved and
passkeys enabled on the existing AgentGuard database connection; prerequisites
showed READY and the method ACTIVE. Progressive enrollment remains enabled.
The owner created the credential directly; Auth0 logged completed enrollment.
A subsequent fresh passkey login opened the production dashboard successfully.
The first enrollment callback had returned a generic code-exchange error despite
Auth0 reporting success; its exact cause remains unconfirmed.

The prepared Post Login Action is `auth0/agentguard-passkey-assurance.cjs`.
It is scoped to AgentGuard Dashboard's client and database connection. It reads
only Auth0 authentication-method evidence and emits the namespaced ID-token claim
`https://agentguard-eight.vercel.app/passkey_assurance` with the actual passkey
method timestamp. It never derives assurance from URL parameters, user metadata,
enrollment status, token issuance time, or Action execution time. An old passkey
event cannot become fresh through a subsequent password login.

The application validates the claim shape, exact method, and timestamp (at most
300 seconds old, no future dates); absent or invalid evidence denies sensitive
actions. This is passkey authentication, not a claim that paid Auth0 MFA ran.
The Action was deployed and bound to Login. The protected actions succeeded
after fresh passkey sign-in. Passkey enrollment/recovery remains in Auth0's trust boundary; do
not permit password-only approval as a recovery fallback. No new authenticator
secret storage or authentication dependencies were added to AgentGuard.

Sources:
- https://auth0.com/blog/all-you-need-to-know-about-passkeys-at-auth0/
- https://support.auth0.com/center/s/article/detecting-passkey-usage-in-auth0-post-login-actions
- https://github.com/auth0/auth0-actions/blob/main/src/post-login/v2/index.d.ts
