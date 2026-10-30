import {
  ExternalLink,
} from "lucide-react";

import type {
  ReactNode,
} from "react";

import type {
  Resume,
} from "../../types/resume.types";

export function TemplateSection({
  title,
  accentColor,
  children,
}: {
  title: string;
  accentColor: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2
        className="mb-3 border-b pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em]"
        style={{
          borderColor:
            `${accentColor}40`,

          color:
            accentColor,
        }}
      >
        {title}
      </h2>

      {children}
    </section>
  );
}

export function SummaryContent({
  resume,
}: {
  resume: Resume;
}) {
  if (!resume.summary) {
    return null;
  }

  return (
    <p className="text-[10.5px] leading-[1.7] text-slate-700">
      {resume.summary}
    </p>
  );
}

export function ExperienceContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-4">
      {[...resume.experiences]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map(
          (experience) => (
            <article
              key={
                experience.id
              }
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <div className="text-[11px] font-bold">
                    {
                      experience.position
                    }
                  </div>

                  <div className="mt-0.5 text-[10px] text-slate-600">
                    {
                      experience.company
                    }

                    {experience.location &&
                      ` • ${experience.location}`}
                  </div>
                </div>

                <div className="shrink-0 text-right text-[9px] text-slate-500">
                  {
                    experience.startDate
                  }

                  {" — "}

                  {experience.current
                    ? "Present"
                    : experience.endDate}
                </div>
              </div>

              {experience.description && (
                <p className="mt-2 whitespace-pre-line text-[9.5px] leading-[1.6] text-slate-600">
                  {
                    experience.description
                  }
                </p>
              )}
            </article>
          ),
        )}
    </div>
  );
}

export function EducationContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-3">
      {[...resume.educations]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map(
          (education) => (
            <article
              key={
                education.id
              }
            >
              <div className="text-[10.5px] font-bold">
                {education.degree}
              </div>

              {education.field && (
                <div className="text-[9.5px] text-slate-600">
                  {education.field}
                </div>
              )}

              <div className="mt-0.5 text-[9px] text-slate-500">
                {
                  education.institution
                }

                {education.location &&
                  ` • ${education.location}`}
              </div>

              <div className="mt-0.5 text-[9px] text-slate-500">
                {
                  education.startDate
                }

                {" — "}

                {education.endDate}
              </div>
            </article>
          ),
        )}
    </div>
  );
}

export function ProjectsContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-4">
      {[...resume.projects]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map(
          (project) => (
            <article
              key={project.id}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-bold">
                  {project.name}
                </div>

                <div className="flex gap-2">
                  {project.githubUrl && (
                    <ExternalLink
                      size={9}
                    />
                  )}

                  {project.liveUrl && (
                    <ExternalLink
                      size={9}
                    />
                  )}
                </div>
              </div>

              {project.description && (
                <p className="mt-1.5 text-[9.5px] leading-[1.6] text-slate-600">
                  {
                    project.description
                  }
                </p>
              )}

              {project.technologies
                .length > 0 && (
                <div className="mt-2 text-[8.5px] font-medium text-slate-500">
                  {project.technologies.join(
                    " • ",
                  )}
                </div>
              )}
            </article>
          ),
        )}
    </div>
  );
}

export function SkillsContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {[...resume.skills]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map((skill) => (
          <span
            key={skill.id}
            className="rounded-md bg-slate-100 px-2 py-1 text-[8.5px] font-medium"
          >
            {skill.name}
          </span>
        ))}
    </div>
  );
}

export function LanguagesContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-2">
      {[...resume.languages]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map(
          (language) => (
            <div
              key={
                language.id
              }
              className="flex items-center justify-between gap-3 text-[9px]"
            >
              <span className="font-semibold">
                {language.name}
              </span>

              <span className="capitalize text-slate-500">
                {language.level}
              </span>
            </div>
          ),
        )}
    </div>
  );
}

export function CertificationsContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-2">
      {[...resume.certifications]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map(
          (certification) => (
            <div
              key={
                certification.id
              }
            >
              <div className="text-[9.5px] font-semibold">
                {
                  certification.name
                }
              </div>

              <div className="text-[8.5px] text-slate-500">
                {
                  certification.issuer
                }

                {certification.issueDate &&
                  ` • ${certification.issueDate}`}
              </div>
            </div>
          ),
        )}
    </div>
  );
}

export function LinksContent({
  resume,
}: {
  resume: Resume;
}) {
  return (
    <div className="space-y-1.5">
      {[...resume.links]
        .sort(
          (a, b) =>
            a.order - b.order,
        )
        .map((link) => (
          <div
            key={link.id}
            className="truncate text-[8.5px]"
          >
            <span className="font-semibold">
              {link.label}:
            </span>{" "}

            <span className="text-slate-500">
              {link.url}
            </span>
          </div>
        ))}
    </div>
  );
}