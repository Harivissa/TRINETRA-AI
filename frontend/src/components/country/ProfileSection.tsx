interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ProfileSection({ title, children }: Props) {
  return (
    <div className="border border-trinetra-border rounded p-6 bg-trinetra-panel mb-6">
      <h2 className="font-display text-2xl text-trinetra-saffron mb-4">{title}</h2>
      {children}
    </div>
  );
}
