import {
  Menu,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { useAuthStore } from "../../../features/auth/store/auth.store";

import {
  footerNavigation,
  mainNavigation,
} from "../../constants/navigation";

import { useThemeStore } from "../../stores/theme.store";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({
  onMenuClick,
}: HeaderProps) {
  const location = useLocation();

  const user = useAuthStore(
    (state) => state.user,
  );

  const theme = useThemeStore(
    (state) => state.theme,
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  );

  const navigation = [
    ...mainNavigation,
    ...footerNavigation,
  ];

  const currentPage = navigation.find(
    (item) =>
      item.path === location.pathname,
  );

  const pageTitle =
    location.pathname === "/profile"
      ? "Profile"
      : currentPage?.label ?? "Workspace";

  const displayName =
    user?.displayName || user?.username || "User";

  return (
    <header className="glass-panel-header fixed left-0 right-0 top-0 z-30 h-20 bg-[var(--bg)] md:left-72">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="neo-button rounded-xl p-2 md:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="font-semibold">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
  to="/profile"
  aria-label="Open profile"
  title={`${displayName} (@${user?.username ?? ""})`}
  className={({ isActive }) =>
    `
      group relative
      flex h-11 w-11
      items-center justify-center
      rounded-2xl
      transition-all duration-200
      
      ${
        isActive
          ? "neo-inset text-[var(--accent)]"
          : "neo-button text-[var(--muted)]"
      }
    `
  }
>
  {({ isActive }) => (
    <>
      <div
        className={`
          flex h-11 w-11
          items-center justify-center
          overflow-hidden
          rounded-xl
          transition-all duration-200
          text-[var(--muted)]

          ${
            isActive
              ? "!text-[var(--accent)]"
              : "hover:text-[var(--text)]"
          }
        `}
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <UserRound
            size={19}
          />
        )}
      </div>

      <div
        className="
          glass-panel
          pointer-events-none
          absolute right-15 top-[calc(100%-51px)]
          min-w-45
          -translate-y-1
          rounded-2xl
          px-4 py-3
          text-left
          opacity-0
          transition-all duration-200

          group-hover:translate-y-0
          group-hover:opacity-100

          group-focus-visible:translate-y-0
          group-focus-visible:opacity-100
        "
      >
        <div className="truncate text-sm font-semibold text-[var(--text)]">
          {displayName}
        </div>

        <div className="mt-0.5 truncate text-xs text-[var(--muted)]">
          @{user?.username}
        </div>
      </div>
    </>
  )}
</NavLink>

          <button
  type="button"
  onClick={toggleTheme}
  className="neo-button theme-toggle flex h-11 w-11 items-center justify-center rounded-2xl"
  aria-label="Toggle theme"
>
  <Sun
    size={19}
    className={`theme-toggle-icon theme-toggle-sun ${
      theme === "dark"
        ? "theme-toggle-active"
        : ""
    }`}
  />

  <Moon
    size={19}
    className={`theme-toggle-icon theme-toggle-moon ${
      theme === "light"
        ? "theme-toggle-active"
        : ""
    }`}
  />
</button>
        </div>
      </div>
    </header>
  );
}