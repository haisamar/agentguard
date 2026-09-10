export type PublicTraceStep = {
  number: string;
  label: string;
  title: string;
  description: string;
  tone:
    | "success"
    | "warning"
    | "danger"
    | "blue"
    | "violet"
    | "neutral";
};


export type PublicDemoCase = {
  key:
    | "authorized"
    | "denied"
    | "approval";

  tabLabel: string;

  title: string;

  subtitle: string;

  status: string;

  statusTone:
    | "success"
    | "warning"
    | "danger"
    | "blue"
    | "violet"
    | "neutral";

  action: string;

  amount?: number;

  resource?: string;

  steps: PublicTraceStep[];
};



export async function getPublicDemoCases(): Promise<
  PublicDemoCase[]
> {

  return [
    {
      key: "authorized",

      tabLabel: "Authorized Agent",

      title: "Authorized Agent",

      subtitle:
        "A finance agent with the correct machine identity and permissions completed a low-risk action without requiring human intervention.",

      status: "ALLOWED",

      statusTone: "success",

      action: "Issue Refund",

      amount: 100,

      resource: "acct_demo_001",


      steps: [

        {
          number: "01",

          label: "Agent Identity",

          title: "Finance Agent",

          description:
            "Authenticated machine identity verified.",

          tone: "violet",
        },


        {
          number: "02",

          label: "Scope Check",

          title: "finance:refund",

          description:
            "OAuth permission verified.",

          tone: "success",
        },


        {
          number: "03",

          label: "Contextual Policy",

          title: "Low Risk Action",

          description:
            "Refund amount is within autonomous execution limits.",

          tone: "blue",
        },


        {
          number: "04",

          label: "Decision",

          title: "Allowed",

          description:
            "AgentGuard permitted the action.",

          tone: "success",
        },


        {
          number: "05",

          label: "Audit",

          title: "Recorded",

          description:
            "Security decision stored in the audit trail.",

          tone: "blue",
        },

      ],
    },



    {
      key: "denied",

      tabLabel: "Blocked Agent",

      title: "Blocked Agent",

      subtitle:
        "A sales agent attempted a financial action without the required permission and was blocked before execution.",


      status: "DENIED",

      statusTone: "danger",

      action: "Issue Refund",

      amount: 750,

      resource: "acct_demo_001",


      steps: [

        {
          number: "01",

          label: "Agent Identity",

          title: "Sales Agent",

          description:
            "Authenticated machine identity verified.",

          tone: "violet",
        },


        {
          number: "02",

          label: "Scope Check",

          title: "Missing finance:refund",

          description:
            "Agent does not possess the required financial permission.",

          tone: "danger",
        },


        {
          number: "03",

          label: "Contextual Policy",

          title: "Not Evaluated",

          description:
            "Authorization failed before policy execution.",

          tone: "neutral",
        },


        {
          number: "04",

          label: "Human Review",

          title: "Not Required",

          description:
            "Request never reached approval workflow.",

          tone: "neutral",
        },


        {
          number: "05",

          label: "Audit",

          title: "Security Event Recorded",

          description:
            "Denied action preserved for investigation.",

          tone: "danger",
        },

      ],
    },



    {
      key: "approval",

      tabLabel: "Approval Workflow",

      title: "Approval Workflow",

      subtitle:
        "A finance agent had permission to request the action, but policy required authenticated human approval before execution.",


      status: "APPROVAL REQUIRED",

      statusTone: "warning",


      action: "Issue Refund",

      amount: 750,

      resource: "acct_demo_001",


      steps: [

        {
          number: "01",

          label: "Agent Identity",

          title: "Finance Agent",

          description:
            "Authenticated machine identity verified.",

          tone: "violet",
        },


        {
          number: "02",

          label: "Scope Check",

          title: "finance:refund",

          description:
            "OAuth permission verified.",

          tone: "success",
        },


        {
          number: "03",

          label: "Contextual Policy",

          title: "High Risk Action",

          description:
            "Refund exceeds autonomous execution threshold.",

          tone: "warning",
        },


        {
          number: "04",

          label: "Human Approval",

          title: "Waiting for Review",

          description:
            "Authorized administrator approval required.",

          tone: "warning",
        },


        {
          number: "05",

          label: "Audit",

          title: "Approval Trace Created",

          description:
            "Identity, decision, and review history linked.",

          tone: "blue",
        },

      ],
    },

  ];
}