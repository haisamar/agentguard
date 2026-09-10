"use client";

import { useEffect, useState } from "react";

import type {
  SimulationScenario,
} from "./scenarios";


type StreamEvent = {
  id: string;
  title: string;
  description: string;
  tone:
    | "blue"
    | "success"
    | "warning"
    | "danger"
    | "violet"
    | "neutral";
};


export function SecurityEventStream({
  scenario,
  stepIndex,
}: {
  scenario: SimulationScenario;
  stepIndex: number;
}) {

  const [events, setEvents] = useState<StreamEvent[]>([]);



  useEffect(() => {

    /*
      Reset stream whenever a new scenario starts.
    */

    setEvents([]);


  }, [
    scenario.id,
  ]);





  useEffect(() => {

    const visibleSteps =
      scenario.steps.slice(
        0,
        stepIndex + 1
      );


    const generatedEvents =
      visibleSteps.map(
        (step,index) => ({
          id:
            `${scenario.id}-${step.id}-${index}`,

          title:
            step.title,

          description:
            `${scenario.agent}: ${step.description}`,

          tone:
            step.tone === "violet"
              ? "blue"
              : step.tone,
        })
      );



    setEvents(generatedEvents);



  }, [
    scenario.id,
    scenario.steps,
    scenario.agent,
    stepIndex,
  ]);






  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">


      <div className="flex items-center justify-between">


        <div>

          <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
            Security Event Stream
          </p>


          <h3 className="mt-2 text-lg font-medium">
            Runtime Authorization Trace
          </h3>


        </div>



        <span className="flex items-center gap-2 text-xs text-emerald-400">

          <span className="h-2 w-2 rounded-full bg-emerald-400" />

          Live

        </span>


      </div>





      <div className="mt-6 space-y-3">


        {events.length === 0 && (

          <p className="text-sm text-zinc-600">
            Waiting for agent activity...
          </p>

        )}





        {events.map((event,index)=>(

          <div
            key={event.id}
            className="rounded-xl border border-white/10 bg-black/20 p-4 transition-all duration-300"
          >


            <div className="flex gap-3">


              <div className="flex flex-col items-center">


                <span
                  className={`mt-1 h-2 w-2 rounded-full ${toneDot(event.tone)}`}
                />


                {index !== events.length - 1 && (

                  <span className="mt-2 h-full w-px bg-white/10" />

                )}

              </div>





              <div>


                <div className="flex items-center gap-2">


                  <span className="text-[10px] font-mono text-zinc-600">
                    EVT-{String(index + 1).padStart(3,"0")}
                  </span>


                  <span
                    className={`text-[10px] uppercase tracking-wider ${toneText(event.tone)}`}
                  >
                    {event.tone}
                  </span>


                </div>



                <p className="mt-1 text-sm font-medium text-zinc-200">
                  {event.title}
                </p>


                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {event.description}
                </p>


              </div>


            </div>


          </div>


        ))}


      </div>


    </div>
  );
}






function toneDot(
  tone: StreamEvent["tone"]
) {

  switch(tone){

    case "danger":
      return "bg-red-400";

    case "warning":
      return "bg-amber-400";

    case "success":
      return "bg-emerald-400";

    case "violet":
      return "bg-violet-400";

    case "neutral":
      return "bg-zinc-500";

    default:
      return "bg-blue-400";

  }

}





function toneText(
  tone: StreamEvent["tone"]
) {

  switch(tone){

    case "danger":
      return "text-red-400";

    case "warning":
      return "text-amber-400";

    case "success":
      return "text-emerald-400";

    case "violet":
      return "text-violet-400";

    case "neutral":
      return "text-zinc-500";

    default:
      return "text-blue-400";

  }

}