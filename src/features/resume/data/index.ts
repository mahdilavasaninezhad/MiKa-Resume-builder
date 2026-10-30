import { LocalResumeRepository } from "./resume.local";

import type {
  ResumeRepository,
} from "./resume.repository";

export const resumeRepository:
  ResumeRepository =
    new LocalResumeRepository();