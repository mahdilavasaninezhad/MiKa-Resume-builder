import {
  CircleAlert,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  footerNavigation,
  mainNavigation,
} from "../../constants/navigation";

import { useAuthStore } from "../../../features/auth/store/auth.store";

import {
  getMissingProfileFields,
  isProfileComplete,
} from "../../../features/profile/utils/isProfileComplete";

import { notify } from "../../lib/notify";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({
  open,
  onClose,
}: SidebarProps) {
  const mobileState = open
    ? "translate-x-0"
    : "-translate-x-full";

  const [
    showProfileHint,
    setShowProfileHint,
  ] = useState(false);

  const [
    typedProfileHint,
    setTypedProfileHint,
  ] = useState("");

  const user = useAuthStore(
    (state) => state.user,
  );

  const profileComplete =
    isProfileComplete(user);

  const missingProfileFields =
    getMissingProfileFields(user);

  const profileHintText =
    missingProfileFields.length > 0
      ? `Complete : ${missingProfileFields.join(" , ")}`
      : "";

  useEffect(() => {
    let timeout:
      | ReturnType<typeof setTimeout>
      | undefined;

    if (profileComplete) {
      setShowProfileHint(false);
      setTypedProfileHint("");

      return;
    }

    if (showProfileHint) {
      if (
        typedProfileHint.length <
        profileHintText.length
      ) {
        timeout = setTimeout(() => {
          setTypedProfileHint(
            profileHintText.slice(
              0,
              typedProfileHint.length + 1,
            ),
          );
        }, 50);
      }
    } else if (
      typedProfileHint.length > 0
    ) {
      timeout = setTimeout(() => {
        setTypedProfileHint(
          profileHintText.slice(
            0,
            typedProfileHint.length - 1,
          ),
        );
      }, 15);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    showProfileHint,
    typedProfileHint,
    profileComplete,
    profileHintText,
  ]);

  useEffect(() => {
    setTypedProfileHint("");
  }, [profileHintText]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 backdrop-blur-xs md:hidden"
        />
      )}

      <div
        className={`
          neo-inset
          fixed left-0 top-0 z-50
          flex h-20 w-72
          items-center justify-between
          rounded-br-md
          px-12.5
          transition-transform duration-300
          md:translate-x-0
          ${mobileState}
        `}
      >
        <div className="flex items-center gap-8 text-center">
          <div className="shadow-button !bg-[var(--bg)] flex h-13 w-13 items-center justify-center rounded-2xl text-xl font-bold">
            P
          </div>

          <div>
            <div className="font-semibold tracking-tight text-xl">
              Pulse
            </div>

            <div className="text-[11px] text-[var(--muted)]">
              Personal workspace
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar"
          className="neo-button rounded-xl p-2 md:hidden"
        >
          <X size={18} />
        </button>
      </div>

      <aside
        className={`
          fixed bottom-0 left-0 top-20 z-50
          flex w-72 flex-col
          px-4 py-5
          backdrop-blur-2xl
          transition-transform duration-300
          md:translate-x-0
          ${mobileState}
        `}
      >
        <nav className="flex flex-1 flex-col gap-2">
          {mainNavigation.map(
            (item) => {
              const Icon = item.icon;

              const isResume =
                item.path === "/resume";

              if (isResume) {
                const resumeLocked =
                  !profileComplete;

                const hintVisible =
                  resumeLocked &&
                  (
                    showProfileHint ||
                    typedProfileHint.length >
                      0
                  );

                return (
                  <div
                    key={item.path}
                    className="relative"
                  >
                    <div className="group relative">
                      <NavLink
                        to={item.path}
                        aria-disabled={
                          resumeLocked
                        }
                        onClick={(
                          event,
                        ) => {
                          if (
                            resumeLocked
                          ) {
                            event.preventDefault();

                            notify.warning(
                              "Complete your profile first.",
                            );

                            return;
                          }

                          onClose();
                        }}
                        className={({
                          isActive,
                        }) =>
                          `
                            flex items-center gap-3
                            rounded-2xl
                            px-4 py-3
                            text-sm font-medium
                            transition-all duration-200

                            ${
                              isActive
                                ? "neo-inset text-[var(--accent)]"
                                : "nav-hover text-[var(--muted)] hover:text-[var(--text)]"
                            }

                            ${
                              resumeLocked
                                ? "cursor-not-allowed"
                                : ""
                            }
                          `
                        }
                      >
                        {({
                          isActive,
                        }) => (
                          <>
                            <Icon
                              size={26}
                              className={`
                                w-7 p-1
                                transition-all

                                ${
                                  isActive
                                    ? "sidebar-icon rounded-lg"
                                    : ""
                                }
                              `}
                            />

                            {item.label}
                            {resumeLocked && (
                        <div
                          onMouseEnter={() =>
                            setShowProfileHint(
                              true,
                            )
                          }
                          onMouseLeave={() =>
                            setShowProfileHint(
                              false,
                            )
                          }
                          className="
                            hint-button
                            z-20
                            flex
                            h-6
                            w-6
                            cursor-help
                            items-center
                            justify-center
                            rounded-xl
                            text-[var(--warning)]
                          "
                          aria-label="Profile completion hint"
                        >
                          <CircleAlert
                            size={16}
                          />
                        </div>
                      )}
                          </>
                        )}
                      </NavLink>
                    </div>

                    {resumeLocked && (
                      <div
                        className={`
                          grid
                          transition-[grid-template-rows,opacity]
                          duration-500
                          ease-[cubic-bezier(0.22,1,0.36,1)]

                          ${
                            hintVisible
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }
                        `}
                      >
                        <div className="overflow-hidden">
                          <div
                            dir="ltr"
                            className="
                              px-4
                              pt-3
                              text-xs
                              leading-5
                              text-[var(--muted)]
                              break-words
                            "
                          >
                            {typedProfileHint}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({
                    isActive,
                  }) =>
                    `
                      flex items-center gap-3
                      rounded-2xl
                      px-4 py-3
                      text-sm font-medium
                      transition-all duration-200

                      ${
                        isActive
                          ? "neo-inset text-[var(--accent)]"
                          : "nav-hover text-[var(--muted)] hover:text-[var(--text)]"
                      }
                    `
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      <Icon
                        size={26}
                        className={`
                          w-7 p-1
                          transition-all

                          ${
                            isActive
                              ? "sidebar-icon rounded-lg"
                              : ""
                          }
                        `}
                      />

                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            },
          )}
        </nav>

        <div className="border-t border-[var(--border)] pt-4">
          {footerNavigation.map(
            (item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({
                    isActive,
                  }) =>
                    `
                      flex items-center gap-3
                      rounded-2xl
                      px-4 py-3
                      text-sm font-medium
                      transition-all duration-200

                      ${
                        isActive
                          ? "neo-inset text-[var(--accent)]"
                          : "nav-hover text-[var(--muted)] hover:text-[var(--text)]"
                      }
                    `
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      <Icon
                        size={26}
                        className={`
                          w-7 p-1
                          transition-all

                          ${
                            isActive
                              ? "sidebar-icon rounded-lg"
                              : ""
                          }
                        `}
                      />

                      {item.label}
                    </>
                  )}
                </NavLink>
              );
            },
          )}
        </div>
      </aside>
    </>
  );
}