import {
  useEffect,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/auth.store";

import { isProfileComplete } from "../../features/profile/utils/isProfileComplete";

import { notify } from "../../shared/lib/notify";

export function CompleteProfileRoute() {
  const user = useAuthStore(
    (state) => state.user,
  );

  const profileComplete =
    isProfileComplete(user);

  useEffect(() => {
    if (!profileComplete) {
      notify.warning(
        "Complete your profile first.",
        "Fill in all required profile fields before creating a resume.",
      );
    }
  }, [profileComplete]);

  if (!profileComplete) {
    return (
      <Navigate
        to="/profile"
        replace
      />
    );
  }

  return <Outlet />;
}