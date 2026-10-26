import { useState, type FormEvent } from "react";
import services from "../data/services.json";
import contact from "../data/contact.json";
import site from "../data/site.json";
import Reveal from "./Reveal";
export default function ProjectForm() {
  const c = contact.form;
  const initial = new URLSearchParams(location.search).get("service");
  const [selected, setSelected] = useState<string[]>(
    services.items.filter((s) => s.slug === initial).map((s) => s.title),
  );
  const [status, setStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected.length) {
      setStatus(c.missingService);
      event.currentTarget
        .querySelector<HTMLInputElement>('input[type="checkbox"]')
        ?.focus();
      return;
    }
    const data = new FormData(event.currentTarget);
    const text = `${site.brand.fullName.toUpperCase()} — ${c.brief.title}\n${site.brand.tagline}\n\n${c.brief.name}: ${data.get("name")}\n${c.brief.email}: ${data.get("email")}\n${c.brief.services}: ${selected.join(", ")}\n\n${c.brief.idea}\n${data.get("idea")}\n\n${c.brief.date} ${new Date().toLocaleDateString()}\n`;
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = c.downloadName;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(c.success);
  }
  return (
    <Reveal>
      <form onSubmit={submit}>
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
        <button className="button lime" type="submit">
          {c.button}
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
