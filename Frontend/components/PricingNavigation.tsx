import pricing from "../data/pricing.json";
export default function PricingNavigation() {
  return (
    <nav className="pricing-navigation" aria-label={pricing.page.title}>
      {pricing.navigation.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
          <span aria-hidden="true">↓</span>
        </a>
      ))}
    </nav>
  );
}
