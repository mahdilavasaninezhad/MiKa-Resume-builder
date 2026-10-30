import type {
  CreateResumeInput,
  Resume,
  UpdateResumeInput,
} from "../types/resume.types";

export interface ResumeRepository {
  getResume(
    id: string,
  ): Promise<Resume | null>;

  listResumes(
    userId: string,
  ): Promise<Resume[]>;

  createResume(
    data: CreateResumeInput,
  ): Promise<Resume>;

  updateResume(
    id: string,
    data: UpdateResumeInput,
  ): Promise<Resume>;

  deleteResume(
    id: string,
  ): Promise<void>;
}