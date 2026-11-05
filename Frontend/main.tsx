import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/fonts.css";
import "./styles/tailwind.css";
import "./styles/navy-theme.css";
import "./styles/dark-theme.css";
const app = (
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);

const root = document.getElementById("root")!;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
