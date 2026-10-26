import Brand from "./Brand";
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
      <div className="footer-word">
        {site.brand.name}
        <span>®</span>
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
