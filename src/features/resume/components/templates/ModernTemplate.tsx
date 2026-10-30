import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type {
  Resume,
} from "../../types/resume.types";

import {
  getResumeDensitySpacing,
  getResumeFontFamily,
} from "../../utils/resumeAppearance";

import {
  CertificationsContent,
  EducationContent,
  ExperienceContent,
  LanguagesContent,
  LinksContent,
  ProjectsContent,
  SkillsContent,
  SummaryContent,
  TemplateSection,
} from "./ResumeTemplateSections";

import {
  ResumeSectionFrame,
} from "./ResumeSectionFrame";

export function ModernTemplate({
  resume,
}: {
  resume: Resume;
}) {
  const {
    accentColor,
    fontFamily,
    density,
    showAvatar,
  } =
    resume.appearance;

  const spacing =
    getResumeDensitySpacing(
      density,
    );

  return (
    <div
      className="min-h-full bg-white text-slate-900"
      style={{
        fontFamily:
          getResumeFontFamily(
            fontFamily,
          ),
      }}
    >
      <ResumeSectionFrame
        resume={resume}
        section="personal"
      >
        <header className="p-[6%] pb-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div
                className="mb-3 h-1 w-14 rounded-full"
                style={{
                  background:
                    accentColor,
                }}
              />

              <h1 className="text-3xl font-bold tracking-tight">
                {resume.personal
                  .fullName ||
                  "Your Name"}
              </h1>

              <p
                className="mt-2 text-sm font-semibold"
                style={{
                  color:
                    accentColor,
                }}
              >
                {resume.personal
                  .jobTitle ||
                  resume.targetJobTitle ||
                  "Professional Title"}
              </p>
            </div>

            {showAvatar &&
              resume.personal
                .avatarUrl && (
                <img
                  src={
                    resume.personal
                      .avatarUrl
                  }
                  alt=""
                  className="h-20 w-20 rounded-[22px] object-cover"
                />
              )}
          </div>

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[9px] text-slate-500">
            {resume.personal
              .email && (
              <span className="flex items-center gap-1">
                <Mail
                  size={10}
                />

                {
                  resume.personal
                    .email
                }
              </span>
            )}

            {resume.personal
              .phoneNumber && (
              <span className="flex items-center gap-1">
                <Phone
                  size={10}
                />

                {
                  resume.personal
                    .phoneNumber
                }
              </span>
            )}

            {resume.personal.city && (
              <span className="flex items-center gap-1">
                <MapPin
                  size={10}
                />

                {
                  resume.personal.city
                }

                {resume.personal
                  .country &&
                  `, ${resume.personal.country}`}
              </span>
            )}
          </div>
        </header>
      </ResumeSectionFrame>

      <div className="grid grid-cols-[1.65fr_0.85fr] border-t border-slate-100">
        <main
          className={`p-[6%] pr-5 ${spacing}`}
        >
          {resume.summary && (
            <ResumeSectionFrame
              resume={resume}
              section="summary"
            >
              <TemplateSection
                title="Profile"
                accentColor={
                  accentColor
                }
              >
                <SummaryContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.experiences
            .length > 0 && (
            <ResumeSectionFrame
              resume={resume}
              section="experience"
            >
              <TemplateSection
                title="Experience"
                accentColor={
                  accentColor
                }
              >
                <ExperienceContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.projects.length >
            0 && (
            <ResumeSectionFrame
              resume={resume}
              section="projects"
            >
              <TemplateSection
                title="Projects"
                accentColor={
                  accentColor
                }
              >
                <ProjectsContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}
        </main>

        <aside
          className={`border-l border-slate-100 bg-slate-50/70 p-5 ${spacing}`}
        >
          {resume.skills.length >
            0 && (
            <ResumeSectionFrame
              resume={resume}
              section="skills"
            >
              <TemplateSection
                title="Skills"
                accentColor={
                  accentColor
                }
              >
                <SkillsContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.educations.length >
            0 && (
            <ResumeSectionFrame
              resume={resume}
              section="education"
            >
              <TemplateSection
                title="Education"
                accentColor={
                  accentColor
                }
              >
                <EducationContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.languages.length >
            0 && (
            <ResumeSectionFrame
              resume={resume}
              section="languages"
            >
              <TemplateSection
                title="Languages"
                accentColor={
                  accentColor
                }
              >
                <LanguagesContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.certifications
            .length > 0 && (
            <ResumeSectionFrame
              resume={resume}
              section="certifications"
            >
              <TemplateSection
                title="Certifications"
                accentColor={
                  accentColor
                }
              >
                <CertificationsContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}

          {resume.links.length >
            0 && (
            <ResumeSectionFrame
              resume={resume}
              section="links"
            >
              <TemplateSection
                title="Links"
                accentColor={
                  accentColor
                }
              >
                <LinksContent
                  resume={resume}
                />
              </TemplateSection>
            </ResumeSectionFrame>
          )}
        </aside>
      </div>
    </div>
  );
}