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

export function CreativeTemplate({
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
      className="
        min-h-full
        bg-white
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
            relative
            overflow-hidden
            p-[6%]
          "
          style={{
            background:
              `${accentColor}12`,
          }}
        >
          <div
            className="
              absolute
              left-0
              top-0
              h-full
              w-2
            "
            style={{
              background:
                accentColor,
            }}
          />

          <div className="flex items-center justify-between gap-5">
            <div>
              <h1 className="text-[34px] font-black tracking-tight">
                {resume.personal
                  .fullName ||
                  "Your Name"}
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  font-bold
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

              <div className="mt-4 flex flex-wrap gap-3 text-[9px] text-slate-500">
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

                {resume.personal
                  .city && (
                  <span className="flex items-center gap-1">
                    <MapPin
                      size={10}
                    />

                    {
                      resume.personal
                        .city
                    }
                  </span>
                )}
              </div>
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
                  className="
                    h-24
                    w-24
                    rounded-full
                    object-cover
                  "
                  style={{
                    border: `4px solid ${accentColor}`,
                  }}
                />
              )}
          </div>
        </header>
      </ResumeSectionFrame>

      <div
        className="
          grid
          grid-cols-[1.55fr_0.8fr]
          gap-5
          p-[5%]
        "
      >
        <main
          className={spacing}
        >
          {resume.summary && (
            <ResumeSectionFrame
              resume={resume}
              section="summary"
            >
              <TemplateSection
                title="About Me"
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
          className={`
            rounded-2xl
            p-4
            ${spacing}
          `}
          style={{
            background:
              `${accentColor}08`,
          }}
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