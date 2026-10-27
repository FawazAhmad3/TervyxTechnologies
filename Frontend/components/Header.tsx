import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Brand from "./Brand";
import site from "../data/site.json";
export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const media = matchMedia("(min-width: 901px)");
    const resize = () => {
      if (media.matches) setOpen(false);
    };
    addEventListener("keydown", close);
    media.addEventListener("change", resize);
    return () => {
      removeEventListener("keydown", close);
      media.removeEventListener("change", resize);
    };
  }, [open]);
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
          ref={menuButton}
          type="button"
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
