import { CompactDisplay, CompactDisplayItem, DisplayModeToggle, type DisplayMode } from "../../../shared/components/tabs/DisplayModeToggle";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  Copy,
  ExternalLink,
  FileSearch2,
  Globe2,
  Radar,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Carousel } from "../../../shared/components/carousel/Carousel";
import { useAuthStore } from "../../auth/store/auth.store";
import { useResume, useResumes } from "../../resume/api/resume.queries";
import { useResumeEditorStore } from "../../resume/store/resume-editor.store";
import type { Resume, ResumeSkill } from "../../resume/types/resume.types";
import { notify } from "../../../shared/lib/notify";

type JobsTab = "boards" | "matches";

type BoardFocus = "general" | "tech" | "enterprise" | "public";

interface JobBoard {
  id: string;
  name: string;
  faName: string;
  description: string;
  jobsUrl: string;
  icon: LucideIcon;
  tags: string[];
  focus: BoardFocus[];
  baseScore: number;
}

interface ResumeSearchProfile {
  role: string;
  city: string;
  keywords: string[];
  searchPhrase: string;
  isTech: boolean;
  strength: number;
}

const jobBoards: JobBoard[] = [
  {
    id: "jobinja",
    name: "Jobinja",
    faName: "جابینجا",
    description:
      "Broad coverage across Iranian companies with strong filters for role, city and contract type.",
    jobsUrl: "https://jobinja.ir/jobs",
    icon: BriefcaseBusiness,
    tags: ["General", "Private companies", "Remote"],
    focus: ["general", "tech"],
    baseScore: 92,
  },
  {
    id: "jobvision",
    name: "JobVision",
    faName: "جاب‌ویژن",
    description:
      "Large job marketplace with detailed filters, career tools and broad city coverage.",
    jobsUrl: "https://jobvision.ir/jobs",
    icon: Target,
    tags: ["General", "Career tools", "Many cities"],
    focus: ["general", "enterprise"],
    baseScore: 91,
  },
  {
    id: "irantalent",
    name: "IranTalent",
    faName: "ایران‌تلنت",
    description:
      "A strong source for professional, specialist and enterprise-level opportunities.",
    jobsUrl: "https://www.irantalent.com/jobs",
    icon: Building2,
    tags: ["Professional", "Enterprise", "Specialists"],
    focus: ["enterprise", "general"],
    baseScore: 88,
  },
  {
    id: "quera",
    name: "Quera Jobs",
    faName: "کوئرا جابز",
    description:
      "Technology-focused opportunities for software, data, product and engineering talent.",
    jobsUrl: "https://quera.org/magnet/jobs",
    icon: Code2,
    tags: ["Technology", "Software", "Engineering"],
    focus: ["tech"],
    baseScore: 72,
  },
  {
    id: "karboom",
    name: "Karboom",
    faName: "کاربوم",
    description:
      "Job listings plus career and assessment tools for a wide range of Iranian roles.",
    jobsUrl: "https://karboom.io/jobs",
    icon: Radar,
    tags: ["General", "Career", "Assessments"],
    focus: ["general", "enterprise"],
    baseScore: 83,
  },
  {
    id: "iranestekhdam",
    name: "Iran Estekhdam",
    faName: "ایران استخدام",
    description:
      "Useful for private-sector listings as well as nationwide and public recruitment announcements.",
    jobsUrl: "https://iranestekhdam.ir/",
    icon: Globe2,
    tags: ["Public hiring", "General", "Nationwide"],
    focus: ["public", "general"],
    baseScore: 79,
  },
];

