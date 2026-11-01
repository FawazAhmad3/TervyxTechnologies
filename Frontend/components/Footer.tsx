import FooterArtwork from "./FooterArtwork";
import Brand from "./Brand";
import ContactChannels from "./ContactChannels";
import site from "../data/site.json";
export default function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <Brand />
        <p>
          {site.footer.lines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
        <a href="#top">{site.footer.top}</a>
      </div>
      <div className="footer-links">
        {site.footer.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <ContactChannels />
      <div className="footer-brand-line" aria-hidden="true">
        <FooterArtwork />
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} {site.footer.copyright}
        </span>
        <span>{site.footer.tagline}</span>
        <span>{site.footer.note}</span>
      </div>
    </footer>
  );
}
