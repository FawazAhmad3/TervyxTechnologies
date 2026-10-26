import { useEffect, type ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import site from "../data/site.json";
export default function Layout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} — ${site.brand.fullName}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", site.metadata.description);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", site.metadata.themeColor);
  }, [title]);
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
