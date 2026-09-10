"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  PublicDemoCase,
  PublicTraceStep,
} from "@/lib/public-demo-data";

import { useDemo } from "./DemoContext";


type Tone =
  | "success"
  | "warning"
  | "danger"
  | "blue"
  | "violet"
  | "neutral";



export function PublicTraceExplorer({
  cases,
}: {
  cases: PublicDemoCase[];
}) {


  const {
    selectedTrace,
  } = useDemo();



  const [
    selectedKey,
    setSelectedKey,
  ] = useState<
    PublicDemoCase["key"]
  >(
    selectedTrace
  );



  useEffect(() => {

    setSelectedKey(
      selectedTrace
    );

  }, [
    selectedTrace,
  ]);




  const selected =
    cases.find(
      (item) =>
        item.key === selectedKey
    )
    ??
    cases[0]
    ??
    null;



  if (!selected) {

    return (

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">

        <p className="text-sm text-zinc-400">
          Technical traces are unavailable.
        </p>

      </div>

    );

  }




  return (

    <div>


      {/* TRACE SELECTOR */}

      <div className="flex flex-wrap gap-2">

        {cases.map((demoCase)=>(

          <button

            key={demoCase.key}

            type="button"

            onClick={() =>
              setSelectedKey(
                demoCase.key
              )
            }

            className={`
              rounded-lg border px-4 py-2.5 text-sm transition
              ${
                selected.key === demoCase.key

                  ? tabActiveStyle(
                      demoCase.key
                    )

                  : "border-white/10 bg-white/[0.02] text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
              }
            `}

          >

            {demoCase.tabLabel}

          </button>

        ))}

      </div>






      {/* TRACE CARD */}


      <div className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f12]">


        {/* HEADER */}


        <div className="border-b border-white/[0.07] px-7 py-7">


          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">



            <div className="max-w-4xl">


              <div className="flex flex-wrap items-center gap-3">


                <h3 className="text-xl font-semibold text-zinc-100">

                  {selected.title}

                </h3>



                <StatusBadge

                  status={
                    selected.status
                  }

                  tone={
                    selected.statusTone
                  }

                />


              </div>




              <p className="mt-3 text-sm leading-6 text-zinc-500">

                {selected.subtitle}

              </p>



            </div>






            {/* TRACE MODEL CARD */}


            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">


              <span className="h-2 w-2 rounded-full bg-blue-400" />


              <div>

                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">

                  Trace System

                </p>


                <p className="mt-1 text-xs font-medium text-zinc-300">

                  AgentGuard Security Model

                </p>


              </div>


            </div>



          </div>








          {/* SUMMARY */}


          <div className="mt-6 grid gap-3 sm:grid-cols-3">


            <SummaryCard

              label="Action"

              value={
                selected.action
              }

            />



            {selected.amount !== undefined && (

              <SummaryCard

                label="Risk Context"

                value={`$${selected.amount}`}

              />

            )}




            {selected.resource && (

              <SummaryCard

                label="Resource"

                value={
                  selected.resource
                }

                mono

              />

            )}



          </div>



        </div>








        {/* TRACE FLOW */}



        <div className="p-7">


          <div className="grid gap-3 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr]">



            {selected.steps.map(
              (step,index)=>(


                <div
                  key={step.number}
                  className="contents"
                >


                  <StepCard
                    step={step}
                  />



                  {
                    index <
                    selected.steps.length - 1
                    &&
                    (
                      <FlowArrow />
                    )
                  }


                </div>


              ))}


          </div>






          <div className="mt-7 border-t border-white/[0.07] pt-5">


            <div className="flex items-center gap-3">


              <span className="h-2 w-2 rounded-full bg-emerald-400"/>


              <p className="text-xs text-zinc-500">

                Complete security trace reconstructed from identity, authorization, policy enforcement, approval workflow, and audit history.

              </p>


            </div>


          </div>



        </div>



      </div>




    </div>

  );

}






function tabActiveStyle(
  key: PublicDemoCase["key"]
) {


  switch(key){


    case "authorized":

      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";


    case "denied":

      return "border-red-500/30 bg-red-500/10 text-red-400";


    case "approval":

      return "border-amber-500/30 bg-amber-500/10 text-amber-400";


    default:

      return "border-white/10 bg-white/[0.03] text-zinc-300";

  }

}







function SummaryCard({
  label,
  value,
  mono=false,
}:{
  label:string;
  value:string;
  mono?:boolean;
}){


  return (

    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">


      <p className="text-[10px] uppercase tracking-wider text-zinc-600">

        {label}

      </p>



      <p
        className={`
          mt-1 text-sm text-zinc-300
          ${
            mono
            ? "font-mono"
            : ""
          }
        `}
      >

        {value}

      </p>


    </div>

  );

}







function StepCard({
  step,
}:{
  step:PublicTraceStep;
}){


  const style =
    toneStyle(
      step.tone
    );



  return (

    <div
      className={`
        min-w-0 rounded-xl border p-4
        ${style.border}
        ${style.background}
      `}
    >


      <div className="flex items-center justify-between">


        <span
          className={`
            font-mono text-[10px] font-semibold
            ${style.text}
          `}
        >

          {step.number}

        </span>


        <span
          className={`
            h-1.5 w-1.5 rounded-full
            ${style.dot}
          `}
        />


      </div>




      <p className="mt-5 text-[10px] font-medium uppercase tracking-wider text-zinc-600">

        {step.label}

      </p>




      <p className="mt-1 text-sm font-medium text-zinc-200">

        {step.title}

      </p>




      <p className="mt-2 text-xs leading-5 text-zinc-600">

        {step.description}

      </p>



    </div>

  );

}







function FlowArrow(){

  return (

    <div className="hidden items-center justify-center xl:flex">


      <div className="flex items-center">


        <div className="h-px w-5 bg-white/10"/>


        <span className="text-zinc-700">
          ›
        </span>


      </div>


    </div>

  );

}








function StatusBadge({
  status,
  tone,
}:{
  status:string;
  tone:Tone;
}){


  const style =
    toneStyle(tone);



  return (

    <span
      className={`
        rounded-md border px-2 py-1
        text-[10px] font-semibold
        ${style.border}
        ${style.background}
        ${style.text}
      `}
    >

      {status}

    </span>

  );

}








function toneStyle(
  tone:Tone
){

  switch(tone){


    case "success":

      return {
        border:"border-emerald-500/20",
        background:"bg-emerald-500/[0.045]",
        text:"text-emerald-400",
        dot:"bg-emerald-400",
      };



    case "warning":

      return {
        border:"border-amber-500/20",
        background:"bg-amber-500/[0.045]",
        text:"text-amber-400",
        dot:"bg-amber-400",
      };



    case "danger":

      return {
        border:"border-red-500/20",
        background:"bg-red-500/[0.045]",
        text:"text-red-400",
        dot:"bg-red-400",
      };



    case "blue":

      return {
        border:"border-blue-500/20",
        background:"bg-blue-500/[0.045]",
        text:"text-blue-400",
        dot:"bg-blue-400",
      };



    case "violet":

      return {
        border:"border-violet-500/20",
        background:"bg-violet-500/[0.045]",
        text:"text-violet-400",
        dot:"bg-violet-400",
      };



    default:

      return {
        border:"border-white/10",
        background:"bg-white/[0.02]",
        text:"text-zinc-500",
        dot:"bg-zinc-600",
      };

  }

}