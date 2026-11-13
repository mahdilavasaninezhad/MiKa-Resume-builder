import { useEffect, useState } from "react";

type AnimatedTabIntroProps = {
  active: boolean;
  title: string;
  description: string;
};

export function AnimatedTabIntro({
  active,
  title,
  description,
}: AnimatedTabIntroProps) {
  const words = title.split(" ");
  const wordCount = words.length;
  const [visibleWords, setVisibleWords] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    setVisibleWords(0);
    setShowDescription(false);

    if (!active) return;

    let currentWord = 0;
    let descriptionTimer: number | undefined;

    const wordTimer = window.setInterval(() => {
      currentWord += 1;
      setVisibleWords(currentWord);

      if (currentWord === wordCount) {
        window.clearInterval(wordTimer);
        descriptionTimer = window.setTimeout(() => {
          setShowDescription(true);
        }, 450);
      }
    }, 220);

    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(descriptionTimer);
    };
  }, [active, title, wordCount]);

  return (
    <div
      aria-hidden={!active}
      className={`grid min-w-0 transition-all duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none
        ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="rounded-2xl bg-[var(--warning-soft)] px-4 text-center text-[var(--warning)]">
          <h2 className="text-lg font-semibold">
            {words.map((word, index) => (
              <span key={index}>
                {index > 0 && " "}
                <span
                  className={`inline-block transition-all duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    motion-reduce:translate-y-0 motion-reduce:opacity-100
                    motion-reduce:blur-none motion-reduce:transition-none
                    ${
                      index < visibleWords
                        ? "translate-y-0 opacity-100 blur-none"
                        : "translate-y-1 opacity-0 blur-[2px]"
                    }`}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>

          <p
            className={`mt-1 pb-1 text-xs text-[var(--muted)] transition-all
              duration-1000 ease-out motion-reduce:translate-y-0
              motion-reduce:opacity-100 motion-reduce:transition-none
              ${
                showDescription
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-0"
              }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}