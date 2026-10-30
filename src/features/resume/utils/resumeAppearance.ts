import type {
  ResumeAppearance,
  ResumeDensity,
  ResumeFont,
} from "../types/resume.types";

export const defaultResumeAppearance:
  ResumeAppearance = {
  accentColor: "#2563eb",
  fontFamily: "sans",
  density: "comfortable",
  showAvatar: true,
};

export function normalizeResumeAppearance(
  appearance?: Partial<ResumeAppearance>,
): ResumeAppearance {
  return {
    ...defaultResumeAppearance,
    ...appearance,
  };
}

export function getResumeFontFamily(
  font: ResumeFont,
) {
  switch (font) {
    case "serif":
      return "Georgia, 'Times New Roman', serif";

    case "mono":
      return "'Courier New', Courier, monospace";

    case "sans":
    default:
      return "Inter, ui-sans-serif, system-ui, sans-serif";
  }
}

export function getResumeDensitySpacing(
  density: ResumeDensity,
) {
  switch (density) {
    case "compact":
      return "space-y-4";

    case "spacious":
      return "space-y-8";

    case "comfortable":
    default:
      return "space-y-6";
  }
}