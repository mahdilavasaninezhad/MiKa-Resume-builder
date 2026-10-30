export const resumeKeys = {
  all: ["resumes"] as const,

  lists: () =>
    [
      ...resumeKeys.all,
      "list",
    ] as const,

  list: (
    userId: string,
  ) =>
    [
      ...resumeKeys.lists(),
      userId,
    ] as const,

  details: () =>
    [
      ...resumeKeys.all,
      "detail",
    ] as const,

  detail: (
    id: string,
  ) =>
    [
      ...resumeKeys.details(),
      id,
    ] as const,
};