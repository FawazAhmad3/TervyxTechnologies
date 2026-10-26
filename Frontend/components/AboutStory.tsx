import about from "../data/about.json";
import Reveal from "./Reveal";
export default function AboutStory() {
  const c = about.story;
  return (
    <section className="about section">
      <Reveal className="section-label">{c.label}</Reveal>
      <div className="about-content">
        <Reveal as="h2">
          {c.lines.map((line) => (
            <span className="block text-inherit!" key={line}>
              {line}
            </span>
          ))}
          <span>{c.muted}</span>
        </Reveal>
        <Reveal className="about-bottom">
          <div className="asterisk" aria-hidden="true">
            ✳
          </div>
          <div>
            {c.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
