import {
  ExternalLink,
  Link2,
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
  resumeLinkFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeLink,
  UpdateResumeInput,
} from "../../types/resume.types";

type LinkFormValues =
  z.infer<
    typeof resumeLinkFormSchema
  >;

interface LinksSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyLink:
  LinkFormValues = {
    label: "",
    url: "",
  };

export function LinksSection({
  resume,
  onUpdate,
}: LinksSectionProps) {
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
    resume.links.length === 0,
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
    useForm<LinkFormValues>({
      resolver: zodResolver(
        resumeLinkFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyLink,
    });

  const label =
    watch("label");

  const url =
    watch("url");

  const links =
    [...resume.links].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(emptyLink);

    setFormOpen(true);
  }

  function handleEdit(
    link: ResumeLink,
  ) {
    setEditingId(
      link.id,
    );

    reset({
      label:
        link.label,

      url:
        link.url,
    });

    setFormOpen(true);
  }

  function close() {
    setEditingId(null);

    setFormOpen(false);

    reset(emptyLink);
  }

  function submit(
    values:
      LinkFormValues,
  ) {
    let next:
      ResumeLink[];

    if (editingId) {
      next =
        links.map(
          (link) =>
            link.id ===
            editingId
              ? {
                  ...link,
                  ...values,
                }
              : link,
        );
    } else {
      next = [
        ...links,

        {
          id:
            crypto.randomUUID(),

          ...values,

          order:
            links.length,
        },
      ];
    }

    onUpdate({
      links: next,
    });

    close();
  }

  function remove(
    id: string,
  ) {
    const next =
      links
        .filter(
          (link) =>
            link.id !== id,
        )
        .map(
          (
            link,
            index,
          ) => ({
            ...link,
            order: index,
          }),
        );

    onUpdate({
      links: next,
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
              Professional links
            </span>

            <span className="ml-2 text-[10px] text-[var(--muted)]">
              {links.length}
            </span>
          </div>

          <button
            type="button"
            onClick={
              handleAdd
            }
            aria-label="Add link"
            title="Add link"
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
                  ? "Edit Link"
                  : "New Link"}
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
              sm:grid-cols-[135px_minmax(0,1fr)]
            "
          >
            <LinkField
              label="Label"
              icon={Link2}
              value={label}
              error={
                errors.label
                  ?.message
              }
            >
              <input
                {...register(
                  "label",
                )}
                placeholder="GitHub"
                className="min-w-0 bg-transparent !text-xs outline-none
                "
              />
            </LinkField>

            <LinkField
              label="URL"
              icon={
                ExternalLink
              }
              value={url}
              error={
                errors.url
                  ?.message
              }
            >
              <input
                {...register(
                  "url",
                )}
                placeholder="https://github.com/..."
                className="min-w-0 bg-transparent !text-xs outline-none
                "
              />
            </LinkField>
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

      {links.length > 0 && (
        <div className="space-y-2">
          {links.map(
            (link) => (
              <article
                key={link.id}
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
                    {link.label}
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.url}
                    className="
                      mt-0.5
                      flex
                      min-w-0
                      items-center
                      gap-1
                      text-[9px]
                      text-[var(--muted)]
                      transition
                      hover:text-[var(--accent)]
                    "
                  >
                    <ExternalLink
                      size={9}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {link.url}
                    </span>
                  </a>
                </div>

                <div className="absolute -bottom-3 right-3 flex shrink-0 items-center gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open link"
                    title="Open link"
                    className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-lg
                        hover:!text-[var(--accent)]
                        transition
                        shadow-button
                    "
                  >
                    <ExternalLink
                      size={11}
                    />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        link,
                      )
                    }
                    aria-label="Edit link"
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
                  >
                    <Pencil
                      size={11}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      remove(
                        link.id,
                      )
                    }
                    aria-label="Delete link"
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

interface LinkFieldProps {
  label: string;

  icon: ElementType;

  value?: string;

  error?: string;

  children:
    ReactNode;
}

function LinkField({
  label,
  icon: Icon,
  value = "",
  error,
  children,
}: LinkFieldProps) {
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