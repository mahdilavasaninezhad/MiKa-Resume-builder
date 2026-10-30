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

export function MinimalTemplate({
  resume,
}: {
  resume: Resume;
}) {
  const {
    accentColor,
    fontFamily,
    density,
  } =
    resume.appearance;

  const spacing =
    getResumeDensitySpacing(
      density,
    );

  return (
    <div
      className={`min-h-full bg-white p-[7%] text-slate-900 ${spacing}`}
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
        <header>
          <h1 className="text-4xl font-light tracking-tight">
            {resume.personal
              .fullName ||
              "Your Name"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {resume.personal
              .jobTitle ||
              resume.targetJobTitle ||
              "Professional Title"}
          </p>

          <div className="mt-3 text-[9px] text-slate-500">
            {[
              resume.personal.email,

              resume.personal
                .phoneNumber,

              [
                resume.personal.city,

                resume.personal
                  .country,
              ]
                .filter(Boolean)
                .join(", "),
            ]
              .filter(Boolean)
              .join("   •   ")}
          </div>
        </header>
      </ResumeSectionFrame>

      <div
        className="h-px w-full"
        style={{
          background:
            accentColor,
        }}
      />

      {resume.summary && (
        <ResumeSectionFrame
          resume={resume}
          section="summary"
        >
          <TemplateSection
            title="About"
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

      {resume.experiences.length >
        0 && (
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
            title="Selected Projects"
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

      <div className="grid grid-cols-2 gap-8">
        <div
          className={spacing}
        >
          {resume.educations
            .length > 0 && (
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
        </div>

        <div
          className={spacing}
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
        </div>
      </div>
    </div>
  );
}