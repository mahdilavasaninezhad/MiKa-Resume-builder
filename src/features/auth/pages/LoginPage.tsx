import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Moon,
  Sun,
  UserPlus,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../store/auth.store";
import { useThemeStore } from "../../../shared/stores/theme.store";
import { notify } from "../../../shared/lib/notify";

type Mode = "login" | "register";

export function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    if (user) {
      navigate("/resume", {
        replace: true,
      });
    }
  }, [user, navigate]);

  useEffect(() => {
    const targetText =
      mode === "login"
        ? "Welcome back to your workspace."
        : "Create your local Pulse account.";

    setTypedText("");

    let index = 0;

    const interval = setInterval(() => {
      index += 1;

      setTypedText(
        targetText.slice(0, index),
      );

      if (index >= targetText.length) {
        clearInterval(interval);
      }
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, [mode]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        await login(
          username,
          password,
        );

        notify.success(
          "Welcome back.",
        );
      } else {
        await register(
          username,
          password,
        );

        notify.success(
          "Account created successfully.",
        );
      }

      navigate("/resume");
    } catch (error) {
      notify.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function changeMode(
    nextMode: Mode,
  ) {
    setMode(nextMode);
    setPassword("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[var(--bg)] p-5 text-[var(--text)]">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={
          theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
        }
        className="neo-button fixed right-5 top-5 z-20 flex h-12 w-12 items-center justify-center rounded-2xl"
      >
        <Sun
          size={20}
          strokeWidth={1.8}
          className={`theme-toggle-icon theme-toggle-sun ${
            theme === "dark"
              ? "theme-toggle-active"
              : ""
          }`}
        />

        <Moon
          size={20}
          strokeWidth={1.8}
          className={`theme-toggle-icon theme-toggle-moon ${
            theme === "light"
              ? "theme-toggle-active"
              : ""
          }`}
        />
      </button>

      <div className="glass-panel w-full max-w-md rounded-[32px] p-7 md:p-9">
        <div className="mb-8 text-center">
          <div className="neo-button relative mx-auto mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-3xl text-[var(--accent)]">
            <div
              className={`
                absolute
                transition-all
                duration-300
                ${
                  mode === "login"
                    ? "rotate-0 scale-100 opacity-100"
                    : "-rotate-12 scale-75 opacity-0"
                }
              `}
            >
              <LogIn
                size={28}
                strokeWidth={1.8}
              />
            </div>

            <div
              className={`
                absolute
                transition-all
                duration-500
                ${
                  mode === "register"
                    ? "rotate-0 scale-100 opacity-100"
                    : "rotate-12 scale-75 opacity-0"
                }
              `}
            >
              <UserPlus
                size={28}
                strokeWidth={1.8}
              />
            </div>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Pulse
          </h1>

          <p className="mt-2 min-h-5 text-sm text-[var(--muted)]">
            {typedText}
          </p>
        </div>

        <div className="neo-inset relative mb-6 grid grid-cols-2 rounded-2xl p-1">
          <div
            className={`
              absolute
              bottom-1.5
              left-1.5
              top-1.5
              w-[calc(50%-5px)]
              rounded-xl
              bg-[var(--bg)]
              shadow-[2px_2px_3px_var(--shadow-dark),-2px_-2px_3px_var(--shadow-light)]
              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                mode === "register"
                  ? "translate-x-full"
                  : "translate-x-0"
              }
            `}
          />

          <button
            type="button"
            onClick={() =>
              changeMode("login")
            }
            className={`
              relative
              z-10
              rounded-xl
              px-4
              py-2.5
              text-sm
              transition-colors
              duration-300
              hover:text-[var(--text)]
              ${
                mode === "login"
                  ? "font-semibold text-[var(--text)]"
                  : "text-[var(--muted)]"
              }
            `}
          >
            Login
          </button>

          <button
            type="button"
            onClick={() =>
              changeMode("register")
            }
            className={`
              relative
              z-10
              rounded-xl
              px-4
              py-2.5
              text-sm
              transition-colors
              duration-300
              hover:text-[var(--text)]
              ${
                mode === "register"
                  ? "font-semibold text-[var(--text)]"
                  : "text-[var(--muted)]"
              }
            `}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <label className="block pt-2">
            <div
              data-filled={
                username.trim().length >
                0
              }
              className="form-field floating-field flex items-center gap-3 rounded-2xl px-4"
            >
              <UserRound
                size={25}
                className="form-icon w-7 rounded-lg p-1 text-[var(--muted)]"
              />

              <input
                value={username}
                onChange={(event) =>
                  setUsername(
                    event.target.value,
                  )
                }
                required
                autoComplete="username"
                className="h-13 w-full bg-transparent outline-none"
              />

              <span className="floating-label">
                Username
              </span>
            </div>
          </label>

          <label className="block pt-2">
            <div
              data-filled={
                password.length > 0
              }
              className="form-field floating-field flex items-center gap-3 rounded-2xl px-4"
            >
              <LockKeyhole
                size={25}
                className="form-icon w-7 rounded-lg p-1 text-[var(--muted)]"
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                required
                minLength={8}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                className="h-13 w-full bg-transparent pr-11 outline-none"
              />

              <span className="floating-label">
                Password
              </span>

              <button
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  setShowPassword(
                    (current) =>
                      !current,
                  );
                }}
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                className="neo-button absolute right-5 -bottom-3.25 flex h-6.5 w-7 items-center justify-center rounded-lg transition !text-[var(--muted)] hover:!text-[var(--text)]"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="absolute w-[80%] rounded-2xl !bg-[var(--accent)] px-5 py-3 font-semibold text-white transition opacity-90 hover:opacity-100 shadow-button disabled:cursor-not-allowed disabled:opacity-50 left-1/2 -translate-x-1/2 -bottom-6"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-[var(--muted)]">
          Portfolio demo authentication. Credentials
          are stored only in this browser.
        </p>
      </div>
    </main>
  );
}