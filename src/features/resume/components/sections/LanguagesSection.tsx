import {
  Languages,
  Pencil,
  Plus,
  Save,
  Trash2,
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
  resumeLanguageFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeLanguage,
  UpdateResumeInput,
} from "../../types/resume.types";

type LanguageFormValues =
  z.infer<
    typeof resumeLanguageFormSchema
  >;

interface LanguagesSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyLanguage:
  LanguageFormValues = {
    name: "",
    level: "conversational",
  };

export function LanguagesSection({
  resume,
  onUpdate,
}: LanguagesSectionProps) {
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
    resume.languages.length ===
      0,
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
    useForm<LanguageFormValues>({
      resolver: zodResolver(
        resumeLanguageFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyLanguage,
    });

  const name =
    watch("name");

  const level =
    watch("level");

  const languages =
    [...resume.languages].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(emptyLanguage);

    setFormOpen(true);
  }

  function handleEdit(
    language:
      ResumeLanguage,
  ) {
    setEditingId(
      language.id,
    );

    reset({
      name:
        language.name,

      level:
        language.level,
    });

    setFormOpen(true);
  }

  function close() {
    setEditingId(null);

    reset(emptyLanguage);

    setFormOpen(false);
  }

  function submit(
    values:
      LanguageFormValues,
  ) {
    let next:
      ResumeLanguage[];

    if (editingId) {
      next =
        languages.map(
          (language) =>
            language.id ===
            editingId
              ? {
                  ...language,
                  ...values,
                }
              : language,
        );
    } else {
      next = [
        ...languages,

        {
          id:
            crypto.randomUUID(),

          ...values,

          order:
            languages.length,
        },
      ];
    }

    onUpdate({
      languages: next,
    });

    close();
  }

  function remove(
    id: string,
  ) {
    const next =
      languages
        .filter(
          (language) =>
            language.id !== id,
        )
        .map(
          (
            language,
            index,
          ) => ({
            ...language,
            order: index,
          }),
        );

    onUpdate({
      languages: next,
    });

    if (
      editingId === id
    ) {
      close();
    }
  }

  return (
    <div className="space-y-3">
      {!formOpen && (
        <div className="flex items-center justify-between max-w-[345px] ml-1.5">
          <div className="min-w-0">
            <span className="text-xs font-medium">
              Languages
            </span>

            <span className="ml-2 text-[10px] text-[var(--muted)]">
              {languages.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label="Add language"
            title="Add language"
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
              submit,
            )
          }
        >
          <div className="mb-2 pb-2 flex items-center justify-between max-w-[345px] ml-1.5">
            <div className="min-w-0">

              <span className="truncate text-[12px] font-semibold ml-35">
                {editingId
                  ? "Edit Language"
                  : "New Language"}
              </span>
            </div>

            <button
              type="button"
              onClick={close}
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
              sm:grid-cols-[minmax(0,1fr)_150px]
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
                            .length > 0
                        ? "text-[var(--success)]"
                        : "text-[var(--muted)]"
                  }
                `}
              >
                <Languages
                  size={11}
                  strokeWidth={1.9}
                />

                Language
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
                placeholder="English"
                className={`
                  form-field
                  h-9
                  w-full
                  rounded-xl
                  px-3
                  text-xs
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
                className={`
                  mb-1
                  text-[10px]
                  font-medium
                  transition-colors

                  ${
                    level
                      ? "text-[var(--success)]"
                      : "text-[var(--muted)]"
                  }
                `}
              >
                Proficiency
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
                  px-3
                  text-xs
                  capitalize
                  outline-none
                "
              >
                <option value="basic">
                  Basic
                </option>

                <option value="conversational">
                  Conversational
                </option>

                <option value="professional">
                  Professional
                </option>

                <option value="native">
                  Native
                </option>
              </select>
            </label>
          </div>

          <div className="mt-2 flex gap-2 absolute -bottom-3.5 right-5 z-1">
            <button
              type="button"
              onClick={close}
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

      {languages.length >
        0 && (
        <div
          className="
            grid
            grid-cols-1
            gap-2
            sm:grid-cols-1
          "
        >
          {languages.map(
            (language) => (
              <article
                key={
                  language.id
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
                      language.name
                    }
                  </div>

                  <div className="mt-0.5 text-[9px] capitalize text-[var(--muted)]">
                    {
                      language.level
                    }
                  </div>
                </div>

                <div className="absolute -bottom-3 right-3 flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        language,
                      )
                    }
                    aria-label="Edit language"
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
                        language.id,
                      )
                    }
                    aria-label="Delete language"
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