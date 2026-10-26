import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import WebDevelopment from "./pages/WebDevelopment";
import AppDevelopment from "./pages/AppDevelopment";
import DigitalMarketing from "./pages/DigitalMarketing";
import NotFound from "./pages/NotFound";
// Physical HTML entrypoints keep all eight pages independently addressable.
const pages = {
  "/": Home,
  "/index": Home,
  "/about": About,
  "/services": Services,
  "/process": Process,
  "/contact": Contact,
  "/web-development": WebDevelopment,
  "/app-development": AppDevelopment,
  "/digital-marketing": DigitalMarketing,
};
export default function App() {
  const path =
    location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  const Page = pages[path as keyof typeof pages] ?? NotFound;
  return <Page />;
}