export function JobsPage() {
  const [view, setView] = useState<DisplayMode>("slider");
  const [activeTab, setActiveTab] = useState<JobsTab>("boards");

  const user = useAuthStore((state) => state.user);
  const activeResumeId = useResumeEditorStore(
    (state) => state.activeResumeId,
  );

  const resumesQuery = useResumes(user?.id ?? null);
  const resumes = resumesQuery.data ?? [];

  const selectedResumeId =
    activeResumeId &&
    resumes.some((resume) => resume.id === activeResumeId)
      ? activeResumeId
      : resumes[0]?.id ?? null;

  const resumeQuery = useResume(selectedResumeId);

  const resume =
    resumeQuery.data ??
    resumes.find((item) => item.id === selectedResumeId) ??
    null;

  const profile = useMemo(
    () => (resume ? buildResumeSearchProfile(resume) : null),
    [resume],
  );

  const rankedBoards = useMemo(
    () =>
      profile
        ? rankBoards(jobBoards, profile)
        : jobBoards.map((board) => ({
            board,
            score: board.baseScore,
          })),
    [profile],
  );

  async function copySearchPhrase() {
    if (!profile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(profile.searchPhrase);
      notify.success("Search keywords copied.");
    } catch {
      notify.error("Could not copy search keywords.");
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="glass-panel-header rounded-[32px] p-2">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-evenly xl:gap-15">
          <div className="flex w-full min-w-0 flex-col items-center text-center">
            <div className="flex w-full flex-wrap items-center justify-evenly">
              <p
                className={`rounded-full px-3.5 py-1 text-sm font-medium transition-colors ${
                  activeTab === "matches"
                    ? "bg-[var(--warning-soft)] text-[var(--warning)]"
                    : "bg-[var(--accent-soft)] text-[var(--accent)]"
                }`}
              >
                Career Hub
              </p>

              <div
                className={`active-inset flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  activeTab === "matches"
                    ? "text-[var(--warning)]"
                    : "text-[var(--accent)]"
                }`}
              >
                <BriefcaseBusiness size={30} strokeWidth={1.8} />
              </div>

              <span className={`active-inset rounded-full px-2 py-1 text-[9px] font-semibold ${activeTab === "matches"
                    ? "text-[var(--warning)]"
                    : "text-[var(--accent)]"
                }`}>
                Resume-aware
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Find The Right Opportunity Faster
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-5 text-[var(--muted)]">
              Explore trusted Iranian job boards or use your current
              resume to build a focused job-search profile.
            </p>

            <div className="mt-3 flex w-full flex-col items-center gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)_minmax(0,1fr)] lg:gap-x-4">
              <div
                role="group"
                aria-label="Jobs view"
                className="neo-inset relative grid w-full max-w-[360px] grid-cols-2 rounded-2xl p-1 lg:col-start-2"
              >
                <div
                  aria-hidden="true"
                  className={`
                    pointer-events-none absolute bottom-1.5 left-1.5 top-1.5
                    w-[calc(50%_-_5px)] rounded-xl bg-[var(--bg)]
                    shadow-[2px_2px_3px_var(--shadow-dark),-2px_-2px_3px_var(--shadow-light)]
                    transition-transform duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    motion-reduce:transition-none
                    ${
                      activeTab === "matches"
                        ? "translate-x-full"
                        : "translate-x-0"
                    }
                  `}
                />

                <TabButton
                  active={activeTab === "boards"}
                  icon={Globe2}
                  label="Job Boards"
                  onClick={() => setActiveTab("boards")}
                />

                <TabButton
                  active={activeTab === "matches"}
                  icon={Sparkles}
                  yellowIcon
                  label="Smart Matches"
                  onClick={() => setActiveTab("matches")}
                />
              </div>

              <div className="min-w-0 lg:col-start-3">
                <SmartMatchesIntro active={activeTab === "matches"} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {activeTab === "boards" ? (
        <JobBoardsTab view={view} />
      ) : (
        <SmartMatchesTab
          view={view}
          loading={resumesQuery.isLoading || resumeQuery.isLoading}
          resume={resume}
          profile={profile}
          rankedBoards={rankedBoards}
          onCopySearchPhrase={copySearchPhrase}
        />
      )}

      <DisplayModeToggle value={view} onChange={setView} tone={activeTab === "matches" ? "warning" : "accent"} />
    </div>
  );
}

function JobBoardsTab({ view }: { view: DisplayMode }) {
  if (view === "compact") {
    return (
      <CompactDisplay label="Job boards" tone="accent">
        {jobBoards.map((board) => (
          <CompactDisplayItem key={board.id} title={board.name} action={{ label: "Open", href: board.jobsUrl }} />
        ))}
      </CompactDisplay>
    );
  }

  return (
    <Carousel label="Job boards">
      {jobBoards.map((board) => (
        <JobBoardCard key={board.id} board={board} />
      ))}
    </Carousel>
  );
}

function SmartMatchesTab({
  view,
  loading,
  resume,
  profile,
  rankedBoards,
  onCopySearchPhrase,
}: {
  view: DisplayMode;
  loading: boolean;
  resume: Resume | null;
  profile: ResumeSearchProfile | null;
  rankedBoards: { board: JobBoard; score: number }[];
  onCopySearchPhrase: () => void;
}) {
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="glass-panel h-[260px] animate-pulse rounded-[28px]" />
        <div className="glass-panel h-[260px] animate-pulse rounded-[28px]" />
      </div>
    );
  }

  if (!resume || !profile) {
    return (
      <section className="glass-panel flex min-h-[300px] flex-col items-center justify-center rounded-[32px] text-center">
        <div className="neo-inset flex h-16 w-16 items-center justify-center rounded-2xl text-[var(--accent)]">
          <FileSearch2 size={40} strokeWidth={1.6} />
        </div>

        <h2 className="mt-7 text-xl font-semibold">Build your resume first</h2>

        <p className="m-7 max-w-2xl text-sm leading-5 text-[var(--muted)]">
          Smart Matches uses your target role, skills, experience and
          location to prepare a focused job search.
        </p>

        <Link
          to="/resume"
          className="absolute -bottom-5 shadow-button inline-flex h-10 items-center gap-3 rounded-xl px-6 text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)]"
        >
          Open Resume Builder
          <ArrowUpRight size={20} className="mt-0.5" />
        </Link>
      </section>
    );
  }

  const hasUsefulProfile =
    Boolean(profile.role) || profile.keywords.length > 0;

  return (
    <div className="grid gap-4 xl:grid-cols-[0.5fr_1fr] xl:items-start">
      <div className="grid gap-3">
        <section className="glass-panel rounded-[28px] py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="shadow-button flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[var(--warning)]">
              <Target size={35} />
            </div>

            <div className="min-w-0 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                Matching resume
              </p>

              <h2
                className="mt-1 truncate text-lg font-semibold"
                title={resume.title}
              >
                {resume.title}
              </h2>
            </div>

            <div className="bg-[var(--warning-soft)] rounded-full px-2.5 py-1 text-[10px] font-semibold text-[var(--warning)]">
              {profile.strength}% Ready
            </div>
          </div>

          <div className="mt-0.5 grid">
            <InfoRow label="Target role" value={profile.role || "Not specified"} />
            <InfoRow label="Location" value={profile.city || "Any location"} />
          </div>

          <div className="mt-2 text-center flex flex-col items-center">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Strongest signals
            </p>

            <div className="mt-1 flex flex-wrap gap-2">
              {profile.keywords.length > 0 ? (
                profile.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="active-inset rounded-full px-2 py-0.5 text-[10px] font-medium"
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[var(--text)]">
                  Add a{" "}
                  <span className="text-[var(--success)]">Target Title</span>{" "}
                  or{" "}
                  <span className="text-[var(--success)]">Skills{" "}</span>
                  to improve matching.
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[28px] px-4 pt-2 pb-3">
          <div className="flex items-center justify-center gap-5">
            <div className="shadow-button flex h-9.5 w-9.5 items-center justify-center rounded-xl text-[var(--warning)]">
              <Search size={20} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-center">
                Resume Search Profile
              </h3>

              <p className="mt-0.5 text-[11px] text-[var(--muted)]">
                Generated from your current resume
              </p>
            </div>

            <button
              type="button"
              onClick={onCopySearchPhrase}
              disabled={!profile.searchPhrase}
              className="absolute -bottom-3.5 right-7 neo-button flex h-7 shrink-0 items-center gap-1.5 rounded-lg px-2 !text-[12px] font-medium !text-[var(--muted)] transition hover:!text-[var(--text)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={12} />
              Copy
            </button>
          </div>

          <div className="neo-inset mt-2 min-h-[40px] leading-4 rounded-2xl px-3 py-2">
            {profile.searchPhrase ? (
              <p className="break-words text-xs font-medium">
                {profile.searchPhrase}
              </p>
            ) : (
              <p className="text-sm text-[var(--muted)]">
                Your resume needs a target title or at least one skill
                before Pulse can build a focused search phrase.
              </p>
            )}
          </div>

          <div className="mt-2 flex items-start gap-1">
            <CheckCircle2 size={13} className="shrink-0 text-[var(--success)]" />

            <p className="text-[10px] leading-3.5 text-[var(--muted)]">
              Pulse does not fabricate job ads. These recommendations
              open official job sources with a resume-derived search
              strategy. Individual live job cards should come from a
              backend connector/API.
            </p>
          </div>
        </section>
      </div>

      {hasUsefulProfile && view === "compact" ? (
        <CompactDisplay label="Smart job matches" tone="warning">
          {rankedBoards.map(({ board }) => (
            <CompactDisplayItem key={board.id} title={board.name} action={{ label: "Open", href: board.jobsUrl }} />
          ))}
        </CompactDisplay>
      ) : hasUsefulProfile ? (
        <section className="min-w-0">
          <Carousel label="Smart job matches" tone="warning">
            {rankedBoards.map(({ board, score }) => (
              <MatchSourceCard
                key={board.id}
                board={board}
                score={score}
                profile={profile}
              />
            ))}
          </Carousel>
        </section>
      ) : (
        <section className="mt-20 glass-panel rounded-[28px] p-15 text-center">
          <h3 className="font-semibold">Add More Resume Signals</h3>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Add a target job title or a few skills in Resume Builder.
            Pulse will then rank the job sources around your actual
            profile.
          </p>

          <Link
            to="/resume"
            className="absolute -bottom-4.5 left-1/2 -translate-x-1/2 shadow-button mt-5 inline-flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold hover:text-[var(--accent)]"
          >
            Improve Resume
            <ArrowUpRight size={14} />
          </Link>
        </section>
      )}
    </div>
  );
}

function JobBoardCard({ board }: { board: JobBoard }) {
  const Icon = board.icon;

  return (
    <article className="relative glass-panel flex min-h-[160px] flex-col rounded-[28px] px-3 pt-3 pb-7 my-12">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 w-full items-center justify-center text-center gap-5">
          <div className="shadow-button flex h-10 w-10 shrink-0 items-center justify-center rounded-lg !text-[var(--accent)]">
            <Icon size={25} strokeWidth={1.5} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold">{board.name}</h2>

            <p className="mt-0.5 text-[12px] text-[var(--text)]" dir="rtl">
              {board.faName}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[12px] leading-4 text-center text-[var(--muted)]">
        {board.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {board.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full active-inset px-1.5 py-0.5 text-[10px] font-medium text-[var(--text)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={board.jobsUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-button flex h-8 w-[calc(100%-120px)] items-center justify-center gap-4 rounded-xl text-[14px] font-semibold !bg-[var(--accent)] text-[var(--bg)] transition hover:!bg-[var(--bg)] hover:!text-[var(--accent)]"
      >
        Browse Jobs
        <ExternalLink size={16} />
      </a>
    </article>
  );
}

function MatchSourceCard({
  board,
  score,
  profile,
}: {
  board: JobBoard;
  score: number;
  profile: ResumeSearchProfile;
}) {
  const Icon = board.icon;

  return (
    <article className="glass-panel flex flex-col rounded-[20px] px-3 pb-7 pt-3 mb-8 md:mt-10">
      <div className="flex min-w-0 items-center justify-between">
        <div className="shadow-button flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--warning)]">
          <Icon size={25} strokeWidth={1.5}/>
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[20px] font-bold">{board.name}</h3>
        </div>

        <span className="text-center rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.03em] text-[var(--warning)] bg-[var(--warning-soft)]">
          {score}% Fit
        </span>
      </div>

      <div className="active-inset mt-5 rounded-xl px-2.5 py-1.5">
        <p className="flex justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
          <Search size={14} className="text-[var(--warning)]" />
          Search for
        </p>

        <p className="text-center mt-3 line-clamp-8 text-[12px] font-medium leading-4 overflow-y-auto">
          {profile.searchPhrase}
        </p>
      </div>

      <a
        href={board.jobsUrl}
        target="_blank"
        rel="noreferrer"
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 shadow-button flex h-8 w-[calc(100%-120px)] items-center justify-center gap-4 rounded-xl text-[14px] font-semibold transition !text-[var(--bg)] hover:!text-[var(--warning)] !bg-[var(--warning)] hover:!bg-[var(--bg)]"
      >
        Open Official Jobs
        <ExternalLink size={16} />
      </a>
    </article>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-dashed border-[var(--border)] py-2">
      <span className="text-[10px] font-medium text-[var(--muted)]">
        {label}
      </span>

      <span className="min-w-0 truncate text-right text-xs font-semibold" title={value}>
        {value}
      </span>
    </div>
  );
}

function SmartMatchesIntro({ active }: { active: boolean }) {
  const words = ["Best", "Source", "For", "This", "Resume"];

  const [visibleWords, setVisibleWords] = useState(0);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisibleWords(0);
      setShowSubtitle(false);
      return;
    }

    setVisibleWords(0);
    setShowSubtitle(false);

    let currentWord = 0;
    let subtitleTimer: number | undefined;

    const wordTimer = window.setInterval(() => {
      currentWord += 1;
      setVisibleWords(currentWord);

      if (currentWord >= words.length) {
        window.clearInterval(wordTimer);

        subtitleTimer = window.setTimeout(() => {
          setShowSubtitle(true);
        }, 450);
      }
    }, 220);

    return () => {
      window.clearInterval(wordTimer);

      if (subtitleTimer !== undefined) {
        window.clearTimeout(subtitleTimer);
      }
    };
  }, [active]);

  return (
    <div
      className={`
        grid transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)] text-[var(--warning)]
        ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
      `}
    >
      <div className="overflow-hidden">
        <div className="pt-1 text-center lg:pt-0 text-center rounded-full bg-[var(--warning-soft)]">
          <h2 className="text-lg font-semibold">
            {words.map((word, index) => (
              <span
                key={word}
                className={`
                  inline-block transition-all duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${
                    index < visibleWords
                      ? "translate-y-0 opacity-100 blur-0"
                      : "translate-y-1 opacity-0 blur-[2px]"
                  }
                `}
              >
                {word}
                {index < words.length - 1 && "\u00A0"}
              </span>
            ))}
          </h2>

          <p
            className={`
              mt-1 pb-1 text-xs text-[var(--muted)] transition-all duration-1000 ease-out
              ${
                showSubtitle
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }
            `}
          >
            Ranked by the role and skill signals found in your resume
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  yellowIcon = false,
  label,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  yellowIcon?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative z-10 flex items-center justify-center gap-2
        rounded-xl px-4 py-2.5 text-sm transition-colors duration-300
        hover:text-[var(--text)] group
        ${active ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"}
      `}
    >
      <Icon
        size={18}
        strokeWidth={1.3}
        className={`
          transition-colors duration-300
          ${
            yellowIcon
              ? "group-hover:!text-[var(--warning)]"
              : "group-hover:!text-[var(--accent)]"
          }
          ${
            active
              ? yellowIcon
                ? "text-[var(--warning)]"
                : "text-[var(--accent)]"
              : "text-[var(--muted)]"
          }
        `}
      />

      {label}
    </button>
  );
}

function buildResumeSearchProfile(resume: Resume): ResumeSearchProfile {
  const sortedExperiences = [...resume.experiences].sort(
    (a, b) => a.order - b.order,
  );

  const role = firstFilled(
    resume.targetJobTitle,
    resume.personal.jobTitle,
    sortedExperiences[0]?.position ?? "",
    resume.title === "Untitled Resume" ? "" : resume.title,
  );

  const skills = [...resume.skills].sort(
    (a, b) => getSkillWeight(b) - getSkillWeight(a),
  );

  const skillNames = skills.map((skill) => skill.name.trim());

  const technologies = resume.projects.flatMap((project) =>
    project.technologies.map((technology) => technology.trim()),
  );

  const experienceRoles = sortedExperiences.map((experience) =>
    experience.position.trim(),
  );

  const keywords = uniqueValues([
    ...skillNames,
    ...technologies,
    ...experienceRoles,
  ])
    .filter(Boolean)
    .filter((value) => value.toLocaleLowerCase() !== role.toLocaleLowerCase())
    .slice(0, 6);

  const searchPhrase = uniqueValues([
    role,
    ...keywords.slice(0, 4),
    resume.personal.city,
  ])
    .filter(Boolean)
    .join(" · ");

  const techHaystack = [
    role,
    resume.summary,
    ...skillNames,
    ...technologies,
    ...experienceRoles,
  ]
    .join(" ")
    .toLocaleLowerCase();

  const isTech = techTerms.some((term) => techHaystack.includes(term));

  const strength = Math.min(
    100,
    25 +
      (role ? 30 : 0) +
      (skillNames.length > 0 ? 25 : 0) +
      (resume.experiences.length > 0 ? 10 : 0) +
      (resume.personal.city ? 10 : 0),
  );

  return {
    role,
    city: resume.personal.city,
    keywords,
    searchPhrase,
    isTech,
    strength,
  };
}

function rankBoards(boards: JobBoard[], profile: ResumeSearchProfile) {
  return boards
    .map((board) => {
      let score = board.baseScore;

      if (profile.isTech && board.focus.includes("tech")) {
        score += 16;
      }

      if (!profile.isTech && board.focus.includes("general")) {
        score += 5;
      }

      if (
        profile.keywords.length >= 4 &&
        board.focus.includes("enterprise")
      ) {
        score += 4;
      }

      return {
        board,
        score: Math.min(99, score),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function getSkillWeight(skill: ResumeSkill) {
  switch (skill.level) {
    case "expert":
      return 4;
    case "advanced":
      return 3;
    case "intermediate":
      return 2;
    case "beginner":
    default:
      return 1;
  }
}

function firstFilled(...values: string[]) {
  return values.find((value) => value.trim().length > 0)?.trim() ?? "";
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const clean = value.trim();

    if (!clean) {
      return false;
    }

    const key = clean.toLocaleLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

const techTerms = [
  "frontend",
  "front end",
  "backend",
  "back end",
  "fullstack",
  "full stack",
  "developer",
  "engineer",
  "software",
  "programmer",
  "react",
  "javascript",
  "typescript",
  "node",
  "python",
  "java",
  "php",
  "golang",
  "go developer",
  "devops",
  "cloud",
  "data",
  "machine learning",
  "ai",
  "ui",
  "ux",
  "برنامه نویس",
  "برنامه‌نویس",
  "توسعه دهنده",
  "توسعه‌دهنده",
  "نرم افزار",
  "نرم‌افزار",
  "دواپس",
  "داده",
  "هوش مصنوعی",
];