interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="glass-panel rounded-[32px] p-8">
      <div className="text-sm font-medium text-[var(--accent)]">Pulse</div>
      <h2 className="mt-2 text-3xl font-semibold">{title}</h2>
      <p className="mt-3 text-[var(--muted)]">{description}</p>
    </section>
  );
}
