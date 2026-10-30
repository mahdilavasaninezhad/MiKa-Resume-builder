import type {
  CreateResumeInput,
  Resume,
} from "../types/resume.types";

export function createDuplicateResume(
  resume: Resume,
): CreateResumeInput {
  return {
    userId: resume.userId,

    title:
      `${resume.title} Copy`,

    targetJobTitle:
      resume.targetJobTitle,

    summary:
      resume.summary,

    personal: {
      ...resume.personal,
    },

    experiences:
      resume.experiences.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    educations:
      resume.educations.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    projects:
      resume.projects.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),

          technologies: [
            ...item.technologies,
          ],
        }),
      ),

    skills:
      resume.skills.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    languages:
      resume.languages.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    certifications:
      resume.certifications.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    links:
      resume.links.map(
        (item) => ({
          ...item,
          id:
            crypto.randomUUID(),
        }),
      ),

    template:
      resume.template,

    appearance: {
        ...resume.appearance,
    },
  };
}