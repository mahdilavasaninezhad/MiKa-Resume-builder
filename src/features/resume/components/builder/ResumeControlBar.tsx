import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleAlert,
  Copy,
  Download,
  FileCode2,
  FilePlus2,
  FileText,
  Files,
  LoaderCircle,
  Maximize2,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuthStore } from "../../../auth/store/auth.store";

import {
  useCreateResume,
  useDeleteResume,
} from "../../api/resume.queries";

import type {
  ResumeSaveStatus,
} from "../../hooks/useResumeAutosave";

import { useResumeEditorStore } from "../../store/resume-editor.store";

import type {
  Resume,
  UpdateResumeInput,
} from "../../types/resume.types";

import { createDuplicateResume } from "../../utils/duplicateResume";
import { createEmptyResume } from "../../utils/createEmptyResume";
import { notify } from "../../../../shared/lib/notify";

interface ResumeControlBarProps {
  resume: Resume;
  resumes: Resume[];
  saveStatus: ResumeSaveStatus;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

type ControlPanel =
  | "new"
  | "delete"
  | "duplicate"
  | "fullscreen"
  | "download"
  | "rename"
  | "resumes"
  | null;

export function ResumeControlBar({
  resume,
  resumes,
  saveStatus,
  onUpdate,
}: ResumeControlBarProps) {
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

  const setFullscreenPreview =
    useResumeEditorStore(
      (state) =>
        state.setFullscreenPreview,
    );

  const createResume =
    useCreateResume();

  const deleteResume =
    useDeleteResume();

  const [
    activePanel,
    setActivePanel,
  ] = useState<ControlPanel>(
    null,
  );

  const [
    title,
    setTitle,
  ] = useState(
    resume.title,
  );

  useEffect(() => {
    setTitle(
      resume.title,
    );

    setActivePanel(
      null,
    );
  }, [
    resume.id,
    resume.title,
  ]);

  function openPanel(
    panel: ControlPanel,
  ) {
    setActivePanel(
      (current) =>
        current === panel
          ? null
          : panel,
    );
  }

  function closePanel() {
    setTitle(
      resume.title,
    );

    setActivePanel(
      null,
    );
  }

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

              email:
                user.email || "",

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

    setActivePanel(
      null,
    );

    notify.success(
      "Resume renamed.",
    );
  }

  function handleFullscreen() {
    setActivePanel(
      null,
    );

    setFullscreenPreview(
      true,
    );
  }

  function handlePdfDownload() {
    setActivePanel(
      null,
    );

    window.print();
  }

  function handleHtmlDownload() {
    const element =
      document.getElementById(
        "resume-print-area",
      );

    if (!element) {
      notify.error(
        "Resume preview could not be found.",
      );

      return;
    }

    const clone =
      element.cloneNode(
        true,
      ) as HTMLElement;

    clone.style.transform =
      "none";

    clone.style.transformOrigin =
      "top left";

    clone.style.width =
      "794px";

    clone.style.height =
      "1123px";

    let styles = "";

    Array.from(
      document.styleSheets,
    ).forEach(
      (styleSheet) => {
        try {
          styles +=
            Array.from(
              styleSheet.cssRules,
            )
              .map(
                (rule) =>
                  rule.cssText,
              )
              .join("\n");
        } catch {
          return;
        }
      },
    );

    const html = `
<!doctype html>

<html lang="en">

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>${escapeHtml(resume.title)}</title>

<style>

${styles}

html,
body {
  margin: 0;
  padding: 0;
  background: #f5f5f5;
}

body {
  display: flex;
  justify-content: center;
  padding: 32px;
}

#resume-print-area {
  width: 794px !important;
  min-height: 1123px;
  height: auto !important;
  transform: none !important;
  transform-origin: top left !important;
  overflow: visible !important;
  background: white;
}

</style>

</head>

<body>

${clone.outerHTML}

</body>

</html>
    `.trim();

    const blob =
      new Blob(
        [html],
        {
          type: "text/html;charset=utf-8",
        },
      );

    const url =
      URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement(
        "a",
      );

    link.href = url;

    link.download =
      `${sanitizeFileName(
        resume.title,
      )}.html`;

    document.body.appendChild(
      link,
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
      url,
    );

    setActivePanel(
      null,
    );

    notify.success(
      "HTML resume downloaded.",
    );
  }

