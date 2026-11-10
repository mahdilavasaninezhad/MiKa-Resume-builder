import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Crown,
  Database,
  Info,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Timer,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  clearAssessmentCache,
  loadAssessment,
} from "../api/assessment.repository";
import { assessmentCatalog } from "../data/assessment.catalog";
import { buildAssessmentResult } from "../utils/assessment-scoring";
import type {
  AssessmentAnswers,
  AssessmentCatalogItem,
  AssessmentMetric,
  AssessmentResult,
  AssessmentTier,
  LoadedAssessment,
} from "../types/assessment.types";

export function AssessmentsPage() {
  const [activeTab, setActiveTab] = useState<AssessmentTier>("free");
  const [activeDefinition, setActiveDefinition] =
    useState<AssessmentCatalogItem | null>(null);
  const [loadedAssessment, setLoadedAssessment] =
    useState<LoadedAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const visibleAssessments = useMemo(
    () =>
      assessmentCatalog.filter(
        (assessment) => assessment.tier === activeTab,
      ),
    [activeTab],
  );

  async function startAssessment(definition: AssessmentCatalogItem) {
    setActiveDefinition(definition);
    setLoadedAssessment(null);
    setLoadError("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
    setLoading(true);

    try {
      const loaded = await loadAssessment(definition);
      setLoadedAssessment(loaded);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Could not load this assessment.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function retryAssessment() {
    if (!activeDefinition) {
      return;
    }

    clearAssessmentCache(activeDefinition.id);
    await startAssessment(activeDefinition);
  }

  function closeAssessment() {
    setActiveDefinition(null);
    setLoadedAssessment(null);
    setLoadError("");
    setLoading(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  }

  function restartAssessment() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResult(null);
  }

  if (activeDefinition) {
    if (loading) {
      return (
        <AssessmentLoadingState
          definition={activeDefinition}
          onClose={closeAssessment}
        />
      );
    }

    if (loadError || !loadedAssessment) {
      return (
        <AssessmentErrorState
          definition={activeDefinition}
          message={loadError || "Could not load this assessment."}
          onClose={closeAssessment}
          onRetry={retryAssessment}
        />
      );
    }

    return (
      <AssessmentRunner
        assessment={loadedAssessment}
        answers={answers}
        currentQuestionIndex={currentQuestionIndex}
        result={result}
        onAnswer={(questionId, value) =>
          setAnswers((current) => ({
            ...current,
            [questionId]: value,
          }))
        }
        onBack={() =>
          setCurrentQuestionIndex((current) => Math.max(0, current - 1))
        }
        onNext={() =>
          setCurrentQuestionIndex((current) =>
            Math.min(
              loadedAssessment.instrument.questions.length - 1,
              current + 1,
            ),
          )
        }
        onFinish={() =>
          setResult(buildAssessmentResult(loadedAssessment, answers))
        }
        onClose={closeAssessment}
        onRestart={restartAssessment}
      />
    );
  }

  return (
    <div className="space-y-5">
      <section className="glass-panel-header rounded-[32px] p-5 md:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="active-inset flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[var(--accent)]">
              <Database size={28} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-[var(--accent)]">
                  Assessment Lab
                </p>

                <span className="active-inset rounded-full px-2.5 py-1 text-[9px] font-semibold">
                  Self-hosted instruments
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Evidence-aware assessments
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-5 text-[var(--muted)]">
                Personality, career-interest, emotional and reasoning
                assessments run entirely inside Pulse. Open instruments
                keep their original scoring, source and license metadata.
              </p>
            </div>
          </div>

          <div className="w-full shrink-0 xl:w-[360px]">
            <div className="neo-inset relative grid w-full grid-cols-2 rounded-2xl p-1">
              <div
                className={`
                  absolute bottom-1.5 left-1.5 top-1.5
                  w-[calc(50%-5px)] rounded-xl bg-[var(--bg)]
                  shadow-[2px_2px_3px_var(--shadow-dark),-2px_-2px_3px_var(--shadow-light)]
                  transition-transform duration-700
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${
                    activeTab === "premium"
                      ? "translate-x-full"
                      : "translate-x-0"
                  }
                `}
              />

              <AssessmentTabButton
                active={activeTab === "free"}
                icon={Sparkles}
                label="Free"
                onClick={() => setActiveTab("free")}
              />

              <AssessmentTabButton
                active={activeTab === "premium"}
                icon={Crown}
                label="Premium"
                onClick={() => setActiveTab("premium")}
              />
            </div>

            {activeTab === "premium" && (
              <p className="mt-2 text-center text-[9px] leading-4 text-[var(--muted)]">
                Premium currently controls Pulse feature access. It does
                not change the license of an underlying open instrument.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {visibleAssessments.map((assessment) => (
          <AssessmentCard
            key={assessment.id}
            assessment={assessment}
            onStart={() => startAssessment(assessment)}
          />
        ))}
      </section>

      <section className="glass-panel-header flex flex-col gap-3 rounded-2xl px-4 py-3 md:flex-row md:items-center md:justify-center">
          
          <div>
            <p className="mb-3 flex gap-3 items-center justify-center text-xs font-semibold text-center">
                <ShieldCheck
            size={18}
            className=" shrink-0 text-[var(--success)]"
          />
              Results are signals, not verdicts.
              
            </p>

            <p className="mt-1 max-w-5xl text-[10px] leading-4 text-[var(--muted)]">
              Open scales retain their published scoring. Pulse-original
              cognitive, 16-type and DISC-style exercises are explicitly
              exploratory and are never presented as standardized IQ,
              MBTI®, Raven® or Everything DiSC® results.
            </p>
          </div>
      </section>
    </div>
  );
}

type WordField = {
  text: string;
  start: number;
};

type CardView = "front" | "details";
type WordPhase = "idle" | "erase" | "write";

function createWordSequence(texts: string[]) {
  let total = 0;

  const fields = texts.map((text) => {
    const field = { text, start: total };
    total += (text.match(/\S+/g) ?? []).length;
    return field;
  });

  return { fields, total };
}

function WordText({
  field,
  visibleWords,
}: {
  field: WordField;
  visibleWords: number;
}) {
  const words = field.text.match(/\S+\s*/g) ?? [];

  return (
    <span>
      <span className="sr-only">{field.text}</span>

      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={index}
            className="transition-opacity duration-100 motion-reduce:transition-none"
            style={{
              opacity: field.start + index < visibleWords ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </span>
  );
}

function AssessmentCard({
  assessment,
  onStart,
}: {
  assessment: AssessmentCatalogItem;
  onStart: () => void;
}) {
  return assessment.tier === "premium" ? (
    <PremiumAssessmentCard assessment={assessment} onStart={onStart} />
  ) : (
    <FreeAssessmentCard assessment={assessment} onStart={onStart} />
  );
}

function PremiumAssessmentCard({
  assessment,
  onStart,
}: {
  assessment: AssessmentCatalogItem;
  onStart: () => void;
}) {
  const sequence = useMemo(
    () => ({
      front: createWordSequence([
        "Premium",
        assessment.licenseLabel,
        assessment.title,
      ]),
      details: createWordSequence([
        assessment.eyebrow,
        assessment.description,
        ...assessment.tags,
        "Duration",
        assessment.duration,
        "Questions",
        assessment.itemCountLabel,
        `Source · ${assessment.sourceLabel}`,
      ]),
    }),
    [assessment],
  );

  const [view, setView] = useState<CardView>("front");
  const [phase, setPhase] = useState<WordPhase>("idle");
  const [visibleWords, setVisibleWords] = useState(sequence.front.total);

  const busy = phase !== "idle";
  const Icon = assessment.icon;
  const detailsId = `assessment-details-${assessment.id}`;
  const metaStart = 2 + assessment.tags.length;
  const totalWords = sequence[view].total;

  useEffect(() => {
    if (phase === "idle") {
      return;
    }

    if (phase === "erase") {
      const timer = window.setTimeout(
        () => {
          if (visibleWords > 0) {
            setVisibleWords(visibleWords - 1);
          } else {
            setView(view === "front" ? "details" : "front");
            setPhase("write");
          }
        },
        visibleWords > 0 ? 45 : 180,
      );

      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      if (visibleWords < totalWords) {
        setVisibleWords(visibleWords + 1);
      } else {
        setPhase("idle");
      }
    }, 65);

    return () => window.clearTimeout(timer);
  }, [phase, view, visibleWords, totalWords]);

  function toggleDetails() {
    if (!busy) {
      setPhase("erase");
    }
  }

  function renderWord(field: WordField) {
    return <WordText field={field} visibleWords={visibleWords} />;
  }

  return (
    <article
      className="neo-surface relative flex min-w-0 flex-col rounded-[28px] p-3 mb-4"
      aria-label={assessment.title}
      aria-busy={busy}
      onKeyDown={(event) => {
        if (event.key === "Escape" && view === "details" && !busy) {
          event.preventDefault();
          toggleDetails();
        }
      }}
    >
      <div className="grid min-w-0 flex-1">
        <div
          aria-hidden={view !== "front"}
          inert={view !== "front"}
          className={`py-2 
            col-start-1 row-start-1 flex items-center justify-center min-h-[190px] min-w-0 flex-col
            ${view !== "front" ? "invisible pointer-events-none" : ""}
          `}
        >
          <div className="flex w-full items-center justify-between">
            <span className="rounded-full bg-[var(--warning-soft)] px-2.5 py-1 text-[9px] font-semibold text-[var(--warning)]">
              {renderWord(sequence.front.fields[0])}
            </span>

            <span className="active-inset min-w-0 max-w-full justify-self-end break-words rounded-full px-2.5 py-1 text-center text-[9px] font-semibold text-[var(--muted)]">
              {renderWord(sequence.front.fields[1])}
            </span>
          </div>

          <div className="m-6.5 shadow-button flex h-15 w-15 shrink-0 items-center justify-center rounded-xl text-[var(--warning)]">
              <Icon size={35} strokeWidth={1.5} />
            </div>

          <div className="flex items-center justify-center">
            <h2 className="break-words text-center text-[12px] text-base font-semibold">
              {renderWord(sequence.front.fields[2])}
            </h2>
          </div>
        </div>

        <div
          id={detailsId}
          role="region"
          aria-label={`${assessment.title} details`}
          aria-hidden={view !== "details"}
          inert={view !== "details"}
          className={`py-2 text-center 
            col-start-1 row-start-1 flex min-h-[190px] min-w-0 flex-col
            ${view !== "details" ? "invisible pointer-events-none" : ""}
          `}
        >
          <p className="break-words text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--warning)]">
            {renderWord(sequence.details.fields[0])}
          </p>

          <p className="mt-1.5 break-words text-[9px] tracking-[0.015em] leading-3.5 text-[var(--muted)]">
            {renderWord(sequence.details.fields[1])}
          </p>

          <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
            {assessment.tags.map((tag, index) => (
              <span
                key={tag}
                className="mb-2 active-inset max-w-full break-words rounded-full px-2 py-1 text-[8px] tracking-[0.03em] text-[var(--warning)] font-medium"
              >
                {renderWord(sequence.details.fields[2 + index])}
              </span>
            ))}
          </div>

          <div className="mt-auto">
            <div className="active-inset grid grid-cols-2 gap-3 rounded-2xl px-3 py-2.5">
              <div className="min-w-0">
                <p className="flex items-center justify-center gap-1 text-[8px] uppercase tracking-wider text-[var(--muted)]">
                  <Timer size={10} className="mb-0.5"/>
                  {renderWord(sequence.details.fields[metaStart])}
                </p>

                <p className="mt-1 break-words text-[10px] font-semibold">
                  {renderWord(sequence.details.fields[metaStart + 1])}
                </p>
              </div>

              <div className="min-w-0 border-l border-[var(--border)] pl-2">
                <p className="text-[8px] uppercase tracking-wider text-[var(--muted)]">
                  {renderWord(sequence.details.fields[metaStart + 2])}
                </p>

                <p className="mt-1 break-words text-[10px] font-semibold">
                  {renderWord(sequence.details.fields[metaStart + 3])}
                </p>
              </div>
            </div>

            <p className="mt-1 break-words text-[9px] leading-4 text-[var(--muted)]">
              {renderWord(sequence.details.fields[metaStart + 4])}
            </p>
          </div>
        </div>
      </div>

      <div className="flex absolute -bottom-4 left-1/2 -translate-x-1/2 gap-4 md:gap-2">
        <button
          type="button"
          onClick={toggleDetails}
          disabled={busy}
          aria-label={
            view === "front"
              ? `Show details for ${assessment.title}`
              : `Close details for ${assessment.title}`
          }
          aria-expanded={view === "details"}
          aria-controls={detailsId}
          title={view === "front" ? "Show details" : "Close details"}
          className="shadow-button flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl text-[var(--muted)] hover:text-[var(--warning)] transition-colors disabled:cursor-wait"
        >
          {view === "front" ? (
            <Info size={21} />
          ) : (
            <X size={21} />
          )}
        </button>
        <button
          type="button"
          onClick={onStart}
          className="shadow-button flex min-h-8 min-w-35 flex-1 items-center justify-center gap-2 rounded-xl !text-[12px] font-semibold transition-colors !bg-[var(--warning)] !text-[var(--bg)] hover:!bg-[var(--bg)] hover:!text-[var(--warning)]"
        >
          Start Assessment
          <ArrowRight size={14} className="shrink-0 mt-0.5" />
        </button>
      </div>
    </article>
  );
}

function FreeAssessmentCard({
  assessment,
  onStart,
}: {
  assessment: AssessmentCatalogItem;
  onStart: () => void;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const frontButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocus = useRef(false);

  const Icon = assessment.icon;
  const detailsId = `assessment-details-${assessment.id}`;

  useEffect(() => {
    if (!shouldMoveFocus.current) {
      return;
    }

    shouldMoveFocus.current = false;

    const button = isFlipped
      ? backButtonRef.current
      : frontButtonRef.current;

    button?.focus({ preventScroll: true });
  }, [isFlipped]);

  function flipCard() {
    shouldMoveFocus.current = true;
    setIsFlipped((current) => !current);
  }

  const faceStyle = {
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  } as const;

  return (
    <article
      className="relative min-w-0"
      aria-label={assessment.title}
      style={{ perspective: "1200px" }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isFlipped) {
          event.preventDefault();
          flipCard();
        }
      }}
    >
      <div
        className="
          relative grid min-w-0
          transition-transform duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          motion-reduce:transition-none
        "
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped
            ? "rotateY(180deg)"
            : "rotateY(0deg)",
        }}
      >
        <div
          aria-hidden={isFlipped}
          inert={isFlipped}
          className="neo-surface relative col-start-1 row-start-1 flex min-h-[230px] min-w-0 flex-col rounded-[28px] p-4"
          style={faceStyle}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
            <span className="justify-self-start rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[9px] font-semibold text-[var(--accent)]">
              Free
            </span>

            <div className="shadow-button flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--accent)]">
              <Icon size={25} strokeWidth={1.5} />
            </div>

            <span className="active-inset min-w-0 max-w-full justify-self-end break-words rounded-full px-2.5 py-1 text-center text-[9px] font-semibold text-[var(--muted)]">
              {assessment.licenseLabel}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center py-6">
            <h2 className="break-words text-center text-base font-semibold">
              {assessment.title}
            </h2>
          </div>

          <div className="mt-auto flex items-center gap-2">
            <button
              type="button"
              onClick={onStart}
              className="shadow-button flex min-h-9 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold transition-colors hover:!text-[var(--accent)]"
            >
              Start Assessment
              <ArrowRight size={14} className="shrink-0" />
            </button>

            <button
              ref={frontButtonRef}
              type="button"
              onClick={flipCard}
              aria-label={`Show details for ${assessment.title}`}
              aria-expanded={isFlipped}
              aria-controls={detailsId}
              title="Show details"
              className="shadow-button flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted)] transition-colors hover:!text-[var(--accent)]"
            >
              <RefreshCw size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div
          id={detailsId}
          role="region"
          aria-label={`${assessment.title} details`}
          aria-hidden={!isFlipped}
          inert={!isFlipped}
          className="neo-surface relative col-start-1 row-start-1 flex min-h-[230px] min-w-0 flex-col rounded-[28px] p-4"
          style={{
            ...faceStyle,
            transform: "rotateY(180deg)",
          }}
        >
          <p className="break-words text-center text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
            {assessment.eyebrow}
          </p>

          <p className="mt-3 break-words text-center text-[11px] leading-5 text-[var(--muted)]">
            {assessment.description}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {assessment.tags.map((tag) => (
              <span
                key={tag}
                className="active-inset max-w-full break-words rounded-full px-2 py-0.5 text-[9px] font-medium tracking-[0.05em]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <Timer size={12} className="shrink-0" />
                {assessment.duration}
              </span>

              <span>{assessment.itemCountLabel}</span>
            </div>

            <p className="mt-2 break-words text-[9px] leading-4 text-[var(--muted)]">
              Source · {assessment.sourceLabel}
            </p>

            <button
              ref={backButtonRef}
              type="button"
              onClick={flipCard}
              aria-label={`Return to ${assessment.title}`}
              className="shadow-button mt-4 flex min-h-9 w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold transition-colors hover:!text-[var(--accent)]"
            >
              <ArrowLeft size={14} />
              Back to assessment
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AssessmentRunner({
  assessment,
  answers,
  currentQuestionIndex,
  result,
  onAnswer,
  onBack,
  onNext,
  onFinish,
  onClose,
  onRestart,
}: {
  assessment: LoadedAssessment;
  answers: AssessmentAnswers;
  currentQuestionIndex: number;
  result: AssessmentResult | null;
  onAnswer: (questionId: string, value: number) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onClose: () => void;
  onRestart: () => void;
}) {
  if (result) {
    return (
      <AssessmentResultView
        assessment={assessment}
        result={result}
        onClose={onClose}
        onRestart={onRestart}
      />
    );
  }

  const question =
    assessment.instrument.questions[currentQuestionIndex];
  const selectedAnswer = answers[question.id];
  const answeredCount = Object.keys(answers).length;

  const progress = Math.round(
    (answeredCount / assessment.instrument.questions.length) * 100,
  );

  const isLastQuestion =
    currentQuestionIndex === assessment.instrument.questions.length - 1;

  const canContinue = selectedAnswer !== undefined;
  const Icon = assessment.definition.icon;

  const compactOptions = question.options.every(
    (option) => option.label.length <= 28,
  );

  const optionGridClass =
    compactOptions && question.options.length >= 5
      ? "sm:grid-cols-2 lg:grid-cols-5"
      : compactOptions && question.options.length === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-2";

  return (
    <div className="space-y-5">
      <section className="glass-panel-header rounded-[32px] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back to assessments"
              className="shadow-button flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--muted)] transition hover:!text-[var(--text)]"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="active-inset flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[var(--accent)]">
              <Icon size={21} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                {assessment.instrument.source.sourceName}
              </p>

              <h1 className="mt-0.5 truncate text-xl font-semibold">
                {assessment.definition.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="active-inset rounded-full px-3 py-1.5 text-[10px] font-semibold">
              Question {currentQuestionIndex + 1} /{" "}
              {assessment.instrument.questions.length}
            </span>

            <span className="text-xs font-semibold text-[var(--accent)]">
              {progress}%
            </span>
          </div>
        </div>

        <div className="neo-inset mt-4 h-2 overflow-hidden rounded-full">
          <div
            className="
              h-full rounded-full bg-[var(--accent)]
              transition-[width] duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
            "
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="glass-panel mx-auto w-full max-w-5xl rounded-[32px] p-5 md:p-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Choose the answer that fits best
          </p>

          <h2 className="mt-4 text-xl font-semibold leading-8 md:text-2xl">
            {question.prompt}
          </h2>

          {assessment.instrument.instruction &&
            currentQuestionIndex === 0 && (
              <p className="mx-auto mt-3 max-w-2xl text-[10px] leading-4 text-[var(--muted)]">
                {assessment.instrument.instruction}
              </p>
            )}

          {assessment.definition.note &&
            currentQuestionIndex === 0 && (
              <p className="mx-auto mt-2 max-w-2xl text-[10px] leading-4 text-[var(--muted)]">
                {assessment.definition.note}
              </p>
            )}
        </div>

        <div
          className={`
            mx-auto mt-7 grid max-w-4xl gap-3
            ${optionGridClass}
          `}
        >
          {question.options.map((option, index) => {
            const selected = selectedAnswer === option.value;
            const showScaleValue =
              assessment.definition.sourceKind === "vendored";

            return (
              <button
                key={`${question.id}-${option.value}`}
                type="button"
                onClick={() => onAnswer(question.id, option.value)}
                className={`
                  flex min-h-[78px] items-center gap-3 rounded-2xl
                  px-4 py-3 text-left text-xs leading-5
                  transition-all duration-300
                  ${
                    selected
                      ? "active-inset !text-[var(--accent)]"
                      : "shadow-button text-[var(--text)] hover:!text-[var(--accent)]"
                  }
                `}
              >
                <span
                  className={`
                    flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full text-[10px] font-semibold
                    ${
                      selected
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--accent-soft)] text-[var(--accent)]"
                    }
                  `}
                >
                  {showScaleValue
                    ? option.value
                    : String.fromCharCode(65 + index)}
                </span>

                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={currentQuestionIndex === 0}
            className="shadow-button flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-[var(--muted)] transition hover:!text-[var(--text)] disabled:opacity-35"
          >
            <ArrowLeft size={14} />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              type="button"
              onClick={onFinish}
              disabled={!canContinue}
              className="shadow-button flex h-9 items-center gap-2 rounded-xl !bg-[var(--accent)] px-5 text-xs font-semibold !text-white transition hover:opacity-90 disabled:opacity-35"
            >
              See result
              <Trophy size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className="shadow-button flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-semibold transition hover:!text-[var(--accent)] disabled:opacity-35"
            >
              Next
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function AssessmentResultView({
  assessment,
  result,
  onClose,
  onRestart,
}: {
  assessment: LoadedAssessment;
  result: AssessmentResult;
  onClose: () => void;
  onRestart: () => void;
}) {
  const Icon = assessment.definition.icon;

  return (
    <div className="space-y-5">
      <section className="glass-panel-header rounded-[32px] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="active-inset flex h-12 w-12 items-center justify-center rounded-2xl text-[var(--success)]">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--success)]">
                Assessment complete
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                {assessment.definition.title}
              </h1>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="shadow-button flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold text-[var(--muted)] transition hover:!text-[var(--text)]"
            >
              <RefreshCw size={14} />
              Retake
            </button>

            <button
              type="button"
              onClick={onClose}
              className="shadow-button flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold transition hover:!text-[var(--accent)]"
            >
              All tests
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="glass-panel rounded-[28px] p-5 text-center md:p-6">
          <div className="active-inset mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] text-[var(--accent)]">
            <Icon size={30} />
          </div>

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Your result
          </p>

          <div className="mx-auto mt-2 inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-semibold text-[var(--accent)]">
            {result.badge}
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            {result.headline}
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {result.summary}
          </p>

          <div className="neo-inset mt-5 rounded-2xl p-4 text-left">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              Interpretation
            </p>

            <p className="mt-2 text-xs leading-5">{result.insight}</p>
          </div>
        </section>

        <section className="glass-panel rounded-[28px] p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                Breakdown
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Scored dimensions
              </h3>
            </div>

            <span className="active-inset rounded-full px-2.5 py-1 text-[9px] font-semibold text-[var(--muted)]">
              {assessment.instrument.source.license}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {result.metrics.length > 0 ? (
              result.metrics.map((metric) => (
                <MetricBar key={metric.key} metric={metric} />
              ))
            ) : (
              <div className="neo-inset rounded-2xl p-4 text-xs text-[var(--muted)]">
                No compatible scoring dimensions were found.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--accent-soft)] px-4 py-3">
            <div className="flex items-start gap-2">
              <ShieldCheck
                size={15}
                className="mt-0.5 shrink-0 text-[var(--accent)]"
              />

              <div>
                <p className="text-[10px] font-semibold">
                  Source · {assessment.instrument.source.sourceName}
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[var(--muted)]">
                  {result.sourceNote ||
                    assessment.instrument.source.attribution ||
                    "Source metadata retained with the vendored instrument."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricBar({ metric }: { metric: AssessmentMetric }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
        <span className="font-medium">{metric.label}</span>

        <span className="font-semibold text-[var(--accent)]">
          {metric.displayValue}
        </span>
      </div>

      <div className="neo-inset h-2 overflow-hidden rounded-full">
        <div
          className="
            h-full rounded-full bg-[var(--accent)]
            transition-[width] duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
          "
          style={{ width: `${metric.normalizedValue}%` }}
        />
      </div>

      {metric.description && (
        <p className="mt-1 text-[9px] leading-4 text-[var(--muted)]">
          {metric.description}
        </p>
      )}
    </div>
  );
}

function AssessmentLoadingState({
  definition,
  onClose,
}: {
  definition: AssessmentCatalogItem;
  onClose: () => void;
}) {
  const Icon = definition.icon;

  return (
    <div className="space-y-5">
      <section className="glass-panel-header rounded-[32px] p-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="shadow-button flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)]"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="active-inset flex h-11 w-11 items-center justify-center rounded-xl text-[var(--accent)]">
            <Icon size={21} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
              Loading local instrument
            </p>

            <h1 className="mt-0.5 text-xl font-semibold">
              {definition.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="glass-panel mx-auto flex min-h-[320px] max-w-4xl flex-col items-center justify-center rounded-[32px] p-8 text-center">
        <div className="neo-inset flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl text-[var(--accent)]">
          <Database size={26} />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          Preparing assessment
        </h2>

        <p className="mt-2 max-w-xl text-xs leading-5 text-[var(--muted)]">
          Pulse is loading the versioned instrument from its own
          deployed assets. Your answers are not sent to OpenScales,
          O*NET or another provider.
        </p>
      </section>
    </div>
  );
}

function AssessmentErrorState({
  definition,
  message,
  onClose,
  onRetry,
}: {
  definition: AssessmentCatalogItem;
  message: string;
  onClose: () => void;
  onRetry: () => void;
}) {
  const Icon = definition.icon;

  return (
    <div className="space-y-5">
      <section className="glass-panel-header rounded-[32px] p-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="shadow-button flex h-9 w-9 items-center justify-center rounded-xl text-[var(--muted)]"
          >
            <ArrowLeft size={17} />
          </button>

          <div className="active-inset flex h-11 w-11 items-center justify-center rounded-xl text-[var(--accent)]">
            <Icon size={21} />
          </div>

          <h1 className="text-xl font-semibold">
            {definition.title}
          </h1>
        </div>
      </section>

      <section className="glass-panel mx-auto flex min-h-[320px] max-w-4xl flex-col items-center justify-center rounded-[32px] p-8 text-center">
        <div className="active-inset flex h-16 w-16 items-center justify-center rounded-2xl text-[var(--danger)]">
          <Database size={26} />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          Instrument asset unavailable
        </h2>

        <p className="mt-2 max-w-2xl text-xs leading-5 text-[var(--muted)]">
          {message}
        </p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="shadow-button h-9 rounded-xl px-4 text-xs font-semibold text-[var(--muted)]"
          >
            Back
          </button>

          <button
            type="button"
            onClick={onRetry}
            className="shadow-button flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-semibold hover:!text-[var(--accent)]"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      </section>
    </div>
  );
}

function AssessmentTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative z-10 flex items-center justify-center gap-2
        rounded-xl px-4 py-2.5 text-sm
        transition-colors duration-300
        ${
          active
            ? "font-semibold text-[var(--text)]"
            : "text-[var(--muted)]"
        }
      `}
    >
      <Icon
        size={16}
        strokeWidth={1.8}
        className={
          active
            ? "text-[var(--accent)]"
            : "text-[var(--muted)]"
        }
      />

      {label}
    </button>
  );
}