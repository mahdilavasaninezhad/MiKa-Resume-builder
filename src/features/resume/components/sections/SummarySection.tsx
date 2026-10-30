import {
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import type {
  z,
} from "zod";

import {
  resumeSummaryFormSchema,
} from "../../schemas/resume.schema";

import type {
  Resume,
  UpdateResumeInput,
} from "../../types/resume.types";

type SummaryFormValues =
  z.infer<
    typeof resumeSummaryFormSchema
  >;

interface SummarySectionProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

export function SummarySection({
  resume,
  onUpdate,
}: SummarySectionProps) {
  const {
    control,
    formState: {
      errors,
    },
  } =
    useForm<SummaryFormValues>({
      resolver: zodResolver(
        resumeSummaryFormSchema,
      ),

      mode: "onChange",

      defaultValues: {
        targetJobTitle:
          resume.targetJobTitle,

        summary:
          resume.summary,
      },
    });

  return (
    <div className="space-y-3 w-[340px] min-w-0 ml-2">
      <Controller
        name="targetJobTitle"
        control={control}
        render={({ field }) => {
          const filled =
            field.value
              .trim()
              .length > 0;

          const hasError =
            Boolean(
              errors
                .targetJobTitle,
            );

          return (
            <label className="block">
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
                    hasError
                      ? "text-[var(--danger)]"
                      : filled
                        ? "text-[var(--success)]"
                        : "text-[var(--muted)]"
                  }
                `}
              >
                <BriefcaseBusiness
                  size={12}
                  strokeWidth={1.9}
                />

                Target job title
              </div>

              <div
                data-filled={
                  filled
                }
                className={`
                  form-field
                  flex
                  h-10
                  items-center
                  rounded-xl
                  px-3

                  ${
                    hasError
                      ? "border-[var(--danger)]"
                      : ""
                  }
                `}
              >
                <input
                  {...field}
                  onChange={(
                    event,
                  ) => {
                    field.onChange(
                      event,
                    );

                    onUpdate({
                      targetJobTitle:
                        event.target.value,
                    });
                  }}
                  placeholder="Software Engineer"
                  className="
                    h-full
                    min-w-0
                    bg-transparent
                    !text-md
                    outline-none
                  "
                />
                {errors
                .targetJobTitle && (
                <p
                  className="
                    truncate
                    text-[10px]
                    text-[var(--danger)]
                  "
                  title={
                    errors
                      .targetJobTitle
                      .message
                  }
                >
                  {
                    errors
                      .targetJobTitle
                      .message
                  }
                </p>
              )}
              </div>

              
            </label>
          );
        }}
      />

      <Controller
        name="summary"
        control={control}
        render={({ field }) => {
          const filled =
            field.value
              .trim()
              .length > 0;

          const hasError =
            Boolean(
              errors.summary,
            );

          return (
            <label className="block">
              <div
                className="
                  mb-1
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <div
                  className={`
                    flex
                    items-center
                    gap-1.5
                    text-[10px]
                    font-medium
                    transition-colors
                    duration-200

                    ${
                      hasError
                        ? "text-[var(--danger)]"
                        : filled
                          ? "text-[var(--success)]"
                          : "text-[var(--muted)]"
                    }
                  `}
                >
                  <Sparkles
                    size={12}
                    strokeWidth={1.9}
                  />

                  Professional summary
                </div>

                <span
                  className={`
                    text-[9px]
                    tabular-nums

                    ${
                      field.value
                        .length >=
                      1100
                        ? "text-[var(--danger)]"
                        : "text-[var(--muted)]"
                    }
                  `}
                >
                  {
                    field.value
                      .length
                  }
                  /1200
                </span>
              </div>

              <div
                data-filled={
                  filled
                }
                className={`
                  form-field
                  rounded-xl
                  px-3
                  py-2.5

                  ${
                    hasError
                      ? "border-[var(--danger)]"
                      : ""
                  }
                `}
              >
                <textarea
                  {...field}
                  onChange={(
                    event,
                  ) => {
                    field.onChange(
                      event,
                    );

                    onUpdate({
                      summary:
                        event.target.value,
                    });
                  }}
                  maxLength={1200}
                  placeholder="Write a concise professional summary..."
                  className="
                    min-h-53
                    w-full
                    resize-y
                    bg-transparent
                    !text-xs
                    leading-5
                    outline-none
                  "
                />
              </div>

              {errors.summary && (
                <p
                  className="
                    mt-1
                    text-[10px]
                    leading-3
                    text-[var(--danger)]
                  "
                >
                  {
                    errors.summary
                      .message
                  }
                </p>
              )}
            </label>
          );
        }}
      />
    </div>
  );
}