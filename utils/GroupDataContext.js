import { createContext,useContext } from "react";

export const GroupedDataContext = createContext()

export const useGroupedContext = ()=>useContext(GroupedDataContext)
