export function ProblemSection() {

  return (
    <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12">


        <p className="text-xs uppercase tracking-[0.18em] text-red-400">
          The Problem
        </p>


        <h2 className="mt-4 max-w-1xl text-3xl font-semibold">
          AI agents can act faster than humans can review them.
        </h2>


        <p className="mt-4 max-w-1xl text-sm leading-7 text-zinc-500">

          Traditional security models were designed around
          human users. Autonomous agents introduce a new
          challenge: software identities that can make
          decisions and execute actions independently.

        </p>


        <div className="mt-8 grid gap-4 md:grid-cols-3">


          <ProblemCard
            title="No Agent Identity"
            description="Multiple AI systems often share credentials, making accountability difficult."
          />


          <ProblemCard
            title="Excessive Permissions"
            description="Agents may have more access than required to complete their tasks."
          />


          <ProblemCard
            title="Limited Visibility"
            description="Organizations need complete records of what agents did and why."
          />


        </div>


      </div>

    </section>
  );
}



function ProblemCard({
 title,
 description,
}:{
 title:string;
 description:string;
}){

 return (

  <div className="rounded-xl border border-white/10 bg-black/20 p-5">

    <h3 className="font-medium text-zinc-200">
      {title}
    </h3>


    <p className="mt-2 text-sm leading-6 text-zinc-500">
      {description}
    </p>

  </div>

 );

}