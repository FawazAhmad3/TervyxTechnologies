import { useContent } from "../i18n/content";
import contactSource from "../data/contact.json";
export default function ContactChannels() {
  const contact = useContent(contactSource);

  const c = contact.channels;
  return (
    <address className="contact-channels" aria-label={c.label}>
      <a href={c.email.href}>{c.email.label}</a>
    </address>
  );
}
