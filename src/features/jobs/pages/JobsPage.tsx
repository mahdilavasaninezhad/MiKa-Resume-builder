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

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useAuthStore,
} from "../../auth/store/auth.store";

import {
  useResume,
  useResumes,
} from "../../resume/api/resume.queries";

import {
  useResumeEditorStore,
} from "../../resume/store/resume-editor.store";

import type {
  Resume,
  ResumeSkill,
} from "../../resume/types/resume.types";

import {
  notify,
} from "../../../shared/lib/notify";

type JobsTab =
  | "boards"
  | "matches";

type BoardFocus =
  | "general"
  | "tech"
  | "enterprise"
  | "public";

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
    jobsUrl:
      "https://jobinja.ir/jobs",
    icon:
      BriefcaseBusiness,
    tags: [
      "General",
      "Private companies",
      "Remote",
    ],
    focus: [
      "general",
      "tech",
    ],
    baseScore: 92,
  },

  {
    id: "jobvision",
    name: "JobVision",
    faName: "جاب‌ویژن",
    description:
      "Large job marketplace with detailed filters, career tools and broad city coverage.",
    jobsUrl:
      "https://jobvision.ir/jobs",
    icon:
      Target,
    tags: [
      "General",
      "Career tools",
      "Many cities",
    ],
    focus: [
      "general",
      "enterprise",
    ],
    baseScore: 91,
  },

  {
    id: "irantalent",
    name: "IranTalent",
    faName: "ایران‌تلنت",
    description:
      "A strong source for professional, specialist and enterprise-level opportunities.",
    jobsUrl:
      "https://www.irantalent.com/jobs",
    icon:
      Building2,
    tags: [
      "Professional",
      "Enterprise",
      "Specialists",
    ],
    focus: [
      "enterprise",
      "general",
    ],
    baseScore: 88,
  },

  {
    id: "quera",
    name: "Quera Jobs",
    faName: "کوئرا جابز",
    description:
      "Technology-focused opportunities for software, data, product and engineering talent.",
    jobsUrl:
      "https://quera.org/magnet/jobs",
    icon:
      Code2,
    tags: [
      "Technology",
      "Software",
      "Engineering",
    ],
    focus: [
      "tech",
    ],
    baseScore: 72,
  },

  {
    id: "karboom",
    name: "Karboom",
    faName: "کاربوم",
    description:
      "Job listings plus career and assessment tools for a wide range of Iranian roles.",
    jobsUrl:
      "https://karboom.io/jobs",
    icon:
      Radar,
    tags: [
      "General",
      "Career",
      "Assessments",
    ],
    focus: [
      "general",
      "enterprise",
    ],
    baseScore: 83,
  },

  {
    id: "iranestekhdam",
    name: "Iran Estekhdam",
    faName: "ایران استخدام",
    description:
      "Useful for private-sector listings as well as nationwide and public recruitment announcements.",
    jobsUrl:
      "https://iranestekhdam.ir/",
    icon:
      Globe2,
    tags: [
      "Public hiring",
      "General",
      "Nationwide",
    ],
    focus: [
      "public",
      "general",
    ],
    baseScore: 79,
  },
];

