import {
  AlertTriangle,
  Home,
  RefreshCcw,
} from "lucide-react";

import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

export function AppErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let description =
    "An unexpected error occurred while loading this page.";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = "Page not found";
      description =
        "The page you're looking for doesn't exist.";
    } else {
      description =
        error.statusText || description;
    }
  } else if (error instanceof Error) {
    description = error.message;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-5 text-[var(--text)]">
      <section className="glass-panel w-full max-w-lg rounded-[32px] p-8 text-center">
        <div className="neo-button mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-[var(--danger)]">
          <AlertTriangle size={28} />
        </div>

        <h1 className="mt-6 text-2xl font-semibold">
          {title}
        </h1>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="neo-button flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-medium"
          >
            <RefreshCcw size={17} />

            Try again
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/dashboard", {
                replace: true,
              })
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            <Home size={17} />

            Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}