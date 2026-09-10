"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";


type DemoTrace =
  | "authorized"
  | "denied"
  | "approval";


type DemoContextType = {

  selectedTrace: DemoTrace;

  setSelectedTrace:
    (
      trace: DemoTrace
    ) => void;

  scrollToTrace:
    () => void;

};



const DemoContext =
  createContext<DemoContextType | null>(null);




export function DemoProvider({
  children,
}:{
  children:React.ReactNode;
}) {


  const [
    selectedTrace,
    setSelectedTrace
  ] =
  useState<DemoTrace>(
    "authorized"
  );



  function scrollToTrace(){

    document
      .getElementById(
        "technical-traces"
      )
      ?.scrollIntoView({
        behavior:"smooth",
      });

  }



  return (

    <DemoContext.Provider
      value={{
        selectedTrace,
        setSelectedTrace,
        scrollToTrace,
      }}
    >

      {children}

    </DemoContext.Provider>

  );

}





export function useDemo(){

  const context =
    useContext(
      DemoContext
    );


  if(!context){

    throw new Error(
      "useDemo must be inside DemoProvider"
    );

  }


  return context;

}