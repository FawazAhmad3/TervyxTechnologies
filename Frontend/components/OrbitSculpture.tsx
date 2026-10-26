import { useEffect, useRef } from "react";
import BrandArtwork from "./BrandArtwork";
import home from "../data/home.json";
export default function OrbitSculpture() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current)
          ref.current.style.transform = `rotate(${scrollY * 0.018}deg)`;
      });
    };
    addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  const c = home.hero;
  return (
    <div className="art" role="img" aria-label={c.image.alt}>
      {c.image.src ? (
        <img
          className="h-full w-full object-contain"
          src={c.image.src}
          alt={c.image.alt}
        />
      ) : (
        <>
          <div className="orbit-label top">
            {c.orbit.top}
            <span>+</span>
          </div>
          <div className="sculpture" ref={ref}>
            <BrandArtwork
              variant="symbol"
              className="hero-brand-symbol"
              decorative
            />
          </div>
          <div className="art-cross one">+</div>
          <div className="art-cross two">+</div>
          <div className="orbit-label bottom">
            <i />
            {c.orbit.bottom}
            <span>{c.orbit.index}</span>
          </div>
        </>
      )}
    </div>
  );
}
