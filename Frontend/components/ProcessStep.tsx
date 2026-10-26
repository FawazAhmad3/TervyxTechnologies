import Reveal from "./Reveal";
export default function ProcessStep({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: number;
}) {
  return (
    <Reveal as="article">
      <div className="step-number">
        {String(index + 1).padStart(2, "0")}
        <span aria-hidden="true">↗</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
