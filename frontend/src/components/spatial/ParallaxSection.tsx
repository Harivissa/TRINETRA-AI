import type { ReactNode } from "react";

export function ParallaxSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`parallax-section ${className}`}>{children}</section>;
}
