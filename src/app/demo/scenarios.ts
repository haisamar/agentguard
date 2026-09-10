export type SimulationTone =
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "violet"
  | "neutral";


export type SimulationStep = {
  id: string;
  label: string;
  title: string;
  description: string;
  tone: SimulationTone;
};



export type SimulationTraceKey =
  | "authorized"
  | "denied"
  | "approval";



export type SimulationScenario = {
  id: string;
  number: string;

  agent: string;
  category: string;

  action: string;

  amount?: number;

  decision: string;

  decisionTone: SimulationTone;

  summary: string;


  // Connects simulation result
  // to PublicTraceExplorer
  traceKey: SimulationTraceKey;


  steps: SimulationStep[];
};





export const simulationScenarios: SimulationScenario[] = [


  {
    id: "sales-agent-denied",

    number: "01",

    agent: "Sales Agent",

    category: "Revenue Operations",

    action: "Issue Refund",

    amount: 750,

    decision: "ACCESS DENIED",

    decisionTone: "danger",


    traceKey: "denied",


    summary:
      "A sales automation agent attempted a financial action without the required refund permission.",



    steps: [

      {
        id: "identity",

        label: "01 · Identity",

        title: "Sales Agent verified",

        description:
          "AgentGuard recognizes this runtime as a distinct machine identity.",

        tone: "blue",
      },


      {
        id: "request",

        label: "02 · Request",

        title: "Refund request created",

        description:
          "The agent requested a $750 customer refund.",

        tone: "violet",
      },


      {
        id: "authorization",

        label: "03 · Authorization",

        title: "finance:refund required",

        description:
          "The action requires the finance:refund OAuth scope.",

        tone: "warning",
      },


      {
        id: "decision",

        label: "04 · Decision",

        title: "Permission rejected",

        description:
          "Sales Agent does not have authority to issue refunds.",

        tone: "danger",
      },


      {
        id: "audit",

        label: "05 · Audit",

        title: "Security event recorded",

        description:
          "The denied action is preserved in the audit trail.",

        tone: "success",
      },

    ],
  },




  {
    id: "finance-agent-approved",

    number: "02",

    agent: "Finance Agent",

    category: "Financial Operations",

    action: "Issue Refund",

    amount: 100,

    decision: "ACTION ALLOWED",

    decisionTone: "success",


    traceKey: "authorized",


    summary:
      "A finance agent with the correct permission completes a low-risk refund.",



    steps: [

      {
        id: "identity",

        label: "01 · Identity",

        title: "Finance Agent verified",

        description:
          "The financial runtime is identified separately from other agents.",

        tone: "blue",
      },


      {
        id: "authorization",

        label: "02 · Authorization",

        title: "finance:refund granted",

        description:
          "The agent possesses the required financial permission.",

        tone: "success",
      },


      {
        id: "policy",

        label: "03 · Policy",

        title: "Risk evaluated",

        description:
          "The refund amount is within autonomous execution limits.",

        tone: "violet",
      },


      {
        id: "decision",

        label: "04 · Decision",

        title: "Refund approved",

        description:
          "The action can execute without human intervention.",

        tone: "success",
      },


      {
        id: "audit",

        label: "05 · Audit",

        title: "Decision recorded",

        description:
          "AgentGuard stores the authorization decision.",

        tone: "blue",
      },

    ],
  },





  {
    id: "finance-agent-approval",

    number: "03",

    agent: "Finance Agent",

    category: "Financial Operations",

    action: "Issue Refund",

    amount: 750,

    decision: "HUMAN APPROVAL REQUIRED",

    decisionTone: "warning",


    traceKey: "approval",


    summary:
      "The agent has permission, but policy requires human review for sensitive actions.",



    steps: [

      {
        id: "identity",

        label: "01 · Identity",

        title: "Finance Agent verified",

        description:
          "The requesting machine identity is authenticated.",

        tone: "blue",
      },


      {
        id: "authorization",

        label: "02 · Authorization",

        title: "Permission accepted",

        description:
          "The agent has finance:refund access.",

        tone: "success",
      },


      {
        id: "policy",

        label: "03 · Policy",

        title: "High-risk action detected",

        description:
          "Refunds above $500 require additional review.",

        tone: "warning",
      },


      {
        id: "approval",

        label: "04 · Approval",

        title: "Waiting for human review",

        description:
          "Execution pauses until an authorized operator approves.",

        tone: "warning",
      },


      {
        id: "audit",

        label: "05 · Audit",

        title: "Approval request recorded",

        description:
          "The complete approval trail is preserved.",

        tone: "blue",
      },

    ],
  },






  {
    id: "admin-approved",

    number: "04",

    agent: "Admin Runtime",

    category: "Security Administration",

    action: "Approve Refund",

    amount: 750,


    decision: "EXECUTION APPROVED",

    decisionTone: "success",


    traceKey: "approval",


    summary:
      "A human administrator approves the sensitive action and allows execution.",



    steps: [

      {
        id: "review",

        label: "01 · Review",

        title: "Human approval requested",

        description:
          "An authenticated administrator reviews the pending action.",

        tone: "violet",
      },


      {
        id: "decision",

        label: "02 · Decision",

        title: "Approval granted",

        description:
          "The administrator authorizes the requested operation.",

        tone: "success",
      },


      {
        id: "execution",

        label: "03 · Execution",

        title: "Refund released",

        description:
          "The approved action is allowed to continue.",

        tone: "success",
      },


      {
        id: "audit",

        label: "04 · Audit",

        title: "Final trace completed",

        description:
          "Identity, approval, and execution history remain connected.",

        tone: "blue",
      },

    ],
  },

];