  function handleResumeSelect(
    id: string,
  ) {
    setActiveResumeId(
      id,
    );

    setActivePanel(
      null,
    );
  }

  return (
    <section
      className="
        glass-panel
        relative
        shrink-0
        rounded-2xl
        p-1
      "
    >
      <div
        className="
          min-h-[70px]
        "
      >
        {activePanel ===
        null ? (
          <DefaultView
            resume={resume}
            saveStatus={
              saveStatus
            }
          />
        ) : (
          <PanelView
            title={getPanelTitle(
              activePanel,
            )}
            onBack={
              closePanel
            }
            actions={
              <>
                {activePanel ===
                  "new" && (
                  <HeaderActionButton
                    icon={
                      FilePlus2
                    }
                    label="Create"
                    title="Create Resume"
                    loading={
                      createResume.isPending
                    }
                    onClick={
                      handleCreate
                    }
                  />
                )}

                {activePanel ===
                  "delete" && (
                  <HeaderActionButton
                    icon={
                      Trash2
                    }
                    label="Delete"
                    title="Delete Resume"
                    tone="danger"
                    loading={
                      deleteResume.isPending
                    }
                    onClick={
                      handleDelete
                    }
                  />
                )}

                {activePanel ===
                  "duplicate" && (
                  <HeaderActionButton
                    icon={Copy}
                    label="Copy"
                    title="Duplicate Resume"
                    loading={
                      createResume.isPending
                    }
                    onClick={
                      handleDuplicate
                    }
                  />
                )}

                {activePanel ===
                  "fullscreen" && (
                  <HeaderActionButton
                    icon={
                      Maximize2
                    }
                    label="Open"
                    title="Open fullscreen"
                    onClick={
                      handleFullscreen
                    }
                  />
                )}

                {activePanel ===
                  "download" && (
                  <div
                    className="
                      flex
                      items-center
                      gap-1
                    "
                  >
                    <HeaderActionButton
                      icon={
                        FileText
                      }
                      label="PDF"
                      title="Download PDF"
                      onClick={
                        handlePdfDownload
                      }
                    />

                    <HeaderActionButton
                      icon={
                        FileCode2
                      }
                      label="HTML"
                      title="Download HTML"
                      onClick={
                        handleHtmlDownload
                      }
                    />
                  </div>
                )}

                {activePanel ===
                  "rename" && (
                  <HeaderActionButton
                    icon={Check}
                    label="Rename"
                    title="Rename Resume"
                    tone="success"
                    onClick={
                      handleRename
                    }
                  />
                )}
              </>
            }
          >
            {activePanel ===
              "new" && (
              <NewPanel />
            )}

            {activePanel ===
              "delete" && (
              <DeletePanel
                title={
                  resume.title
                }
              />
            )}

            {activePanel ===
              "duplicate" && (
              <DuplicatePanel />
            )}

            {activePanel ===
              "fullscreen" && (
              <FullscreenPanel />
            )}

            {activePanel ===
              "download" && (
              <DownloadPanel />
            )}

            {activePanel ===
              "rename" && (
              <RenamePanel
                title={title}
                onChange={
                  setTitle
                }
                onRename={
                  handleRename
                }
              />
            )}

            {activePanel ===
              "resumes" && (
              <ResumesPanel
                resumes={
                  resumes
                }
                activeResumeId={
                  activeResumeId
                }
                onSelect={
                  handleResumeSelect
                }
              />
            )}
          </PanelView>
        )}
      </div>

      <div
        className="
          absolute
          -top-3.5
          left-1/2
          z-10
          flex
          -translate-x-1/2
          items-center
          gap-2
          rounded-xl
          px-1.5
        "
      >
        <ActionButton
          icon={
            FilePlus2
          }
          title="New"
          active={
            activePanel ===
            "new"
          }
          onClick={() =>
            openPanel(
              "new",
            )
          }
        />

        <ActionButton
          icon={
            Trash2
          }
          title="Delete"
          tone="danger"
          active={
            activePanel ===
            "delete"
          }
          onClick={() =>
            openPanel(
              "delete",
            )
          }
        />

        <ActionButton
          icon={Copy}
          title="Duplicate"
          active={
            activePanel ===
            "duplicate"
          }
          onClick={() =>
            openPanel(
              "duplicate",
            )
          }
        />

        <ActionButton
          icon={
            Maximize2
          }
          title="Fullscreen"
          active={
            activePanel ===
            "fullscreen"
          }
          onClick={() =>
            openPanel(
              "fullscreen",
            )
          }
        />

        <ActionButton
          icon={
            Download
          }
          title="Download"
          active={
            activePanel ===
            "download"
          }
          onClick={() =>
            openPanel(
              "download",
            )
          }
        />

        <ActionButton
          icon={Pencil}
          title="Rename"
          active={
            activePanel ===
            "rename"
          }
          onClick={() => {
            setTitle(
              resume.title,
            );

            openPanel(
              "rename",
            );
          }}
        />

        <ActionButton
          icon={Files}
          title="Resumes"
          active={
            activePanel ===
            "resumes"
          }
          onClick={() =>
            openPanel(
              "resumes",
            )
          }
        />
      </div>
    </section>
  );
}

