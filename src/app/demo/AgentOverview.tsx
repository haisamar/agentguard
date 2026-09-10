export function AgentOverview() {
  const agents = [
    {
      name: "Sales Agent",
      role: "Revenue Operations",
      permissions: [
        "crm:read",
        "crm:write",
      ],
      tone: "blue",
    },
    {
      name: "Finance Agent",
      role: "Financial Operations",
      permissions: [
        "finance:refund",
      ],
      tone: "violet",
    },
    {
      name: "Admin Runtime",
      role: "Human Approval",
      permissions: [
        "agent:manage",
      ],
      tone: "emerald",
    },
  ];


  return (
    <div className="mb-8">

      <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
        Connected Agents
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">

        {agents.map((agent)=>(
          <div
            key={agent.name}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >

            <div className="flex items-center justify-between">

              <h3 className="font-medium text-zinc-200">
                {agent.name}
              </h3>

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

            </div>


            <p className="mt-2 text-sm text-zinc-500">
              {agent.role}
            </p>


            <div className="mt-4 flex flex-wrap gap-2">

              {agent.permissions.map((permission)=>(
                <span
                  key={permission}
                  className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-xs text-zinc-400"
                >
                  {permission}
                </span>
              ))}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}