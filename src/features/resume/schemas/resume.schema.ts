import { z } from "zod";

export const resumePersonalSchema =
  z.object({
    fullName: z.string().trim(),
    email: z
      .string()
      .trim()
      .email()
      .or(z.literal("")),
    phoneNumber: z.string().trim(),
    city: z.string().trim(),
    country: z.string().trim(),
    jobTitle: z.string().trim(),
    avatarUrl:
      z.string().nullable(),
  });

export const resumeExperienceSchema =
  z.object({
    id: z.string(),
    company: z.string().trim(),
    position: z.string().trim(),
    location: z.string().trim(),
    startDate: z.string(),
    endDate: z.string(),
    current: z.boolean(),
    description: z.string(),
    order: z.number(),
  });

export const resumeEducationSchema =
  z.object({
    id: z.string(),
    institution: z.string().trim(),
    degree: z.string().trim(),
    field: z.string().trim(),
    location: z.string().trim(),
    startDate: z.string(),
    endDate: z.string(),
    description: z.string(),
    order: z.number(),
  });

export const resumeProjectSchema =
  z.object({
    id: z.string(),
    name: z.string().trim(),
    description: z.string(),
    technologies:
      z.array(z.string()),
    githubUrl: z.string(),
    liveUrl: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    order: z.number(),
  });

export const resumeSchema =
  z.object({
    id: z.string(),
    userId: z.string(),

    title: z.string(),
    targetJobTitle: z.string(),
    summary: z.string(),

    personal:
      resumePersonalSchema,

    experiences:
      z.array(
        resumeExperienceSchema,
      ),

    educations:
      z.array(
        resumeEducationSchema,
      ),

    projects:
      z.array(
        resumeProjectSchema,
      ),

    skills: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        level: z.enum([
          "beginner",
          "intermediate",
          "advanced",
          "expert",
        ]),
        order: z.number(),
      }),
    ),

    languages: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        level: z.enum([
          "basic",
          "conversational",
          "professional",
          "native",
        ]),
        order: z.number(),
      }),
    ),

    certifications: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        issuer: z.string(),
        issueDate: z.string(),
        credentialUrl:
          z.string(),
        order: z.number(),
      }),
    ),

    links: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        url: z.string(),
        order: z.number(),
      }),
    ),

    template: z.enum([
      "modern",
      "minimal",
      "professional",
    ]),

    appearance: z.object({
  accentColor: z.string(),

  fontFamily: z.enum([
    "sans",
    "serif",
    "mono",
  ]),

  density: z.enum([
    "compact",
    "comfortable",
    "spacious",
  ]),

  showAvatar: z.boolean(),
}),

    createdAt: z.string(),
    updatedAt: z.string(),
  });

  export const resumePersonalFormSchema =
  z.object({
    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Full name must contain at least 2 characters.",
      ),

    email: z
      .string()
      .trim()
      .email(
        "Enter a valid email address.",
      ),

    phoneNumber: z
      .string()
      .trim()
      .min(
        5,
        "Enter a valid phone number.",
      ),

    city: z
      .string()
      .trim()
      .min(
        2,
        "Enter your city.",
      ),

    country: z
      .string()
      .trim()
      .min(
        2,
        "Enter your country.",
      ),

    jobTitle: z
      .string()
      .trim()
      .min(
        2,
        "Enter your professional title.",
      ),
  });

export const resumeSummaryFormSchema =
  z.object({
    targetJobTitle: z
      .string()
      .trim()
      .min(
        2,
        "Enter your target job title.",
      ),

    summary: z
      .string()
      .trim()
      .min(
        40,
        "Your summary should contain at least 40 characters.",
      )
      .max(
        1200,
        "Your summary cannot exceed 1200 characters.",
      ),
  });

  export const resumeExperienceFormSchema =
  z
    .object({
      company: z
        .string()
        .trim()
        .min(
          2,
          "Company name is required.",
        ),

      position: z
        .string()
        .trim()
        .min(
          2,
          "Position is required.",
        ),

      location: z
        .string()
        .trim(),

      startDate: z
        .string()
        .min(
          1,
          "Start date is required.",
        ),

      endDate: z.string(),

      current: z.boolean(),

      description: z
        .string()
        .max(
          2000,
          "Description cannot exceed 2000 characters.",
        ),
    })
    .superRefine(
      (value, context) => {
        if (
          !value.current &&
          !value.endDate
        ) {
          context.addIssue({
            code: "custom",
            path: ["endDate"],
            message:
              "End date is required.",
          });
        }
      },
    );

export const resumeEducationFormSchema =
  z.object({
    institution: z
      .string()
      .trim()
      .min(
        2,
        "Institution is required.",
      ),

    degree: z
      .string()
      .trim()
      .min(
        2,
        "Degree is required.",
      ),

    field: z
      .string()
      .trim(),

    location: z
      .string()
      .trim(),

    startDate: z
      .string()
      .min(
        1,
        "Start date is required.",
      ),

    endDate: z
      .string()
      .min(
        1,
        "End date is required.",
      ),

    description: z
      .string()
      .max(
        1500,
        "Description cannot exceed 1500 characters.",
      ),
  });

export const resumeProjectFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Project name is required.",
      ),

    description: z
      .string()
      .trim()
      .min(
        20,
        "Describe your project in at least 20 characters.",
      )
      .max(
        2000,
        "Description cannot exceed 2000 characters.",
      ),

    technologies: z
      .string()
      .trim(),

    githubUrl: z
      .union([
        z.literal(""),
        z
          .string()
          .url(
            "Enter a valid GitHub URL.",
          ),
      ]),

    liveUrl: z
      .union([
        z.literal(""),
        z
          .string()
          .url(
            "Enter a valid live URL.",
          ),
      ]),

    startDate: z.string(),

    endDate: z.string(),
  });

export const resumeSkillFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Skill name is required.",
      ),

    level: z.enum([
      "beginner",
      "intermediate",
      "advanced",
      "expert",
    ]),
  });

export const resumeLanguageFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Language is required.",
      ),

    level: z.enum([
      "basic",
      "conversational",
      "professional",
      "native",
    ]),
  });

export const resumeCertificationFormSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Certification name is required.",
      ),

    issuer: z
      .string()
      .trim()
      .min(
        2,
        "Issuer is required.",
      ),

    issueDate: z.string(),

    credentialUrl: z
      .union([
        z.literal(""),
        z
          .string()
          .url(
            "Enter a valid credential URL.",
          ),
      ]),
  });

export const resumeLinkFormSchema =
  z.object({
    label: z
      .string()
      .trim()
      .min(
        1,
        "Link label is required.",
      ),

    url: z
      .string()
      .url(
        "Enter a valid URL.",
      ),
  });