import services from "../data/services.json";
export default function ServiceDirectory() {
  return (
    <nav className="service-directory" aria-label={services.directoryLabel}>
      {services.directory.map((link) => (
        <a className="text-link" key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}
