import {
  useEffect,
  useRef,
} from "react";

import { useAuthStore } from "../../auth/store/auth.store";

import {
  useCreateResume,
  useResume,
  useResumes,
} from "../api/resume.queries";

import {
  ResumeEditor,
  ResumeSectionInfo,
} from "../components/builder/ResumeEditor";

import { ResumePreview } from "../components/builder/ResumePreview";

import { ResumeSectionNav } from "../components/builder/ResumeSectionNav";

import { ResumeControlBar } from "../components/builder/ResumeControlBar";

import { FullscreenResumePreview } from "../components/builder/FullscreenResumePreview";

import { ResumeProgress } from "../components/builder/ResumeProgress";

import { useResumeCompletion } from "../hooks/useResumeCompletion";

import { useResumeAutosave } from "../hooks/useResumeAutosave";

import { useResumeEditorStore } from "../store/resume-editor.store";

import { createEmptyResume } from "../utils/createEmptyResume";

import { notify } from "../../../shared/lib/notify";

import { ResumeAppearancePanel } from "../components/builder/ResumeAppearancePanel";

export function ResumeBuilderPage() {
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

  const previewMode =
    useResumeEditorStore(
      (state) =>
        state.previewMode,
    );

  const creationStarted =
    useRef(false);

  const resumesQuery =
    useResumes(
      user?.id ?? null,
    );

  const {
    mutateAsync:
      createResumeAsync,
    isPending:
      isCreatingResume,
  } = useCreateResume();

  const resumeQuery =
    useResume(
      activeResumeId,
    );

  const resume =
    resumeQuery.data;

  const resumes =
    resumesQuery.data ?? [];

  const completion =
    useResumeCompletion(
      resume,
    );

  const {
    updateResume,
    saveStatus,
  } = useResumeAutosave(
    activeResumeId,
  );

  useEffect(() => {
    if (
      !user ||
      !resumesQuery.isSuccess
    ) {
      return;
    }

    if (
      resumes.length > 0
    ) {
      creationStarted.current =
        false;

      const activeExists =
        activeResumeId
          ? resumes.some(
              (item) =>
                item.id ===
                activeResumeId,
            )
          : false;

      if (!activeExists) {
        setActiveResumeId(
          resumes[0].id,
        );
      }

      return;
    }

    if (
      creationStarted.current
    ) {
      return;
    }

    creationStarted.current =
      true;

    const initialResume =
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
      );

    void createResumeAsync(
      initialResume,
    )
      .then(
        (createdResume) => {
          setActiveResumeId(
            createdResume.id,
          );
        },
      )
      .catch(
        (error) => {
          creationStarted.current =
            false;

          notify.error(
            error instanceof Error
              ? error.message
              : "Could not create resume.",
          );
        },
      );
  }, [
    user,
    activeResumeId,
    resumes,
    resumesQuery.isSuccess,
    setActiveResumeId,
    createResumeAsync,
  ]);

  if (!user) {
    return null;
  }

  const isSelectingResume =
    resumes.length > 0 &&
    !activeResumeId;

  const isLoading =
    resumesQuery.isLoading ||
    isCreatingResume ||
    isSelectingResume ||
    (
      Boolean(
        activeResumeId,
      ) &&
      resumeQuery.isLoading
    );

  if (isLoading) {
    return (
      <ResumeBuilderLoading />
    );
  }

  if (
    resumesQuery.isError
  ) {
    return (
      <ResumeBuilderError
        title="Could not load your resumes"
        description="Something went wrong while loading your resume collection."
      />
    );
  }

  if (
    resumeQuery.isError
  ) {
    return (
      <ResumeBuilderError
        title="Could not load your resume"
        description="Something went wrong while loading the selected resume."
      />
    );
  }

  if (!resume) {
    return (
      <ResumeBuilderLoading />
    );
  }

  return (
    <div
      className="
        relative
        mx-auto
        h-[calc(100vh-10rem)]
        w-full
        max-w-[1600px]
      "
    >
      <div
        className="
          relative
          z-10
          grid
          h-[calc(100vh-8.5rem)]
          grid-cols-1
          gap-4
          xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.2fr)_minmax(290px,0.25fr)]
        "
      >
        <div
          className={`
            min-h-0

            ${
              previewMode
                ? "hidden xl:grid"
                : "grid"
            }

            grid-rows-[minmax(0,1fr)_auto]
            gap-5
          `}
        >
          <section
            className="
              glass-panel
              flex
              min-h-0
              flex-col
              rounded-2xl
            "
          >
            <ResumeSectionNav
              resume={resume}
            />

            <div
              className="
                min-h-0
                flex-1
                overflow-hidden
              "
            >
              <ResumeEditor
                resume={resume}
                onUpdate={updateResume}
              />
            </div>
          </section>

          <ResumeSectionInfo />
        </div>

        <section
          className={`
            min-h-0

            ${
              previewMode
                ? "block"
                : "hidden xl:block"
            }
          `}
        >
          <div
            className="
              h-full
              min-h-0
              overflow-hidden
              overscroll-contain
              rounded-2xl
            "
          >
            <ResumePreview
              resume={resume}
            />
          </div>
        </section>

        <aside
          className="
            hidden
            min-h-0
            flex-col
            gap-2
            xl:flex
          "
        >
          <div
            className="
              shrink-0
              px-1
            "
          >
            <ResumeProgress
              value={completion}
            />
          </div>

          <div
            className="
              shrink-0
            "
          >
            <ResumeControlBar
              resume={resume}
              resumes={resumes}
              saveStatus={saveStatus}
              onUpdate={updateResume}
            />
          </div>

          <div
            className="
              mt-4
              min-h-0
              flex-1
            "
          >
            <ResumeAppearancePanel
              resume={resume}
              onUpdate={updateResume}
            />
          </div>
        </aside>

        <div
          className="
            shrink-0
            space-y-3
            xl:hidden
          "
        >
          <ResumeProgress
            value={completion}
          />

          <ResumeControlBar
            resume={resume}
            resumes={resumes}
            saveStatus={saveStatus}
            onUpdate={updateResume}
          />

          <ResumeAppearancePanel
            resume={resume}
            onUpdate={updateResume}
          />
        </div>
      </div>

      <FullscreenResumePreview
        resume={resume}
      />
    </div>
  );
}