export function JobsPage() {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<JobsTab>(
      "boards",
    );

  const user =
    useAuthStore(
      (state) =>
        state.user,
    );

  const activeResumeId =
    useResumeEditorStore(
      (state) =>
        state.activeResumeId,
    );

  const resumesQuery =
    useResumes(
      user?.id ?? null,
    );

  const resumes =
    resumesQuery.data ?? [];

  const selectedResumeId =
    activeResumeId &&
    resumes.some(
      (resume) =>
        resume.id ===
        activeResumeId,
    )
      ? activeResumeId
      : resumes[0]?.id ??
        null;

  const resumeQuery =
    useResume(
      selectedResumeId,
    );

  const resume =
    resumeQuery.data ??
    resumes.find(
      (item) =>
        item.id ===
        selectedResumeId,
    ) ??
    null;

  const profile =
    useMemo(
      () =>
        resume
          ? buildResumeSearchProfile(
              resume,
            )
          : null,
      [resume],
    );

  const rankedBoards =
    useMemo(
      () =>
        profile
          ? rankBoards(
              jobBoards,
              profile,
            )
          : jobBoards.map(
              (board) => ({
                board,

                score:
                  board.baseScore,
              }),
            ),
      [profile],
    );

  async function copySearchPhrase() {
    if (!profile) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        profile.searchPhrase,
      );

      notify.success(
        "Search keywords copied.",
      );
    } catch {
      notify.error(
        "Could not copy search keywords.",
      );
    }
  }

  return (
    <div className="space-y-5">
      <section
        className="
          glass-panel-header
          rounded-[32px]
          p-5
        "
      >
        <div
          className="
            flex
            flex-col
            gap-15
            xl:flex-row
            xl:items-center
            xl:justify-evenly
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              text-center
            "
          >
            <div className="min-w-0">
              <div
                className="
                  flex
                  justify-between
                  flex-wrap
                  items-center
                  gap-2
                "
              >
                <p
                  className="
                    text-sm
                    font-medium
                    text-[var(--accent)]
                  "
                >
                  Career Hub
                </p>

                <div
                  className="
                    active-inset
                    flex
                    h-13
                    w-13
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    text-[var(--accent)]
                  "
                >
                  <BriefcaseBusiness
                    size={30}
                    strokeWidth={
                      1.8
                    }
                  />
                </div>

                <span
                  className="
                    rounded-full
                    active-inset
                    px-2
                    py-1
                    text-[9px]
                    font-semibold
                    text-[var(--text)]
                  "
                >
                  Resume-aware
                </span>
              </div>

              <h1
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-tight
                  md:text-3xl
                "
              >
                Find The Right
                Opportunity Faster
              </h1>

              <p
                className="
                  mt-2
                  max-w-3xl
                  text-sm
                  leading-5
                  text-[var(--muted)]
                "
              >
                Explore trusted
                Iranian job boards
                or use your current
                resume to build a
                focused job-search
                profile.
              </p>
            </div>
          </div>

          <div
            className="
              w-full
              shrink-0
              xl:w-[360px]
            "
          >
            <div
              className="
                neo-inset
                relative
                grid
                w-full
                grid-cols-2
                rounded-2xl
                p-1
              "
            >
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
                    activeTab ===
                    "matches"
                      ? "translate-x-full"
                      : "translate-x-0"
                  }
                `}
              />

              <TabButton
                active={
                  activeTab ===
                  "boards"
                }
                icon={Globe2}
                label="Job Boards"
                onClick={() =>
                  setActiveTab(
                    "boards",
                  )
                }
              />

              <TabButton
                active={
                  activeTab ===
                  "matches"
                }
                icon={Sparkles}
                label="Smart Matches"
                onClick={() =>
                  setActiveTab(
                    "matches",
                  )
                }
              />
            </div>

            <SmartMatchesIntro
              active={
                activeTab ===
                "matches"
              }
            />
          </div>
        </div>
      </section>

      {activeTab ===
      "boards" ? (
        <JobBoardsTab />
      ) : (
        <SmartMatchesTab
          loading={
            resumesQuery.isLoading ||
            resumeQuery.isLoading
          }
          resume={resume}
          profile={profile}
          rankedBoards={
            rankedBoards
          }
          onCopySearchPhrase={
            copySearchPhrase
          }
        />
      )}
    </div>
  );
}

function JobBoardsTab() {
  return (
    <section
      className="
        grid
        gap-9
        md:grid-cols-2
        xl:grid-cols-3
      "
    >
      {jobBoards.map(
        (board) => (
          <JobBoardCard
            key={
              board.id
            }
            board={
              board
            }
          />
        ),
      )}
    </section>
  );
}

function SmartMatchesTab({
  loading,
  resume,
  profile,
  rankedBoards,
  onCopySearchPhrase,
}: {
  loading: boolean;

  resume:
    Resume | null;

  profile:
    | ResumeSearchProfile
    | null;

  rankedBoards: {
    board: JobBoard;
    score: number;
  }[];

  onCopySearchPhrase:
    () => void;
}) {
  if (loading) {
    return (
      <div
        className="
          grid
          gap-4
          lg:grid-cols-[0.85fr_1.15fr]
        "
      >
        <div
          className="
            glass-panel
            h-[260px]
            animate-pulse
            rounded-[28px]
          "
        />

        <div
          className="
            glass-panel
            h-[260px]
            animate-pulse
            rounded-[28px]
          "
        />
      </div>
    );
  }

  if (
    !resume ||
    !profile
  ) {
    return (
      <section
        className="
          glass-panel
          flex
          min-h-[300px]
          flex-col
          items-center
          justify-center
          rounded-[32px]
          text-center
        "
      >
        <div
          className="
            neo-inset
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            text-[var(--accent)]
          "
        >
          <FileSearch2
            size={40}
            strokeWidth={
              1.6
            }
          />
        </div>

        <h2
          className="
            mt-7
            text-xl
            font-semibold
          "
        >
          Build your resume
          first
        </h2>

        <p
          className="
            m-7
            max-w-2xl
            text-sm
            leading-5
            text-[var(--muted)]
          "
        >
          Smart Matches uses
          your target role,
          skills, experience
          and location to
          prepare a focused
          job search.
        </p>

        <Link
          to="/resume"
          className="
            absolute
            -bottom-5
            shadow-button
            inline-flex
            h-10
            items-center
            gap-3
            rounded-xl
            px-6
            text-sm
            font-semibold
            text-[var(--text)]
            hover:text-[var(--accent)]
          "
        >
          Open Resume Builder

          <ArrowUpRight
            size={20}
            className="mt-0.5"
          />
        </Link>
      </section>
    );
  }

  const hasUsefulProfile =
    Boolean(
      profile.role,
    ) ||
    profile.keywords
      .length > 0;

  return (
    <div
      className="
        grid
        gap-6
        xl:grid-cols-[0.5fr_1fr]
        xl:items-start
      "
    >
      <div
        className="
          grid
          gap-3
        "
      >
        <section
          className="
            glass-panel
            rounded-[28px]
            py-3
            px-4
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
            "
          >
            <div
              className="
                shadow-button
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-[var(--accent)]
              "
            >
              <Target
                size={20}
              />
            </div>

            <div className="min-w-0 text-center">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[var(--muted)]
                "
              >
                Matching resume
              </p>

              <h2
                className="
                  mt-1
                  truncate
                  text-lg
                  font-semibold
                "
                title={
                  resume.title
                }
              >
                {
                  resume.title
                }
              </h2>
            </div>

            <div
              className="
                bg-[var(--accent-soft)]
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                text-[var(--accent)]
              "
            >
              {
                profile.strength
              }
              % Ready
            </div>
          </div>

          <div
            className="
              mt-0.5
              grid
            "
          >
            <InfoRow
              label="Target role"
              value={
                profile.role ||
                "Not specified"
              }
            />

            <InfoRow
              label="Location"
              value={
                profile.city ||
                "Any location"
              }
            />
          </div>

          <div className="mt-2 text-center flex flex-col items-center">
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[var(--muted)]
              "
            >
              Strongest signals
            </p>

            <div
              className="
                mt-1
                flex
                flex-wrap
                gap-2
              "
            >
              {profile
                .keywords
                .length > 0 ? (
                profile
                  .keywords
                  .map(
                    (
                      keyword,
                    ) => (
                      <span
                        key={
                          keyword
                        }
                        className="
                          active-inset
                          rounded-full
                          px-2
                          py-0.5
                          text-[10px]
                          font-medium
                        "
                      >
                        {
                          keyword
                        }
                      </span>
                    ),
                  )
              ) : (
                <span
                  className="
                    text-xs
                    text-[var(--text)]
                  "
                >
                  Add a{" "}
                  <span className="text-[var(--success)]">
                    Target Title
                  </span>{" "}
                  or{" "}
                  <span className="text-[var(--success)]">
                    Skills{" "}
                  </span>
                  to improve
                  matching.
                </span>
              )}
            </div>
          </div>
        </section>

        <section
          className="
            glass-panel
            rounded-[28px]
            px-4
            pt-2
            pb-3
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-5
            "
          >
            <div
              className="
                shadow-button
                flex
                h-9.5
                w-9.5
                items-center
                justify-center
                rounded-xl
                text-[var(--accent)]
              "
            >
              <Search
                size={20}
              />
            </div>

            <div>
              <h3
                className="
                  text-sm
                  font-semibold
                  text-center
                "
              >
                Resume Search
                Profile
              </h3>

              <p
                className="
                  mt-0.5
                  text-[11px]
                  text-[var(--muted)]
                "
              >
                Generated from
                your current
                resume
              </p>
            </div>

            <button
              type="button"
              onClick={
                onCopySearchPhrase
              }
              disabled={
                !profile.searchPhrase
              }
              className="
                absolute
                -bottom-3.5
                right-7
                neo-button
                flex
                h-7
                shrink-0
                items-center
                gap-1.5
                rounded-lg
                px-2
                !text-[12px]
                font-medium
                !text-[var(--muted)]
                transition
                hover:!text-[var(--text)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <Copy
                size={12}
              />

              Copy
            </button>
          </div>

          <div
            className="
              neo-inset
              mt-2
              min-h-[40px]
              leading-4
              rounded-2xl
              px-3
              py-2
            "
          >
            {profile.searchPhrase ? (
              <p
                className="
                  break-words
                  text-xs
                  font-medium
                "
              >
                {
                  profile.searchPhrase
                }
              </p>
            ) : (
              <p
                className="
                  text-sm
                  text-[var(--muted)]
                "
              >
                Your resume needs
                a target title or
                at least one skill
                before Pulse can
                build a focused
                search phrase.
              </p>
            )}
          </div>

          <div
            className="
              mt-2
              flex
              items-start
              gap-1
            "
          >
            <CheckCircle2
              size={13}
              className="
                shrink-0
                text-[var(--success)]
              "
            />

            <p
              className="
                text-[10px]
                leading-3.5
                text-[var(--muted)]
              "
            >
              Pulse does not
              fabricate job ads.
              These recommendations
              open official job
              sources with a
              resume-derived search
              strategy. Individual
              live job cards should
              come from a backend
              connector/API.
            </p>
          </div>
        </section>
      </div>

      {hasUsefulProfile ? (
        <section>
          <div
            className="
              grid
              gap-4
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {rankedBoards.map(
              ({
                board,
                score,
              }) => (
                <MatchSourceCard
                  key={
                    board.id
                  }
                  board={
                    board
                  }
                  score={
                    score
                  }
                  profile={
                    profile
                  }
                />
              ),
            )}
          </div>
        </section>
      ) : (
        <section
          className="
            mt-20
            glass-panel
            rounded-[28px]
            p-15
            text-center
          "
        >
          <h3 className="font-semibold">
            Add More Resume
            Signals
          </h3>

          <p
            className="
              mx-auto
              mt-8
              max-w-xl
              text-sm
              leading-6
              text-[var(--muted)]
            "
          >
            Add a target job title
            or a few skills in
            Resume Builder. Pulse
            will then rank the job
            sources around your
            actual profile.
          </p>

          <Link
            to="/resume"
            className="
              absolute
              -bottom-4.5
              left-1/2
              -translate-x-1/2
              shadow-button
              mt-5
              inline-flex
              h-9
              items-center
              gap-2
              rounded-xl
              px-4
              text-xs
              font-semibold
              hover:text-[var(--accent)]
            "
          >
            Improve Resume

            <ArrowUpRight
              size={14}
            />
          </Link>
        </section>
      )}
    </div>
  );
}

function JobBoardCard({
  board,
}: {
  board: JobBoard;
}) {
  const Icon =
    board.icon;

  return (
    <article
      className="
        relative
        neo-surface
        flex
        min-h-[160px]
        flex-col
        rounded-[28px]
        p-3
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            min-w-0
            w-full
            items-center
            justify-center
            text-center
            gap-10
          "
        >
          <div
            className="
              shadow-button
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              !text-[var(--accent)]
            "
          >
            <Icon
              size={18}
              strokeWidth={
                1.8
              }
            />
          </div>

          <div className="min-w-0">
            <h2
              className="
                truncate
                text-base
                font-semibold
              "
            >
              {
                board.name
              }
            </h2>

            <p
              className="
                mt-0.5
                text-[10px]
                text-[var(--text)]
              "
              dir="rtl"
            >
              {
                board.faName
              }
            </p>
          </div>
        </div>

        <ArrowUpRight
          size={18}
          className="
            shrink-0
            text-[var(--muted)]
          "
        />
      </div>

      <p
        className="
          mt-3.5
          text-[11px]
          leading-4
          text-center
          text-[var(--muted)]
        "
      >
        {
          board.description
        }
      </p>

      <div
        className="
          mt-3
          flex
          flex-wrap
          gap-2
          justify-center
        "
      >
        {board.tags.map(
          (tag) => (
            <span
              key={
                tag
              }
              className="
                rounded-full
                active-inset
                px-1.5
                py-0.5
                text-[9px]
                font-medium
                text-[var(--text)]
              "
            >
              {tag}
            </span>
          ),
        )}
      </div>

      <a
        href={
          board.jobsUrl
        }
        target="_blank"
        rel="noreferrer"
        className="
          absolute
          -bottom-3.5
          left-1/2
          -translate-x-1/2
          max-w-[150px]
          shadow-button
          flex
          h-7
          items-center
          justify-center
          gap-4
          rounded-xl
          px-4
          text-xs
          font-semibold
          !bg-[var(--accent)]
          text-[var(--bg)]
          transition
          hover:!bg-[var(--bg)]
          hover:!text-[var(--accent)]
        "
      >
        Browse jobs

        <ExternalLink
          size={14}
        />
      </a>
    </article>
  );
}

function MatchSourceCard({
  board,
  score,
  profile,
}: {
  board:
    JobBoard;

  score:
    number;

  profile:
    ResumeSearchProfile;
}) {
  const Icon =
    board.icon;

  return (
    <article
      className="
        glass-panel
        flex
        flex-col
        rounded-[20px]
        px-2
        pb-4
        pt-2
        mb-2
      "
    >
        <div
          className="
            flex
            min-w-0
            items-center
            justify-between
            gap-2
          "
        >
          <div
            className="
              shadow-button
              flex
              h-6
              w-6
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[var(--accent)]
            "
          >
            <Icon
              size={13}
            />
          </div>

          <div className="min-w-0">
            <h3
              className="
                truncate
                text-[11px]
                font-semibold
              "
            >
              {
                board.name
              }
            </h3>
          </div>
          <span
          className="
            text-center
            rounded-full
            px-2
            py-1
            text-[8px]
            font-semibold
            text-[var(--accent)]
            bg-[var(--accent-soft)]
          "
        >
          {score}% Fit
        </span>
        </div>

      <div
        className="
          active-inset
          mt-1.5
          rounded-xl
          px-2.5
          py-1.5
        "
      >
        <p
          className="
            flex
            justify-center
            gap-1
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.12em]
            text-[var(--muted)]
          "
        >
          <Search
              size={11}
              className="text-[var(--accent)]"
            />
          Search for
        </p>

        <p
          className="
            line-clamp-2
            text-[9px]
            font-medium
            leading-3
            overflow-y-auto
          "
        >
          {
            profile.searchPhrase
          }
        </p>
      </div>

      <a
        href={
          board.jobsUrl
        }
        target="_blank"
        rel="noreferrer"
        className="
          absolute
          -bottom-3
          left-1/2
          -translate-x-1/2
          shadow-button
          flex
          h-6
          items-center
          justify-center
          gap-1.5
          rounded-xl
          px-2
          text-[10px]
          font-semibold
          transition
          !text-[var(--bg)]
          hover:!text-[var(--accent)]
          !bg-[var(--accent)]
          hover:!bg-[var(--bg)]
        "
      >
        Open Official Jobs

        <ExternalLink
          size={13}
        />
      </a>
    </article>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-dashed
        border-[var(--border)]
        py-2
      "
    >
      <span
        className="
          text-[10px]
          font-medium
          text-[var(--muted)]
        "
      >
        {label}
      </span>

      <span
        className="
          min-w-0
          truncate
          text-right
          text-xs
          font-semibold
        "
        title={
          value
        }
      >
        {value}
      </span>
    </div>
  );
}

function SmartMatchesIntro({
  active,
}: {
  active: boolean;
}) {
  const words = [
    "Best",
    "Source",
    "For",
    "This",
    "Resume",
  ];

  const [
    visibleWords,
    setVisibleWords,
  ] = useState(0);

  const [
    showSubtitle,
    setShowSubtitle,
  ] = useState(false);

  useEffect(() => {
    if (!active) {
      setVisibleWords(0);
      setShowSubtitle(false);

      return;
    }

    setVisibleWords(0);
    setShowSubtitle(false);

    let currentWord = 0;

    let subtitleTimer:
      number | undefined;

    const wordTimer =
      window.setInterval(
        () => {
          currentWord += 1;

          setVisibleWords(
            currentWord,
          );

          if (
            currentWord >=
            words.length
          ) {
            window.clearInterval(
              wordTimer,
            );

            subtitleTimer =
              window.setTimeout(
                () => {
                  setShowSubtitle(
                    true,
                  );
                },
                450,
              );
          }
        },
        220,
      );

    return () => {
      window.clearInterval(
        wordTimer,
      );

      if (
        subtitleTimer !==
        undefined
      ) {
        window.clearTimeout(
          subtitleTimer,
        );
      }
    };
  }, [active]);

  return (
    <div
      className={`
        grid
        transition-all
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]

        ${
          active
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }
      `}
    >
      <div className="overflow-hidden">
        <div
          className="
            pt-6
            text-center
          "
        >
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            {words.map(
              (
                word,
                index,
              ) => (
                <span
                  key={
                    word
                  }
                  className={`
                    inline-block
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    ${
                      index <
                      visibleWords
                        ? "translate-y-0 opacity-100 blur-0"
                        : "translate-y-1 opacity-0 blur-[2px]"
                    }
                  `}
                >
                  {word}

                  {index <
                    words.length -
                      1 &&
                    "\u00A0"}
                </span>
              ),
            )}
          </h2>

          <p
            className={`
              mt-1
              text-xs
              text-[var(--muted)]
              transition-all
              duration-1000
              ease-out

              ${
                showSubtitle
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }
            `}
          >
            Ranked by the role and
            skill signals found in
            your resume
          </p>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active:
    boolean;

  icon:
    LucideIcon;

  label:
    string;

  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        relative
        z-10
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        transition-colors
        duration-300
        hover:text-[var(--text)]

        ${
          active
            ? "font-semibold text-[var(--text)]"
            : "text-[var(--muted)]"
        }
      `}
    >
      <Icon
        size={16}
        strokeWidth={
          1.8
        }
        className={`
        ${
          active
            ? "text-[var(--accent)]"
            : "text-[var(--muted)]"
        }
      `}
      />

      {label}
    </button>
  );
}

