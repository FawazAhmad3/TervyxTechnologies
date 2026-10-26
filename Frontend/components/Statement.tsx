import { useEffect, useRef } from "react";
import process from "../data/process.json";
import Reveal from "./Reveal";
export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const update = () =>
      ref.current?.style.setProperty("--spin", `${scrollY * 0.045}deg`);
    addEventListener("scroll", update, { passive: true });
    update();
    return () => removeEventListener("scroll", update);
  }, []);
  const c = process.statement;
  return (
    <section className="statement" ref={ref}>
      <Reveal className="section-label">{c.label}</Reveal>
      <Reveal as="h2">
        {c.lines.map((line) => (
          <span className="block text-inherit!" key={line}>
            {line}
          </span>
        ))}
        <em>{c.accent}</em>
      </Reveal>
      <div className="statement-orbit" aria-hidden="true">
        ✳
      </div>
      <Reveal as="p">
        {c.description.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
