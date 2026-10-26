import site from "../data/site.json";
export default function Brand() {
  return (
    <a
      className="brand shrink-0"
      href={site.brand.home}
      aria-label={`${site.brand.fullName} home`}
    >
      <span className="brand-icon" aria-hidden="true">
        {site.brand.icon}
      </span>
      <span>
        {site.brand.name}
        <small>{site.brand.descriptor}</small>
      </span>
    </a>
  );
}
