import { useRef, type KeyboardEvent } from "react";
import pricing from "../data/pricing.json";
export type PricingCategory = "website-plans" | "android-plans";
export default function PricingNavigation({
  active,
  onChange,
}: {
  active: PricingCategory;
  onChange: (category: PricingCategory) => void;
}) {
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight")
      next = (index + 1) % pricing.navigation.length;
    else if (event.key === "ArrowLeft")
      next =
        (index + pricing.navigation.length - 1) % pricing.navigation.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = pricing.navigation.length - 1;
    else return;
    event.preventDefault();
    onChange(pricing.navigation[next].href.slice(1) as PricingCategory);
    tabs.current[next]?.focus();
  }
  return (
    <div
      className="pricing-navigation"
      role="tablist"
      aria-label={pricing.page.title}
    >
      {pricing.navigation.map((item, index) => {
        const category = item.href.slice(1) as PricingCategory;
        return (
          <button
            key={category}
            ref={(el) => {
              tabs.current[index] = el;
            }}
            id={`tab-${category}`}
            type="button"
            role="tab"
            aria-selected={active === category}
            aria-controls={`panel-${category}`}
            tabIndex={active === category ? 0 : -1}
            onClick={() => onChange(category)}
            onKeyDown={(event) => handleKey(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