function buildResumeSearchProfile(
  resume:
    Resume,
): ResumeSearchProfile {
  const sortedExperiences =
    [
      ...resume.experiences,
    ].sort(
      (a, b) =>
        a.order -
        b.order,
    );

  const role =
    firstFilled(
      resume.targetJobTitle,

      resume.personal
        .jobTitle,

      sortedExperiences[0]
        ?.position ?? "",

      resume.title ===
        "Untitled Resume"
        ? ""
        : resume.title,
    );

  const skills =
    [
      ...resume.skills,
    ].sort(
      (a, b) =>
        getSkillWeight(
          b,
        ) -
        getSkillWeight(
          a,
        ),
    );

  const skillNames =
    skills.map(
      (skill) =>
        skill.name.trim(),
    );

  const technologies =
    resume.projects.flatMap(
      (project) =>
        project.technologies.map(
          (technology) =>
            technology.trim(),
        ),
    );

  const experienceRoles =
    sortedExperiences.map(
      (experience) =>
        experience.position.trim(),
    );

  const keywords =
    uniqueValues([
      ...skillNames,
      ...technologies,
      ...experienceRoles,
    ])
      .filter(Boolean)
      .filter(
        (value) =>
          value.toLocaleLowerCase() !==
          role.toLocaleLowerCase(),
      )
      .slice(
        0,
        6,
      );

  const searchPhrase =
    uniqueValues([
      role,

      ...keywords.slice(
        0,
        4,
      ),

      resume.personal.city,
    ])
      .filter(Boolean)
      .join(" · ");

  const techHaystack =
    [
      role,

      resume.summary,

      ...skillNames,

      ...technologies,

      ...experienceRoles,
    ]
      .join(" ")
      .toLocaleLowerCase();

  const isTech =
    techTerms.some(
      (term) =>
        techHaystack.includes(
          term,
        ),
    );

  const strength =
    Math.min(
      100,

      25 +
        (role
          ? 30
          : 0) +
        (skillNames.length >
        0
          ? 25
          : 0) +
        (resume.experiences
          .length > 0
          ? 10
          : 0) +
        (resume.personal.city
          ? 10
          : 0),
    );

  return {
    role,

    city:
      resume.personal.city,

    keywords,

    searchPhrase,

    isTech,

    strength,
  };
}

