import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { resumeRepository } from "../data";

import type {
  CreateResumeInput,
  UpdateResumeInput,
} from "../types/resume.types";

import { resumeKeys } from "./resume.keys";

export function useResume(
  id: string | null,
) {
  return useQuery({
    queryKey:
      resumeKeys.detail(
        id ?? "",
      ),

    queryFn: () =>
      resumeRepository.getResume(
        id!,
      ),

    enabled: Boolean(id),
  });
}

export function useResumes(
  userId: string | null,
) {
  return useQuery({
    queryKey:
      resumeKeys.list(
        userId ?? "",
      ),

    queryFn: () =>
      resumeRepository.listResumes(
        userId!,
      ),

    enabled: Boolean(userId),
  });
}

export function useCreateResume() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateResumeInput,
    ) =>
      resumeRepository.createResume(
        data,
      ),

    onSuccess: (
      resume,
    ) => {
      queryClient.invalidateQueries({
        queryKey:
          resumeKeys.list(
            resume.userId,
          ),
      });

      queryClient.setQueryData(
        resumeKeys.detail(
          resume.id,
        ),
        resume,
      );
    },
  });
}

export function useUpdateResume() {
  const queryClient =
    useQueryClient();

  return useMutation({
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

    onSuccess: (
      resume,
    ) => {
      queryClient.setQueryData(
        resumeKeys.detail(
          resume.id,
        ),
        resume,
      );

      queryClient.invalidateQueries({
        queryKey:
          resumeKeys.list(
            resume.userId,
          ),
      });
    },
  });
}

export function useDeleteResume() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userId,
    }: {
      id: string;
      userId: string;
    }) =>
      resumeRepository.deleteResume(
        id,
      ),

    onSuccess: (
      _,
      variables,
    ) => {
      queryClient.removeQueries({
        queryKey:
          resumeKeys.detail(
            variables.id,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          resumeKeys.list(
            variables.userId,
          ),
      });
    },
  });
}