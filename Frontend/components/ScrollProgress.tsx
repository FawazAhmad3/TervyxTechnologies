import { useEffect, useRef } from "react";
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        if (ref.current)
          ref.current.style.width = `${max ? (scrollY / max) * 100 : 0}%`;
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div className="progress" ref={ref} aria-hidden="true" />;
}
