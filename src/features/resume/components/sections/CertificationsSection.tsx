import {
  Award,
  CalendarDays,
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
  resumeCertificationFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  ResumeCertification,
  UpdateResumeInput,
} from "../../types/resume.types";

type CertificationFormValues =
  z.infer<
    typeof resumeCertificationFormSchema
  >;

interface CertificationsSectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const emptyCertification:
  CertificationFormValues = {
    name: "",
    issuer: "",
    issueDate: "",
    credentialUrl: "",
  };

export function CertificationsSection({
  resume,
  onUpdate,
}: CertificationsSectionProps) {
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
    resume.certifications.length ===
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
    useForm<CertificationFormValues>({
      resolver: zodResolver(
        resumeCertificationFormSchema,
      ),

      mode: "onChange",

      defaultValues:
        emptyCertification,
    });

  const name =
    watch("name");

  const issuer =
    watch("issuer");

  const issueDate =
    watch("issueDate");

  const credentialUrl =
    watch("credentialUrl");

  const certifications =
    [
      ...resume.certifications,
    ].sort(
      (a, b) =>
        a.order - b.order,
    );

  function handleAdd() {
    setEditingId(null);

    reset(
      emptyCertification,
    );

    setFormOpen(true);
  }

  function handleEdit(
    item:
      ResumeCertification,
  ) {
    setEditingId(
      item.id,
    );

    reset({
      name:
        item.name,

      issuer:
        item.issuer,

      issueDate:
        item.issueDate,

      credentialUrl:
        item.credentialUrl,
    });

    setFormOpen(true);
  }

  function close() {
    setFormOpen(false);

    setEditingId(null);

    reset(
      emptyCertification,
    );
  }

  function submit(
    values:
      CertificationFormValues,
  ) {
    let next:
      ResumeCertification[];

    if (editingId) {
      next =
        certifications.map(
          (item) =>
            item.id ===
            editingId
              ? {
                  ...item,
                  ...values,
                }
              : item,
        );
    } else {
      next = [
        ...certifications,

        {
          id:
            crypto.randomUUID(),

          ...values,

          order:
            certifications.length,
        },
      ];
    }

    onUpdate({
      certifications: next,
    });

    close();
  }

  function remove(
    id: string,
  ) {
    const next =
      certifications
        .filter(
          (item) =>
            item.id !== id,
        )
        .map(
          (
            item,
            index,
          ) => ({
            ...item,
            order: index,
          }),
        );

    onUpdate({
      certifications: next,
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
              Certifications
            </span>

            <span className="ml-1 text-[10px] text-[var(--muted)]">
              {certifications.length}
            </span>
          </div>

          <button
            type="button"
            onClick={
              handleAdd
            }
            aria-label="Add certification"
            title="Add certification"
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
                  ? "Edit Certification"
                  : "New Certification"}
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
              gap-x-3
              gap-y-2
              sm:grid-cols-2
            "
          >
            <CertificationField
              label="Certification"
              icon={Award}
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
                placeholder="AWS Certified Developer"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </CertificationField>

            <CertificationField
              label="Issuer"
              icon={Award}
              value={issuer}
              error={
                errors.issuer
                  ?.message
              }
            >
              <input
                {...register(
                  "issuer",
                )}
                placeholder="Amazon Web Services"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </CertificationField>

            <CertificationField
              label="Issue date"
              icon={
                CalendarDays
              }
              value={
                issueDate
              }
              error={
                errors.issueDate
                  ?.message
              }
            >
              <input
                {...register(
                  "issueDate",
                )}
                type="month"
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </CertificationField>

            <CertificationField
              label="Credential URL"
              icon={Link2}
              value={
                credentialUrl
              }
              error={
                errors.credentialUrl
                  ?.message
              }
            >
              <input
                {...register(
                  "credentialUrl",
                )}
                placeholder="https://..."
                className="min-w-0 bg-transparent !text-xs outline-none"
              />
            </CertificationField>
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

      {certifications.length >
        0 && (
        <div className="space-y-2">
          {certifications.map(
            (item) => (
              <article
                key={item.id}
                className="
                  rounded-xl
                  border
                  border-[var(--border)]
                  px-3
                  py-2.5
                  mb-5
                  relative
                "
              >

                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold">
                    {item.name}
                  </div>

                  <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-[9px] text-[var(--muted)]">
                    {item.issuer && (
                      <span className="truncate">
                        {
                          item.issuer
                        }
                      </span>
                    )}

                    {item.issuer &&
                      item.issueDate && (
                        <span className="opacity-40">
                          •
                        </span>
                      )}

                    {item.issueDate && (
                      <span className="shrink-0">
                        {
                          item.issueDate
                        }
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute -bottom-3 right-3 flex shrink-0 items-center gap-2">
                  {item.credentialUrl && (
                    <a
                      href={
                        item.credentialUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open credential"
                      title="Open credential"
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
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(
                        item,
                      )
                    }
                    aria-label="Edit certification"
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
                        item.id,
                      )
                    }
                    aria-label="Delete certification"
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

interface CertificationFieldProps {
  label: string;

  icon:
    React.ElementType;

  value?: string;

  error?: string;

  children:
    React.ReactNode;
}

function CertificationField({
  label,
  icon: Icon,
  value = "",
  error,
  children,
}: CertificationFieldProps) {
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