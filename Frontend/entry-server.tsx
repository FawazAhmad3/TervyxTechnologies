import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
export { seoConfig, seoPages } from "./seo/config";
export function renderPage(path: string) {
  return renderToString(
    <StrictMode>
      <ThemeProvider>
        <App path={path} />
      </ThemeProvider>
    </StrictMode>,
  );
}
