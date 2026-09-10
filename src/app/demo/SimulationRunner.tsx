"use client";

import { useState } from "react";
import { useDemo } from "./DemoContext";

import {
  simulationScenarios,
  type SimulationScenario,
} from "./scenarios";

import { SecurityEventStream } from "./SecurityEventStream";


export function SimulationRunner() {

  const {
    setSelectedTrace,
    scrollToTrace,
  } = useDemo();



  const [
    started,
    setStarted
  ] = useState(false);


  const [
    scenarioIndex,
    setScenarioIndex
  ] = useState(0);


  const [
    stepIndex,
    setStepIndex
  ] = useState(0);


  const [
    completed,
    setCompleted
  ] = useState(false);



  const scenario =
    simulationScenarios[scenarioIndex];





  function startSimulation(){

    setStarted(true);

    setScenarioIndex(0);

    setStepIndex(0);

    setCompleted(false);


    setSelectedTrace(
      "denied"
    );

  }







  function nextStep(){

    if(!scenario) return;



    if(
      stepIndex <
      scenario.steps.length - 1
    ){

      setStepIndex(
        current => current + 1
      );

      return;

    }




    /*
      Update technical trace
      when scenario finishes
    */

    setSelectedTrace(
      scenario.traceKey
    );




    if(
      scenarioIndex <
      simulationScenarios.length - 1
    ){

      setScenarioIndex(
        current => current + 1
      );


      setStepIndex(0);


      return;

    }



    setCompleted(true);

  }






  if(!started){

    return (

      <div className="rounded-3xl border border-blue-500/20 bg-blue-500/[0.04] p-8 md:p-12">


        <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
          Interactive Security Simulation
        </p>


        <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight">
          See how AgentGuard protects autonomous AI actions.
        </h2>


        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
          Four agents. Four security decisions.
          Watch how identity, permissions, policy,
          and human oversight determine what happens next.
        </p>


        <button
          onClick={startSimulation}
          className="mt-8 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          Start Security Simulation
        </button>


      </div>

    );

  }







  if(completed){

    return (

      <CompletionSummary
        restart={startSimulation}
        viewTrace={()=>{
          setSelectedTrace("approval");
          scrollToTrace();
        }}
      />

    );

  }








  return (

    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">


      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f12]">


        <div className="border-b border-white/[0.07] px-7 py-6">


          <div className="flex flex-wrap items-start justify-between gap-5">


            <div>


              <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
                Security Simulation
              </p>


              <div className="mt-3 flex items-center gap-3">

                <span className="text-xs text-zinc-500">
                  Scenario {scenarioIndex + 1} of {simulationScenarios.length}
                </span>


                <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{
                      width:`${
                        ((scenarioIndex + 1) /
                        simulationScenarios.length) * 100
                      }%`
                    }}
                  />

                </div>

              </div>



              <h2 className="mt-4 text-2xl font-semibold">
                {scenario.agent} request
              </h2>


              <p className="mt-1 text-sm text-zinc-500">
                {scenario.category}
              </p>


            </div>



            <DecisionBadge
              scenario={scenario}
            />

          </div>


        </div>







        <div className="p-7">


          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">


            <div className="grid gap-5 md:grid-cols-2">


              <div>

                <p className="text-xs uppercase tracking-wider text-zinc-600">
                  Agent Intent
                </p>


                <p className="mt-2 text-lg font-medium">
                  {scenario.action}
                </p>

              </div>




              {scenario.amount !== undefined && (

                <div>

                  <p className="text-xs uppercase tracking-wider text-zinc-600">
                    Amount
                  </p>


                  <p className="mt-2 text-lg font-medium">
                    ${scenario.amount}
                  </p>

                </div>

              )}


            </div>


            <p className="mt-5 text-sm leading-6 text-zinc-500">
              {scenario.summary}
            </p>


          </div>







          <div className="mt-7 space-y-3">

            {scenario.steps.map((step,index)=>(

              <div
                key={step.id}
                className={`
                  rounded-xl border p-5 transition-all
                  ${
                    index <= stepIndex
                    ? "border-white/10 bg-white/[0.04]"
                    : "border-white/[0.05] bg-white/[0.01] opacity-40"
                  }
                `}
              >

                <div className="flex gap-4">

                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${
                      index <= stepIndex
                      ? toneDot(step.tone)
                      : "bg-zinc-700"
                    }`}
                  />


                  <div>

                    <p className="text-xs uppercase tracking-wider text-zinc-600">
                      {step.label}
                    </p>


                    <h3 className="mt-1 font-medium text-zinc-200">
                      {step.title}
                    </h3>


                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      {step.description}
                    </p>


                  </div>


                </div>

              </div>

            ))}

          </div>






          <button
            onClick={nextStep}
            className="mt-7 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-200 hover:bg-white/[0.08]"
          >

            {
              stepIndex === scenario.steps.length - 1
              ? scenarioIndex === simulationScenarios.length - 1
                ? "Complete Simulation"
                : "Next Scenario"
              : "Continue"
            }

          </button>


        </div>


      </div>







      <SecurityEventStream
        key={scenario.id}
        scenario={scenario}
        stepIndex={stepIndex}
      />



    </div>

  );

}









function CompletionSummary({
  restart,
  viewTrace,
}:{
  restart:()=>void;
  viewTrace:()=>void;
}){


return (

<div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04] p-8 md:p-12">


<p className="text-xs uppercase tracking-[0.18em] text-emerald-400">
Simulation Complete
</p>


<h2 className="mt-4 text-3xl font-semibold">
AgentGuard protected the workflow.
</h2>


<p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
Every agent action passed through identity,
authorization, policy enforcement, approval,
and audit recording.
</p>



<div className="mt-8 flex flex-wrap gap-3">


<button
onClick={viewTrace}
className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black hover:bg-zinc-200"
>
View Technical Traces
</button>



<button
onClick={restart}
className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-200"
>
Run Simulation Again
</button>


</div>


</div>

);


}








function DecisionBadge({
scenario,
}:{
scenario:SimulationScenario;
}){


return (

<span
className={`
rounded-lg border px-3 py-2 text-xs font-medium
${
scenario.decisionTone==="danger"
?"border-red-500/30 bg-red-500/10 text-red-400"
:
scenario.decisionTone==="warning"
?"border-amber-500/30 bg-amber-500/10 text-amber-400"
:
"border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
}
`}
>
{scenario.decision}
</span>

);


}







function toneDot(tone:string){

switch(tone){

case "danger":
return "bg-red-400";

case "warning":
return "bg-amber-400";

case "success":
return "bg-emerald-400";

case "violet":
return "bg-violet-400";

default:
return "bg-blue-400";

}

}