import home from "../data/home.json";
import Reveal from "./Reveal";
export default function HomeIntroduction() {
  const c = home.introduction;
  return (
    <section className="section home-introduction border-t border-[#303831]">
      <Reveal className="section-label">{c.label}</Reveal>
      <div className="mt-7 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <Reveal as="h2">
            {c.heading}
            <br />
            <span>{c.muted}</span>
          </Reveal>
          <Reveal className="mt-8 max-w-xl space-y-5">
            {c.paragraphs.map((text) => (
              <p key={text} className="text-sm">
                {text}
              </p>
            ))}
            <a className="text-link pt-3 text-brand-lime" href={c.link.href}>
              {c.link.label}
              <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
        <div className="self-center">
          {c.principles.map((item, index) => (
            <Reveal
              key={item.label}
              className="border-b border-[#303831] py-6 first:pt-0"
            >
              <div className="flex gap-5">
                <span className="pt-1 font-display text-xs text-brand-lime">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.5px]">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm">{item.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
