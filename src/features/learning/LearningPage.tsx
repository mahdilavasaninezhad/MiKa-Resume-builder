import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BookOpen,
  Crown,
  ExternalLink,
  Gift,
  GraduationCap,
  Heart,
  Sparkles,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Carousel } from "../../shared/components/carousel/Carousel";
import { FloatingField } from "../../shared/components/form/FloatingField";
import { AnimatedTabIntro } from "../../shared/components/tabs/AnimatedTabIntro";
import {
  CompactDisplay,
  CompactDisplayItem,
  DisplayModeToggle,
  type DisplayMode,
} from "../../shared/components/tabs/DisplayModeToggle";
import { useAuthStore } from "../auth/store/auth.store";
import { useResume, useResumes } from "../resume/api/resume.queries";
import { useResumeEditorStore } from "../resume/store/resume-editor.store";
import type { Resume } from "../resume/types/resume.types";

type LearningAccess = "free" | "paid";

export function LearningPage() {
  const [tab, setTab] = useState<"free" | "premium">("free");
  const [view, setView] = useState<DisplayMode>("slider");
  const [interests, setInterests] = useState("");
  const [strengths, setStrengths] = useState("");
  const isPremium = tab === "premium";

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

  const compactProviders = isPremium
    ? sources.map(({ provider }) => provider)
    : learningProviders;

  const accent = isPremium ? "text-[var(--warning)]" : "text-[var(--accent)]";
  const badge = isPremium
    ? "bg-[var(--warning-soft)] text-[var(--warning)]"
    : "bg-[var(--accent-soft)] text-[var(--accent)]";

  return (
    <div className="relative flex min-w-0 flex-col gap-3">
      <section className="glass-panel-header rounded-[32px] p-2">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-evenly xl:gap-15">
          <div className="flex w-full min-w-0 flex-col items-center text-center">
            <div className="flex w-full flex-wrap items-center justify-evenly">
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

              <span
                className={`active-inset rounded-full px-2 py-1 text-[9px] font-semibold transition-colors ${accent}`}
              >
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

            <div className="mt-3 flex w-full flex-col items-center gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)_minmax(0,1fr)] lg:gap-x-4">
              <div
                role="group"
                aria-label="Learning view"
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

              <div className="min-w-0 lg:col-start-3">
                <AnimatedTabIntro
                  active={isPremium}
                  title="Your Learning Matches"
                  description="Matched providers and courses."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {view === "compact" ? (
        <section
          className="grid gap-2 rounded-[28px]"
          aria-label="Learning providers"
        >
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-sm font-semibold">
              {isPremium ? "Matching providers" : "Learning providers"}
            </h2>

            <span className="text-xs text-[var(--muted)]">
              {compactProviders.length}
            </span>
          </div>

          {compactProviders.length > 0 && (
            <CompactDisplay
              label="Learning providers"
              tone={isPremium ? "warning" : "accent"}
            >
              {compactProviders.map((provider) => (
                <CompactDisplayItem
                  key={provider.id}
                  title={provider.faName}
                  action={{ label: "ورود", href: provider.url }}
                />
              ))}
            </CompactDisplay>
          )}

          {isPremium && compactProviders.length === 0 && (
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

          <p className="mb-2 mt-1 text-xs text-[var(--muted)]">
            Browse the official websites in the learning directory.
          </p>

          <Carousel label="All learning providers">
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
          </Carousel>
        </section>
      ) : (
        <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)]">
          <section className="glass-panel min-w-0 rounded-[28px] px-3 py-3 mt-2 !bg-[var(--bg)]">
            <div className="flex items-center justify-center gap-2 text-center">
              <Sparkles size={20} className={accent} />
              <h2 className="font-semibold">Learning Profile</h2>
            </div>

            <p className="ml-1 mt-5 flex items-center gap-2 break-words text-xs text-[var(--muted)]">
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
                  className="w-full min-w-0 bg-transparent !text-sm outline-none placeholder:text-[var(--muted)] placeholder:text-xs mt-1"
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
                  className="w-full min-w-0 bg-transparent !text-sm outline-none placeholder:text-[var(--muted)] placeholder:text-xs mt-1"
                />
              </FloatingField>
            </div>

            {matches.length > 0 && (
              <ul className="active-inset rounded-xl my-6 flex flex-col gap-3 text-center !bg-[var(--warning-soft)]">
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

          <div className="min-w-0 text-center [&_.carousel__viewport]:py-3 [&_.carousel__controls]:gap-2 [&_.carousel__arrow]:h-6 [&_.carousel__arrow]:w-6 [&_.carousel__dot]:h-4 [&_.carousel__dot]:w-3">
            <section aria-labelledby="learning-sources">
              <h2 id="learning-sources" className="text-sm font-semibold">
                Matching Providers
              </h2>

              {sources.length > 0 ? (
                <Carousel label="Recommended learning providers" tone="warning">
                  {sources.map(({ provider, relevant }) => (
                    <LearningCard
                      key={provider.id}
                      title={provider.name}
                      subtitle={provider.faName}
                      url={provider.url}
                      topics={relevant.map((topic) => topic.label)}
                      paid
                      linkLabel="Open official site"
                    />
                  ))}
                </Carousel>
              ) : (
                <p role="status" className="mt-1 text-xs text-[var(--muted)]">
                  {resumeLoading
                    ? "Loading your learning profile…"
                    : "Add a field of study, skill or interest to find relevant providers."}
                </p>
              )}
            </section>

            <section aria-labelledby="learning-courses">
              <h2 id="learning-courses" className="text-sm font-semibold">
                Matching Courses
              </h2>

              <div
                aria-live="polite"
                className="mt-1 text-xs text-[var(--muted)] empty:hidden"
              >
                {!learningApiEnabled ? (
                  <p>Live course search is awaiting a catalog connection.</p>
                ) : resumeLoading ? (
                  <p>Loading your learning profile…</p>
                ) : selectedTopics.length === 0 ? (
                  <p>Add education, skills or interests to search for courses.</p>
                ) : coursesQuery.isPending ? (
                  <p>Searching courses…</p>
                ) : coursesQuery.isError ? (
                  <div className="flex flex-wrap items-center justify-center gap-2">
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
                <Carousel label="Recommended courses" tone="warning">
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
                      paid
                      linkLabel="Open official course"
                    />
                  ))}
                </Carousel>
              )}
            </section>
          </div>
        </div>
      )}

      <DisplayModeToggle
        value={view}
        onChange={setView}
        tone={isPremium ? "warning" : "accent"}
      />
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
      className={`group relative z-10 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 hover:text-[var(--text)] ${
        active ? "font-semibold text-[var(--text)]" : "text-[var(--muted)]"
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.3}
        className={`transition-colors duration-300 ${hover} ${
          active ? accent : "text-[var(--muted)]"
        }`}
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
    <article
      className={`glass-panel relative flex min-w-0 flex-col rounded-[28px] px-3 pt-3 !bg-[var(--bg)] ${
        paid ? "mb-1 min-h-[115px]" : "mt-3 mb-14 min-h-[150px]"
      }`}
    >
      <div className="flex min-w-0 items-center justify-center gap-5 text-center">
        <div
          className={`shadow-button flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent}`}
        >
          <BookOpen size={25} strokeWidth={1.5} />
        </div>

        <div className="min-w-0">
          <h3 dir="auto" className="break-words text-base font-bold">
            {title}
          </h3>
          <p dir="auto" className="mt-0.5 text-[12px] text-[var(--text)]">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1">
        {topics.map((topic) => (
          <span
            key={topic}
            className="active-inset rounded-full px-1.5 py-0.5 text-[10px] tracking-[0.1px] font-medium text-[var(--text)]"
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
        className={`shadow-button absolute -bottom-4 left-1/2 flex h-8 w-[calc(100%-120px)] -translate-x-1/2 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[14px] font-semibold transition hover:!bg-[var(--surface)] ${linkTone}`}
      >
        {linkLabel}
        <ExternalLink size={16} className="shrink-0" />
      </a>
    </article>
  );
}

const topicIds = [
  "software",
  "data",
  "engineering",
  "business",
  "design",
  "languages",
  "science",
  "humanities",
] as const;

type LearningTopic = (typeof topicIds)[number];

const topics: Record<LearningTopic, { label: string; keywords: string[] }> = {
  software: {
    label: "Software",
    keywords: [
      "نرم افزار", "برنامه نویسی", "مهندسی کامپیوتر", "فناوری اطلاعات",
      "وردپرس", "computer science", "software", "javascript", "typescript",
      "react", "python", "frontend", "backend", "web development", "wordpress",
    ],
  },
  data: {
    label: "Data & AI",
    keywords: [
      "علم داده", "تحلیل داده", "هوش مصنوعی", "یادگیری ماشین", "آمار",
      "data science", "data analysis", "machine learning",
      "artificial intelligence", "statistics", "sql",
    ],
  },
  engineering: {
    label: "Engineering",
    keywords: [
      "مکانیک", "مهندسی برق", "عمران", "مهندسی صنایع", "معماری",
      "mechanical engineering", "electrical engineering", "civil engineering",
      "autocad", "solidworks", "matlab",
    ],
  },
  business: {
    label: "Business",
    keywords: [
      "مدیریت", "بازاریابی", "حسابداری", "اقتصاد", "مدیریت محصول",
      "سئو", "دیجیتال مارکتینگ", "مذاکره", "marketing", "accounting",
      "finance", "business", "management", "mba", "seo", "negotiation",
    ],
  },
  design: {
    label: "Design",
    keywords: [
      "طراحی گرافیک", "رابط کاربری", "تجربه کاربری", "گرافیک", "طراحی",
      "graphic design", "figma", "photoshop", "illustrator", "ux", "ui",
    ],
  },
  languages: {
    label: "Languages",
    keywords: [
      "آموزش زبان", "زبان انگلیسی", "انگلیسی", "آلمانی", "فرانسوی",
      "english", "german", "french", "ielts", "toefl", "translation",
    ],
  },
  science: {
    label: "Basic Sciences",
    keywords: [
      "ریاضی", "فیزیک", "شیمی", "زیست شناسی",
      "mathematics", "physics", "chemistry", "biology",
    ],
  },
  humanities: {
    label: "Humanities",
    keywords: [
      "روانشناسی", "روان شناسی", "فلسفه", "جامعه شناسی", "ادبیات",
      "psychology", "philosophy", "sociology", "literature",
    ],
  },
};

type LearningProvider = {
  id: string;
  name: string;
  faName: string;
  url: string;
  topics: readonly LearningTopic[];
};

const learningProviders: LearningProvider[] = [
  {
    id: "faradars",
    name: "Faradars",
    faName: "فرادرس",
    url: "https://faradars.org/",
    topics: topicIds,
  },
  {
    id: "maktabkhooneh",
    name: "Maktabkhooneh",
    faName: "مکتب‌خونه",
    url: "https://maktabkhooneh.org/",
    topics: topicIds,
  },
  {
    id: "quera",
    name: "Quera College",
    faName: "کوئرا کالج",
    url: "https://quera.org/college/",
    topics: ["software", "data"],
  },
  {
    id: "toplearn",
    name: "TopLearn",
    faName: "تاپ‌لرن",
    url: "https://toplearn.com/",
    topics: ["software", "design"],
  },
  {
    id: "sabzlearn",
    name: "Sabzlearn",
    faName: "سبزلرن",
    url: "https://sabzlearn.ir/",
    topics: ["software"],
  },
  {
    id: "roocket",
    name: "Roocket",
    faName: "راکت",
    url: "https://roocket.ir/",
    topics: ["software"],
  },
  {
    id: "7learn",
    name: "7Learn",
    faName: "سون‌لرن",
    url: "https://7learn.com/",
    topics: ["software", "data"],
  },
  {
    id: "sokanacademy",
    name: "Sokan Academy",
    faName: "سکان آکادمی",
    url: "https://sokanacademy.com/",
    topics: ["software"],
  },
  {
    id: "daneshjooyar",
    name: "Daneshjooyar",
    faName: "دانشجویار",
    url: "https://academy.daneshjooyar.com/public/department",
    topics: ["software", "data", "engineering"],
  },
  {
    id: "barnamenevisan",
    name: "Barnamenevisan",
    faName: "برنامه‌نویسان",
    url: "https://barnamenevisan.info/",
    topics: ["software"],
  },
  {
    id: "hamyarwp",
    name: "Hamyar WordPress",
    faName: "همیار وردپرس",
    url: "https://hamyarwp.com/",
    topics: ["software"],
  },
  {
    id: "motamem",
    name: "Motamem",
    faName: "متمم",
    url: "https://motamem.org/",
    topics: ["business"],
  },
  {
    id: "novin",
    name: "Novin Academy",
    faName: "آکادمی نوین",
    url: "https://www.novin.com/academy/",
    topics: ["business"],
  },
  {
    id: "modiresabz",
    name: "Modire Sabz",
    faName: "مدیرسبز",
    url: "https://modiresabz.com/",
    topics: ["business"],
  },
  {
    id: "websima",
    name: "Websima Academy",
    faName: "آکادمی وبسیما",
    url: "https://websima.academy/workshop/semrush/",
    topics: ["business"],
  },
  {
    id: "bamooz",
    name: "B-amooz",
    faName: "بیاموز",
    url: "https://b-amooz.com/",
    topics: ["languages"],
  },
  {
    id: "zabanshenas",
    name: "Zabanshenas",
    faName: "زبانشناس",
    url: "https://zabanshenas.com/",
    topics: ["languages"],
  },
  {
    id: "learnit",
    name: "Learnit",
    faName: "لرنیت",
    url: "https://learnit.ir/",
    topics: ["languages"],
  },
  {
    id: "mft",
    name: "Tehran Institute of Technology",
    faName: "مجتمع فنی تهران",
    url: "https://mftplus.com/",
    topics: ["software", "engineering", "business", "design", "languages"],
  },
  {
    id: "eseminar",
    name: "Eseminar",
    faName: "ایسمینار",
    url: "https://eseminar.tv/",
    topics: ["business"],
  },
];

function topicLabel(topic: LearningTopic) {
  return topics[topic].label;
}

function normalize(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N}+#]+/gu, " ")
    .trim();
}

function getLearningMatches(
  resume: Resume | null,
  interests: string,
  strengths: string,
) {
  const groups = [
    {
      label: "Education",
      weight: 4,
      values:
        resume?.educations.flatMap((item) => [
          item.field,
          item.degree,
          item.description,
        ]) ?? [],
    },
    { label: "Interests", weight: 4, values: [interests] },
    { label: "Strengths", weight: 3, values: [strengths] },
    {
      label: "Skills",
      weight: 3,
      values: resume?.skills.map((item) => item.name) ?? [],
    },
    {
      label: "Projects",
      weight: 2,
      values:
        resume?.projects.flatMap((item) => [
          item.name,
          item.description,
          ...item.technologies,
        ]) ?? [],
    },
    {
      label: "Experience",
      weight: 2,
      values:
        resume?.experiences.flatMap((item) => [
          item.position,
          item.description,
        ]) ?? [],
    },
    {
      label: "Career goals",
      weight: 2,
      values: resume
        ? [resume.targetJobTitle, resume.personal.jobTitle, resume.summary]
        : [],
    },
    {
      label: "Certificates",
      weight: 1,
      values: resume?.certifications.map((item) => item.name) ?? [],
    },
    {
      label: "Languages",
      weight: 1,
      values: resume?.languages.map((item) => item.name) ?? [],
    },
  ].map((group) => ({
    ...group,
    values: group.values.map((value) => ` ${normalize(value)} `),
  }));

  return topicIds
    .flatMap((id) => {
      const keywords = topics[id].keywords.map(
        (word) => ` ${normalize(word)} `,
      );

      const matchedGroups = groups.filter((group) =>
        group.values.some((value) =>
          keywords.some((word) => value.includes(word)),
        ),
      );

      if (!matchedGroups.length) return [];

      return [
        {
          id,
          label: topics[id].label,
          reasons: matchedGroups.map((group) => group.label),
          weight: matchedGroups.reduce((sum, group) => sum + group.weight, 0),
        },
      ];
    })
    .sort((a, b) => b.weight - a.weight);
}

const courseSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  title: z.string().trim().min(1),
  url: z.url(),
  access: z.enum(["free", "paid"]),
  topics: z.array(z.enum(topicIds)).min(1),
  verifiedAt: z.iso.datetime({ offset: true }),
});

const responseSchema = z.object({
  items: z.array(courseSchema),
});

type LearningCourse = z.infer<typeof courseSchema>;

const endpoint = import.meta.env.VITE_LEARNING_SEARCH_URL?.trim();
const learningApiEnabled = Boolean(endpoint);

async function searchLearningCourses(
  access: LearningAccess,
  selectedTopics: LearningTopic[],
  signal: AbortSignal,
): Promise<LearningCourse[]> {
  if (!endpoint) return [];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ access, topics: selectedTopics }),
    signal,
  });

  if (!response.ok) {
    throw new Error(`Learning search failed (${response.status}).`);
  }

  const { items } = responseSchema.parse(await response.json());
  const seen = new Set<string>();

  return items.filter((course) => {
    const provider = learningProviders.find(
      (item) => item.id === course.providerId,
    );

    if (!provider || course.access !== access || seen.has(course.id)) {
      return false;
    }

    if (!course.topics.some((topic) => selectedTopics.includes(topic))) {
      return false;
    }

    const url = new URL(course.url);
    const host = new URL(provider.url).hostname;

    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      (url.hostname !== host && !url.hostname.endsWith(`.${host}`))
    ) {
      return false;
    }

    seen.add(course.id);
    return true;
  });
}