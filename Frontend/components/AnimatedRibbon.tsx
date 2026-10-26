import { useEffect, useRef } from "react";
import home from "../data/home.json";
export default function AnimatedRibbon() {
  const ribbon = useRef<HTMLElement>(null),
    track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ribbon.current,
      text = track.current;
    if (!el || !text) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      position = 0,
      target = 0,
      start = 0,
      end = 1,
      travel = 0;
    let disposed = false;
    const animate = () => {
      position += (target - position) * 0.16;
      if (Math.abs(target - position) < 0.2) position = target;
      text.style.transform = `translate3d(${-position}px,0,0)`;
      frame = position !== target ? requestAnimationFrame(animate) : 0;
    };
    const update = () => {
      if (media.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        text.style.transform = "none";
        return;
      }
      target =
        Math.max(0, Math.min(1, (scrollY - start) / (end - start))) * travel;
      if (!frame) frame = requestAnimationFrame(animate);
    };
    const measure = () => {
      if (disposed) return;
      const box = el.getBoundingClientRect();
      const top = box.top + scrollY;
      travel = Math.max(0, text.scrollWidth - el.clientWidth);
      start = top - innerHeight;
      end = top + box.height;
      update();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", measure);
    media.addEventListener("change", measure);
    document.fonts.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      resize.disconnect();
      removeEventListener("scroll", update);
      removeEventListener("resize", measure);
      media.removeEventListener("change", measure);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <section
      className="ribbon-scroll"
      aria-label={home.ribbon.label}
      ref={ribbon}
    >
      <div className="ticker">
        <div ref={track}>
          {[...home.ribbon.items, ...home.ribbon.items].map((item, i) => (
            <span className="ribbon-item" key={`${item}-${i}`}>
              {item}
              <span className="ribbon-star" aria-hidden="true">
                ✳
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
