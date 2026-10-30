import {
  create,
} from "zustand";

import type {
  ResumeSectionType,
} from "../types/resume.types";

interface ResumeEditorState {
  activeResumeId:
    string | null;

  selectedSection:
    ResumeSectionType;

  previewMode: boolean;

  fullscreenPreview:
    boolean;

  zoom: number;

  setActiveResumeId: (
    id: string | null,
  ) => void;

  setSelectedSection: (
    section:
      ResumeSectionType,
  ) => void;

  setPreviewMode: (
    value: boolean,
  ) => void;

  setFullscreenPreview: (
    value: boolean,
  ) => void;

  setZoom: (
    value: number,
  ) => void;

  reset: () => void;
}

export const useResumeEditorStore =
  create<ResumeEditorState>(
    (set) => ({
      activeResumeId: null,

      selectedSection:
        "personal",

      previewMode: false,

      fullscreenPreview:
        false,

      zoom: 1,

      setActiveResumeId: (
        id,
      ) =>
        set({
          activeResumeId: id,
        }),

      setSelectedSection: (
        section,
      ) =>
        set({
          selectedSection:
            section,
        }),

      setPreviewMode: (
        value,
      ) =>
        set({
          previewMode: value,
        }),

      setFullscreenPreview: (
        value,
      ) =>
        set({
          fullscreenPreview:
            value,
        }),

      setZoom: (
        value,
      ) =>
        set({
          zoom: Math.min(
            1.5,
            Math.max(
              0.5,
              value,
            ),
          ),
        }),

      reset: () =>
        set({
          activeResumeId: null,

          selectedSection:
            "personal",

          previewMode: false,

          fullscreenPreview:
            false,

          zoom: 1,
        }),
    }),
  );