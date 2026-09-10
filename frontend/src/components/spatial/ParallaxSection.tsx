import { useEffect, useRef } from "react";
import type { PropsWithChildren } from "react";

export default function ParallaxSection({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(max-width: 640px)").matches) return;
    const onScroll = () => { node.style.setProperty("--parallax-y", `${Math.min(12, window.scrollY * 0.015)}px`); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <section ref={ref} className={`parallax-section ${className}`}>{children}</section>;
}
