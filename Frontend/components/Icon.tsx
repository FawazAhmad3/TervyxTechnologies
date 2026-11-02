import { Fragment } from "react";
type IconName =
  "arrow-up-right" | "arrow-down" | "arrow-up" | "arrow-right" | "asterisk";
export default function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    "arrow-up-right": "M4 20 20 4M5 4h15v15",
    "arrow-down": "M12 3v18M5 14l7 7 7-7",
    "arrow-up": "M12 21V3M5 10l7-7 7 7",
    "arrow-right": "M3 12h18M14 5l7 7-7 7",
    asterisk: "M12 2v20M2 12h20M5 5l14 14M5 19 19 5",
  };
  return (
    <svg
      className={`ui-icon ui-icon-${name}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
const names: Record<string, IconName> = {
  "↗": "arrow-up-right",
  "↓": "arrow-down",
  "↑": "arrow-up",
  "→": "arrow-right",
  "✳": "asterisk",
};
export function IconText({ text }: { text: string }) {
  return (
    <>
      {text.split(/([↗↓↑→✳])/u).map((part, index) => (
        <Fragment key={index}>
          {names[part] ? <Icon name={names[part]} /> : part}
        </Fragment>
      ))}
    </>
  );
}
