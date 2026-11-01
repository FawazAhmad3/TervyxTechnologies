import contact from "../data/contact.json";
export default function ContactChannels() {
  const c = contact.channels;
  return (
    <address className="contact-channels" aria-label={c.label}>
      <a href={c.email.href}>{c.email.label}</a>
      <a href={c.phone.href}>{c.phone.label}</a>
      <a href={c.whatsapp.href} target="_blank" rel="noopener noreferrer">
        {c.whatsapp.label} ↗
      </a>
    </address>
  );
}
