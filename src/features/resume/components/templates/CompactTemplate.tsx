import type {
  Resume,
} from "../../types/resume.types";

import {
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

export function CompactTemplate({
  resume,
}: {
  resume: Resume;
}) {
  const {
    accentColor,
    fontFamily,
  } =
    resume.appearance;

  return (
    <div
      className="
        min-h-full
        bg-white
        p-[5%]
        text-slate-900
      "
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
        <header
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {resume.personal
                .fullName ||
                "Your Name"}
            </h1>

            <p
              className="
                mt-1
                text-[10px]
                font-semibold
              "
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

          <div
            className="
              max-w-[50%]
              text-right
              text-[8px]
              leading-4
              text-slate-500
            "
          >
            {[
              resume.personal.email,

              resume.personal
                .phoneNumber,

              resume.personal.city,

              resume.personal
                .country,
            ]
              .filter(Boolean)
              .join(" • ")}
          </div>
        </header>
      </ResumeSectionFrame>

      <div
        className="
          my-3
          h-px
          w-full
        "
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
            title="Summary"
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

      <div
        className="
          mt-3
          grid
          grid-cols-[1.6fr_0.8fr]
          gap-5

          [&_p]:!text-[9px]
          [&_li]:!text-[9px]
        "
      >
        <main className="space-y-3">
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
        </main>

        <aside className="space-y-3">
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

          {resume.certifications
            .length > 0 && (
            <ResumeSectionFrame
              resume={resume}
              section="certifications"
            >
              <TemplateSection
                title="Certificates"
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