# AgentGuard

### Identity Security for AI Agents

AgentGuard is an identity-aware authorization layer for autonomous AI agents.

It gives each agent a distinct machine identity, limits what it can request with OAuth scopes, evaluates contextual policy before sensitive actions execute, introduces authenticated human approval when autonomous authority should stop, and records the resulting security decisions.

**Live product:** https://agentguard-eight.vercel.app  
**Interactive demo:** https://agentguard-eight.vercel.app/demo  
**MCP authorization backend:** https://github.com/haisamar/agentguard-mcp

---

## Why AgentGuard?

Giving an AI agent access to a tool is easy.

The harder question is:

> Which agent should be allowed to use which tool, under what conditions, and when should a human have to intervene?

A sales agent may need to read CRM accounts and update opportunities, but it should not automatically be able to issue refunds. A finance agent may legitimately have refund permission, but a high-value refund may still require human review.

AgentGuard demonstrates how familiar identity and access-management ideas can be applied to autonomous AI execution.

---

## Security Lifecycle

```text
AI Agent
   ↓
Machine Identity
   ↓
OAuth Scope Authorization
   ↓
Contextual Policy
   ↓
 ┌───────────────┬───────────────────────┐
 │               │                       │
ALLOW            DENY            APPROVAL_REQUIRED
 │               │                       │
 ↓               ↓                       ↓
Execute          Block             Human Review
                                         │
                                   Approve / Deny
                                         │
                                         ↓
                               Controlled Execution
                                         │
                                         ↓
                                    Audit Trail
