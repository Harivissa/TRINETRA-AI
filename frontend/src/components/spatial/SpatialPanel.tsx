import type { ReactNode } from "react";

export function SpatialPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`spatial-panel ${className}`}>{children}</div>;
}

export function DepthCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`depth-card ${className}`}>{children}</div>;
}
