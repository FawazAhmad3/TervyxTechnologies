import process from "../data/process.json";
import SectionHeading from "./SectionHeading";
import ProcessStep from "./ProcessStep";
export default function ProcessSteps({
  summary = false,
}: {
  summary?: boolean;
}) {
  const content = summary ? process.summary : process.steps;
  return (
    <section className="process section" id="process">
      <SectionHeading content={content} />
      <div className="steps">
        {content.items.map((step, index) => (
          <ProcessStep key={step.title} {...step} index={index} />
        ))}
      </div>
    </section>
  );
}
