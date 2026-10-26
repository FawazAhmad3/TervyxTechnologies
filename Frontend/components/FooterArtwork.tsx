import { useEffect, useRef } from "react";
import BrandArtwork from "./BrandArtwork";
export default function FooterArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const symbol = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!ref.current || !symbol.current) return;
        const progress = Math.max(
          0,
          Math.min(
            1,
            1 - ref.current.getBoundingClientRect().top / innerHeight,
          ),
        );
        symbol.current.style.transform = `rotate(${progress * 7 - 3.5}deg)`;
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
  return (
    <div className="footer-logo-artwork" ref={ref} aria-hidden="true">
      <div className="footer-symbol-scroll" ref={symbol}>
        <BrandArtwork
          variant="symbol"
          className="footer-animated-symbol"
          decorative
        />
      </div>
      <BrandArtwork
        variant="wordmark"
        className="footer-wordmark-art"
        decorative
      />
    </div>
  );
}
