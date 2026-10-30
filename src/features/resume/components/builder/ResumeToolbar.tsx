import {
  CircleAlert,
  CheckCircle2,
  Eye,
  FileText,
  LayoutTemplate,
  LoaderCircle,
  Pencil,
  Download,
  Maximize2,
} from "lucide-react";

import type {
  ResumeSaveStatus,
} from "../../hooks/useResumeAutosave";

import type {
  Resume,
  ResumeTemplate,
  UpdateResumeInput,
} from "../../types/resume.types";

import { useResumeEditorStore } from "../../store/resume-editor.store";

import { ResumeProgress } from "./ResumeProgress";

interface ResumeToolbarProps {
  resume: Resume;

  completion: number;

  saveStatus:
    ResumeSaveStatus;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

export function ResumeToolbar({
  resume,
  completion,
  saveStatus,
  onUpdate,
}: ResumeToolbarProps) {
  const previewMode =
    useResumeEditorStore(
      (state) =>
        state.previewMode,
    );

  const setPreviewMode =
    useResumeEditorStore(
      (state) =>
        state.setPreviewMode,
    );

    const setFullscreenPreview =
    useResumeEditorStore(
        (state) =>
          state.setFullscreenPreview,
    );

  function handleTemplateChange(
    template: ResumeTemplate,
  ) {
    onUpdate({
      template,
    });
  }

  return (
    <section className="glass-panel rounded-[30px] p-4 md:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="neo-button flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-[var(--accent)]">
            <FileText size={21} />
          </div>

          <div className="min-w-0">
            <div className="truncate text-lg font-semibold">
              {resume.title}
            </div>

            <SaveState
              status={
                saveStatus
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <ResumeProgress
            value={completion}
          />

          <div className="flex items-center gap-2">
            <div className="neo-inset flex items-center gap-2 rounded-2xl px-3">
              <LayoutTemplate
                size={17}
                className="text-[var(--muted)]"
              />

              <select
                value={
                  resume.template
                }
                onChange={(
                  event,
                ) =>
                  handleTemplateChange(
                    event.target
                      .value as ResumeTemplate,
                  )
                }
                className="h-11 bg-transparent text-sm outline-none"
              >
                <option value="modern">
                  Modern
                </option>

                <option value="minimal">
                  Minimal
                </option>

                <option value="professional">
                  Professional
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                setPreviewMode(
                  !previewMode,
                )
              }
              className="neo-button flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-medium xl:hidden"
            >
              {previewMode ? (
                <>
                  <Pencil
                    size={17}
                  />
                  Editor
                </>
              ) : (
                <>
                  <Eye
                    size={17}
                  />
                  Preview
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SaveState({
  status,
}: {
  status: ResumeSaveStatus;
}) {
  if (
    status === "saving"
  ) {
    return (
      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
        <LoaderCircle
          size={14}
          className="animate-spin text-[var(--accent)]"
        />

        Saving...
      </div>
    );
  }

  if (
    status === "error"
  ) {
    return (
      <div className="mt-1 flex items-center gap-2 text-xs text-[var(--danger)]">
        <CircleAlert
          size={14}
        />

        Save failed
      </div>
    );
  }

  return (
    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
      <CheckCircle2
        size={14}
        className="text-[var(--success)]"
      />

      Saved
    </div>
  );
}