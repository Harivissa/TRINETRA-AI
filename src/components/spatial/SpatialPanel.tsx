import React from "react";

interface SpatialPanelProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
}

export function SpatialPanel({ children, className = "", depth = 1 }: SpatialPanelProps) {
  return (
    <div
      className={`relative transition-all duration-300 border border-trinetra-border bg-trinetra-panel ${className}`}
      style={{
        boxShadow: `0 ${depth * 4}px ${depth * 16}px rgba(0, 0, 0, 0.45)`,
      }}
    >
      {children}
    </div>
  );
}

export function DepthCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group/depth relative transition-transform duration-300 ease-out hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

export function ParallaxSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

export default SpatialPanel;
