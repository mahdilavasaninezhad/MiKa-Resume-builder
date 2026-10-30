import { create } from "zustand";

import {
  changeLocalPassword,
  getSession,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
  updateLocalProfile,
} from "../services/auth.service";

import type {
  AuthUser,
  UpdateProfileData,
} from "../types/auth.types";

interface AuthState {
  user: AuthUser | null;

  login: (
    username: string,
    password: string,
  ) => Promise<void>;

  register: (
    username: string,
    password: string,
  ) => Promise<void>;

  updateProfile: (
    data: UpdateProfileData,
  ) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>(
    (set, get) => ({
      user: getSession(),

      login: async (
        username,
        password,
      ) => {
        const user =
          await loginLocalUser(
            username,
            password,
          );

        set({ user });
      },

      register: async (
        username,
        password,
      ) => {
        const user =
          await registerLocalUser(
            username,
            password,
          );

        set({ user });
      },

      updateProfile: async (
        data,
      ) => {
        const user =
          get().user;

        if (!user) {
          throw new Error(
            "You are not logged in.",
          );
        }

        const updatedUser =
          await updateLocalProfile(
            user.id,
            data,
          );

        set({
          user: updatedUser,
        });
      },

      changePassword: async (
        currentPassword,
        newPassword,
      ) => {
        const user =
          get().user;

        if (!user) {
          throw new Error(
            "You are not logged in.",
          );
        }

        await changeLocalPassword(
          user.id,
          currentPassword,
          newPassword,
        );
      },

      logout: () => {
        logoutLocalUser();

        set({
          user: null,
        });
      },
    }),
  );