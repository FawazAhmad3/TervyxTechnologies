import Reveal from "./Reveal";
export default function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Reveal as="article">
      <h3>{title}</h3>
      <p>{description}</p>
    </Reveal>
  );
}
