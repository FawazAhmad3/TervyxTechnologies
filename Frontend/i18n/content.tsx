import { createContext, useContext } from "react";
import { type Locale } from "./locale";
import { localize } from "./localize";
export { localize, translate } from "./localize";
export const LocaleContext = createContext<Locale>("en");
export function useContent<T>(content: T): T {
  return localize(content, useContext(LocaleContext));
}
