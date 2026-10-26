import { useEffect, useState } from "react";
import PricingNavigation, { type PricingCategory } from "./PricingNavigation";
import PairedPricing from "./PairedPricing";
import AndroidPricing from "./AndroidPricing";
import SmmPricing from "./SmmPricing";
import SeoPricing from "./SeoPricing";
import pricing from "../data/pricing.json";
const panels = {
  "website-plans": PairedPricing,
  "android-plans": AndroidPricing,
  "smm-plans": SmmPricing,
  "seo-plans": SeoPricing,
};
const categoryFromHash = (): PricingCategory => {
  const category = location.hash.slice(1) as PricingCategory;
  return pricing.navigation.some((item) => item.href === `#${category}`)
    ? category
    : "website-plans";
};
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
  const Panel = panels[active];
  return (
    <>
      <PricingNavigation active={active} onChange={select} />
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
      >
        <Panel />
      </div>
    </>
  );
}
