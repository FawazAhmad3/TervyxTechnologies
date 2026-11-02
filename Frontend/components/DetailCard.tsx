import Icon from "./Icon";
import Reveal from "./Reveal";
export default function DetailCard({
  title,
  description,
  index,
  href,
}: {
  title: string;
  description: string;
  index: number;
  href?: string;
}) {
  return (
    <Reveal as="article" className="detail-card">
      <div className="step-number">
        {String(index + 1).padStart(2, "0")}
        <span aria-hidden="true">
          <Icon name="arrow-up-right" />
        </span>
      </div>
      <h3>{href ? <a href={href}>{title}</a> : title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
