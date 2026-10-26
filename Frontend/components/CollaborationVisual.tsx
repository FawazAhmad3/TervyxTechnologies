import home from "../data/home.json";
import Reveal from "./Reveal";
export default function CollaborationVisual() {
  const c = home.collaboration.visual;
  return (
    <Reveal className="collaboration-visual">
      <div className="section-label">{c.label}</div>
      <div className="collaboration-map">
        <div className="map-orbit" aria-hidden="true" />
        <div className="map-orbit inner" aria-hidden="true" />
        <div className="map-center">
          <span aria-hidden="true">✳</span>
          <span>{c.center}</span>
        </div>
        {c.nodes.map((node, index) => (
          <span className={`map-node node-${index}`} key={node}>
            {node}
          </span>
        ))}
      </div>
      <div className="section-label">{c.bottom}</div>
    </Reveal>
  );
}
