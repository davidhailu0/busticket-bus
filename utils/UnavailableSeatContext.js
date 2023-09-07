import { createContext,useContext } from "react";

export const UnavailableContext = createContext()

export const useUnavailableContext = ()=>useContext(UnavailableContext)