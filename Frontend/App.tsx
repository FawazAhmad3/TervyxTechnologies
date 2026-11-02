import { PagePathContext } from "./context/PagePathContext";
import { normalizePath } from "./seo/paths";
import SocialMediaMarketing from "./pages/SocialMediaMarketing";
import SeoServices from "./pages/SeoServices";
import Pricing from "./pages/Pricing";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Process from "./pages/Process";
import Contact from "./pages/Contact";
import WebDevelopment from "./pages/WebDevelopment";
import AppDevelopment from "./pages/AppDevelopment";
import DigitalMarketing from "./pages/DigitalMarketing";
import NotFound from "./pages/NotFound";
// Physical HTML entrypoints keep every page independently addressable.
const pages = {
  "/": Home,
  "/index": Home,
  "/about": About,
  "/services": Services,
  "/process": Process,
  "/contact": Contact,
  "/pricing": Pricing,
  "/web-development": WebDevelopment,
  "/app-development": AppDevelopment,
  "/digital-marketing": DigitalMarketing,
  "/social-media-marketing": SocialMediaMarketing,
  "/seo-services": SeoServices,
};
export default function App({
  path = typeof location === "undefined" ? "/" : location.pathname,
}: {
  path?: string;
}) {
  path = normalizePath(path);
  const Page = pages[path as keyof typeof pages] ?? NotFound;
  return (
    <PagePathContext.Provider value={path}>
      <Page />
    </PagePathContext.Provider>
  );
}
