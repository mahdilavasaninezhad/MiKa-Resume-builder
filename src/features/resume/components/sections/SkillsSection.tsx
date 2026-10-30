import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Plus,
  Save,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

import {
  useState,
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
  resumeSkillFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeSkill,
  UpdateResumeInput,
} from "../../types/resume.types";

type SkillFormValues =
  z.infer<
    typeof resumeSkillFormSchema
  >;

interface SkillsSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptySkill:
  SkillFormValues = {
    name: "",
    level: "intermediate",
  };

export function SkillsSection({
  resume,
  onUpdate,
}: SkillsSectionProps) {
  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    formOpen,
    setFormOpen,
  ] = useState(
    resume.skills.length === 0,
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
    },
  } =
    useForm<SkillFormValues>({
      resolver: zodResolver(
        resumeSkillFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptySkill,
    });

  const name =
    watch("name");

  const level =
    watch("level");

  const skills =
    [...resume.skills].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(emptySkill);

    setFormOpen(true);
  }

  function handleEdit(
    skill: ResumeSkill,
  ) {
    setEditingId(skill.id);

    reset({
      name: skill.name,
      level: skill.level,
    });

    setFormOpen(true);
  }

  function handleCancel() {
    setEditingId(null);

    reset(emptySkill);

    setFormOpen(false);
  }

  function onSubmit(
    values:
      SkillFormValues,
  ) {
    let next:
      ResumeSkill[];

    if (editingId) {
      next =
        skills.map(
          (skill) =>
            skill.id ===
            editingId
              ? {
                  ...skill,
                  ...values,
                }
              : skill,
        );
    } else {
      next = [
        ...skills,
        {
          id:
            crypto.randomUUID(),

          ...values,

          order:
            skills.length,
        },
      ];
    }

    onUpdate({
      skills: next,
    });

    handleCancel();
  }

  function remove(
    id: string,
  ) {
    onUpdate({
      skills:
        skills
          .filter(
            (skill) =>
              skill.id !== id,
          )
          .map(
            (
              skill,
              index,
            ) => ({
              ...skill,
              order: index,
            }),
          ),
    });

    if (
      editingId === id
    ) {
      handleCancel();
    }
  }

  function move(
    id: string,
    direction:
      | "up"
      | "down",
  ) {
    const next = [
      ...skills,
    ];

    const index =
      next.findIndex(
        (skill) =>
          skill.id === id,
      );

    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      index < 0 ||
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
      skills:
        next.map(
          (
            skill,
            itemIndex,
          ) => ({
            ...skill,
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
              Skills
            </span>

            <span className="ml-2 text-[10px] text-[var(--muted)]">
              {skills.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add skill"
            title="Add skill"
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
                  ? "Edit Skill"
                  : "New Skill"}
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
              gap-2
              sm:grid-cols-[minmax(0,1fr)_140px]
            "
          >
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

                  ${
                    errors.name
                      ? "text-[var(--danger)]"
                      : name
                            .trim()
                            .length >
                          0
                        ? "text-[var(--success)]"
                        : "text-[var(--muted)]"
                  }
                `}
              >
                <Wrench
                  size={11}
                  strokeWidth={1.9}
                />

                Skill
              </div>

              <input
                {...register(
                  "name",
                )}
                data-filled={
                  name
                    .trim()
                    .length > 0
                }
                placeholder="React"
                className={`
                  form-field
                  h-9
                  w-full
                  rounded-xl
                  px-3
                  !text-sm
                  outline-none

                  ${
                    errors.name
                      ? "border-[var(--danger)]"
                      : ""
                  }
                `}
              />

              {errors.name && (
                <p className="mt-1 text-[10px] leading-3 text-[var(--danger)]">
                  {
                    errors.name
                      .message
                  }
                </p>
              )}
            </label>

            <label className="min-w-0">
              <div
                className="
                  mb-1
                  text-[10px]
                  font-medium
                  text-[var(--success)]
                "
              >
                Level
              </div>

              <select
                {...register(
                  "level",
                )}
                data-filled={
                  Boolean(level)
                }
                className="
                  form-field
                  h-9
                  w-full
                  rounded-xl
                  bg-transparent
                  px-2
                  !text-sm
                  capitalize
                  outline-none
                "
              >
                <option value="beginner">
                  Beginner
                </option>

                <option value="intermediate">
                  Intermediate
                </option>

                <option value="advanced">
                  Advanced
                </option>

                <option value="expert">
                  Expert
                </option>
              </select>
            </label>
          </div>

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

      {skills.length >
        0 && (
        <div
          className="
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-1
          "
        >
          {skills.map(
            (
              skill,
              index,
            ) => (
              <article
                key={
                  skill.id
                }
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-3
                  py-2.5
                  mb-3
                  relative
                "
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">
                    {
                      skill.name
                    }
                  </div>

                  <div className="mt-0.5 text-[9px] capitalize text-[var(--muted)]">
                    {
                      skill.level
                    }
                  </div>
                </div>

                <div className="absolute -bottom-3 right-3 flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      index === 0
                    }
                    onClick={() =>
                      move(
                        skill.id,
                        "up",
                      )
                    }
                    aria-label="Move skill up"
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
                  >
                    <ArrowUp
                      size={11}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      index ===
                      skills.length -
                        1
                    }
                    onClick={() =>
                      move(
                        skill.id,
                        "down",
                      )
                    }
                    aria-label="Move skill down"
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
                  >
                    <ArrowDown
                      size={11}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        skill,
                      )
                    }
                    aria-label="Edit skill"
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
                  >
                    <Pencil
                      size={11}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      remove(
                        skill.id,
                      )
                    }
                    aria-label="Delete skill"
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
                  >
                    <Trash2
                      size={12}
                    />
                  </button>
                </div>
              </article>
            ),
          )}
        </div>
      )}
    </div>
  );
}