function rankBoards(
  boards:
    JobBoard[],

  profile:
    ResumeSearchProfile,
) {
  return boards
    .map(
      (board) => {
        let score =
          board.baseScore;

        if (
          profile.isTech &&
          board.focus.includes(
            "tech",
          )
        ) {
          score += 16;
        }

        if (
          !profile.isTech &&
          board.focus.includes(
            "general",
          )
        ) {
          score += 5;
        }

        if (
          profile.keywords
            .length >= 4 &&
          board.focus.includes(
            "enterprise",
          )
        ) {
          score += 4;
        }

        return {
          board,

          score:
            Math.min(
              99,
              score,
            ),
        };
      },
    )
    .sort(
      (a, b) =>
        b.score -
        a.score,
    );
}

function getSkillWeight(
  skill:
    ResumeSkill,
) {
  switch (
    skill.level
  ) {
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

function firstFilled(
  ...values:
    string[]
) {
  return (
    values.find(
      (value) =>
        value.trim()
          .length > 0,
    )?.trim() ?? ""
  );
}

function uniqueValues(
  values:
    string[],
) {
  const seen =
    new Set<string>();

  return values.filter(
    (value) => {
      const clean =
        value.trim();

      if (!clean) {
        return false;
      }

      const key =
        clean.toLocaleLowerCase();

      if (
        seen.has(
          key,
        )
      ) {
        return false;
      }

      seen.add(
        key,
      );

      return true;
    },
  );
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