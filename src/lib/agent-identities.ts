export type AgentIdentityType =
  | "Machine"
  | "Human"
  | "System"
  | "Unknown";

export type ResolvedAgentIdentity = {
  name: string;
  type: AgentIdentityType;
  role?: string;
};

export function resolveAgentIdentity(
  identity: string | null | undefined
): ResolvedAgentIdentity {
  if (!identity) {
    return {
      name: "Unknown Identity",
      type: "Unknown",
    };
  }

  // Demo / local simulation identities.
  if (identity.startsWith("sales-agent-demo")) {
    return {
      name: "Sales Agent",
      type: "Machine",
      role: "Revenue Operations",
    };
  }

  if (identity.startsWith("finance-agent-demo")) {
    return {
      name: "Finance Agent",
      type: "Machine",
      role: "Finance Operations",
    };
  }

  if (identity.startsWith("admin-runtime-demo")) {
    return {
      name: "Admin Runtime",
      type: "Machine",
      role: "Security Administration",
    };
  }

  if (identity.startsWith("admin-human-demo")) {
    return {
      name: "Human Administrator",
      type: "Human",
      role: "Approval Authority",
    };
  }

  // Known Auth0 machine identities.
  if (identity.startsWith("acWr66")) {
    return {
      name: "Sales Agent",
      type: "Machine",
      role: "Revenue Operations",
    };
  }

  if (identity.startsWith("46Pv6Y")) {
    return {
      name: "Finance Agent",
      type: "Machine",
      role: "Finance Operations",
    };
  }

  if (identity.startsWith("URssw3")) {
    return {
      name: "Admin Runtime",
      type: "Machine",
      role: "Security Administration",
    };
  }

  // Authenticated human identities.
  if (identity.startsWith("human:")) {
    return {
      name: "Human Administrator",
      type: "Human",
      role: "Approval Authority",
    };
  }

  // Internal AgentGuard system identities.
  if (identity.startsWith("system:")) {
    return {
      name: "AgentGuard System",
      type: "System",
    };
  }

  // Generic Auth0 client-credentials subject.
  if (identity.endsWith("@clients")) {
    return {
      name: "Protected Machine Identity",
      type: "Machine",
    };
  }

  return {
    name: "Protected Identity",
    type: "Unknown",
  };
}

export function identityName(
  identity: string | null | undefined
) {
  return resolveAgentIdentity(identity).name;
}

export function identityType(
  identity: string | null | undefined
) {
  return resolveAgentIdentity(identity).type;
}
