import {
  Download,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import type {
  Resume,
} from "../../types/resume.types";

import {
  useResumeEditorStore,
} from "../../store/resume-editor.store";

import {
  ResumePreview,
} from "./ResumePreview";

export function FullscreenResumePreview({
  resume,
}: {
  resume: Resume;
}) {
  const open =
    useResumeEditorStore(
      (state) =>
        state.fullscreenPreview,
    );

  const setOpen =
    useResumeEditorStore(
      (state) =>
        state.setFullscreenPreview,
    );

  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    function handleKey(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape"
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKey,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKey,
      );
    };
  }, [
    open,
    setOpen,
  ]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[500] overflow-y-auto bg-[var(--bg)]/95 p-4 backdrop-blur-xl md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="sticky top-3 z-20 mb-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              window.print()
            }
            className="neo-button flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium"
          >
            <Download
              size={17}
            />

            Export PDF
          </button>

          <button
            type="button"
            onClick={() =>
              setOpen(false)
            }
            className="neo-button flex h-11 w-11 items-center justify-center rounded-2xl"
          >
            <X size={18} />
          </button>
        </div>

        <ResumePreview
          resume={resume}
          fullscreen
        />
      </div>
    </div>
  );
}