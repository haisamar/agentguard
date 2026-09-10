"use client";


const lifecycle = [
  {
    number: "01",
    title: "Machine Identity",
    description:
      "Every autonomous agent operates with a distinct identity.",
  },
  {
    number: "02",
    title: "OAuth Authorization",
    description:
      "Permissions determine what each agent can access.",
  },
  {
    number: "03",
    title: "Contextual Policy",
    description:
      "Risk is evaluated before sensitive actions execute.",
  },
  {
    number: "04",
    title: "Human Approval",
    description:
      "High-risk operations pause for authorized review.",
  },
  {
    number: "05",
    title: "Audit Trail",
    description:
      "Every decision remains traceable and reviewable.",
  },
];


export function SecurityLifecycle() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-10">

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
          AgentGuard Security Model
        </p>

        <h2 className="mt-3 text-2xl font-semibold">
          Every agent action follows a controlled lifecycle.
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          AgentGuard separates identity, authorization,
          policy decisions, human control, and audit history.
        </p>
      </div>


      <div className="mt-8 grid gap-3 md:grid-cols-5">

        {lifecycle.map((item,index)=>(
          <div
            key={item.number}
            className="relative rounded-2xl border border-white/10 bg-black/20 p-5"
          >

            <span className="font-mono text-xs text-blue-400">
              {item.number}
            </span>


            <h3 className="mt-4 text-sm font-medium text-zinc-200">
              {item.title}
            </h3>


            <p className="mt-2 text-xs leading-5 text-zinc-600">
              {item.description}
            </p>


            {index < lifecycle.length - 1 && (
              <span className="absolute right-[-12px] top-1/2 hidden text-zinc-700 md:block">
                →
              </span>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}