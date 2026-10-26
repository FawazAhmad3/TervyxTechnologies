import contact from "../data/contact.json";
import Reveal from "./Reveal";
export default function ContactIntro() {
  return (
    <div>
      <Reveal className="section-label">{contact.label}</Reveal>
      <Reveal as="h1" className="contact-title">
        {contact.lines.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
        <em>{contact.accent}</em>
      </Reveal>
      <Reveal as="p">
        {contact.description.map((line) => (
          <span className="block" key={line}>
            {line}
          </span>
        ))}
      </Reveal>
      <Reveal className="contact-sign">
        <span aria-hidden="true">✳</span>
        <span>
          {contact.signature.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </span>
      </Reveal>
    </div>
  );
}
