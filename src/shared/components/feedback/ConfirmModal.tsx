import {
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  createPortal,
} from "react-dom";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  tone?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  icon: Icon = LogOut,
  tone = "danger",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      );

      document.body.style.overflow =
        "";
    };
  }, [
    open,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  const iconColorClass =
    tone === "danger"
      ? "text-[var(--danger)]"
      : "text-[var(--accent)]";

  const confirmColorClass =
    tone === "danger"
      ? "!bg-[var(--danger)]"
      : "!bg-[var(--accent)]";

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/
        p-4
        backdrop-blur-xs
      "
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="
          neo-surface
          relative
          w-full
          max-w-md
          animate-modal-in
          rounded-[32px]
          p-6
          text-center
          md:p-7
        "
      >
        <button
          type="button"
          onClick={
            onClose
          }
          aria-label="Close dialog"
          className="
            shadow-button
            absolute
            right-8
            -top-5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            text-[var(--text)]
            hover:text-[var(--danger)]
          "
        >
          <X
            size={20}
          />
        </button>

        <div
          className={`
            neo-inset
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-[24px]

            ${iconColorClass}
          `}
        >
          <Icon
            size={27}
          />
        </div>

        <h2
          id="confirm-modal-title"
          className="
            mt-6
            text-2xl
            font-semibold
            tracking-tight
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            mb-6
            text-sm
            leading-6
            text-[var(--muted)]
          "
        >
          {description}
        </p>

        <div
          className="
            absolute
            -bottom-6
            left-1/2
            grid
            w-full
            max-w-80
            -translate-x-1/2
            grid-cols-2
            gap-3
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            disabled={
              loading
            }
            className="
              shadow-button
              rounded-2xl
              px-5
              py-3
              text-sm
              font-semibold
              text-[var(--muted)]
              hover:text-[var(--text)]
              disabled:opacity-50
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={
              onConfirm
            }
            disabled={
              loading
            }
            className={`
              shadow-button
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              opacity-90
              transition
              hover:opacity-100
              disabled:opacity-50

              ${confirmColorClass}
            `}
          >
            <Icon
              size={17}
            />

            {loading
              ? `${confirmText}...`
              : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}