import home from "../data/home.json";
type Preview = (typeof home.projects.items)[number]["preview"];
export default function ProjectPreview({ preview }: { preview: Preview }) {
  return (
    <div
      className={`project-preview project-preview-${preview.kind}`}
      aria-hidden="true"
    >
      <div className="preview-window">
        <div className="preview-chrome">
          <i />
          <i />
          <i />
          <span>↗</span>
        </div>
        <div className="preview-window-content">
          <div className="preview-kicker">{preview.label}</div>
          <div className="preview-orb">✳</div>
          <h3>{preview.title}</h3>
          <p>{preview.subtitle}</p>
          <div className="preview-action">
            {preview.button}
            <span>↗</span>
          </div>
          <div className="preview-mini-grid">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
      <div className="preview-caption">
        {preview.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
