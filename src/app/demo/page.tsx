import Link from "next/link";

import { SimulationRunner } from "./SimulationRunner";
import { AgentOverview } from "./AgentOverview";
import { SecurityLifecycle } from "./SecurityLifecycle";
import { ProblemSection } from "./ProblemSection";

import {
  getPublicDemoCases,
} from "@/lib/public-demo-data";

import { PublicTraceExplorer } from "./PublicTraceExplorer";
import { DemoProvider } from "./DemoContext";



export default async function DemoPage() {

  const cases =
    await getPublicDemoCases();



  return (

    <DemoProvider>

      <main className="min-h-screen bg-[#08090b] text-white">


        {/* NAV */}

        <header className="border-b border-white/10">

          <div className="mx-auto flex max-w-[1450px] items-center justify-between px-6 py-5 lg:px-10">


            <Link
              href="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 font-bold text-blue-400">
                AG
              </div>


              <div>

                <p className="font-semibold">
                  AgentGuard
                </p>


                <p className="text-xs text-zinc-600">
                  Identity Security for AI Agents
                </p>

              </div>


            </Link>




            <div className="flex items-center gap-3">

              <span className="hidden text-xs text-zinc-600 sm:inline">
                Public security environment
              </span>


              <a
                href="/auth/login?returnTo=/dashboard"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                Administrator Login
              </a>


            </div>


          </div>


        </header>






        {/* HERO */}


        <section className="mx-auto max-w-[1450px] px-6 pb-12 pt-20 lg:px-10">


          <div className="max-w-4xl">


            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
              Interactive AI Security Demonstration
            </span>




            <h1 className="mt-7 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">

              Autonomous AI agents need
              <span className="text-zinc-500">
                {" "}identity, permissions, and control.
              </span>

            </h1>




            <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-500 md:text-lg">

              AgentGuard protects autonomous software identities by
              enforcing least-privilege authorization, contextual policy,
              human approval workflows, and complete audit visibility.

            </p>


          </div>


        </section>








        {/* PROBLEM */}

        <ProblemSection />







        {/* ARCHITECTURE */}


        <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">


          <div className="mb-7">

            <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
              Security Architecture
            </p>


            <h2 className="mt-3 text-3xl font-semibold">
              Every AI action follows a controlled lifecycle.
            </h2>

          </div>



          <div className="grid gap-3 md:grid-cols-5">


            <ArchitectureStep
              number="01"
              title="Machine Identity"
              description="Every runtime receives a unique identity."
            />


            <ArchitectureStep
              number="02"
              title="OAuth Authorization"
              description="Permissions are limited by scope."
            />


            <ArchitectureStep
              number="03"
              title="Context Policy"
              description="Risk is evaluated before execution."
            />


            <ArchitectureStep
              number="04"
              title="Human Approval"
              description="Sensitive actions require oversight."
            />


            <ArchitectureStep
              number="05"
              title="Audit Trail"
              description="Every decision remains traceable."
            />


          </div>


        </section>








        {/* SIMULATION */}



        <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">


          <div className="mb-8">

            <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
              Live Agent Simulation
            </p>


            <h2 className="mt-3 text-3xl font-semibold">
              Watch AgentGuard make security decisions in real time.
            </h2>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">

              Follow autonomous agents as they request actions,
              pass authorization checks, trigger policies,
              and create verifiable security records.

            </p>


          </div>




          <AgentOverview />



          <div className="mt-8">

            <SimulationRunner />

          </div>



          <div className="mt-10">

            <SecurityLifecycle />

          </div>


        </section>








        {/* TRACE */}



        <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">


          <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
            Technical Trace Explorer
          </p>


          <h2 className="mt-3 text-3xl font-semibold">
            Inspect every security decision.
          </h2>


          <p className="mt-3 max-w-2xl text-sm text-zinc-500">

            Review how identity,
            authorization,
            approvals,
            and audit history connect together.

          </p>



          <div className="mt-8">

            <PublicTraceExplorer
              cases={cases}
            />

          </div>


        </section>









        {/* SECURITY MODEL */}



        <section className="mx-auto max-w-[1450px] px-6 py-14 lg:px-10">


          <div className="grid gap-5 lg:grid-cols-3">


            <FeatureCard
              eyebrow="IDENTITY"
              title="Every agent is accountable"
              description="Separate machine identities prevent shared privileged access."
            />



            <FeatureCard
              eyebrow="AUTHORIZATION"
              title="Permission before automation"
              description="Agents only access actions allowed by their scopes."
            />



            <FeatureCard
              eyebrow="CONTROL"
              title="Autonomy with boundaries"
              description="Sensitive actions can require human approval."
            />


          </div>


        </section>








        {/* CTA */}



        <section className="mx-auto max-w-[1450px] px-6 pb-24 pt-12 lg:px-10">


          <div className="rounded-3xl border border-blue-500/15 bg-blue-500/[0.035] p-10">


            <h2 className="text-2xl font-semibold">
              Protect your AI workforce before it scales.
            </h2>


            <p className="mt-3 max-w-2xl text-sm text-zinc-500">

              The administrator console provides protected identities,
              approval workflows, and complete audit visibility.

            </p>


            <a
              href="/auth/login?returnTo=/dashboard"
              className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
            >
              Administrator Login
            </a>


          </div>


        </section>





      </main>


    </DemoProvider>

  );

}








function ArchitectureStep({
number,
title,
description,
}:{
number:string;
title:string;
description:string;
}){

return (

<div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

<span className="font-mono text-xs text-blue-400">
{number}
</span>


<h3 className="mt-5 font-medium">
{title}
</h3>


<p className="mt-2 text-xs text-zinc-600">
{description}
</p>


</div>

);

}







function FeatureCard({
eyebrow,
title,
description,
}:{
eyebrow:string;
title:string;
description:string;
}){

return (

<div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">

<p className="text-[10px] uppercase tracking-[0.18em] text-blue-400">
{eyebrow}
</p>


<h3 className="mt-4 text-lg font-medium">
{title}
</h3>


<p className="mt-2 text-sm text-zinc-500">
{description}
</p>


</div>

);

}