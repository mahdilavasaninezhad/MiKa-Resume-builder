import {
  ArrowDown,
  ArrowUp,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Save,
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
  resumeExperienceFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeExperience,
  UpdateResumeInput,
} from "../../types/resume.types";

type ExperienceFormValues =
  z.infer<
    typeof resumeExperienceFormSchema
  >;

interface ExperienceSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyExperience:
  ExperienceFormValues = {
    company: "",
    position: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };

export function ExperienceSection({
  resume,
  onUpdate,
}: ExperienceSectionProps) {
  const [
    formOpen,
    setFormOpen,
  ] = useState(
    resume.experiences.length ===
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
    setValue,
    formState: {
      errors,
    },
  } =
    useForm<ExperienceFormValues>({
      resolver: zodResolver(
        resumeExperienceFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyExperience,
    });

  const current =
    watch("current");

  const company =
    watch("company");

  const position =
    watch("position");

  const location =
    watch("location");

  const startDate =
    watch("startDate");

  const endDate =
    watch("endDate");

  const description =
    watch("description");

  const experiences =
    [
      ...resume.experiences,
    ].sort(
      (a, b) =>
        a.order - b.order,
    );

  const currentRegister =
    register("current");

  function handleAdd() {
    setEditingId(null);

    reset(
      emptyExperience,
    );

    setFormOpen(true);
  }

  function handleEdit(
    experience:
      ResumeExperience,
  ) {
    setEditingId(
      experience.id,
    );

    reset({
      company:
        experience.company,

      position:
        experience.position,

      location:
        experience.location,

      startDate:
        experience.startDate,

      endDate:
        experience.endDate,

      current:
        experience.current,

      description:
        experience.description,
    });

    setFormOpen(true);
  }

  function handleCancel() {
    setEditingId(null);

    reset(
      emptyExperience,
    );

    setFormOpen(false);
  }

  function onSubmit(
    values:
      ExperienceFormValues,
  ) {
    let nextExperiences:
      ResumeExperience[];

    if (editingId) {
      nextExperiences =
        experiences.map(
          (experience) =>
            experience.id ===
            editingId
              ? {
                  ...experience,

                  ...values,

                  endDate:
                    values.current
                      ? ""
                      : values.endDate,
                }
              : experience,
        );
    } else {
      const experience:
        ResumeExperience = {
          id: crypto.randomUUID(),

          ...values,

          endDate:
            values.current
              ? ""
              : values.endDate,

          order:
            experiences.length,
        };

      nextExperiences = [
        ...experiences,
        experience,
      ];
    }

    onUpdate({
      experiences:
        nextExperiences,
    });

    handleCancel();
  }

  function handleDelete(
    id: string,
  ) {
    const next =
      experiences
        .filter(
          (experience) =>
            experience.id !== id,
        )
        .map(
          (
            experience,
            index,
          ) => ({
            ...experience,
            order: index,
          }),
        );

    onUpdate({
      experiences: next,
    });

    if (
      editingId === id
    ) {
      handleCancel();
    }
  }

  function moveExperience(
    id: string,
    direction:
      | "up"
      | "down",
  ) {
    const next = [
      ...experiences,
    ];

    const index =
      next.findIndex(
        (experience) =>
          experience.id === id,
      );

    if (index === -1) {
      return;
    }

    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        next.length
    ) {
      return;
    }

    [
      next[index],
      next[targetIndex],
    ] = [
      next[targetIndex],
      next[index],
    ];

    onUpdate({
      experiences:
        next.map(
          (
            experience,
            itemIndex,
          ) => ({
            ...experience,
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
              Experiences
            </span>

            <span className="ml-1 text-[10px] text-[var(--muted)]">
              {experiences.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add experience"
            title="Add experience"
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
                  ? "Edit Experience"
                  : "New Experience"}
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
                size={14}
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
            <ExperienceField
              label="Company"
              icon={Building2}
              value={company}
              error={
                errors.company
                  ?.message
              }
            >
              <input
                {...register(
                  "company",
                )}
                placeholder="Company name"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ExperienceField>

            <ExperienceField
              label="Position"
              icon={
                BriefcaseBusiness
              }
              value={position}
              error={
                errors.position
                  ?.message
              }
            >
              <input
                {...register(
                  "position",
                )}
                placeholder="Frontend Developer"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </ExperienceField>

            <ExperienceField
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
            </ExperienceField>

            <ExperienceField
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
            </ExperienceField>

            <ExperienceField
              label="End date"
              icon={
                CalendarDays
              }
              value={
                current
                  ? "current"
                  : endDate
              }
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
                disabled={current}
                className="
                  min-w-0
                  bg-transparent
                  !text-xs
                  outline-none
                  disabled:cursor-not-allowed
                  disabled:opacity-35
                "
              />
            </ExperienceField>

            <div className="flex flex-col justify-end">
              <label
                className={`
                  flex
                  h-9
                  cursor-pointer
                  items-center
                  gap-2
                  rounded-xl
                  px-5
                  text-[10px]
                  font-medium
                  transition-all
                  

                  ${
                    current
                      ? "neo-inset text-[var(--accent)] "
                      : "neo-button !text-[var(--muted)] hover:!text-[var(--text)]"
                  }
                `}
              >
                <input
                  {...currentRegister}
                  type="checkbox"
                  onChange={(
                    event,
                  ) => {
                    currentRegister.onChange(
                      event,
                    );

                    if (
                      event.target.checked
                    ) {
                      setValue(
                        "endDate",
                        "",
                        {
                          shouldValidate:
                            true,
                          shouldDirty:
                            true,
                        },
                      );
                    }
                  }}
                  className="h-3.5 w-3.5 accent-[var(--accent)] cursor-pointer"
                />

                I currently work here
              </label>
            </div>
          </div>

          <label className="mt-2 block">
            <div className="mb-1 flex items-center justify-between gap-3">
              <span
                className={`
                  text-[10px]
                  font-medium

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
                placeholder="Responsibilities, impact and achievements..."
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

      {experiences.length >
        0 && (
        <div className="space-y-2">
          {experiences.map(
            (
              experience,
              index,
            ) => (
              <article
                key={
                  experience.id
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
                    <div className="flex min-w-0 items-center gap-2">
                      <h3 className="truncate text-xs font-semibold">
                        {
                          experience.position
                        }
                      </h3>

                      {experience.current && (
                        <span className="shrink-0 rounded-md bg-[var(--success-soft)] px-1.5 py-0.5 text-[8px] font-medium text-[var(--success)]">
                          Current
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[var(--muted)]">
                      <span className="truncate">
                        {
                          experience.company
                        }
                      </span>

                      {experience.location && (
                        <>
                          <span className="opacity-40">
                            •
                          </span>

                          <span className="truncate">
                            {
                              experience.location
                            }
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-1 text-[9px] text-[var(--muted)]">
                      {
                        experience.startDate
                      }

                      {" — "}

                      {experience.current
                        ? "Present"
                        : experience.endDate}
                    </div>
                  </div>

                  <div className="absolute -bottom-5.5 right-0 flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={
                        index === 0
                      }
                      onClick={() =>
                        moveExperience(
                          experience.id,
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
                      aria-label="Move experience up"
                    >
                      <ArrowUp
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        index ===
                        experiences.length -
                          1
                      }
                      onClick={() =>
                        moveExperience(
                          experience.id,
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
                      aria-label="Move experience down"
                    >
                      <ArrowDown
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          experience,
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
                      aria-label="Edit experience"
                    >
                      <Pencil
                        size={12}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          experience.id,
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
                      aria-label="Delete experience"
                    >
                      <Trash2
                        size={12}
                      />
                    </button>
                  </div>
                </div>

                {experience.description && (
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
                      experience.description
                    }
                  >
                    {
                      experience.description
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

interface ExperienceFieldProps {
  label: string;

  icon: ElementType;

  value?: string;

  error?: string;

  children:
    ReactNode;
}

function ExperienceField({
  label,
  icon: Icon,
  value = "",
  error,
  children,
}: ExperienceFieldProps) {
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