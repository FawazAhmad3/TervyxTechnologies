import Reveal from "./Reveal";
export default function DetailCard({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <Reveal as="article" className="detail-card">
      <div className="step-number">
        {String(index + 1).padStart(2, "0")}
        <span aria-hidden="true">↗</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
