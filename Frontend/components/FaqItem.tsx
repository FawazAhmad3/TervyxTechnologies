export default function FaqItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  return (
    <details className="faq-item" name="homepage-questions">
      <summary>
        <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
        <h3>{question}</h3>
        <span className="faq-toggle" aria-hidden="true">
          +
        </span>
      </summary>
      <p>{answer}</p>
    </details>
  );
}