function DefaultView({
  resume,
  saveStatus,
}: {
  resume: Resume;

  saveStatus:
    ResumeSaveStatus;
}) {
  return (
    <div
      className="
        flex
        h-full
        pt-2
        min-h-[72.5px]
        items-center
        justify-center
        gap-5
        text-center
      "
    >
      <div
        className="
          neo-inset
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          text-[var(--accent)]
        "
      >
        <FileText
          size={20}
        />
      </div>

      <h2
        className="
          max-w-full
          truncate
          px-4
          text-xs
          font-semibold
        "
        title={
          resume.title
        }
      >
        {resume.title}

        <SaveState
          status={
            saveStatus
          }
        />
      </h2>
    </div>
  );
}

function PanelView({
  title,
  onBack,
  actions,
  children,
}: {
  title: string;

  onBack: () => void;

  actions?: ReactNode;

  children: ReactNode;
}) {
  return (
    <div
      className="
        flex
        min-h-[72px]
        flex-col
      "
    >
      <div
        className="
          flex
          min-h-7
          border-b
          border-[var(--border)]
        "
      >
        <div
          className="
            absolute
            -bottom-3.5
            left-5
            flex
            min-w-0
            items-center
            gap-2
          "
        >
          <button
            type="button"
            onClick={
              onBack
            }
            title="Back"
            className="
              shadow-button
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              !text-[var(--text)]
              transition
              hover:!text-[var(--accent)]
            "
          >
            <ArrowLeft
              size={13}
            />
          </button>
        </div>

        {actions && (
          <div
            className="
              absolute
              -bottom-3.5
              right-5
              flex
              shrink-0
              items-center
              gap-1
              pr-1
            "
          >
            {actions}
          </div>
        )}
      </div>

      <div
        className="
          min-h-0
          flex-1
          p-1
        "
      >
        {children}
      </div>
    </div>
  );
}

