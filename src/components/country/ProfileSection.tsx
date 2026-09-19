import React from "react";

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProfileSection({ title, children, className = "" }: ProfileSectionProps) {
  return (
    <section className={`border border-trinetra-border bg-trinetra-panel rounded-md p-6 ${className}`}>
      <h3 className="font-display text-2xl text-white mb-4 tracking-wide border-b border-trinetra-border/60 pb-3">
        {title}
      </h3>
      <div>{children}</div>
    </section>
  );
}
