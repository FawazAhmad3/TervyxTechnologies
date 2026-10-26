import type { ReactNode } from "react";
export default function Button({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a className="button lime" href={href}>
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}
