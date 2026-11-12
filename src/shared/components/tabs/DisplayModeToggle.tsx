import { GalleryHorizontal, List } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

export type DisplayMode = "slider" | "compact";
export type DisplayTone = "accent" | "success" | "warning";

const modes = [
  { value: "slider", label: "نمای اسلایدر", icon: GalleryHorizontal },
  { value: "compact", label: "نمای فشرده", icon: List },
] as const;

export function DisplayModeToggle({
  value,
  onChange,
  tone,
}: {
  value: DisplayMode;
  onChange: (value: DisplayMode) => void;
  tone: DisplayTone;
}) {
  return (
    <div className="fixed bottom-3 right-3 w-22 p-1 shadow-button rounded-xl !bg-[var(--bg)]">
    <div
      dir="ltr"
      role="group"
      aria-label="حالت نمایش"
      className="neo-inset grid grid-cols-2 rounded-xl px-1.5"
      style={{ "--display-tone": `var(--${tone})` } as CSSProperties}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-2.5 left-2.5 top-2.5 w-[calc(50%-9px)] rounded-lg shadow-button !bg-[var(--bg)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${value === "compact" ? "translate-x-full" : "translate-x-0"}`}
      />
      {modes.map(({ value: mode, label, icon: Icon }) => (
        <button
          key={mode}
          type="button"
          aria-label={label}
          title={label}
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={`relative grid h-9 place-items-center rounded-xl hover:text-[var(--display-tone)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] ${value === mode ? "text-[var(--display-tone)]" : "text-[var(--muted)]"}`}
        >
          <Icon size={18} aria-hidden="true" />
        </button>
      ))}
    </div>
    </div>
  );
}

export function CompactDisplay({
  label,
  tone,
  children,
}: {
  label: string;
  tone: DisplayTone;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className="glass-panel rounded-[20px] px-3 py-4"
      style={{
        "--display-tone": `var(--${tone})`,
        "--display-soft": `var(--${tone}-soft)`,
      } as CSSProperties}
    >
      <ul className="m-0 grid list-none grid-cols-2 gap-y-4 gap-x-1 p-0 md:grid-cols-3 xl:grid-cols-4">
        {children}
      </ul>
    </section>
  );
}

export function CompactDisplayItem({
  title,
  action,
}: {
  title: string;
  action:
    | { label: string; href: string }
    | { label: string; onClick: () => void };
}) {
  const actionClass =
    "absolute right-5 -bottom-2.5 shadow-button inline-flex min-h-5 shrink-0 items-center rounded-lg px-2 !text-[12px] pb-0.5 !font-semibold !bg-[var(--display-tone)] !text-[var(--bg)] hover:!bg-[var(--bg)] hover:!text-[var(--display-tone)] focus-visible:outline-2 focus-visible:outline-[var(--display-tone)]";

  return (
    <li className="active-inset flex min-w-0 items-center justify-between gap-1.5 rounded-xl px-5 py-2 !bg-[var(--display-soft)] relative">
      <span dir="auto" title={title} className="min-w-0 truncate text-xs font-semibold">
        {title}
      </span>
      {"href" in action ? (
        <a href={action.href} target="_blank" rel="noopener noreferrer" aria-label={`${action.label} — ${title}`} className={actionClass}>
          {action.label}
        </a>
      ) : (
        <button type="button" onClick={action.onClick} aria-label={`${action.label} — ${title}`} className={actionClass}>
          {action.label}
        </button>
      )}
    </li>
  );
}