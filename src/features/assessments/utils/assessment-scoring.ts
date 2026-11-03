import type {
  AssessmentAnswers,
  AssessmentMetric,
  AssessmentResult,
  LoadedAssessment,
  VendoredScaleDefinition,
} from "../types/assessment.types";

interface ComputedScale {
  key: string;
  label: string;
  method:
    | "mean"
    | "sum";
  raw: number;
  rawMin: number;
  rawMax: number;
  normalized: number;
  description?: string;
}

export function buildAssessmentResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  switch (
    assessment.definition
      .resultKind
  ) {
    case "type16":
      return buildType16Result(
        assessment,
        answers,
      );

    case "disc":
      return buildDiscResult(
        assessment,
        answers,
      );

    case "ability":
      return buildAbilityResult(
        assessment,
        answers,
      );

    case "riasec":
      return buildRiasecResult(
        assessment,
        answers,
      );

    case "scale":
      return buildSingleScaleResult(
        assessment,
        answers,
      );

    case "profile":

    default:
      return buildProfileResult(
        assessment,
        answers,
      );
  }
}

function buildProfileResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const computed =
    computeAllScales(
      assessment,
      answers,
    );

  const selected =
    selectPreferredScales(
      assessment,
      computed,
    );

  const metrics =
    selected.map(
      toMetric,
    );

  const strongest =
    [...metrics].sort(
      (
        a,
        b,
      ) =>
        b.normalizedValue -
        a.normalizedValue,
    )[0];

  return {
    headline:
      strongest
        ? `${strongest.label} stands out`
        : "Profile complete",

    badge:
      assessment.definition
        .title,

    summary:
      strongest
        ? `The strongest relative signal in this profile is ${strongest.label}. The displayed score remains on the instrument's original scoring scale.`
        : "Your responses were scored using the instrument's published scoring rules.",

    insight:
      "Read the full pattern rather than treating one dimension as a fixed identity. Bars are only a visual normalization of the instrument's valid raw range; the number beside each bar is the actual instrument score.",

    metrics,

    sourceNote:
      buildSourceNote(
        assessment,
      ),
  };
}

function buildSingleScaleResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const computed =
    computeAllScales(
      assessment,
      answers,
    );

  const selected =
    selectPreferredScales(
      assessment,
      computed,
    );

  const primary =
    selected[0] ??
    computed[0];

  if (!primary) {
    return emptyResult(
      assessment,
    );
  }

  return {
    headline:
      formatRawScore(
        primary,
      ),

    badge:
      primary.label,

    summary:
      primary.description
        ? primary.description
        : `Your ${primary.label.toLowerCase()} score is shown on the instrument's original ${formatRange(
            primary.rawMin,
            primary.rawMax,
          )} scale.`,

    insight:
      "This is a self-report score, not a percentile unless the original instrument explicitly provides population norms. Pulse does not invent normative rankings.",

    metrics:
      selected.length
        ? selected.map(
            toMetric,
          )
        : [
            toMetric(
              primary,
            ),
          ],

    sourceNote:
      buildSourceNote(
        assessment,
      ),
  };
}

function buildRiasecResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const computed =
    computeAllScales(
      assessment,
      answers,
    );

  const orderedKeys = [
    "R",
    "I",
    "A",
    "S",
    "E",
    "C",
  ];

  const byKey =
    new Map(
      computed.map(
        (
          score,
        ) => [
          score.key.toUpperCase(),
          score,
        ],
      ),
    );

  const selected =
    orderedKeys
      .map(
        (
          key,
        ) =>
          byKey.get(
            key,
          ),
      )
      .filter(
        (
          score,
        ): score is ComputedScale =>
          Boolean(
            score,
          ),
      );

  const ranked =
    [...selected].sort(
      (
        a,
        b,
      ) =>
        b.raw -
        a.raw,
    );

  const code =
    ranked
      .slice(
        0,
        3,
      )
      .map(
        (
          score,
        ) =>
          score.key.toUpperCase(),
      )
      .join("");

  const topNames =
    ranked
      .slice(
        0,
        3,
      )
      .map(
        (
          score,
        ) =>
          score.label,
      )
      .join(", ");

  return {
    headline:
      code ||
      "RIASEC",

    badge:
      "Top-three interest code",

    summary:
      topNames
        ? `Your strongest work-interest themes are ${topNames}.`
        : "Your RIASEC interest profile is complete.",

    insight:
      "RIASEC describes preferred kinds of work activity. It does not measure intelligence, skill level or job eligibility. Use the top themes to explore environments and roles that contain more of the activities you actually enjoy.",

    metrics:
      selected.map(
        toMetric,
      ),

    sourceNote:
      buildSourceNote(
        assessment,
      ),
  };
}

