import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Save,
  School,
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
  resumeEducationFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeEducation,
  UpdateResumeInput,
} from "../../types/resume.types";

type EducationFormValues =
  z.infer<
    typeof resumeEducationFormSchema
  >;

interface EducationSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyEducation:
  EducationFormValues = {
    institution: "",
    degree: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };

export function EducationSection({
  resume,
  onUpdate,
}: EducationSectionProps) {
  const [
    formOpen,
    setFormOpen,
  ] = useState(
    resume.educations.length ===
      0,
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
    useForm<EducationFormValues>({
      resolver: zodResolver(
        resumeEducationFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyEducation,
    });

  const institution =
    watch("institution");

  const degree =
    watch("degree");

  const field =
    watch("field");

  const location =
    watch("location");

  const startDate =
    watch("startDate");

  const endDate =
    watch("endDate");

  const description =
    watch("description");

  const educations =
    [
      ...resume.educations,
    ].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(
      emptyEducation,
    );

    setFormOpen(true);
  }

  function handleEdit(
    education:
      ResumeEducation,
  ) {
    setEditingId(
      education.id,
    );

    reset({
      institution:
        education.institution,

      degree:
        education.degree,

      field:
        education.field,

      location:
        education.location,

      startDate:
        education.startDate,

      endDate:
        education.endDate,

      description:
        education.description,
    });

    setFormOpen(true);
  }

  function handleCancel() {
    setEditingId(null);

    reset(
      emptyEducation,
    );

    setFormOpen(false);
  }

  function onSubmit(
    values:
      EducationFormValues,
  ) {
    let next:
      ResumeEducation[];

    if (editingId) {
      next =
        educations.map(
          (education) =>
            education.id ===
            editingId
              ? {
                  ...education,
                  ...values,
                }
              : education,
        );
    } else {
      next = [
        ...educations,
        {
          id:
            crypto.randomUUID(),

          ...values,

          order:
            educations.length,
        },
      ];
    }

    onUpdate({
      educations: next,
    });

    handleCancel();
  }

  function handleDelete(
    id: string,
  ) {
    const next =
      educations
        .filter(
          (education) =>
            education.id !== id,
        )
        .map(
          (
            education,
            index,
          ) => ({
            ...education,
            order: index,
          }),
        );

    onUpdate({
      educations: next,
    });

    if (
      editingId === id
    ) {
      handleCancel();
    }
  }

  function moveEducation(
    id: string,
    direction:
      | "up"
      | "down",
  ) {
    const next = [
      ...educations,
    ];

    const index =
      next.findIndex(
        (education) =>
          education.id === id,
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
      educations:
        next.map(
          (
            education,
            itemIndex,
          ) => ({
            ...education,
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
              Education 
            </span>

            <span className="ml-1 text-[10px] text-[var(--muted)]">
              {educations.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add education"
            title="Add education"
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
                  ? "Edit Education"
                  : "New Education"}
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
            <EducationField
              label="Institution"
              icon={School}
              value={institution}
              error={
                errors.institution
                  ?.message
              }
            >
              <input
                {...register(
                  "institution",
                )}
                placeholder="University or school"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </EducationField>

            <EducationField
              label="Degree"
              icon={
                GraduationCap
              }
              value={degree}
              error={
                errors.degree
                  ?.message
              }
            >
              <input
                {...register(
                  "degree",
                )}
                placeholder="Bachelor's degree"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </EducationField>

            <EducationField
              label="Field of study"
              icon={BookOpen}
              value={field}
              error={
                errors.field
                  ?.message
              }
            >
              <input
                {...register(
                  "field",
                )}
                placeholder="Computer Science"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </EducationField>

            <EducationField
              label="Location"
              icon={MapPin}
              value={location}
              error={
                errors.location
                  ?.message
              }
            >
              <input
                {...register(
                  "location",
                )}
                placeholder="City, Country"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </EducationField>

            <EducationField
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
            </EducationField>

            <EducationField
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
            </EducationField>
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
                    1350
                      ? "text-[var(--danger)]"
                      : "text-[var(--muted)]"
                  }
                `}
              >
                {
                  description.length
                }
                /1500
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
                maxLength={1500}
                placeholder="Honors, achievements, activities or relevant coursework..."
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

      {educations.length >
        0 && (
        <div className="space-y-2">
          {educations.map(
            (
              education,
              index,
            ) => (
              <article
                key={
                  education.id
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
                        education.degree
                      }
                    </h3>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[var(--muted)]">
                      <span className="truncate">
                        {
                          education.institution
                        }
                      </span>

                      {education.field && (
                        <>
                          <span className="opacity-40">
                            •
                          </span>

                          <span className="truncate">
                            {
                              education.field
                            }
                          </span>
                        </>
                      )}

                      {education.location && (
                        <>
                          <span className="opacity-40">
                            •
                          </span>

                          <span className="truncate">
                            {
                              education.location
                            }
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-1 text-[9px] text-[var(--muted)]">
                      {
                        education.startDate
                      }

                      {" — "}

                      {
                        education.endDate
                      }
                    </div>
                  </div>

                  <div className="absolute -bottom-5.5 right-0 flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveEducation(
                          education.id,
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
                      aria-label="Move education up"
                    >
                      <ArrowUp
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        educations.length -
                          1
                      }
                      onClick={() =>
                        moveEducation(
                          education.id,
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
                      aria-label="Move education down"
                    >
                      <ArrowDown
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          education,
                        )
                      }
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        hover:!text-[var(--warning)]
                        transition
                        shadow-button
                      "
                      aria-label="Edit education"
                    >
                      <Pencil
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          education.id,
                        )
                      }
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        hover:!text-[var(--danger)]
                        transition
                        shadow-button
                      "
                      aria-label="Delete education"
                    >
                      <Trash2
                        size={12}
                      />
                    </button>
                  </div>
                </div>

                {education.description && (
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
                      education.description
                    }
                  >
                    {
                      education.description
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

interface EducationFieldProps {
  label: string;

  icon: ElementType;

  value?: string;

  error?: string;

  children:
    ReactNode;
}

function EducationField({
  label,
  icon: Icon,
  value = "",
  error,
  children,
}: EducationFieldProps) {
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