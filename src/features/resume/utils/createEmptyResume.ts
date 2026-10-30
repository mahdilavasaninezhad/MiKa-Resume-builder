import type {
  CreateResumeInput,
  ResumePersonalInfo,
} from "../types/resume.types";

import {
  defaultResumeAppearance,
} from "./resumeAppearance";

export function createEmptyResume(
  userId: string,
  personal?: Partial<ResumePersonalInfo>,
): CreateResumeInput {
  return {
    userId,

    title: "Untitled Resume",

    targetJobTitle: "",

    summary: "",

    personal: {
      fullName:
        personal?.fullName ?? "",

      email:
        personal?.email ?? "",

      phoneNumber:
        personal?.phoneNumber ?? "",

      city:
        personal?.city ?? "",

      country:
        personal?.country ?? "",

      jobTitle:
        personal?.jobTitle ?? "",

      avatarUrl:
        personal?.avatarUrl ?? null,
    },

    experiences: [],
    educations: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
    links: [],

    template: "modern",

    appearance: {
    ...defaultResumeAppearance,
    },
  };
}