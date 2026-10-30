import {
  FileText,
  Award,
  BriefcaseBusiness,
  Check,
  FolderKanban,
  GraduationCap,
  Languages,
  Link2,
  User,
  Wrench,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import { useResumeEditorStore } from "../../store/resume-editor.store";

import type {
  Resume,
  ResumeSectionType,
} from "../../types/resume.types";

interface ResumeSectionNavProps {
  resume: Resume;
}

interface SectionItem {
  id: ResumeSectionType;
  label: string;
  icon: LucideIcon;
}

const sections: SectionItem[] = [
  {
    id: "personal",
    label: "Personal",
    icon: User,
  },

  {
    id: "summary",
    label: "Summary",
    icon: FileText,
  },

  {
    id: "experience",
    label: "Experience",
    icon: BriefcaseBusiness,
  },

  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
  },

  {
    id: "projects",
    label: "Projects",
    icon: FolderKanban,
  },

  {
    id: "skills",
    label: "Skills",
    icon: Wrench,
  },

  {
    id: "languages",
    label: "Languages",
    icon: Languages,
  },

  {
    id: "certifications",
    label: "Certifications",
    icon: Award,
  },

  {
    id: "links",
    label: "Links",
    icon: Link2,
  },
];

function isSectionComplete(
  resume: Resume,
  section: ResumeSectionType,
) {
  switch (section) {
    case "personal":
      return Boolean(
        resume.personal.fullName.trim() &&
          resume.personal.email.trim() &&
          resume.personal.jobTitle.trim(),
      );

    case "summary":
      return Boolean(
        resume.summary.trim(),
      );

    case "experience":
      return (
        resume.experiences.length >
        0
      );

    case "education":
      return (
        resume.educations.length >
        0
      );

    case "projects":
      return (
        resume.projects.length >
        0
      );

    case "skills":
      return (
        resume.skills.length >
        0
      );

    case "languages":
      return (
        resume.languages.length >
        0
      );

    case "certifications":
      return (
        resume.certifications.length >
        0
      );

    case "links":
      return (
        resume.links.length >
        0
      );

    default:
      return false;
  }
}

export function ResumeSectionNav({
  resume,
}: ResumeSectionNavProps) {
  const selectedSection =
    useResumeEditorStore(
      (state) =>
        state.selectedSection,
    );

  const setSelectedSection =
    useResumeEditorStore(
      (state) =>
        state.setSelectedSection,
    );

  return (
    <nav
      className="
        shrink-0
        border-b
        border-[var(--border)]
      "
    >
      <div className="overflow-x-auto p-2">
        <div
          className="
            grid
            min-w-[350px]
            grid-cols-9
            gap-1
          "
        >
          {sections.map(
            (section) => {
              const Icon =
                section.icon;

              const active =
                selectedSection ===
                section.id;

              const completed =
                isSectionComplete(
                  resume,
                  section.id,
                );

              return (
                <button
                  key={
                    section.id
                  }
                  type="button"
                  onClick={() =>
                    setSelectedSection(
                      section.id,
                    )
                  }
                  aria-label={
                    section.label
                  }
                  title={
                    section.label
                  }
                  className={`
                    relative
                    flex
                    h-9
                    min-w-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-all
                    duration-200

                    ${
                      active
                        ? "neo-inset text-[var(--accent)]"
                        : "nav-hover text-[var(--muted)] hover:text-[var(--text)]"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    strokeWidth={
                      active
                        ? 2.2
                        : 1.8
                    }
                  />

                  {completed && (
                    <span
                      className="
                        shadow-button
                        absolute
                        right-3
                        -top-2
                        flex
                        h-3.5
                        w-3.5
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--success-soft)]
                        text-[var(--success)]
                      "
                    >
                      <Check
                        size={8}
                        strokeWidth={3}
                      />
                    </span>
                  )}
                </button>
              );
            },
          )}
        </div>
      </div>
    </nav>
  );
}