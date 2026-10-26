import { useEffect, useState } from "react";
import PricingNavigation, { type PricingCategory } from "./PricingNavigation";
import PairedPricing from "./PairedPricing";
import AndroidPricing from "./AndroidPricing";
const categoryFromHash = (): PricingCategory =>
  location.hash === "#android-plans" ? "android-plans" : "website-plans";
export default function PricingTabs() {
  const [active, setActive] = useState<PricingCategory>(categoryFromHash);
  useEffect(() => {
    const sync = () => setActive(categoryFromHash());
    addEventListener("hashchange", sync);
    return () => removeEventListener("hashchange", sync);
  }, []);
  function select(category: PricingCategory) {
    setActive(category);
    history.replaceState(
      null,
      "",
      `${location.pathname}${location.search}#${category}`,
    );
  }
  return (
    <>
      <PricingNavigation active={active} onChange={select} />
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        {active === "website-plans" ? <PairedPricing /> : <AndroidPricing />}
      </div>
    </>
  );
}
