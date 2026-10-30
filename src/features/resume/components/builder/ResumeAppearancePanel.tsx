import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Award,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  GraduationCap,
  ImagePlus,
  Languages,
  LayoutTemplate,
  Link2,
  Palette,
  Trash2,
  Type,
  User,
  Wrench,
} from "lucide-react";

import {
  useRef,
  useState,
} from "react";

import type {
  ChangeEvent,
  ElementType,
  ReactNode,
} from "react";

import type {
  Resume,
  ResumeBorderStyle,
  ResumeSectionAppearance,
  ResumeSectionFont,
  ResumeSectionType,
  ResumeTemplate,
  ResumeTextAlign,
  UpdateResumeInput,
} from "../../types/resume.types";

import {
  getResumeSectionAppearance,
} from "../../utils/resumeSectionAppearance";

import {
  notify,
} from "../../../../shared/lib/notify";

interface ResumeAppearancePanelProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

const templates: {
  value: ResumeTemplate;
  label: string;
}[] = [
  {
    value: "modern",
    label: "Modern",
  },
  {
    value: "minimal",
    label: "Minimal",
  },
  {
    value: "professional",
    label: "Pro",
  },
  {
    value: "creative",
    label: "Creative",
  },
  {
    value: "compact",
    label: "Compact",
  },
];

const sections: {
  value: ResumeSectionType;
  label: string;
  icon: ElementType;
}[] = [
  {
    value: "personal",
    label: "Personal",
    icon: User,
  },
  {
    value: "summary",
    label: "Summary",
    icon: FileText,
  },
  {
    value: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },
  {
    value: "education",
    label: "Education",
    icon: GraduationCap,
  },
  {
    value: "projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    value: "skills",
    label: "Skills",
    icon: Wrench,
  },
  {
    value: "languages",
    label: "Languages",
    icon: Languages,
  },
  {
    value: "certifications",
    label: "Certificates",
    icon: Award,
  },
  {
    value: "links",
    label: "Links",
    icon: Link2,
  },
];

const fonts: {
  value: ResumeSectionFont;
  label: string;
}[] = [
  {
    value: "sans",
    label: "Sans",
  },
  {
    value: "serif",
    label: "Serif",
  },
  {
    value: "mono",
    label: "Mono",
  },
  {
    value: "system",
    label: "System",
  },
  {
    value: "cursive",
    label: "Cursive",
  },
];

const borderStyles: {
  value: ResumeBorderStyle;
  label: string;
}[] = [
  {
    value: "solid",
    label: "Solid",
  },
  {
    value: "dashed",
    label: "Dashed",
  },
  {
    value: "dotted",
    label: "Dotted",
  },
  {
    value: "double",
    label: "Double",
  },
];

