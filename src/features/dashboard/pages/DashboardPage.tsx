import { FileText, Users, WandSparkles } from "lucide-react";
import { useAuthStore } from "../../auth/store/auth.store";
import { getRegisteredUsersCount } from "../../auth/services/auth.service";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const members = getRegisteredUsersCount();

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-[32px] p-6 md:p-8">
        <p className="text-sm font-medium text-[var(--accent)]">Dashboard</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">Welcome, {user?.username}</h2>
        <p className="mt-2 max-w-2xl text-[var(--muted)]">
          Manage your workspace, build your resume and explore Pulse.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="neo-surface rounded-[28px] p-6">
          <Users className="mb-5 text-[var(--accent)]" />
          <div className="text-3xl font-semibold">{members}</div>
          <div className="mt-1 text-sm text-[var(--muted)]">Members</div>
        </div>

        <div className="neo-surface rounded-[28px] p-6">
          <FileText className="mb-5 text-[var(--success)]" />
          <div className="text-3xl font-semibold">0</div>
          <div className="mt-1 text-sm text-[var(--muted)]">Resumes</div>
        </div>

        <div className="neo-surface rounded-[28px] p-6">
          <WandSparkles className="mb-5 text-[var(--accent)]" />
          <div className="text-3xl font-semibold">Pulse</div>
          <div className="mt-1 text-sm text-[var(--muted)]">Local demo mode</div>
        </div>
      </section>
    </div>
  );
}
