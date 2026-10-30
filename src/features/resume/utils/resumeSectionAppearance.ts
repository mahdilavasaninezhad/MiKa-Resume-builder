import type {
  ResumeSectionAppearance,
  ResumeSectionFont,
  ResumeSectionStyles,
  ResumeSectionType,
} from "../types/resume.types";

export const defaultResumeSectionAppearance: Required<
  Omit<
    ResumeSectionAppearance,
    "imageUrl"
  >
> & {
  imageUrl: string | null;
} = {
  backgroundColor: "#ffffff",

  titleColor: "#0f172a",

  textColor: "#475569",

  iconColor: "#2563eb",

  fontFamily: "sans",

  fontSize: 12,

  lineHeight: 1.4,

  letterSpacing: 0,

  textAlign: "left",

  borderEnabled: false,

  borderColor: "#cbd5e1",

  borderStyle: "solid",

  borderWidth: 1,

  padding: 0,

  imageUrl: null,
};

export function getResumeSectionAppearance(
  sectionStyles:
    | ResumeSectionStyles
    | undefined,
  section: ResumeSectionType,
) {
  return {
    ...defaultResumeSectionAppearance,
    ...(sectionStyles?.[
      section
    ] ?? {}),
  };
}

export function getResumeSectionFontFamily(
  font:
    ResumeSectionFont,
) {
  switch (font) {
    case "serif":
      return "Georgia, 'Times New Roman', serif";

    case "mono":
      return "'Courier New', Courier, monospace";

    case "system":
      return "Arial, Helvetica, sans-serif";

    case "cursive":
      return "'Brush Script MT', 'Segoe Script', cursive";

    case "sans":
    default:
      return "Inter, ui-sans-serif, system-ui, sans-serif";
  }
}