function buildType16Result(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const totals:
    Record<
      string,
      number
    > = {
      E: 0,
      I: 0,
      S: 0,
      N: 0,
      T: 0,
      F: 0,
      J: 0,
      P: 0,
    };

  assessment.instrument
    .questions
    .forEach(
      (
        question,
      ) => {
        const answer =
          answers[
            question.id
          ];

        if (
          answer ===
          undefined
        ) {
          return;
        }

        const option =
          question.options.find(
            (
              item,
            ) =>
              item.value ===
              answer,
          );

        Object.entries(
          option?.scores ??
            {},
        ).forEach(
          ([
            key,
            value,
          ]) => {
            totals[
              key
            ] =
              (totals[
                key
              ] ??
                0) +
              value;
          },
        );
      },
    );

  const pairs = [
    [
      "E",
      "I",
      "Energy",
    ],

    [
      "S",
      "N",
      "Information",
    ],

    [
      "T",
      "F",
      "Decisions",
    ],

    [
      "J",
      "P",
      "Structure",
    ],
  ] as const;

  const code =
    pairs
      .map(
        ([
          left,
          right,
        ]) =>
          totals[
            left
          ] >=
          totals[
            right
          ]
            ? left
            : right,
      )
      .join("");

  const metrics:
    AssessmentMetric[] =
    pairs.map(
      ([
        left,
        right,
        label,
      ]) => {
        const leftValue =
          totals[
            left
          ];

        const rightValue =
          totals[
            right
          ];

        const total =
          Math.max(
            1,
            leftValue +
              rightValue,
          );

        const winner =
          leftValue >=
          rightValue
            ? left
            : right;

        const winnerValue =
          Math.max(
            leftValue,
            rightValue,
          );

        return {
          key:
            `${left}${right}`,

          label:
            `${label} · ${winner}`,

          displayValue:
            `${winnerValue} / ${total}`,

          rawValue:
            winnerValue,

          normalizedValue:
            (winnerValue /
              total) *
            100,
        };
      },
    );

  return {
    headline:
      code,

    badge:
      "Exploratory preference code",

    summary:
      "This code summarizes four preference pairs from Pulse-original questions. It is not the official MBTI® assessment and should not be treated as a fixed personality identity.",

    insight:
      "Use the result as a conversation starter about communication, decisions and work rhythm. For trait-based assessment, the Big Five profile in this lab is the stronger scientific option.",

    metrics,

    sourceNote:
      "Pulse original exploratory item set.",
  };
}

function buildDiscResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const totals:
    Record<
      string,
      number
    > = {
      D: 0,
      I: 0,
      S: 0,
      C: 0,
    };

  assessment.instrument
    .questions
    .forEach(
      (
        question,
      ) => {
        const answer =
          answers[
            question.id
          ];

        if (
          answer ===
          undefined
        ) {
          return;
        }

        const option =
          question.options.find(
            (
              item,
            ) =>
              item.value ===
              answer,
          );

        Object.entries(
          option?.scores ??
            {},
        ).forEach(
          ([
            key,
            value,
          ]) => {
            totals[
              key
            ] =
              (totals[
                key
              ] ??
                0) +
              value;
          },
        );
      },
    );

  const labels:
    Record<
      string,
      string
    > = {
      D: "Drive",
      I: "Influence",
      S:
        "Steadiness",
      C:
        "Conscientiousness",
    };

  const total =
    Math.max(
      1,

      Object.values(
        totals,
      ).reduce(
        (
          sum,
          value,
        ) =>
          sum +
          value,

        0,
      ),
    );

  const metrics:
    AssessmentMetric[] =
    Object.entries(
      totals,
    )
      .map(
        ([
          key,
          raw,
        ]) => ({
          key,

          label:
            labels[
              key
            ] ??
            key,

          displayValue:
            `${raw} / ${total}`,

          rawValue:
            raw,

          normalizedValue:
            (raw /
              total) *
            100,
        }),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.normalizedValue -
          a.normalizedValue,
      );

  const strongest =
    metrics[0];

  return {
    headline:
      strongest
        ? `${strongest.label} (${strongest.key})`
        : "Work-style profile",

    badge:
      "Exploratory DISC-style signal",

    summary:
      strongest
        ? `${strongest.label} is the most visible preference in this short work-style exercise.`
        : "Your work-style reflection is complete.",

    insight:
      "This is deliberately not presented as Everything DiSC® or as a validated selection instrument. Use it for team and communication reflection only.",

    metrics,

    sourceNote:
      "Pulse original exploratory item set.",
  };
}

function buildAbilityResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  let correct = 0;

  assessment.instrument
    .questions
    .forEach(
      (
        question,
      ) => {
        const answer =
          answers[
            question.id
          ];

        if (
          answer ===
          undefined
        ) {
          return;
        }

        const selected =
          question.options.find(
            (
              option,
            ) =>
              option.value ===
              answer,
          );

        if (
          selected?.correct
        ) {
          correct +=
            1;
        }
      },
    );

  const total =
    assessment.instrument
      .questions.length;

  const accuracy =
    (correct /
      Math.max(
        1,
        total,
      )) *
    100;

  const band =
    accuracy >=
    85
      ? "Very strong performance"
      : accuracy >=
          70
        ? "Strong performance"
        : accuracy >=
            50
          ? "Developing performance"
          : "More practice needed";

  return {
    headline:
      `${correct} / ${total} correct`,

    badge:
      band,

    summary:
      "This result is task accuracy on this original Pulse item set. It is intentionally not converted into an IQ number or a standardized Raven score.",

    insight:
      "Standardized cognitive assessment requires validated item banks, controlled administration and normative data. This lab is useful for practice and reflection, not diagnosis or high-stakes decisions.",

    metrics: [
      {
        key:
          "accuracy",

        label:
          "Accuracy",

        displayValue:
          `${Math.round(
            accuracy,
          )}%`,

        rawValue:
          correct,

        normalizedValue:
          accuracy,
      },
    ],

    sourceNote:
      "Pulse original reasoning items.",
  };
}

function computeAllScales(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): ComputedScale[] {
  return assessment.instrument
    .scales
    .map(
      (
        scale,
      ) =>
        computeScale(
          assessment,
          scale,
          answers,
        ),
    )
    .filter(
      (
        score,
      ): score is ComputedScale =>
        Boolean(
          score,
        ),
    );
}

