export function AboutPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="neo-surface rounded-[32px] p-7">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[32px] bg-[var(--accent-soft)] text-4xl font-bold text-[var(--accent)]">
          M
        </div>
        <h2 className="mt-6 text-center text-2xl font-semibold">MiKa</h2>
        <p className="mt-2 text-center text-sm text-[var(--muted)]">Software Developer</p>
      </section>

      <section className="glass-panel rounded-[32px] p-7">
        <div className="text-sm font-medium text-[var(--accent)]">About the creator</div>
        <h1 className="mt-2 text-3xl font-semibold">About Me</h1>
        <p className="mt-5 leading-8 text-[var(--muted)]">
          Your biography, experience, skills and resume will be displayed here.
        </p>
      </section>
    </div>
  );
}
