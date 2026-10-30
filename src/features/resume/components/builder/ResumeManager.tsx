import {
  Copy,
  FilePlus2,
  FileText,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useCreateResume,
  useDeleteResume,
} from "../../api/resume.queries";

import { useAuthStore } from "../../../auth/store/auth.store";

import { useResumeEditorStore } from "../../store/resume-editor.store";

import type {
  Resume,
  UpdateResumeInput,
} from "../../types/resume.types";

import {
  createEmptyResume,
} from "../../utils/createEmptyResume";

import {
  createDuplicateResume,
} from "../../utils/duplicateResume";

import { ConfirmModal } from "../../../../shared/components/feedback/ConfirmModal";

import {
  notify,
} from "../../../../shared/lib/notify";

interface ResumeManagerProps {
  resume: Resume;
  resumes: Resume[];

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

export function ResumeManager({
  resume,
  resumes,
  onUpdate,
}: ResumeManagerProps) {
  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  const activeResumeId =
    useResumeEditorStore(
      (state) =>
        state.activeResumeId,
    );

  const setActiveResumeId =
    useResumeEditorStore(
      (state) =>
        state.setActiveResumeId,
    );

  const createResume =
    useCreateResume();

  const deleteResume =
    useDeleteResume();

  const [
    editingTitle,
    setEditingTitle,
  ] = useState(false);

  const [
    title,
    setTitle,
  ] = useState(
    resume.title,
  );

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  async function handleCreate() {
    if (!user) {
      return;
    }

    try {
      const created =
        await createResume.mutateAsync(
          createEmptyResume(
            user.id,
            {
              fullName:
                user.displayName ||
                user.username,

              phoneNumber:
                user.phoneNumber ||
                "",

              city:
                user.city || "",

              avatarUrl:
                user.avatarUrl ||
                null,
            },
          ),
        );

      setActiveResumeId(
        created.id,
      );

      notify.success(
        "New resume created.",
      );
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Could not create resume.",
      );
    }
  }

  async function handleDuplicate() {
    try {
      const created =
        await createResume.mutateAsync(
          createDuplicateResume(
            resume,
          ),
        );

      setActiveResumeId(
        created.id,
      );

      notify.success(
        "Resume duplicated.",
      );
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Could not duplicate resume.",
      );
    }
  }

  function handleRename() {
    const cleanTitle =
      title.trim();

    if (
      cleanTitle.length < 2
    ) {
      notify.error(
        "Resume title is too short.",
      );

      return;
    }

    onUpdate({
      title: cleanTitle,
    });

    setEditingTitle(false);
  }

  async function handleDelete() {
    try {
      const remaining =
        resumes.filter(
          (item) =>
            item.id !==
            resume.id,
        );

      await deleteResume.mutateAsync({
        id: resume.id,
        userId:
          resume.userId,
      });

      setDeleteOpen(false);

      setActiveResumeId(
        remaining[0]?.id ??
          null,
      );

      notify.success(
        "Resume deleted.",
      );
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Could not delete resume.",
      );
    }
  }

  return (
    <>
      <section className="glass-panel rounded-[28px] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="neo-button flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--accent)]">
              <FileText
                size={18}
              />
            </div>

            {editingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  value={title}
                  autoFocus
                  onChange={(
                    event,
                  ) =>
                    setTitle(
                      event.target
                        .value,
                    )
                  }
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                      "Enter"
                    ) {
                      handleRename();
                    }

                    if (
                      event.key ===
                      "Escape"
                    ) {
                      setTitle(
                        resume.title,
                      );

                      setEditingTitle(
                        false,
                      );
                    }
                  }}
                  className="form-field h-10 min-w-56 rounded-xl px-3 outline-none"
                />

                <button
                  type="button"
                  onClick={
                    handleRename
                  }
                  className="text-sm font-medium text-[var(--success)]"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold">
                    {resume.title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      setTitle(
                        resume.title,
                      );

                      setEditingTitle(
                        true,
                      );
                    }}
                    className="text-[var(--muted)] transition hover:text-[var(--accent)]"
                  >
                    <Pencil
                      size={14}
                    />
                  </button>
                </div>

                <div className="mt-1 text-xs text-[var(--muted)]">
                  {resumes.length}{" "}
                  {resumes.length === 1
                    ? "resume"
                    : "resumes"}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={
                activeResumeId ??
                ""
              }
              onChange={(
                event,
              ) =>
                setActiveResumeId(
                  event.target
                    .value,
                )
              }
              className="neo-inset h-10 rounded-xl bg-transparent px-3 text-sm outline-none"
            >
              {resumes.map(
                (item) => (
                  <option
                    key={
                      item.id
                    }
                    value={
                      item.id
                    }
                  >
                    {item.title}
                  </option>
                ),
              )}
            </select>

            <button
              type="button"
              onClick={
                handleCreate
              }
              className="neo-button flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-[var(--accent)]"
            >
              <FilePlus2
                size={16}
              />

              New
            </button>

            <button
              type="button"
              onClick={
                handleDuplicate
              }
              className="neo-button flex h-10 items-center gap-2 rounded-xl px-3 text-sm"
            >
              <Copy size={16} />

              Duplicate
            </button>

            <button
              type="button"
              onClick={() =>
                setDeleteOpen(
                  true,
                )
              }
              className="neo-button flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-[var(--danger)]"
            >
              <Trash2
                size={16}
              />

              Delete
            </button>
          </div>
        </div>
      </section>

      <ConfirmModal
        open={deleteOpen}
        title="Delete this resume?"
        description={`"${resume.title}" will be permanently removed from Pulse.`}
        confirmText="Delete"
        cancelText="Keep resume"
        icon={Trash2}
        tone="danger"
        loading={
          deleteResume.isPending
        }
        onClose={() =>
          setDeleteOpen(
            false,
          )
        }
        onConfirm={
          handleDelete
        }
      />
    </>
  );
}