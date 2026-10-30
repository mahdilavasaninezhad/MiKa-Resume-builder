import {
  useMemo,
} from "react";

import type {
  Resume,
} from "../types/resume.types";

import {
  calculateResumeCompletion,
} from "../utils/resumeCompletion";

export function useResumeCompletion(
  resume:
    | Resume
    | null
    | undefined,
) {
  return useMemo(() => {
    if (!resume) {
      return 0;
    }

    return calculateResumeCompletion(
      resume,
    );
  }, [resume]);
}