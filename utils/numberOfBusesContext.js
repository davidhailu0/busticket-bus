import { createContext,useContext } from "react";

export const NumberOfBusContext = createContext()

export const useNumberOfBusContext = ()=>useContext(NumberOfBusContext)