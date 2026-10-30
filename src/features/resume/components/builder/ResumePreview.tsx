import {
  Minus,
  Plus,
  RotateCcw,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  Resume,
} from "../../types/resume.types";

import {
  MinimalTemplate,
} from "../templates/MinimalTemplate";

import {
  ModernTemplate,
} from "../templates/ModernTemplate";

import {
  ProfessionalTemplate,
} from "../templates/ProfessionalTemplate";

import {
  CreativeTemplate,
} from "../templates/CreativeTemplate";

import {
  CompactTemplate,
} from "../templates/CompactTemplate";

interface ResumePreviewProps {
  resume: Resume;
  fullscreen?: boolean;
}

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export function ResumePreview({
  resume,
  fullscreen = false,
}: ResumePreviewProps) {
  const previewRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const [
    fitScale,
    setFitScale,
  ] = useState(1);

  const [
    zoom,
    setZoom,
  ] = useState(1);

  useEffect(() => {
    if (
      fullscreen ||
      !previewRef.current
    ) {
      return;
    }

    const element =
      previewRef.current;

    function updateScale() {
      const width =
        element.clientWidth;

      const height =
        element.clientHeight;

      if (
        width <= 0 ||
        height <= 0
      ) {
        return;
      }

      const horizontalPadding =
        20;

      const verticalPadding =
        20;

      const widthScale =
        (width -
          horizontalPadding) /
        PAGE_WIDTH;

      const heightScale =
        (height -
          verticalPadding) /
        PAGE_HEIGHT;

      const nextScale =
        Math.min(
          widthScale,
          heightScale,
          1,
        );

      setFitScale(
        Math.max(
          nextScale,
          0.2,
        ),
      );
    }

    updateScale();

    const observer =
      new ResizeObserver(
        updateScale,
      );

    observer.observe(
      element,
    );

    return () => {
      observer.disconnect();
    };
  }, [
    fullscreen,
  ]);

  const previewScale =
    useMemo(
      () =>
        fitScale * zoom,
      [
        fitScale,
        zoom,
      ],
    );

  const zoomPercent =
    Math.round(
      zoom * 100,
    );

  const isZoomed =
    zoom > 1.001;

  function zoomIn() {
    setZoom(
      (current) =>
        Math.min(
          Number(
            (
              current +
              ZOOM_STEP
            ).toFixed(2),
          ),
          MAX_ZOOM,
        ),
    );
  }

  function zoomOut() {
    setZoom(
      (current) =>
        Math.max(
          Number(
            (
              current -
              ZOOM_STEP
            ).toFixed(2),
          ),
          MIN_ZOOM,
        ),
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  return (
    <section
      className="
        resume-preview-wrapper
        
        flex
        h-full
        min-h-0
        flex-col
        rounded-2xl
        p-2.5
      "
    >
      {!fullscreen && (
        <div
          className="
            mb-2
            flex
            shrink-0
            items-center
            justify-center
            gap-9
          "
        >
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold">
              Preview
            </h3>
          </div>

          <div
            className="
              flex
              items-center
              gap-1.5
            "
          >
            <button
              type="button"
              onClick={
                zoomOut
              }
              disabled={
                zoom <= MIN_ZOOM
              }
              aria-label="Zoom Out"
              title="Zoom Out"
              className="
                neo-button
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                !text-[var(--text)]
                transition
                hover:!text-[var(--accent)]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Minus
                size={15}
              />
            </button>

            <button
              type="button"
              onClick={
                resetZoom
              }
              title="Reset Zoom"
              className="
                active-inset
                flex
                h-7
                min-w-12
                items-center
                justify-center
                rounded-lg
                px-2
                tabular-nums
                text-[var(--text)]
                transition
                hover:text-[var(--accent)]
              "
            >
              {zoomPercent}%
            </button>

            <button
              type="button"
              onClick={
                zoomIn
              }
              disabled={
                zoom >= MAX_ZOOM
              }
              aria-label="Zoom In"
              title="Zoom In"
              className="
                neo-button
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                !text-[var(--text)]
                transition
                hover:!text-[var(--accent)]
                disabled:cursor-not-allowed
                disabled:opacity-30
              "
            >
              <Plus
                size={15}
              />
            </button>

            <button
              type="button"
              onClick={
                resetZoom
              }
              disabled={
                zoom === 1
              }
              aria-label="Fit Preview"
              title="Fit Preview"
              className="
                neo-button
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                !text-[var(--muted)]
                transition
                hover:!text-[var(--text)]
                disabled:cursor-default
                disabled:opacity-30
              "
            >
              <RotateCcw
                size={15}
              />
            </button>
          </div>
          <span
              className="
                rounded-lg
                bg-[var(--success-soft)]
                px-2
                py-1
                text-[9px]
                font-medium
                text-[var(--success)]
              "
            >
              Live
            </span>
        </div>
      )}

      {fullscreen ? (
        <div
          className="
            flex
            min-h-0
            flex-1
            justify-center
            overflow-y-auto
          "
        >
          <div
            id="resume-print-area"
            className="
              aspect-[210/297]
              w-full
              max-w-[794px]
              shrink-0
              overflow-hidden
              rounded-lg
              bg-white
              shadow-lg
            "
          >
            <TemplateRenderer
              resume={resume}
            />
          </div>
        </div>
      ) : (
        <div
          ref={previewRef}
          className="
            min-h-0
            min-w-0
            flex-1
            overflow-auto
            overscroll-contain
          "
        >
          <div
            className={`
              flex
              min-h-full
              min-w-full
              p-2

              ${
                isZoomed
                  ? "items-start justify-start"
                  : "items-center justify-center"
              }
            `}
          >
            <div
              className="
                relative
                shrink-0
              "
              style={{
                width:
                  PAGE_WIDTH *
                  previewScale,

                height:
                  PAGE_HEIGHT *
                  previewScale,
              }}
            >
              <div
                id="resume-print-area"
                className="
                  absolute
                  left-0
                  top-0
                  overflow-hidden
                  rounded-lg
                  bg-white
                  shadow-lg
                "
                style={{
                  width:
                    PAGE_WIDTH,

                  height:
                    PAGE_HEIGHT,

                  transform: `scale(${previewScale})`,

                  transformOrigin:
                    "top left",
                }}
              >
                <TemplateRenderer
                  resume={resume}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function TemplateRenderer({
  resume,
}: {
  resume: Resume;
}) {
  switch (resume.template) {
    case "minimal":
      return (
        <MinimalTemplate
          resume={resume}
        />
      );

    case "professional":
      return (
        <ProfessionalTemplate
          resume={resume}
        />
      );

    case "creative":
      return (
        <CreativeTemplate
          resume={resume}
        />
      );

    case "compact":
      return (
        <CompactTemplate
          resume={resume}
        />
      );

    case "modern":
    default:
      return (
        <ModernTemplate
          resume={resume}
        />
      );
  }
}