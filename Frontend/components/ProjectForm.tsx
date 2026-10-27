import { useState, type FormEvent } from "react";
import services from "../data/services.json";
import contact from "../data/contact.json";
import Reveal from "./Reveal";
export default function ProjectForm() {
  const c = contact.form;
  const params = new URLSearchParams(location.search);
  const initial = params.get("service");
  const [selected, setSelected] = useState<string[]>(
    services.items.filter((s) => s.slug === initial).map((s) => s.title),
  );
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    if (!selected.length) {
      setStatus(c.missingService);
      event.currentTarget
        .querySelector<HTMLInputElement>('input[type="checkbox"]')
        ?.focus();
      return;
    }
    const data = new FormData(event.currentTarget);
    setSending(true);
    setStatus("");
    const form = event.currentTarget;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      const response = await fetch("/api/quotation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          services: selected,
          idea: data.get("idea"),
          website: data.get("website"),
        }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        setStatus(response.status === 429 ? c.rateLimited : c.error);
        return;
      }
      setStatus(`${c.success} ${c.referenceLabel}: ${result.reference}`);
      form.reset();
      setSelected([]);
    } catch {
      setStatus(c.error);
    } finally {
      clearTimeout(timeout);
      setSending(false);
    }
  }
  return (
    <Reveal>
      <form onSubmit={submit} aria-busy={sending}>
        <div className="quote-honeypot" aria-hidden="true">
          <label>
            Leave this field empty
            <input
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>
        <h2 className="form-title">{c.title}</h2>
        <p>{c.description}</p>
        <fieldset className="service-options" aria-label={c.title}>
          {services.items.map((service) => (
            <label key={service.slug}>
              <input
                type="checkbox"
                name="service"
                value={service.title}
                checked={selected.includes(service.title)}
                onChange={(event) => {
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, service.title]
                      : current.filter((s) => s !== service.title),
                  );
                  setStatus("");
                }}
              />
              <span>{service.title} ↗</span>
            </label>
          ))}
        </fieldset>
        <label className="field">
          {c.name.label}
          <input
            name="name"
            placeholder={c.name.placeholder}
            required
            autoComplete="name"
            maxLength={120}
          />
        </label>
        <label className="field">
          {c.email.label}
          <input
            type="email"
            name="email"
            placeholder={c.email.placeholder}
            required
            autoComplete="email"
            maxLength={254}
          />
        </label>
        <label className="field">
          {c.idea.label}
          <textarea
            name="idea"
            placeholder={c.idea.placeholder}
            required
            rows={3}
            maxLength={5000}
          />
        </label>
        <button className="button lime" type="submit" disabled={sending}>
          {sending ? c.sending : c.button}
          <span aria-hidden="true">↗</span>
        </button>
        <p className="form-note">{c.note}</p>
        <p className="form-status" role="status">
          {status}
        </p>
      </form>
    </Reveal>
  );
}
