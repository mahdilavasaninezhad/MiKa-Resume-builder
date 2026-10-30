import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Code2,
  Github,
  Globe2,
  LockKeyhole,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  ElementType,
  ReactNode,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import type {
  z,
} from "zod";

import {
  resumeProjectFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeProject,
  UpdateResumeInput,
} from "../../types/resume.types";

type ProjectFormValues =
  z.infer<
    typeof resumeProjectFormSchema
  >;

interface ProjectsSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyProject:
  ProjectFormValues = {
    name: "",
    description: "",
    technologies: "",
    githubUrl: "",
    liveUrl: "",
    startDate: "",
    endDate: "",
  };

export function ProjectsSection({
  resume,
  onUpdate,
}: ProjectsSectionProps) {
  const [
    formOpen,
    setFormOpen,
  ] = useState(
    resume.projects.length === 0,
  );

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
    },
  } =
    useForm<ProjectFormValues>({
      resolver: zodResolver(
        resumeProjectFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyProject,
    });

  const name =
    watch("name");

  const technologies =
    watch("technologies");

  const githubUrl =
    watch("githubUrl");

  const liveUrl =
    watch("liveUrl");

  const startDate =
    watch("startDate");

  const endDate =
    watch("endDate");

  const description =
    watch("description");

  const projects =
    [
      ...resume.projects,
    ].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(emptyProject);

    setFormOpen(true);
  }

  function handleEdit(
    project: ResumeProject,
  ) {
    setEditingId(
      project.id,
    );

    reset({
      name:
        project.name,

      description:
        project.description,

      technologies:
        project.technologies.join(
          ", ",
        ),

      githubUrl:
        project.githubUrl,

      liveUrl:
        project.liveUrl,

      startDate:
        project.startDate,

      endDate:
        project.endDate,
    });

    setFormOpen(true);
  }

  function handleCancel() {
    setEditingId(null);

    reset(emptyProject);

    setFormOpen(false);
  }

  function onSubmit(
    values:
      ProjectFormValues,
  ) {
    const nextTechnologies =
      values.technologies
        .split(",")
        .map((item) =>
          item.trim(),
        )
        .filter(Boolean);

    let nextProjects:
      ResumeProject[];

    if (editingId) {
      nextProjects =
        projects.map(
          (project) =>
            project.id ===
            editingId
              ? {
                  ...project,
                  ...values,
                  technologies:
                    nextTechnologies,
                }
              : project,
        );
    } else {
      nextProjects = [
        ...projects,

        {
          id:
            crypto.randomUUID(),

          ...values,

          technologies:
            nextTechnologies,

          order:
            projects.length,
        },
      ];
    }

    onUpdate({
      projects:
        nextProjects,
    });

    handleCancel();
  }

  function handleDelete(
    id: string,
  ) {
    const next =
      projects
        .filter(
          (project) =>
            project.id !== id,
        )
        .map(
          (
            project,
            index,
          ) => ({
            ...project,
            order: index,
          }),
        );

    onUpdate({
      projects: next,
    });

    if (
      editingId === id
    ) {
      handleCancel();
    }
  }

  function moveProject(
    id: string,
    direction:
      | "up"
      | "down",
  ) {
    const next = [
      ...projects,
    ];

    const index =
      next.findIndex(
        (project) =>
          project.id === id,
      );

    if (index === -1) {
      return;
    }

    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >= next.length
    ) {
      return;
    }

    [
      next[index],
      next[target],
    ] = [
      next[target],
      next[index],
    ];

    onUpdate({
      projects:
        next.map(
          (
            project,
            itemIndex,
          ) => ({
            ...project,
            order:
              itemIndex,
          }),
        ),
    });
  }

  return (
    <div className="space-y-3">
      {!formOpen && (
        <div className="flex items-center justify-between max-w-[345px] ml-1.5">
          <div className="min-w-0">
            <span className="text-xs font-medium">
              Projects
            </span>

            <span className="ml-2 text-[10px] text-[var(--muted)]">
              {projects.length}
            </span>
          </div>
                <div>
                  <button
                    type="button"
                    disabled
                    title="Available in Pulse Pro"
                    className="
                      shadow-button
                      flex
                      cursor-not-allowed
                      items-center
                      gap-3
                      rounded-lg
                      px-4
                      py-1
                      !text-[11px]
                      !font-semibold
                      text-[var(--danger)]
                      opacity-60
                    "
                    
                  >
                    <Sparkles
                      size={14}
                    />
                    AI
                    
                    
                    <LockKeyhole
                      size={14}
                    />
                    PRO
                  </button>
                </div>
          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add project"
            title="Add project"
            className="
              shadow-button
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-lg
              hover:text-[var(--accent)]
              transition
            "
          >
            <Plus
              size={14}
            />
          </button>
        </div>
      )}

      {formOpen && (
        <form
          onSubmit={
            handleSubmit(
              onSubmit,
            )
          }
        >
          <div className="mb-2 pb-2 flex items-center justify-between max-w-[345px] ml-1.5">
            <div className="min-w-0">

              <span className="truncate text-[12px] font-semibold ml-35">
                {editingId
                  ? "Edit Project"
                  : "New Project"}
              </span>
            </div>

            <button
              type="button"
              onClick={
                handleCancel
              }
              aria-label="Close form"
              className="
                shadow-button
                flex
                h-6
                w-6
                shrink-0
                items-center
                justify-center
                rounded-lg
                !text-[var(--text)]
                hover:!text-[var(--danger)]
              "
            >
              <X
                size={13}
              />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-x-3
              gap-y-2
              sm:grid-cols-2
            "
          >
            <ProjectField
              label="Project name"
              icon={Code2}
              value={name}
              error={
                errors.name
                  ?.message
              }
            >
              <input
                {...register(
                  "name",
                )}
                placeholder="Pulse"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>

            <ProjectField
              label="Technologies"
              icon={Code2}
              value={
                technologies
              }
              error={
                errors.technologies
                  ?.message
              }
            >
              <input
                {...register(
                  "technologies",
                )}
                placeholder="React, TypeScript, Zustand"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>

            <ProjectField
              label="GitHub URL"
              icon={Github}
              value={githubUrl}
              error={
                errors.githubUrl
                  ?.message
              }
            >
              <input
                {...register(
                  "githubUrl",
                )}
                placeholder="https://github.com/..."
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>

            <ProjectField
              label="Live URL"
              icon={Globe2}
              value={liveUrl}
              error={
                errors.liveUrl
                  ?.message
              }
            >
              <input
                {...register(
                  "liveUrl",
                )}
                placeholder="https://..."
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>

            <ProjectField
              label="Start date"
              icon={
                CalendarDays
              }
              value={startDate}
              error={
                errors.startDate
                  ?.message
              }
            >
              <input
                {...register(
                  "startDate",
                )}
                type="month"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>

            <ProjectField
              label="End date"
              icon={
                CalendarDays
              }
              value={endDate}
              error={
                errors.endDate
                  ?.message
              }
            >
              <input
                {...register(
                  "endDate",
                )}
                type="month"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ProjectField>
          </div>

          <label className="mt-2 block">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span
                className={`
                  text-[10px]
                  font-medium
                  transition-colors

                  ${
                    errors.description
                      ? "text-[var(--danger)]"
                      : description
                            .trim()
                            .length > 0
                        ? "text-[var(--success)]"
                        : "text-[var(--muted)]"
                  }
                `}
              >
                Description
              </span>

              <span
                className={`
                  text-[9px]
                  tabular-nums

                  ${
                    description.length >=
                    1800
                      ? "text-[var(--danger)]"
                      : "text-[var(--muted)]"
                  }
                `}
              >
                {
                  description.length
                }
                /2000
              </span>
            </div>

            <div
              data-filled={
                description
                  .trim()
                  .length > 0
              }
              className={`
                form-field
                rounded-xl
                px-3
                py-2

                ${
                  errors.description
                    ? "border-[var(--danger)]"
                    : ""
                }
              `}
            >
              <textarea
                {...register(
                  "description",
                )}
                maxLength={2000}
                placeholder="What did you build, what challenges did you solve and what impact did it have?"
                className="
                  w-full
                  resize-y
                  bg-transparent
                  !text-xs
                  leading-7.5
                  outline-none
                "
              />
            </div>

            {errors.description && (
              <p className="mt-1 !text-[10px] leading-7.5 text-[var(--danger)]">
                {
                  errors.description
                    .message
                }
              </p>
            )}
          </label>

          <div className="mt-2 flex gap-2 absolute -bottom-3.5 right-5 z-1">
            <button
              type="button"
              onClick={
                handleCancel
              }
              className="
                shadow-button
                h-7
                rounded-lg
                px-4
                !text-[10px]
                !font-medium
                !text-[var(--muted)]
                hover:!text-[var(--text)]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                shadow-button
                flex
                h-7
                items-center
                gap-1.5
                rounded-lg
                px-4
                !text-[12px]
                !font-semibold
                !text-white
                !bg-[var(--accent)]
                transition
                opacity-90
                hover:opacity-100
              "
            >
              <Save
                size={13}
              />

              {editingId
                ? "Save"
                : "Add"}
            </button>
          </div>
        </form>
      )}

      {projects.length >
        0 && (
        <div className="space-y-2">
          {projects.map(
            (
              project,
              index,
            ) => (
              <article
                key={
                  project.id
                }
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-3
                  py-2.5
                  mb-5
                "
              >
                <div className="flex items-start gap-2 relative">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xs font-semibold">
                      {
                        project.name
                      }
                    </h3>

                    {project
                      .technologies
                      .length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {project.technologies.map(
                          (
                            technology,
                          ) => (
                            <span
                              key={
                                technology
                              }
                              className="
                                rounded-md
                                bg-[var(--accent-soft)]
                                px-1.5
                                py-0.5
                                text-[8px]
                                leading-none
                                text-[var(--accent)]
                              "
                            >
                              {
                                technology
                              }
                            </span>
                          ),
                        )}
                      </div>
                    )}

                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={
                            project.githubUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            flex
                            items-center
                            gap-1
                            text-[9px]
                            text-[var(--muted)]
                            transition
                            hover:text-[var(--accent)]
                          "
                        >
                          <Github
                            size={10}
                          />

                          GitHub
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          href={
                            project.liveUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="
                            flex
                            items-center
                            gap-1
                            text-[9px]
                            text-[var(--muted)]
                            transition
                            hover:text-[var(--accent)]
                          "
                        >
                          <Globe2
                            size={10}
                          />

                          Live
                        </a>
                      )}

                      {(project.startDate ||
                        project.endDate) && (
                        <span className="text-[9px] text-[var(--muted)]">
                          {
                            project.startDate
                          }

                          {project.endDate &&
                            ` — ${project.endDate}`}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="absolute -bottom-11.5 right-0 flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveProject(
                          project.id,
                          "up",
                        )
                      }
                      className="
                        shadow-button
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        text-[var(--muted)]
                        transition
                        hover:text-[var(--text)]
                        disabled:cursor-not-allowed
                        disabled:opacity-20
                      "
                      aria-label="Move project up"
                    >
                      <ArrowUp
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        projects.length -
                          1
                      }
                      onClick={() =>
                        moveProject(
                          project.id,
                          "down",
                        )
                      }
                      className="
                        shadow-button
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        text-[var(--muted)]
                        transition
                        hover:text-[var(--text)]
                        disabled:cursor-not-allowed
                        disabled:opacity-20
                      "
                      aria-label="Move project down"
                    >
                      <ArrowDown
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          project,
                        )
                      }
                      className="
                        shadow-button
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        hover:!text-[var(--warning)]
                        transition
                      "
                      aria-label="Edit project"
                    >
                      <Pencil
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          project.id,
                        )
                      }
                      className="
                        shadow-button
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        hover:text-[var(--danger)]
                        transition
                        hover:bg-[var(--danger-soft)]
                      "
                      aria-label="Delete project"
                    >
                      <Trash2
                        size={12}
                      />
                    </button>
                  </div>
                </div>

                {project.description && (
                  <p
                    className="
                      mt-2
                      line-clamp-2
                      whitespace-pre-line
                      text-[10px]
                      leading-4
                      text-[var(--muted)]
                    "
                    title={
                      project.description
                    }
                  >
                    {
                      project.description
                    }
                  </p>
                )}

                
              </article>
            ),
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectFieldProps {
  label: string;

  icon: ElementType;

  value?: string;

  error?: string;

  children:
    ReactNode;
}

function ProjectField({
  label,
  icon: Icon,
  value = "",
  error,
  children,
}: ProjectFieldProps) {
  const filled =
    value.trim().length > 0;

  return (
    <label className="min-w-0">
      <div
        className={`
          mb-1
          flex
          items-center
          gap-1.5
          text-[10px]
          font-medium
          transition-colors
          duration-200

          ${
            error
              ? "text-[var(--danger)]"
              : filled
                ? "text-[var(--success)]"
                : "text-[var(--muted)]"
          }
        `}
      >
        <Icon
          size={11}
          strokeWidth={1.9}
        />

        <span className="truncate">
          {label}
        </span>
      </div>

      <div
        data-filled={filled}
        className={`
          form-field
          flex
          h-9
          min-w-0
          items-center
          rounded-xl
          px-3

          ${
            error
              ? "border-[var(--danger)]"
              : ""
          }
        `}
      >
        {children}
      </div>

      {error && (
        <p
          className="
            mt-1
            truncate
            text-[10px]
            leading-3
            text-[var(--danger)]
          "
          title={error}
        >
          {error}
        </p>
      )}
    </label>
  );
}