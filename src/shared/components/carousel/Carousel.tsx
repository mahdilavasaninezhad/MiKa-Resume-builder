import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "./carousel.css";

const SLIDE_DURATION_MS = 5_000;

export function Carousel({
  children,
  label,
  tone = "accent",
}: {
  children: ReactNode;
  label: string;
  tone?: "accent" | "warning";
}) {
  const slides = Children.toArray(children);
  const identity = JSON.stringify(
    slides.map((slide, index) =>
      typeof slide === "object" && "key" in slide ? slide.key : index,
    ),
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const targetRef = useRef(0);
  const directionRef = useRef<1 | -1>(1);
  const restartPlaybackRef = useRef<(() => void) | null>(null);

  const centerSlide = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const slide = viewport?.children[index];

    if (!viewport || !(slide instanceof HTMLElement)) return;

    targetRef.current = index;

    viewport.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });

    restartPlaybackRef.current?.();
  }, []);

  const navigateTo = (index: number) => {
    const previous = targetRef.current;

    if (index !== previous) {
      directionRef.current = index < previous ? -1 : 1;
    }

    centerSlide(index);
  };

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    let frame = 0;
    let timer: number | undefined;
    let pointerId: number | null = null;

    const update = () => {
      const bounds = viewport.getBoundingClientRect();
      const center = bounds.left + bounds.width / 2;
      let nearest = 0;
      let distance = Infinity;

      Array.from(viewport.children).forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        const offset = Math.abs(rect.left + rect.width / 2 - center);

        if (offset < distance) {
          distance = offset;
          nearest = index;
        }
      });

      setActive(nearest);
      return nearest;
    };

    const restartPlayback = () => {
      window.clearTimeout(timer);

      if (
        viewport.children.length < 2 ||
        pointerId !== null ||
        document.hidden
      ) {
        return;
      }

      timer = window.setTimeout(() => {
        const current = update();
        const last = viewport.children.length - 1;

        if (current === last) directionRef.current = -1;
        if (current === 0) directionRef.current = 1;

        centerSlide(current + directionRef.current);
      }, SLIDE_DURATION_MS);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const handleScroll = () => {
      scheduleUpdate();
      restartPlayback();
    };

    const settle = () => {
      targetRef.current = update();
      restartPlayback();
    };

    const startGesture = (event: PointerEvent) => {
      if (!event.isPrimary) return;

      pointerId = event.pointerId;
      restartPlayback();
    };

    const endGesture = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;

      pointerId = null;
      restartPlayback();
    };

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(viewport);
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    viewport.addEventListener("scrollend", settle);
    viewport.addEventListener("pointerdown", startGesture);
    viewport.addEventListener("wheel", restartPlayback, { passive: true });
    window.addEventListener("pointerup", endGesture);
    window.addEventListener("pointercancel", endGesture);
    document.addEventListener("visibilitychange", restartPlayback);

    restartPlaybackRef.current = restartPlayback;
    targetRef.current = 0;
    directionRef.current = 1;
    viewport.scrollLeft = 0;
    settle();

    return () => {
      restartPlaybackRef.current = null;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();

      viewport.removeEventListener("scrollend", settle);
      viewport.removeEventListener("scroll", handleScroll);
      viewport.removeEventListener("pointerdown", startGesture);
      viewport.removeEventListener("wheel", restartPlayback);
      window.removeEventListener("pointerup", endGesture);
      window.removeEventListener("pointercancel", endGesture);
      document.removeEventListener("visibilitychange", restartPlayback);
    };
  }, [centerSlide, identity]);

  if (!slides.length) return null;

  return (
    <div className="carousel" data-tone={tone}>
      <div
        ref={viewportRef}
        className="carousel__viewport"
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        dir="ltr"
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;

          const destinations: Record<string, number> = {
            ArrowLeft: Math.max(0, targetRef.current - 1),
            ArrowRight: Math.min(slides.length - 1, targetRef.current + 1),
            Home: 0,
            End: slides.length - 1,
          };

          if (!(event.key in destinations)) return;

          event.preventDefault();
          navigateTo(destinations[event.key]);
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={typeof slide === "object" && "key" in slide ? slide.key : index}
            className="carousel__slide"
            data-active={index === active}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <div
              inert={index !== active}
              aria-hidden={index !== active}
              className={
                index === active
                  ? "neo-surface carousel__surface"
                  : "carousel__surface"
              }
            >
              {slide}
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__controls">
        <button
          type="button"
          className="shadow-button carousel__arrow"
          aria-label="Previous slide"
          disabled={active === 0}
          onClick={() => navigateTo(Math.max(0, targetRef.current - 1))}
        >
          <ChevronLeft size={18} />
        </button>

        <div className="carousel__dots" role="group" aria-label="Choose a slide">
          {slides.map((slide, index) => (
            <button
              key={typeof slide === "object" && "key" in slide ? slide.key : index}
              type="button"
              className="carousel__dot"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => navigateTo(index)}
            >
              <span />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="shadow-button carousel__arrow"
          aria-label="Next slide"
          disabled={active === slides.length - 1}
          onClick={() =>
            navigateTo(Math.min(slides.length - 1, targetRef.current + 1))
          }
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}