import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Brand from "./Brand";
import site from "../data/site.json";
export default function Header() {
  const [open, setOpen] = useState(false);
  const current =
    location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return (
    <header>
      <Brand />
      <nav
        id="main-navigation"
        className={open ? "open" : ""}
        aria-label="Main navigation"
      >
        {site.navigation.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={
              link.href.replace(/\.html$/, "") === current ? "page" : undefined
            }
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <ThemeToggle />
        <a className="nav-cta" href={site.contactLink.href}>
          {site.contactLink.label}
          <span aria-hidden="true">↗</span>
        </a>
        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-controls="main-navigation"
          aria-expanded={open}
          aria-label={open ? site.menu.close : site.menu.open}
        >
          {open ? "×" : "☰"}
        </button>
      </div>
    </header>
  );
}