function computeScale(
  assessment:
    LoadedAssessment,

  scale:
    VendoredScaleDefinition,

  answers:
    AssessmentAnswers,
): ComputedScale | null {
  const min =
    assessment.instrument
      .responseScale.min;

  const max =
    assessment.instrument
      .responseScale.max;

  const values:
    number[] = [];

  Object.entries(
    scale.itemWeights,
  ).forEach(
    ([
      itemId,
      weight,
    ]) => {
      const answer =
        answers[
          itemId
        ];

      if (
        answer ===
          undefined ||
        weight ===
          0
      ) {
        return;
      }

      const reversed =
        weight <
        0;

      const coded =
        reversed
          ? min +
            max -
            answer
          : answer;

      const multiplier =
        Math.max(
          1,

          Math.abs(
            weight,
          ),
        );

      values.push(
        coded *
          multiplier,
      );
    },
  );

  if (
    !values.length
  ) {
    return null;
  }

  const raw =
    scale.method ===
    "mean"
      ? values.reduce(
          (
            sum,
            value,
          ) =>
            sum +
            value,

          0,
        ) /
        values.length
      : values.reduce(
          (
            sum,
            value,
          ) =>
            sum +
            value,

          0,
        );

  const defaultMin =
    scale.method ===
    "mean"
      ? min
      : values.length *
        min;

  const defaultMax =
    scale.method ===
    "mean"
      ? max
      : values.length *
        max;

  const rawMin =
    scale.rawMin ??
    defaultMin;

  const rawMax =
    scale.rawMax ??
    defaultMax;

  return {
    key:
      scale.key,

    label:
      scale.label,

    method:
      scale.method,

    raw,

    rawMin,

    rawMax,

    normalized:
      normalize(
        raw,
        rawMin,
        rawMax,
      ),

    description:
      scale.description,
  };
}

function selectPreferredScales(
  assessment:
    LoadedAssessment,

  computed:
    ComputedScale[],
): ComputedScale[] {
  const preferred =
    assessment.definition
      .preferredMetricKeys ??
    [];

  if (
    !preferred.length
  ) {
    const meanScores =
      computed.filter(
        (
          score,
        ) =>
          score.method ===
          "mean",
      );

    return meanScores.length
      ? meanScores
      : computed;
  }

  const byKey =
    new Map(
      computed.map(
        (
          score,
        ) => [
          score.key,
          score,
        ],
      ),
    );

  const selected:
    ComputedScale[] = [];

  const labels =
    new Set<string>();

  preferred.forEach(
    (
      key,
    ) => {
      const score =
        byKey.get(
          key,
        );

      if (
        !score ||
        labels.has(
          score.label,
        )
      ) {
        return;
      }

      labels.add(
        score.label,
      );

      selected.push(
        score,
      );
    },
  );

  return selected.length
    ? selected
    : computed;
}

function toMetric(
  score:
    ComputedScale,
): AssessmentMetric {
  return {
    key:
      score.key,

    label:
      score.label,

    displayValue:
      formatRawScore(
        score,
      ),

    rawValue:
      Number(
        score.raw.toFixed(
          2,
        ),
      ),

    normalizedValue:
      score.normalized,

    description:
      score.description,
  };
}

function formatRawScore(
  score:
    ComputedScale,
) {
  const decimals =
    score.method ===
    "mean"
      ? 2
      : 0;

  return `${score.raw.toFixed(
    decimals,
  )} / ${score.rawMax.toFixed(
    decimals,
  )}`;
}

function formatRange(
  min: number,
  max: number,
) {
  return `${min}–${max}`;
}

function normalize(
  value: number,
  min: number,
  max: number,
) {
  if (
    max <= min
  ) {
    return 0;
  }

  return Math.max(
    0,

    Math.min(
      100,

      ((value -
        min) /
        (max -
          min)) *
        100,
    ),
  );
}

function buildSourceNote(
  assessment:
    LoadedAssessment,
) {
  const {
    source,
  } =
    assessment.instrument;

  const parts = [
    source.sourceName,
    source.license,
    source.citation,
  ].filter(
    Boolean,
  );

  return parts.join(
    " · ",
  );
}

function emptyResult(
  assessment:
    LoadedAssessment,
): AssessmentResult {
  return {
    headline:
      "Result ready",

    badge:
      assessment.definition
        .title,

    summary:
      "The assessment was completed, but no compatible score was produced.",

    insight:
      "Check the vendored instrument definition and scoring rules before using this result.",

    metrics: [],

    sourceNote:
      buildSourceNote(
        assessment,
      ),
  };
}