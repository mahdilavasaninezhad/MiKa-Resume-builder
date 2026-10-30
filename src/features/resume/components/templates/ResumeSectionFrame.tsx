import type {
  CSSProperties,
  ReactNode,
} from "react";

import type {
  Resume,
  ResumeSectionType,
} from "../../types/resume.types";

import {
  getResumeSectionAppearance,
  getResumeSectionFontFamily,
} from "../../utils/resumeSectionAppearance";

interface ResumeSectionFrameProps {
  resume: Resume;

  section:
    ResumeSectionType;

  children:
    ReactNode;

  className?: string;
}

export function ResumeSectionFrame({
  resume,
  section,
  children,
  className = "",
}: ResumeSectionFrameProps) {
  const rawStyle =
    resume.appearance
      .sectionStyles?.[
        section
      ] ?? {};

  const resolvedStyle =
    getResumeSectionAppearance(
      resume.appearance
        .sectionStyles,
      section,
    );

  const style = {
    backgroundColor:
      rawStyle.backgroundColor,

    fontFamily:
      rawStyle.fontFamily
        ? getResumeSectionFontFamily(
            resolvedStyle.fontFamily,
          )
        : undefined,

    fontSize:
      rawStyle.fontSize !==
      undefined
        ? `${rawStyle.fontSize}px`
        : undefined,

    lineHeight:
      rawStyle.lineHeight,

    letterSpacing:
      rawStyle.letterSpacing !==
      undefined
        ? `${rawStyle.letterSpacing}px`
        : undefined,

    textAlign:
      rawStyle.textAlign,

    padding:
      rawStyle.padding !==
      undefined
        ? `${rawStyle.padding}px`
        : undefined,

    border:
      rawStyle.borderEnabled
        ? `${resolvedStyle.borderWidth}px ${resolvedStyle.borderStyle} ${resolvedStyle.borderColor}`
        : rawStyle.borderEnabled ===
            false
          ? "none"
          : undefined,

    "--resume-section-title":
      resolvedStyle.titleColor,

    "--resume-section-text":
      resolvedStyle.textColor,

    "--resume-section-icon":
      resolvedStyle.iconColor,
  } as CSSProperties;

  const alignmentClass =
    rawStyle.textAlign ===
    "center"
      ? "[&_*]:!text-center"
      : rawStyle.textAlign ===
          "right"
        ? "[&_*]:!text-right"
        : rawStyle.textAlign ===
            "left"
          ? "[&_*]:!text-left"
          : "";

  const textColorClass =
    rawStyle.textColor
      ? "[&_*]:!text-[var(--resume-section-text)]"
      : "";

  const titleColorClass =
    rawStyle.titleColor
      ? `
        [&_h1]:!text-[var(--resume-section-title)]
        [&_h2]:!text-[var(--resume-section-title)]
        [&_h3]:!text-[var(--resume-section-title)]
        [&_h4]:!text-[var(--resume-section-title)]
      `
      : "";

  const iconColorClass =
    rawStyle.iconColor
      ? `
        [&_svg]:!text-[var(--resume-section-icon)]
        [&_svg]:!stroke-[var(--resume-section-icon)]
      `
      : "";

  const fontSizeClass =
    rawStyle.fontSize !==
    undefined
      ? "[&_*]:!text-[length:inherit]"
      : "";

  const lineHeightClass =
    rawStyle.lineHeight !==
    undefined
      ? "[&_*]:!leading-[inherit]"
      : "";

  const letterSpacingClass =
    rawStyle.letterSpacing !==
    undefined
      ? "[&_*]:!tracking-[inherit]"
      : "";

  return (
    <section
      data-resume-section={
        section
      }
      style={style}
      className={`
        overflow-hidden

        ${alignmentClass}
        ${textColorClass}
        ${titleColorClass}
        ${iconColorClass}
        ${fontSizeClass}
        ${lineHeightClass}
        ${letterSpacingClass}

        ${className}
      `}
    >
      {rawStyle.imageUrl && (
        <img
          src={
            rawStyle.imageUrl
          }
          alt=""
          className="
            mb-2
            max-h-28
            w-full
            rounded-lg
            object-cover
          "
        />
      )}

      {children}
    </section>
  );
}