export function ResumeAppearancePanel({
  resume,
  onUpdate,
}: ResumeAppearancePanelProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    selectedSection,
    setSelectedSection,
  ] =
    useState<ResumeSectionType>(
      "personal",
    );

  const sectionStyles =
    resume.appearance
      .sectionStyles ?? {};

  const rawSectionStyle =
    sectionStyles[
      selectedSection
    ] ?? {};

  const sectionStyle =
    getResumeSectionAppearance(
      sectionStyles,
      selectedSection,
    );

  function updateTemplate(
    template:
      ResumeTemplate,
  ) {
    onUpdate({
      template,
    });
  }

  function updateSection(
    data:
      Partial<ResumeSectionAppearance>,
  ) {
    onUpdate({
      appearance: {
        ...resume.appearance,

        sectionStyles: {
          ...sectionStyles,

          [selectedSection]: {
            ...rawSectionStyle,
            ...data,
          },
        },
      },
    });
  }

  function handleImageChange(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      notify.error(
        "Please select a valid image.",
      );

      event.target.value =
        "";

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result !==
        "string"
      ) {
        return;
      }

      updateSection({
        imageUrl:
          reader.result,
      });
    };

    reader.onerror = () => {
      notify.error(
        "Could not read selected image.",
      );
    };

    reader.readAsDataURL(
      file,
    );

    event.target.value = "";
  }

  return (
    <section
      className="
        glass-panel
        flex
        h-full
        min-h-0
        flex-col
        gap-1.5
        rounded-2xl
        p-2
      "
    >
      <div
        className="
          flex
          shrink-0
          items-center
          justify-center
          gap-2
          rounded-lg
          p-1
          glass-panel-header
        "
      >
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-lg
            text-[var(--accent)]
          "
        >
          <Palette
            size={30}
          />
        </div>

        <div className="min-w-0 text-center">
          <h3
            className="
              text-[15px]
              font-semibold
            "
          >
            Resume Design
          </h3>

          <p
            className="
              text-[9px]
              text-[var(--muted)]
            "
          >
            Template & Section Editor
          </p>
        </div>
      </div>

      <div
        className="
          shrink-0
          border-b
          border-dashed
          border-[var(--shadow-dark)]
          pb-2
        "
      >
        <PanelTitle
          icon={
            LayoutTemplate
          }
          title="Template"
        />

        <div
          className="
            mt-1
            grid
            grid-cols-5
            gap-1
          "
        >
          {templates.map(
            (template) => {
              const active =
                resume.template ===
                template.value;

              return (
                <button
                  key={
                    template.value
                  }
                  type="button"
                  onClick={() =>
                    updateTemplate(
                      template.value,
                    )
                  }
                  className={`
                    h-6
                    min-w-0
                    rounded-md
                    px-1
                    !text-[10px]
                    font-medium
                    transition-all
                    text-[var(--muted)]

                    ${
                      active
                        ? "active-inset !text-[var(--accent)]"
                        : "button-hover hover:!text-[var(--text)]"
                    }
                  `}
                >
                  <span
                    className="
                      block
                      truncate
                    "
                  >
                    {
                      template.label
                    }
                  </span>
                </button>
              );
            },
          )}
        </div>
      </div>

      <div
        className="
          relative
          h-8
          shrink-0
        "
      >
        <div
          className="
            absolute
            -bottom-6.5
            left-0
            right-0
            grid
            grid-cols-9
            gap-1.5
            p-2
          "
        >
          {sections.map(
            (section) => {
              const active =
                selectedSection ===
                section.value;

              const Icon =
                section.icon;

              return (
                <button
                  key={
                    section.value
                  }
                  type="button"
                  title={
                    section.label
                  }
                  aria-label={
                    section.label
                  }
                  onClick={() =>
                    setSelectedSection(
                      section.value,
                    )
                  }
                  className={`
                    shadow-button
                    flex
                    h-5.5
                    min-w-0
                    items-center
                    justify-center
                    rounded-md
                    transition-all
                    text-[var(--muted)]

                    ${
                      active
                        ? "active-inset !text-[var(--accent)]"
                        : "hover:!text-[var(--text)]"
                    }
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={
                      1.8
                    }
                  />
                </button>
              );
            },
          )}
        </div>

        <PanelTitle
          icon={
            LayoutTemplate
          }
          title="Sections"
        />
      </div>

      <div
        className="
          neo-inset
          min-h-0
          flex-1
          overflow-x-hidden
          overflow-y-auto
          rounded-xl
          p-3
          pt-6.5
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <PanelTitle
            icon={Type}
            title={`${
              sections.find(
                (section) =>
                  section.value ===
                  selectedSection,
              )?.label ??
              selectedSection
            }`}
          />

          <div
            className="
              flex
              shrink-0
            "
          >
            <span className="flex items-center mr-1 text-[11px] text-[var(--muted)] ">Add Image</span>
            <input
              ref={
                fileInputRef
              }
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="hidden"
            />

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                neo-button
                flex
                h-5.5
                items-center
                rounded-md
                px-1
                mr-1.5
                !text-[var(--muted)]
                hover:!text-[var(--text)]
              "
            >
              <ImagePlus
                size={15}
                strokeWidth={1.6}
              />
            </button>

            {rawSectionStyle.imageUrl && (
              <button
                type="button"
                onClick={() =>
                  updateSection({
                    imageUrl:
                      null,
                  })
                }
                className="
                  neo-button
                  flex
                  h-5.5
                  w-5.5
                  items-center
                  justify-center
                  rounded-md
                  !text-[var(--muted)]
                  hover:!text-[var(--danger)]
                "
              >
                <Trash2
                  size={14}
                  strokeWidth={1.6}
                />
              </button>
            )}
          </div>
        </div>

        <div
          className="
            mt-1
            grid
            grid-cols-5
            gap-1
          "
        >
          <ColorControl
            label="BG"
            value={
              sectionStyle.backgroundColor
            }
            onChange={(
              value,
            ) =>
              updateSection({
                backgroundColor:
                  value,
              })
            }
          />

          <ColorControl
            label="Title"
            value={
              sectionStyle.titleColor
            }
            onChange={(
              value,
            ) =>
              updateSection({
                titleColor:
                  value,
              })
            }
          />

          <ColorControl
            label="Text"
            value={
              sectionStyle.textColor
            }
            onChange={(
              value,
            ) =>
              updateSection({
                textColor:
                  value,
              })
            }
          />

          <ColorControl
            label="Icon"
            value={
              sectionStyle.iconColor
            }
            onChange={(
              value,
            ) =>
              updateSection({
                iconColor:
                  value,
              })
            }
          />

          <ColorControl
            label="Border"
            value={
              sectionStyle.borderColor
            }
            disabled={
              !sectionStyle.borderEnabled
            }
            onChange={(
              value,
            ) =>
              updateSection({
                borderColor:
                  value,
              })
            }
          />
        </div>

        <div
          className="
            mt-1
            grid
            grid-cols-2
            gap-1
          "
        >
          <CompactField
            label="Font"
          >
            <select
              value={
                sectionStyle.fontFamily
              }
              onChange={(
                event,
              ) =>
                updateSection({
                  fontFamily:
                    event.target
                      .value as ResumeSectionFont,
                })
              }
              className="
                shadow-button
                h-5
                min-w-0
                flex-1
                !text-[12px]
                text-[var(--muted)]
                hover:text-[var(--text)]
                text-center
                outline-none
                border
                border-[var(--muted)]
                hover:border-[var(--text)]
                rounded-md
              "
            >
              {fonts.map(
                (font) => (
                  <option
                    key={
                      font.value
                    }
                    value={
                      font.value
                    }
                  >
                    {
                      font.label
                    }
                  </option>
                ),
              )}
            </select>
          </CompactField>

          <RangeField
            label="Font Size"
            value={
              sectionStyle.fontSize
            }
            min={8}
            max={32}
            step={1}
            suffix="px"
            onChange={(
              value,
            ) =>
              updateSection({
                fontSize:
                  value,
              })
            }
          />
        </div>

        <div
          className="
            mt-1
            grid
            grid-cols-2
            gap-1
          "
        >
          <RangeField
            label="Line"
            value={
              sectionStyle.lineHeight
            }
            min={1}
            max={2.4}
            step={0.1}
            onChange={(
              value,
            ) =>
              updateSection({
                lineHeight:
                  value,
              })
            }
          />

          <RangeField
            label="Letter"
            value={
              sectionStyle.letterSpacing
            }
            min={-1}
            max={5}
            step={0.25}
            suffix="px"
            onChange={(
              value,
            ) =>
              updateSection({
                letterSpacing:
                  value,
              })
            }
          />
        </div>

        <div
          className="
            mt-1
            grid
            grid-cols-2
            gap-1
          "
        >
          <CompactField
            label="Align"
          >
            <div
              className="
                ml-auto
                flex
                items-center
                gap-0.5
              "
            >
              <AlignControl
                icon={
                  AlignLeft
                }
                value="left"
                active={
                  sectionStyle.textAlign ===
                  "left"
                }
                onClick={(
                  value,
                ) =>
                  updateSection({
                    textAlign:
                      value,
                  })
                }
              />

              <AlignControl
                icon={
                  AlignCenter
                }
                value="center"
                active={
                  sectionStyle.textAlign ===
                  "center"
                }
                onClick={(
                  value,
                ) =>
                  updateSection({
                    textAlign:
                      value,
                  })
                }
              />

              <AlignControl
                icon={
                  AlignRight
                }
                value="right"
                active={
                  sectionStyle.textAlign ===
                  "right"
                }
                onClick={(
                  value,
                ) =>
                  updateSection({
                    textAlign:
                      value,
                  })
                }
              />
            </div>
          </CompactField>

          <CompactField
            label="Border"
          >
            <button
              type="button"
              onClick={() =>
                updateSection({
                  borderEnabled:
                    !sectionStyle.borderEnabled,
                })
              }
              className={`
                neo-button
                ml-auto
                h-5
                rounded-md
                px-2
                !text-[13px]
                font-semibold
                hover:text-[var(--text)]

                ${
                  sectionStyle.borderEnabled
                    ? "!text-[var(--accent)]"
                    : "text-[var(--muted)]"
                }
              `}
            >
              {sectionStyle.borderEnabled
                ? "ON"
                : "OFF"}
            </button>
          </CompactField>
        </div>

        <div
          className="
            mt-1
            grid
            grid-cols-2
            gap-1
          "
        >
          <CompactField
            label="Style"
          >
            <select
              disabled={
                !sectionStyle.borderEnabled
              }
              value={
                sectionStyle.borderStyle
              }
              onChange={(
                event,
              ) =>
                updateSection({
                  borderStyle:
                    event.target
                      .value as ResumeBorderStyle,
                })
              }
              className="
                shadow-button
                h-5
                min-w-0
                flex-1
                text-center
                !text-[12px]
                text-[var(--muted)]
                hover:text-[var(--text)]
                outline-none
                disabled:opacity-30
                border
                border-[var(--muted)]
                hover:border-[var(--text)]
                rounded-md
              "
            >
              {borderStyles.map(
                (style) => (
                  <option
                    key={
                      style.value
                    }
                    value={
                      style.value
                    }
                  >
                    {
                      style.label
                    }
                  </option>
                ),
              )}
            </select>
          </CompactField>

          <RangeField
            label="Size"
            value={
              sectionStyle.borderWidth
            }
            min={1}
            max={10}
            step={1}
            suffix="px"
            disabled={
              !sectionStyle.borderEnabled
            }
            onChange={(
              value,
            ) =>
              updateSection({
                borderWidth:
                  value,
              })
            }
          />
        </div>

        <div
          className="
            mt-1
            flex
            h-6
            items-center
            gap-1.5
            px-1
          "
        >
          <span
            className="
              shrink-0
              text-[9px]
              text-[var(--muted)]
            "
          >
            Padding
          </span>

          <input
            type="range"
            min={0}
            max={40}
            step={2}
            value={
              sectionStyle.padding
            }
            onChange={(
              event,
            ) =>
              updateSection({
                padding:
                  Number(
                    event.target
                      .value,
                  ),
              })
            }
            className="
              min-w-0
              flex-1
              accent-blue-600
            "
          />

          <span
            className="
              w-5
              shrink-0
              text-right
              text-[9px]
            "
          >
            {
              sectionStyle.padding
            }
            px
          </span>
        </div>
      </div>
    </section>
  );
}

function PanelTitle({
  icon: Icon,
  title,
}: {
  icon: ElementType;

  title: string;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        justify-center
        gap-2
      "
    >
      <Icon
        size={15}
        className="
          shrink-0
        "
      />

      <span
        className="
          truncate
          text-[11px]
          font-semibold
        "
      >
        {title}
      </span>
    </div>
  );
}

function CompactField({
  label,
  children,
}: {
  label: string;

  children:
    ReactNode;
}) {
  return (
    <div
      className="
        flex
        h-6
        min-w-0
        items-center
        gap-1
        rounded-md
        px-1.5
      "
    >
      <span
        className="
          shrink-0
          text-[9px]
          text-[var(--muted)]
        "
      >
        {label}
      </span>

      {children}
    </div>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  disabled = false,
  onChange,
}: {
  label: string;

  value: number;

  min: number;

  max: number;

  step: number;

  suffix?: string;

  disabled?: boolean;

  onChange: (
    value: number,
  ) => void;
}) {
  return (
    <div
      className={`
        flex
        h-6
        min-w-0
        items-center
        gap-1
        rounded-md
        px-1.5

        ${
          disabled
            ? "opacity-30"
            : ""
        }
      `}
    >
      <span
        className="
          shrink-0
          text-[9px]
          text-[var(--muted)]
        "
      >
        {label}
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(
          event,
        ) =>
          onChange(
            Number(
              event.target.value,
            ),
          )
        }
        className="
          min-w-0
          flex-1
          accent-blue-600
        "
      />

      <span
        className="
          w-5
          shrink-0
          text-right
          text-[9px]
        "
      >
        {value}
        {suffix}
      </span>
    </div>
  );
}

function ColorControl({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  disabled?: boolean;
}) {
  return (
    <label
      className={`
        flex
        min-w-0
        flex-col
        items-center
        justify-center
        rounded-md
        py-0.5

        ${
          disabled
            ? "opacity-30"
            : ""
        }
      `}
    >
      <span
        className="
          max-w-full
          truncate
          text-[8px]
          text-[var(--muted)]
        "
      >
        {label}
      </span>

      <input
        type="color"
        value={value}
        disabled={disabled}
        onChange={(
          event,
        ) =>
          onChange(
            event.target.value,
          )
        }
        className="
          h-5
          w-7
          cursor-pointer
          border-0
          bg-transparent
          p-0
          disabled:cursor-default
        "
      />
    </label>
  );
}

function AlignControl({
  icon: Icon,
  value,
  active,
  onClick,
}: {
  icon: ElementType;

  value:
    ResumeTextAlign;

  active: boolean;

  onClick: (
    value:
      ResumeTextAlign,
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onClick(value)
      }
      className={`
        shadow-button
        flex
        h-5
        w-6
        mx-1
        items-center
        justify-center
        rounded-md
        text-[var(--muted)]

        ${
          active
            ? "!text-[var(--accent)]"
            : "hover:text-[var(--text)]"
        }
      `}
    >
      <Icon
        size={16}
      />
    </button>
  );
}