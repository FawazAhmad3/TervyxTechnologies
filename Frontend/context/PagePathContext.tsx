import { createContext, useContext } from "react";
export const PagePathContext = createContext("/");
export const usePagePath = () => useContext(PagePathContext);
