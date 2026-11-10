import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  User,
  ArrowUpRight,
  BookOpen,
  Crown,
  ExternalLink,
  GalleryHorizontal,
  Gift,
  GraduationCap,
  Heart,
  List,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { FloatingField } from "../../shared/components/form/FloatingField";
import { useAuthStore } from "../auth/store/auth.store";
import { useResume, useResumes } from "../resume/api/resume.queries";
import { useResumeEditorStore } from "../resume/store/resume-editor.store";
import {
  getLearningMatches,
  learningApiEnabled,
  learningProviders,
  searchLearningCourses,
  topicLabel,
} from "./learning.data";
import { LearningCarousel } from "./LearningCarousel";

export function LearningPage() {
  const [tab, setTab] = useState<"free" | "premium">("free");
  const [view, setView] = useState<"slider" | "compact">("slider");
  const isPremium = tab === "premium";

  useEffect(() => {
    if (view !== "slider") return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [view]);

  const [interests, setInterests] = useState("");
  const [strengths, setStrengths] = useState("");

  const userId = useAuthStore((state) => state.user?.id ?? null);
  const activeResumeId = useResumeEditorStore((state) => state.activeResumeId);
  const resumesQuery = useResumes(userId);
  const resumes = resumesQuery.data ?? [];
  const selectedResume =
    resumes.find((resume) => resume.id === activeResumeId) ?? resumes[0];
  const resumeQuery = useResume(selectedResume?.id ?? null);
  const resume = resumeQuery.data ?? selectedResume ?? null;
  const resumeLoading = resumesQuery.isLoading || resumeQuery.isLoading;

  const matches = useMemo(
    () => getLearningMatches(resume, interests, strengths),
    [resume, interests, strengths],
  );
  const selectedTopics = matches.map((match) => match.id);

  const coursesQuery = useQuery({
    queryKey: ["learning-courses", "premium", selectedTopics],
    queryFn: async ({ signal }) => {
      const [free, paid] = await Promise.all([
        searchLearningCourses("free", selectedTopics, signal),
        searchLearningCourses("paid", selectedTopics, signal),
      ]);

      return [...free, ...paid];
    },
    enabled:
      isPremium &&
      learningApiEnabled &&
      selectedTopics.length > 0 &&
      !resumeLoading,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const sources = learningProviders
    .map((provider) => {
      const relevant = matches.filter((match) =>
        provider.topics.includes(match.id),
      );

      return {
        provider,
        relevant,
        weight: relevant.reduce((sum, match) => sum + match.weight, 0),
      };
    })
    .filter(({ relevant }) => relevant.length > 0)
    .sort((a, b) => b.weight - a.weight);

  const accent = isPremium ? "text-[var(--warning)]" : "text-[var(--accent)]";
  const badge = isPremium
    ? "bg-[var(--warning-soft)] text-[var(--warning)]"
    : "bg-[var(--accent-soft)] text-[var(--accent)]";

  return (
    <div className="relative space-y-5 pb-20" data-learning-view={view}>
      <section className="glass-panel-header rounded-[32px] p-2">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-evenly xl:gap-15">
          <div className="min-w-0 text-center flex flex-col items-center w-full">
            <div className="w-full flex flex-wrap items-center justify-evenly">
              <p
                className={`rounded-full px-3.5 py-1 text-sm font-medium transition-colors ${badge}`}
              >
                Learning Hub
              </p>

              <div
                className={`active-inset flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl transition-colors ${accent}`}
              >
                <GraduationCap size={30} strokeWidth={1.8} />
              </div>

              <span className="active-inset rounded-full px-2 py-1 text-[9px] font-semibold">
                Resume-aware
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
              Find Training That Fits Your Goals
            </h1>

            <p className="mt-1 max-w-3xl text-sm leading-5 text-[var(--muted)]">
              Explore Iranian learning providers using your education,
              skills, interests and strengths.
            </p>
            <div className="w-full shrink-0 xl:w-[360px] mt-3 flex justify-center">
            <div
              role="group"
              aria-label="Learning view"
              className="neo-inset relative grid w-full grid-cols-2 rounded-2xl p-1"
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
                  ${isPremium ? "translate-x-full" : "translate-x-0"}
                `}
              />

              <AccessButton
                active={!isPremium}
                icon={Gift}
                label="Free"
                onClick={() => setTab("free")}
              />

              <AccessButton
                active={isPremium}
                icon={Crown}
                label="Premium"
                paid
                onClick={() => setTab("premium")}
              />
            </div>
          </div>
          </div>
        </div>
      </section>

      {view === "compact" ? (
        <section
          className="learning-directory-compact"
          aria-label="Learning providers"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">
              {isPremium ? "Matching providers" : "Learning providers"}
            </h2>

            <span className="text-xs text-[var(--muted)]">
              {isPremium ? sources.length : learningProviders.length}
            </span>
          </div>

          <div
            className="learning-directory-compact__tabs"
            role="group"
            aria-label="Learning view"
          >
            <button
              type="button"
              aria-pressed={!isPremium}
              onClick={() => setTab("free")}
            >
              Free
            </button>

            <button
              type="button"
              aria-pressed={isPremium}
              onClick={() => setTab("premium")}
            >
              Premium
            </button>
          </div>

          <div className="learning-directory-compact__grid">
            {(
              isPremium
                ? sources.map(({ provider }) => provider)
                : learningProviders
            ).map((provider) => (
              <div
                className="flex min-w-0 items-center justify-between gap-[5px] rounded-[9px] border border-solid border-[var(--border)] px-[7px] py-[5px] [direction:rtl] [@media(max-height:500px)]:px-[4px] [@media(max-height:500px)]:py-[2px]"
                key={provider.id}
              >
                <span
                  dir="auto"
                  title={provider.faName}
                  className="min-w-0 truncate text-[11px] [@media(max-height:500px)]:text-[10px]"
                >
                  {provider.faName}
                </span>

                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open official site — ${provider.faName}`}
                  className="inline-flex shrink-0 items-center gap-[3px] rounded-[6px] p-[4px] text-[10px] text-[var(--accent)]"
                >
                  <span className="[@media(max-height:500px)]:hidden">ورود</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>

          {isPremium && !sources.length && (
            <p className="text-xs text-[var(--muted)]">
              Add your interests in slider view to find matching providers.
            </p>
          )}
        </section>
      ) : !isPremium ? (
        <section aria-labelledby="learning-directory" className="text-center">
          <h2 id="learning-directory" className="text-sm font-semibold">
            Iranian Learning Providers
          </h2>

          <p className="mb-4 mt-1 text-xs text-[var(--muted)]">
            Browse the official websites in the learning directory.
          </p>

          <LearningCarousel label="All learning providers">
            {learningProviders.map((provider) => (
              <LearningCard
                key={provider.id}
                title={provider.name}
                subtitle={provider.faName}
                url={provider.url}
                topics={provider.topics.map(topicLabel)}
                paid={false}
                linkLabel="Open official site"
              />
            ))}
          </LearningCarousel>
        </section>
      ) : (
        <div className="learning-slider-premium grid items-start gap-6 xl:grid-cols-[minmax(0,0.5fr)_minmax(0,1fr)]">
          <section className="glass-panel min-w-0 rounded-[28px] px-3 py-2 ">
            <div className="flex items-center justify-center gap-2 text-center">
              <Sparkles size={20} className={accent} />
              <h2 className=" font-semibold">Learning Profile</h2>
            </div>

            <p className="flex items-center gap-2 mt-5 ml-1 break-words text-xs text-[var(--muted)]">
                <User size={14} />
              {resumeLoading
                ? "Loading resume…"
                : resume?.title ?? "No resume selected."}
            </p>

            {(resumesQuery.isError || resumeQuery.isError) && (
              <p role="status" className="mt-2 text-xs text-[var(--danger)]">
                Some resume data could not be loaded.
              </p>
            )}

            {!resume && !resumeLoading && (
              <Link
                to="/resume"
                className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--accent)]"
              >
                Open Resume Builder <ArrowUpRight size={14} />
              </Link>
            )}

            <div className="mt-4 grid gap-2">
              <FloatingField
                label="Interests"
                icon={Heart}
                value={interests}
                className="ml-5"
              >
                <input
                  value={interests}
                  onChange={(event) => setInterests(event.target.value)}
                  placeholder="e.g. SEO"
                  maxLength={300}
                  className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
                />
              </FloatingField>

              <FloatingField
                label="Strengths"
                icon={Zap}
                value={strengths}
                className="ml-5"
              >
                <input
                  value={strengths}
                  onChange={(event) => setStrengths(event.target.value)}
                  placeholder="e.g. writing"
                  maxLength={300}
                  className="min-w-0 w-full bg-transparent !text-sm outline-none placeholder:text-[var(--muted)]"
                />
              </FloatingField>
            </div>

            {matches.length > 0 && (
              <ul className="mt-6 text-center flex flex-col gap-3">
                {matches.map((match) => (
                  <li key={match.id} className="py-2 text-xs">
                    <span className="font-semibold">{match.label}</span>
                    <p className="mt-1 text-[10px] text-[var(--muted)]">
                      {match.reasons.join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="min-w-0 space-y-5 text-center">
            <section aria-labelledby="learning-sources">
              <h2 id="learning-sources" className="text-sm font-semibold">
                Matching Providers
              </h2>

              <p className="mb-4 mt-1 text-xs text-[var(--muted)]">
                Providers are ranked by the topics matched in your learning
                profile.
              </p>

              {!sources.length && (
                <p role="status" className="text-xs text-[var(--muted)]">
                  {resumeLoading
                    ? "Loading your learning profile…"
                    : "Add a field of study, skill or interest to find relevant providers."}
                </p>
              )}

              <LearningCarousel label="Recommended learning providers" premium>
                {sources.map(({ provider, relevant }) => (
                  <LearningCard
                    key={provider.id}
                    title={provider.name}
                    subtitle={provider.faName}
                    url={provider.url}
                    topics={relevant.map((topic) => topic.label)}
                    paid={isPremium}
                    linkLabel="Open official site"
                  />
                ))}
              </LearningCarousel>
            </section>

            <section aria-labelledby="learning-courses">
              <h2 id="learning-courses" className="text-sm font-semibold">
                Matching Courses
              </h2>

              <div aria-live="polite" className="mt-1 text-xs text-[var(--muted)]">
                {!learningApiEnabled ? (
                  <p>Live course search is awaiting a catalog connection.</p>
                ) : resumeLoading ? (
                  <p>Loading your learning profile…</p>
                ) : selectedTopics.length === 0 ? (
                  <p>Add education, skills or interests to search for courses.</p>
                ) : coursesQuery.isPending ? (
                  <p>Searching courses…</p>
                ) : coursesQuery.isError ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <p>Course search is unavailable.</p>
                    <button
                      type="button"
                      onClick={() => void coursesQuery.refetch()}
                      className="shadow-button rounded-lg px-2 py-1"
                    >
                      Retry
                    </button>
                  </div>
                ) : coursesQuery.data?.length === 0 ? (
                  <p>No matching courses were returned.</p>
                ) : null}
              </div>

              {(coursesQuery.data?.length ?? 0) > 0 && (
                <LearningCarousel label="Recommended courses" premium>
                  {coursesQuery.data?.map((course) => (
                    <LearningCard
                      key={`${course.access}:${course.id}`}
                      title={course.title}
                      subtitle={`${
                        learningProviders.find(
                          (provider) => provider.id === course.providerId,
                        )?.name ?? ""
                      } · ${
                        course.access === "free" ? "Free course" : "Paid course"
                      }`}
                      url={course.url}
                      topics={course.topics.map(topicLabel)}
                      paid={isPremium}
                      linkLabel="Open official course"
                    />
                  ))}
                </LearningCarousel>
              )}
            </section>
          </div>
        </div>
      )}

      <div
        className="neo-surface learning-view-toggle"
        role="group"
        aria-label="Resource display"
      >
        <button
          type="button"
          aria-pressed={view === "slider"}
          onClick={() => setView("slider")}
        >
          <GalleryHorizontal size={16} />
          <span>اسلایدر</span>
        </button>

        <button
          type="button"
          aria-pressed={view === "compact"}
          onClick={() => setView("compact")}
        >
          <List size={16} />
          <span>فهرست فشرده</span>
        </button>
      </div>
    </div>
  );
}

function AccessButton({
  active,
  icon: Icon,
  label,
  paid = false,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  paid?: boolean;
  onClick: () => void;
}) {
  const accent = paid ? "text-[var(--warning)]" : "text-[var(--accent)]";
  const hover = paid
    ? "group-hover:!text-[var(--warning)]"
    : "group-hover:!text-[var(--accent)]";

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors ${
        active ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.3}
        className={`transition-colors ${hover} ${active ? accent : ""}`}
      />
      {label}
    </button>
  );
}

function LearningCard({
  title,
  subtitle,
  url,
  topics,
  paid,
  linkLabel,
}: {
  title: string;
  subtitle: string;
  url: string;
  topics: string[];
  paid: boolean;
  linkLabel: string;
}) {
  const accent = paid ? "text-[var(--warning)]" : "text-[var(--accent)]";
  const linkTone = paid
    ? "!bg-[var(--warning)] text-[var(--bg)] hover:!text-[var(--warning)]"
    : "!bg-[var(--accent)] text-[var(--bg)] hover:!text-[var(--accent)]";

  return (
    <article className="relative flex min-h-[110px] min-w-0 flex-col rounded-[28px] p-2">
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 items-center justify-center gap-3 text-center">
          <div
            className={`shadow-button flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent}`}
          >
            <BookOpen size={18} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3 dir="auto" className="break-words text-base font-semibold">
              {title}
            </h3>
            <p dir="auto" className=" text-[10px] text-[var(--muted)]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap justify-center gap-1">
        {topics.map((topic) => (
          <span
            key={topic}
            className="active-inset rounded-full px-1.5 py-0.5 text-[9px] font-medium"
          >
            {topic}
          </span>
        ))}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${linkLabel} — ${title}`}
        className={`shadow-button absolute -bottom-3 left-1/2 flex h-6 -translate-x-1/2 items-center justify-center gap-5 whitespace-nowrap rounded-lg w-[calc(100%-120px)] text-xs font-semibold transition hover:!bg-[var(--bg)] ${linkTone}`}
      >
        {linkLabel}
        <ExternalLink size={13} className="shrink-0" />
      </a>
    </article>
  );
}