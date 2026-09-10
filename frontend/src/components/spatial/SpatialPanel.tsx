import type { HTMLAttributes, PropsWithChildren } from "react";

export function SpatialPanel({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={`spatial-panel ${className}`} {...props}>{children}</div>;
}

export function DepthCard({ children, className = "", ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return <div className={`depth-card ${className}`} {...props}>{children}</div>;
}
