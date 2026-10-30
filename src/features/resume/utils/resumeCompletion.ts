import type {
  Resume,
} from "../types/resume.types";

export function calculateResumeCompletion(
  resume: Resume,
) {
  const checks = [
    Boolean(
      resume.personal.fullName.trim(),
    ),

    Boolean(
      resume.personal.email.trim(),
    ),

    Boolean(
      resume.personal.jobTitle.trim(),
    ),

    Boolean(
      resume.summary.trim(),
    ),

    resume.experiences.length > 0,

    resume.educations.length > 0,

    resume.projects.length > 0,

    resume.skills.length > 0,

    resume.languages.length > 0,

    resume.links.length > 0,
  ];

  const completed =
    checks.filter(Boolean).length;

  return Math.round(
    (completed /
      checks.length) *
      100,
  );
}