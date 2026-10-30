import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { resumeKeys } from "../api/resume.keys";

import { resumeRepository } from "../data";

import type {
  Resume,
  UpdateResumeInput,
} from "../types/resume.types";

import { notify } from "../../../shared/lib/notify";

export type ResumeSaveStatus =
  | "saved"
  | "saving"
  | "error";

function hasChanges(
  data: UpdateResumeInput,
) {
  return (
    Object.keys(data).length > 0
  );
}

function mergeUpdates(
  current: UpdateResumeInput,
  next: UpdateResumeInput,
): UpdateResumeInput {
  const merged: UpdateResumeInput = {
    ...current,
    ...next,
  };

  if (
    current.personal ||
    next.personal
  ) {
    merged.personal = {
      ...current.personal,
      ...next.personal,
    };
  }

  if (
  current.appearance ||
  next.appearance
) {
  merged.appearance = {
    ...current.appearance,
    ...next.appearance,
  };
}

  return merged;
}

function applyUpdate(
  resume: Resume,
  data: UpdateResumeInput,
): Resume {
  return {
    ...resume,
    ...data,

    personal: data.personal
      ? {
          ...resume.personal,
          ...data.personal,
        }
      : resume.personal,

    appearance:
      data.appearance
      ? {
          ...resume.appearance,
          ...data.appearance,
        }
      : resume.appearance,

    updatedAt:
      new Date().toISOString(),
  };
}

export function useResumeAutosave(
  resumeId: string | null,
  delay = 700,
) {
  const queryClient =
    useQueryClient();

  const [
    saveStatus,
    setSaveStatus,
  ] =
    useState<ResumeSaveStatus>(
      "saved",
    );

  const timeoutRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const pendingRef =
    useRef<UpdateResumeInput>({});

  const savingRef =
    useRef(false);

  const persistRef =
    useRef<
      () => Promise<void>
    >(async () => {});

  const mutation =
    useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: UpdateResumeInput;
      }) =>
        resumeRepository.updateResume(
          id,
          data,
        ),
    });

  const mutateAsyncRef =
    useRef(
      mutation.mutateAsync,
    );

  useEffect(() => {
    mutateAsyncRef.current =
      mutation.mutateAsync;
  }, [mutation.mutateAsync]);

  useEffect(() => {
    persistRef.current =
      async () => {
        if (
          !resumeId ||
          savingRef.current ||
          !hasChanges(
            pendingRef.current,
          )
        ) {
          return;
        }

        const payload =
          pendingRef.current;

        pendingRef.current = {};

        savingRef.current = true;

        setSaveStatus("saving");

        let failed = false;

        try {
          const savedResume =
            await mutateAsyncRef.current(
              {
                id: resumeId,
                data: payload,
              },
            );

          if (
            !hasChanges(
              pendingRef.current,
            )
          ) {
            queryClient.setQueryData(
              resumeKeys.detail(
                resumeId,
              ),
              savedResume,
            );

            setSaveStatus(
              "saved",
            );
          }
        } catch (error) {
          failed = true;

          pendingRef.current =
            mergeUpdates(
              payload,
              pendingRef.current,
            );

          setSaveStatus(
            "error",
          );

          notify.error(
            error instanceof Error
              ? error.message
              : "Could not save resume.",
          );
        } finally {
          savingRef.current = false;

          if (
            !failed &&
            hasChanges(
              pendingRef.current,
            )
          ) {
            timeoutRef.current =
              setTimeout(() => {
                void persistRef.current();
              }, delay);
          }
        }
      };
  }, [
    resumeId,
    delay,
    queryClient,
  ]);

  const updateResume =
    useCallback(
      (
        data: UpdateResumeInput,
      ) => {
        if (!resumeId) {
          return;
        }

        pendingRef.current =
          mergeUpdates(
            pendingRef.current,
            data,
          );

        queryClient.setQueryData<
          Resume | null
        >(
          resumeKeys.detail(
            resumeId,
          ),
          (current) => {
            if (!current) {
              return current;
            }

            return applyUpdate(
              current,
              data,
            );
          },
        );

        setSaveStatus(
          "saving",
        );

        if (
          timeoutRef.current
        ) {
          clearTimeout(
            timeoutRef.current,
          );
        }

        timeoutRef.current =
          setTimeout(() => {
            void persistRef.current();
          }, delay);
      },
      [
        resumeId,
        delay,
        queryClient,
      ],
    );

  useEffect(() => {
    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current,
        );
      }

      if (
        resumeId &&
        hasChanges(
          pendingRef.current,
        )
      ) {
        void resumeRepository
          .updateResume(
            resumeId,
            pendingRef.current,
          );
      }
    };
  }, [resumeId]);

  return {
    updateResume,
    saveStatus,
  };
}