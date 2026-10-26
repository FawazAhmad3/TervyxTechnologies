import { useEffect, useRef } from "react";
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
          ref.current.style.transform = `rotate(${scrollY * 0.045 - 25}deg) rotateY(${scrollY * 0.035}deg)`;
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
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className={`ring r${n}`} />
            ))}
            <div className="core">✳</div>
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
