import { useRef, useState, type KeyboardEvent } from "react";
import home from "../data/home.json";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import ProjectPreview from "./ProjectPreview";
export default function ProjectExplorer() {
  const c = home.projects;
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const item = c.items[active];
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % c.items.length;
    else if (event.key === "ArrowLeft")
      next = (index + c.items.length - 1) % c.items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = c.items.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  return (
    <section className="section bg-brand-panel">
      <SectionHeading content={c} />
      <Reveal>
        <div
          className="project-tabs"
          role="tablist"
          aria-label={c.heading + " " + c.muted}
        >
          {c.items.map((project, index) => (
            <button
              key={project.id}
              ref={(el) => {
                tabs.current[index] = el;
              }}
              id={`project-tab-${project.id}`}
              role="tab"
              aria-selected={active === index}
              aria-controls={`project-panel-${project.id}`}
              tabIndex={active === index ? 0 : -1}
              onKeyDown={(event) => handleKey(event, index)}
              onClick={() => setActive(index)}
            >
              {project.tab}
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div
          key={item.id}
          id={`project-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`project-tab-${item.id}`}
          tabIndex={0}
          className="project-panel"
        >
          <ProjectPreview preview={item.preview} />
          <div className="project-description">
            <div className="section-label">{item.type}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>
              {item.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">↗</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a className="text-link" href={item.href}>
              {c.button}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
        <p className="project-note">{c.note}</p>
      </Reveal>
    </section>
  );
}
