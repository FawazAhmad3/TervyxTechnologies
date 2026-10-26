import Reveal from "./Reveal";
export type IntroContent = {
  label: string;
  heading: string;
  accent: string;
  description: string;
};
export default function PageIntro({ content }: { content: IntroContent }) {
  return (
    <section className="page-intro">
      <Reveal className="section-label">{content.label}</Reveal>
      <Reveal as="h1">
        {content.heading}
        <br />
        <em>{content.accent}</em>
      </Reveal>
      <Reveal as="p">{content.description}</Reveal>
    </section>
  );
}
