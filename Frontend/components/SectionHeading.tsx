import Reveal from "./Reveal";
export type HeadingContent = {
  label?: string;
  heading: string;
  muted?: string;
  description?: string[];
};
export default function SectionHeading({
  content,
}: {
  content: HeadingContent;
}) {
  return (
    <Reveal className="section-top">
      <div>
        {content.label && <div className="section-label">{content.label}</div>}
        <h2>
          {content.heading}
          {content.muted && (
            <>
              <br />
              <span>{content.muted}</span>
            </>
          )}
        </h2>
      </div>
      {content.description && (
        <p>
          {content.description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      )}
    </Reveal>
  );
}