function HeaderActionButton({
  icon: Icon,
  label,
  title,
  onClick,
  loading = false,
  tone = "default",
}: {
  icon: LucideIcon;

  label: string;

  title: string;

  onClick: () => void;

  loading?: boolean;

  tone?:
    | "default"
    | "danger"
    | "success";
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      disabled={
        loading
      }
      title={
        title
      }
      aria-label={
        title
      }
      className={`
        shadow-button
        flex
        h-7
        shrink-0
        items-center
        justify-center
        gap-1
        rounded-md
        px-1.5
        !text-[12px]
        font-medium
        transition-all
        disabled:cursor-not-allowed
        disabled:opacity-40
        text-[var(--text)]

        ${
          tone ===
          "danger"
            ? "hover:text-[var(--danger)]"
            : tone ===
                "success"
              ? "hover:text-[var(--success)]"
              : "hover:text-[var(--success)]"
        }
      `}
    >
      {loading ? (
        <LoaderCircle
          size={9}
          className="animate-spin"
        />
      ) : (
        <Icon
          size={14}
          strokeWidth={2}
        />
      )}

      <span>
        {label}
      </span>
    </button>
  );
}

function NewPanel() {
  return (
    <div
      className="
        flex
        h-full
        items-center
        text-center
        pb-2
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[10px]
            font-medium
          "
        >
          Create New Resume
        </p>

        <p
          className="
            text-[9px]
            text-[var(--muted)]
          "
        >
          Start another resume with your basic profile information.
        </p>
      </div>
    </div>
  );
}

