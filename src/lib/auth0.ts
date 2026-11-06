import { Auth0Client, filterDefaultIdTokenClaims } from "@auth0/nextjs-auth0/server";
import { PASSKEY_ASSURANCE_CLAIM } from "./admin-policy";

export const auth0 = new Auth0Client({
  async beforeSessionSaved(session) {
    // Only verified SDK claims are retained; no request or user metadata input.
    const { amr, auth_time } = session.user;
    return {
      ...session,
      user: {
        ...filterDefaultIdTokenClaims(session.user),
        amr: Array.isArray(amr) ? amr.filter((value): value is string => typeof value === "string") : [],
        auth_time: typeof auth_time === "number" ? auth_time : undefined,
        [PASSKEY_ASSURANCE_CLAIM]: session.user[PASSKEY_ASSURANCE_CLAIM],
      },
    };
  },
});
