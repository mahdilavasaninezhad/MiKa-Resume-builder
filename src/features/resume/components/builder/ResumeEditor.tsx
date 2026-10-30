import {
  AlignLeft,
  Award,
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  Languages,
  Link2,
  Plus,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import { useResumeEditorStore } from "../../store/resume-editor.store";

import type {
  Resume,
  ResumeSectionType,
  UpdateResumeInput,
} from "../../types/resume.types";

import { PersonalSection } from "../sections/PersonalSection";
import { SummarySection } from "../sections/SummarySection";
import { ExperienceSection } from "../sections/ExperienceSection";
import { EducationSection } from "../sections/EducationSection";
import { ProjectsSection } from "../sections/ProjectsSection";
import { SkillsSection } from "../sections/SkillsSection";
import { LanguagesSection } from "../sections/LanguagesSection";
import { CertificationsSection } from "../sections/CertificationsSection";
import { LinksSection } from "../sections/LinksSection";

interface ResumeEditorProps {
  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}

interface SectionMeta {
  title: string;
  description: string;
  icon: LucideIcon;
}

const sectionMeta: Record<
  ResumeSectionType,
  SectionMeta
> = {
  personal: {
    title:
      "Personal information",

    description:
      "Add your contact information and professional headline so employers can quickly understand who you are and how to reach you.",

    icon: UserRound,
  },

  summary: {
    title:
      "Professional summary",

    description:
      "Give recruiters a quick overview of your experience, strongest skills and the direction you want to take your career.",

    icon: AlignLeft,
  },

  experience: {
    title:
      "Work experience",

    description:
      "Show where you have worked, what responsibilities you had and what impact or achievements you created.",

    icon: BriefcaseBusiness,
  },

  education: {
    title:
      "Education",

    description:
      "Add your academic background, degrees and qualifications that support your professional profile.",

    icon: GraduationCap,
  },

  projects: {
    title:
      "Projects",

    description:
      "Show real work that demonstrates what you can build, the problems you can solve and the technologies you know.",

    icon: FolderKanban,
  },

  skills: {
    title:
      "Skills",

    description:
      "Highlight technologies, tools and professional abilities that are relevant to the roles you want.",

    icon: Wrench,
  },

  languages: {
    title:
      "Languages",

    description:
      "Show the languages you can communicate in and your level of proficiency in each one.",

    icon: Languages,
  },

  certifications: {
    title:
      "Certifications",

    description:
      "Add professional certificates and credentials that strengthen your expertise and credibility.",

    icon: Award,
  },

  links: {
    title:
      "Professional links",

    description:
      "Connect your GitHub, LinkedIn, portfolio or other professional profiles so recruiters can learn more about your work.",

    icon: Link2,
  },
};

function hasSectionContent(
  resume: Resume,
  section:
    ResumeSectionType,
) {
  switch (section) {
    case "personal":
      return Boolean(
        resume.personal.fullName.trim() ||
          resume.personal.email.trim() ||
          resume.personal.phoneNumber.trim() ||
          resume.personal.city.trim() ||
          resume.personal.country.trim() ||
          resume.personal.jobTitle.trim(),
      );

    case "summary":
      return Boolean(
        resume.targetJobTitle.trim() ||
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

export function ResumeEditor({
  resume,
  onUpdate,
}: ResumeEditorProps) {
  const selectedSection =
    useResumeEditorStore(
      (state) =>
        state.selectedSection,
    );

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(() =>
    hasSectionContent(
      resume,
      selectedSection,
    ),
  );

  useEffect(() => {
    setEditorOpen(
      hasSectionContent(
        resume,
        selectedSection,
      ),
    );
  }, [
    selectedSection,
    resume.id,
  ]);

  return (
    <section
      className="
        h-full
        min-h-0
        overflow-hidden
      "
    >
      
        <div
          className="
            h-full
            min-h-0
            overflow-y-auto
            overscroll-contain
            py-3.5
            px-3
          "
        >
          <SectionRenderer
            section={
              selectedSection
            }
            resume={resume}
            onUpdate={onUpdate}
          />
        </div>
     
    </section>
  );
}

export function ResumeSectionInfo() {
  const selectedSection =
    useResumeEditorStore(
      (state) =>
        state.selectedSection,
    );

  const meta =
    sectionMeta[selectedSection];

  const Icon =
    meta.icon;

  return (
    <section
      className="
        glass-panel-header
        shrink-0
        rounded-2xl
        p-3
        flex
        flex-col
        gap-2
        justify-center
        align-center
        items-center
      "
    >
      <div
          className="
            sidebar-icon
            h-7
            w-7
            flex
            items-center
            justify-center
            shrink-0
            rounded-lg
            text-[var(--accent)]
          "
        >
          <Icon size={18} />
        </div>
        <h3 className="text-xs font-semibold ">
            {meta.title}
          </h3>
        <div className="min-w-0">
          <p
            className="
              mt-0.5
              text-[10px]
              text-center
              leading-4
              text-[var(--muted)]
            "
          >
            {meta.description}
          </p>
        </div>
    </section>
  );
}

function SectionRenderer({
  section,
  resume,
  onUpdate,
}: {
  section:
    ResumeSectionType;

  resume: Resume;

  onUpdate: (
    data: UpdateResumeInput,
  ) => void;
}) {
  switch (section) {
    case "personal":
      return (
        <PersonalSection
          key={resume.id}
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "summary":
      return (
        <SummarySection
          key={resume.id}
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "experience":
      return (
        <ExperienceSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "education":
      return (
        <EducationSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "projects":
      return (
        <ProjectsSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "skills":
      return (
        <SkillsSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "languages":
      return (
        <LanguagesSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "certifications":
      return (
        <CertificationsSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    case "links":
      return (
        <LinksSection
          resume={resume}
          onUpdate={onUpdate}
        />
      );

    default:
      return null;
  }
}