function DeletePanel({
  title,
}: {
  title: string;
}) {
  return (
    <div
      className="
        flex
        h-full
        items-center
        text-center
        pb-2
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[10px]
            font-medium
            text-[var(--danger)]
          "
        >
          Delete This Resume ?
        </p>

        <p
          className="
            truncate
            text-[9px]
            text-[var(--muted)]
          "
          title={title}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function DuplicatePanel() {
  return (
    <div
      className="
        flex
        h-full
        items-center
        text-center
        pb-2
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[10px]
            font-medium
          "
        >
          Duplicate Resume
        </p>

        <p
          className="
            text-[9px]
            text-[var(--muted)]
          "
        >
          Create a separate copy of the current resume.
        </p>
      </div>
    </div>
  );
}

function FullscreenPanel() {
  return (
    <div
      className="
        flex
        h-full
        items-center
        text-center
        pb-2
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[10px]
            font-medium
          "
        >
          Fullscreen preview
        </p>

        <p
          className="
            text-[9px]
            text-[var(--muted)]
          "
        >
          Review the resume without the editor around it.
        </p>
      </div>
    </div>
  );
}

function DownloadPanel() {
  return (
    <div
      className="
        flex
        h-full
        items-center
        text-center
        pb-2
      "
    >
      <div
        className="
          min-w-0
          flex-1
        "
      >
        <p
          className="
            text-[10px]
            font-medium
          "
        >
          Download Resume
        </p>

        <p
          className="
            text-[9px]
            text-[var(--muted)]
          "
        >
          Choose PDF or HTML from the actions above.
        </p>
      </div>
    </div>
  );
}

function RenamePanel({
  title,
  onChange,
  onRename,
}: {
  title: string;

  onChange: (
    value: string,
  ) => void;

  onRename: () => void;
}) {
  return (
    <div
      className="
        flex
        h-full
        items-center
      "
    >
      <input
        value={title}
        autoFocus
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        onKeyDown={(
          event,
        ) => {
          if (
            event.key ===
            "Enter"
          ) {
            onRename();
          }
        }}
        className="
          form-field
          h-6
          w-full
          min-w-0
          rounded-lg
          px-2.5
          !text-[13px]
          outline-none
        "
      />
    </div>
  );
}

function ResumesPanel({
  resumes,
  activeResumeId,
  onSelect,
}: {
  resumes: Resume[];

  activeResumeId:
    string | null;

  onSelect: (
    id: string,
  ) => void;
}) {
  return (
    <div
      className="
        max-h-[48px]
        space-y-1
        overflow-y-auto
        overscroll-contain
        pr-1
      "
    >
      {resumes.map(
        (item) => {
          const active =
            item.id ===
            activeResumeId;

          return (
            <button
              key={
                item.id
              }
              type="button"
              onClick={() =>
                onSelect(
                  item.id,
                )
              }
              className={`
                flex
                h-6
                w-full
                min-w-0
                items-center
                gap-2
                rounded-lg
                px-2.5
                text-left
                !text-[13px]
                transition

                ${
                  active
                    ? "neo-inset text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-[var(--surface)]"
                }
              `}
            >
              <FileText
                size={12}
                className="shrink-0"
              />

              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                "
              >
                {
                  item.title
                }
              </span>

              {active && (
                <Check
                  size={14}
                  className="shrink-0"
                />
              )}
            </button>
          );
        },
      )}
    </div>
  );
}

function ActionButton({
  icon: Icon,
  title,
  onClick,
  active = false,
  tone = "default",
}: {
  icon: LucideIcon;

  title: string;

  onClick: () => void;

  active?: boolean;

  tone?:
    | "default"
    | "danger";
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      title={
        title
      }
      aria-label={
        title
      }
      className={`
        shadow-button
        relative
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-lg
        transition-all
        text-[var(--muted)]

        ${
          active
            ? "!text-[var(--accent)]"
            : tone ===
                "danger"
              ? "hover:!text-[var(--danger)]"
              : "hover:!text-[var(--text)]"
        }
      `}
    >
      <Icon
        size={15}
        strokeWidth={1.8}
      />

      {active && (
        <span
          className="
            pointer-events-none
            absolute
            left-1/2
            top-full
            mt-1
            -translate-x-1/2
            truncate
            text-[9px]
            font-semibold
            text-[var(--text)]
          "
        >
          {title}
        </span>
      )}
    </button>
  );
}

function SaveState({
  status,
}: {
  status:
    ResumeSaveStatus;
}) {
  if (
    status === "saving"
  ) {
    return (
      <div
        className="
          mt-1
          flex
          items-center
          justify-center
          gap-0.5
          text-[8px]
          text-[var(--muted)]
        "
      >
        <LoaderCircle
          size={12}
          className="
            animate-spin
            text-[var(--accent)]
          "
        />

        Saving...
      </div>
    );
  }

  if (
    status === "error"
  ) {
    return (
      <div
        className="
          mt-1
          flex
          items-center
          justify-center
          gap-0.5
          text-[8px]
          text-[var(--danger)]
        "
      >
        <CircleAlert
          size={12}
        />

        Save failed
      </div>
    );
  }

  return (
    <div
      className="
        mt-1
        flex
        items-center
        justify-center
        gap-0.5
        text-[8px]
        text-[var(--muted)]
      "
    >
      <CheckCircle2
        size={12}
        className="
          text-[var(--success)]
        "
      />

      Saved
    </div>
  );
}

function getPanelTitle(
  panel: Exclude<
    ControlPanel,
    null
  >,
) {
  switch (panel) {
    case "new":
      return "New";

    case "delete":
      return "Delete";

    case "duplicate":
      return "Duplicate";

    case "fullscreen":
      return "Fullscreen";

    case "download":
      return "Download";

    case "rename":
      return "Rename";

    case "resumes":
      return "Resumes";
  }
}

function sanitizeFileName(
  value: string,
) {
  const cleaned =
    value
      .trim()
      .replace(
        /[<>:"/\\\\|?\*\u0000-\u001F]/g,
        "-",
      )
      .replace(
        /\s+/g,
        " ",
      );

  return (
    cleaned ||
    "resume"
  );
}

function escapeHtml(
  value: string,
) {
  return value
    .replace(
      /&/g,
      "&amp;",
    )
    .replace(
      /</g,
      "&lt;",
    )
    .replace(
      />/g,
      "&gt;",
    )
    .replace(
      /"/g,
      "&quot;",
    )
    .replace(
      /'/g,
      "&#039;",
    );
}