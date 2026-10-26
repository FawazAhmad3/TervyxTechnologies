import home from "../data/home.json";
import Button from "./Button";
import OrbitSculpture from "./OrbitSculpture";
export default function Hero() {
  const c = home.hero;
  return (
    <section className="hero" id="home">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow">
          <i />
          {c.label}
        </div>
        <h1>
          {c.lines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
          <em>{c.accent}</em>
        </h1>
        <p className="max-w-[390px]">
          {c.paragraph.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
        <div className="hero-actions">
          <Button href={c.primary.href}>{c.primary.label}</Button>
          <a className="text-link" href={c.secondary.href}>
            {c.secondary.label}
            <span>↓</span>
          </a>
        </div>
        <div className="hero-note">
          <span className="mini-stars" aria-hidden="true">
            ✳
          </span>
          {c.note}
        </div>
      </div>
      <OrbitSculpture />
      <div className="hero-bottom">
        <span>{c.industry}</span>
        <a href={c.scroll.href}>
          {c.scroll.label}
          <span>↓</span>
        </a>
      </div>
    </section>
  );
}