function ResumeBuilderLoading() {
  return (
    <div
      className="
        mx-auto
        h-[calc(100dvh-7rem)]
        w-full
        max-w-[1800px]
        overflow-hidden
        md:h-[calc(100dvh-9rem)]
      "
    >
      <div
        className="
          grid
          h-full
          min-h-0
          gap-3
          xl:grid-cols-[minmax(360px,0.9fr)_minmax(420px,1.18fr)_minmax(300px,0.78fr)]
        "
      >
        <div className="flex min-h-0 flex-col gap-3">
          <div className="glass-panel min-h-0 flex-1 animate-pulse rounded-2xl" />

          <div className="glass-panel h-20 shrink-0 animate-pulse rounded-2xl" />
        </div>

        <div className="glass-panel hidden h-full animate-pulse rounded-2xl xl:block" />

        <div className="glass-panel hidden h-full animate-pulse rounded-2xl xl:block" />
      </div>
    </div>
  );
}

function ResumeBuilderError({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        glass-panel
        mx-auto
        flex
        h-[calc(100dvh-7rem)]
        max-w-[1600px]
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        p-10
        text-center
        md:h-[calc(100dvh-9rem)]
      "
    >
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--muted)]">
        {description}
      </p>

      <button
        type="button"
        onClick={() =>
          window.location.reload()
        }
        className="neo-button mt-6 rounded-2xl px-5 py-3 text-sm font-medium text-[var(--accent)]"
      >
        Try again
      </button>
    </div>
  );
}