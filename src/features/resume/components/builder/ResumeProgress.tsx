interface ResumeProgressProps {
  value: number;
}

export function ResumeProgress({
  value,
}: ResumeProgressProps) {
  return (
    <div className="min-w-36">
      <div className="mb-1 flex items-center justify-between gap-4">
        <span className="text-[9px] text-[var(--muted)]">
          Completion
        </span>

        <span className="text-[9px] font-semibold text-[var(--accent)]">
          {value}%
        </span>
      </div>

      <div className="neo-inset h-1.5 overflow-hidden rounded-full mb-4">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}