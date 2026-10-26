import process from "../data/process.json";
import SectionHeading from "./SectionHeading";
import ProcessStep from "./ProcessStep";
export default function ProcessSteps() {
  return (
    <section className="process section" id="process">
      <SectionHeading content={process.steps} />
      <div className="steps">
        {process.steps.items.map((step, index) => (
          <ProcessStep key={step.title} {...step} index={index} />
        ))}
      </div>
    </section>
  );
}
