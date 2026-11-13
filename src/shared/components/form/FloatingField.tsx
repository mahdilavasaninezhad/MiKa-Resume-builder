import {
  cloneElement,
  useState,
  type ElementType,
  type ReactElement,
} from "react";

interface FloatingFieldProps {
  label: string;
  icon: ElementType;
  value: string;
  error?: string;
  className?: string;
  children: ReactElement<{ placeholder?: string }>;
}

export function FloatingField({
  label,
  icon: Icon,
  value,
  error,
  className = "",
  children,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const filled = value.trim().length > 0;
  const floating = focused || filled;

  const valueColor = filled ? "text-[var(--success)]" : "text-[var(--muted)]";
  const iconColor = error ? "text-[var(--danger)]" : valueColor;
  const labelColor = error
    ? "text-[var(--danger)]"
    : focused
      ? "text-[var(--accent)]"
      : valueColor;

  return (
    <label className={`relative block min-w-0 pt-[10px] ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute -left-6 top-6 flex h-[11px] items-center transition-colors duration-200 ${iconColor}`}
      >
        <Icon size={16} strokeWidth={1.5} />
      </div>

      <div
        data-filled={filled}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={() => setFocused(false)}
        className={`
          form-field relative flex h-9 min-w-0 items-center
          rounded-lg px-4 py-4.5 text-md transition-all
          ${error ? "border-[var(--danger)]" : ""}
        `}
      >
        {cloneElement(children, {
          placeholder: focused && !filled ? children.props.placeholder : "",
        })}

        <span
          className={`
            pointer-events-none absolute z-10 whitespace-nowrap
            -translate-y-1/2 transition-all duration-300
            ${
              floating
                ? "shadow-button left-3.5 top-0 rounded-[5px] bg-[var(--surface)] px-1 text-[9px]"
                : "left-4 top-1/2 text-xs"
            }
            ${labelColor}
          `}
        >
          {label}
        </span>
      </div>

      {error && (
        <p
          className="absolute -top-1 right-0 truncate text-[10px] leading-3 text-[var(--danger)]"
          title={error}
        >
          {error}
        </p>
      )}
    </label>
  );
}