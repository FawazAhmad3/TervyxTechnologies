import pricing from "../data/pricing.json";
export default function PricingScopeNote() {
  const note = pricing.page.scopeNotice;
  return (
    <aside className="pricing-scope-note" aria-label={note.title}>
      <strong>{note.title}</strong>
      <strong>{note.text}</strong>
    </aside>
  );
}
