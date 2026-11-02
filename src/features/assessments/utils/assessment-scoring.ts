import type {
  AssessmentAnswers,
  AssessmentMetric,
  AssessmentResult,
  AssessmentScoringRule,
  LoadedAssessment,
} from "../types/assessment.types";

interface ComputedScore {
  key: string;
  label: string;
  raw: number;
  normalized: number;
  method: string;
}

export function buildAssessmentResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  switch (
    assessment.definition
      .resultMode
  ) {
    case "ability":
      return buildAbilityResult(
        assessment,
        answers,
      );

    case "disc":
      return buildDiscResult(
        assessment,
        answers,
      );

    case "type16":
      return buildType16Result(
        assessment,
        answers,
      );

    case "riasec":
      return buildRiasecResult(
        assessment,
        answers,
      );

    case "single":
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
    computeScales(
      assessment,
      answers,
    );

  const configured =
    assessment.definition
      .metricDefinitions;

  let selected:
    ComputedScore[] =
    [];

  if (
    configured?.length
  ) {
    selected =
      configured
        .map(
          (
            metricDefinition,
          ) => {
            const score =
              metricDefinition
                .keys
                .map(
                  (
                    key,
                  ) =>
                    computed.get(
                      key,
                    ),
                )
                .find(
                  Boolean,
                );

            if (!score) {
              return null;
            }

            return {
              ...score,

              label:
                metricDefinition
                  .label,
            };
          },
        )
        .filter(
          (
            score,
          ): score is ComputedScore =>
            score !==
            null,
        );
  }

  if (
    !selected.length
  ) {
    selected =
      Array.from(
        computed.values(),
      ).filter(
        (
          score,
        ) =>
          score.method.includes(
            "mean",
          ),
      );
  }

  if (
    !selected.length
  ) {
    selected =
      Array.from(
        computed.values(),
      );
  }

  const metrics =
    selected
      .map(
        toMetric,
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.value -
          a.value,
      );

  const strongest =
    metrics[0];

  return {
    headline:
      strongest
        ? `${strongest.label} stands out`
        : "Profile complete",

    badge:
      `${assessment.definition.title} result`,

    summary:
      strongest
        ? `Your highest score in this profile is ${strongest.label}. Read the full pattern rather than treating one dimension as a fixed identity.`
        : "Your responses were scored successfully.",

    insight:
      "Use the profile as a structured signal for reflection, career conversations and development planning. Trait scores describe tendencies, not destiny or capability.",

    metrics,
  };
}

function buildSingleScaleResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const computed =
    Array.from(
      computeScales(
        assessment,
        answers,
      ).values(),
    );

  const preferred =
    computed.find(
      (
        score,
      ) =>
        score.method.includes(
          "mean",
        ),
    ) ??
    computed[0];

  if (!preferred) {
    return emptyResult(
      assessment.definition
        .title,
    );
  }

  const value =
    Math.round(
      preferred.normalized,
    );

  const band =
    value >= 75
      ? "Strong signal"
      : value >=
          60
        ? "Above midpoint"
        : value >=
            40
          ? "Moderate signal"
          : "Lower signal";

  return {
    headline:
      `${value}%`,

    badge:
      band,

    summary:
      `${preferred.label} is ${band.toLowerCase()} in this self-report snapshot.`,

    insight:
      "Interpret this score relative to your own behavior and context. It is not a clinical diagnosis, percentile rank or hiring decision.",

    metrics: [
      toMetric(
        preferred,
      ),
    ],
  };
}

function buildRiasecResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  const orderedKeys = [
    "R",
    "I",
    "A",
    "S",
    "E",
    "C",
  ];

  const alpha:
    Record<
      string,
      number
    > = {
      R: 1,
      I: 1,
      A: 1,
      S: 1,
      E: 1,
      C: 1,
    };

  assessment.scoring.forEach(
    (
      rule,
    ) => {
      if (
        !orderedKeys.includes(
          rule.key,
        ) ||
        !rule.items
      ) {
        return;
      }

      const entries =
        Array.isArray(
          rule.items,
        )
          ? rule.items.map(
              (
                itemId,
              ) =>
                [
                  itemId,

                  rule.itemCoding?.[
                    itemId
                  ] ??
                    1,
                ] as const,
            )
          : Object.entries(
              rule.items,
            );

      entries.forEach(
        ([
          itemId,
          coding,
        ]) => {
          const response =
            answers[
              itemId
            ];

          if (
            response ===
              undefined ||
            coding === 0
          ) {
            return;
          }

          const coded =
            coding <
            0
              ? assessment.scaleMin +
                assessment.scaleMax -
                response
              : response;

          const evidence =
            normalizeToUnit(
              coded,

              assessment.scaleMin,

              assessment.scaleMax,
            );

          alpha[
            rule.key
          ] += evidence;
        },
      );
    },
  );

  const totalAlpha =
    Math.max(
      1,

      orderedKeys.reduce(
        (
          sum,
          key,
        ) =>
          sum +
          alpha[
            key
          ],

        0,
      ),
    );

  const metrics:
    AssessmentMetric[] =
    orderedKeys
      .map(
        (
          key,
        ) => ({
          key,

          label:
            riasecLabel(
              key,
            ),

          value:
            Math.round(
              (alpha[
                key
              ] /
                totalAlpha) *
                100,
            ),

          rawValue:
            Number(
              alpha[
                key
              ].toFixed(
                2,
              ),
            ),
        }),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.value -
          a.value,
      );

  const code =
    metrics
      .slice(
        0,
        3,
      )
      .map(
        (
          metric,
        ) =>
          metric.key,
      )
      .join("");

  const topNames =
    metrics
      .slice(
        0,
        3,
      )
      .map(
        (
          metric,
        ) =>
          metric.label,
      )
      .join(
        ", ",
      );

  return {
    headline:
      code ||
      "RIASEC",

    badge:
      "Top-three interest code",

    summary:
      `Your strongest interest themes are ${topNames}.`,

    insight:
      "RIASEC measures what kinds of work activities you currently find interesting. It does not measure intelligence, skill level or job eligibility.",

    metrics,
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

  assessment.questions.forEach(
    (
      question,
    ) => {
      const answerValue =
        answers[
          question.id
        ];

      if (
        answerValue ===
        undefined
      ) {
        return;
      }

      const option =
        question.options.find(
          (
            candidate,
          ) =>
            candidate.value ===
            answerValue,
        );

      if (
        !option?.scores
      ) {
        return;
      }

      Object.entries(
        option.scores,
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
        const leftScore =
          totals[
            left
          ];

        const rightScore =
          totals[
            right
          ];

        const total =
          Math.max(
            1,

            leftScore +
              rightScore,
          );

        const winner =
          leftScore >=
          rightScore
            ? left
            : right;

        return {
          key:
            `${left}${right}`,

          label:
            `${label} · ${winner}`,

          value:
            Math.round(
              (Math.max(
                leftScore,

                rightScore,
              ) /
                total) *
                100,
            ),
        };
      },
    );

  return {
    headline:
      code,

    badge:
      "Exploratory 16-type preference code",

    summary:
      "This code summarizes four preference pairs from a short set of original Pulse questions. It is not the official MBTI® assessment and should not be treated as a fixed identity.",

    insight:
      "Use the result to compare communication habits, decision style and preferred work rhythm. Big Five remains the stronger trait-based instrument in this assessment lab.",

    metrics,
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

  assessment.questions.forEach(
    (
      question,
    ) => {
      const answerValue =
        answers[
          question.id
        ];

      if (
        answerValue ===
        undefined
      ) {
        return;
      }

      const option =
        question.options.find(
          (
            candidate,
          ) =>
            candidate.value ===
            answerValue,
        );

      if (
        !option?.scores
      ) {
        return;
      }

      Object.entries(
        option.scores,
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

  const labels:
    Record<
      string,
      string
    > = {
      D: "Drive",

      I:
        "Influence",

      S:
        "Steadiness",

      C:
        "Conscientiousness",
    };

  const metrics =
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
            ] ?? key,

          value:
            Math.round(
              (raw /
                total) *
                100,
            ),

          rawValue:
            raw,
        }),
      )
      .sort(
        (
          a,
          b,
        ) =>
          b.value -
          a.value,
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
        ? `${strongest.label} is the most visible preference in this short exploratory work-style exercise.`
        : "Your work-style reflection is complete.",

    insight:
      "This tool is intentionally not treated as a validated DISC instrument. Use it as conversation material for teamwork and communication, not selection or diagnosis.",

    metrics,
  };
}

function buildAbilityResult(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
): AssessmentResult {
  let correct = 0;

  assessment.questions.forEach(
    (
      question,
    ) => {
      const answerValue =
        answers[
          question.id
        ];

      if (
        answerValue ===
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
            answerValue,
        );

      if (
        selected?.correct
      ) {
        correct += 1;
      }
    },
  );

  const total =
    assessment.questions
      .length;

  const percentage =
    Math.round(
      (correct /
        Math.max(
          1,
          total,
        )) *
        100,
    );

  const band =
    percentage >=
    85
      ? "Very strong performance"
      : percentage >=
          70
        ? "Strong performance"
        : percentage >=
            50
          ? "Developing performance"
          : "More practice needed";

  return {
    headline:
      `${correct} / ${total} correct`,

    badge:
      `${band} · ${percentage}%`,

    summary:
      "This percentage reflects accuracy on this original Pulse question set only.",

    insight:
      "Do not convert this result into an IQ number or a Raven score. Standardized cognitive tests require validated item banks, norms and controlled administration.",

    metrics: [
      {
        key:
          "accuracy",

        label:
          "Accuracy",

        value:
          percentage,

        rawValue:
          correct,
      },
    ],
  };
}

function computeScales(
  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,
) {
  const result =
    new Map<
      string,
      ComputedScore
    >();

  const pending = [
    ...assessment.scoring,
  ];

  let guard =
    pending.length *
      3 +
    3;

  while (
    pending.length &&
    guard > 0
  ) {
    guard -= 1;

    const rule =
      pending.shift();

    if (!rule) {
      break;
    }

    const computed =
      computeRule(
        rule,

        assessment,

        answers,

        result,
      );

    if (!computed) {
      pending.push(
        rule,
      );

      continue;
    }

    result.set(
      rule.key,

      computed,
    );
  }

  return result;
}

function computeRule(
  rule:
    AssessmentScoringRule,

  assessment:
    LoadedAssessment,

  answers:
    AssessmentAnswers,

  previousScores:
    Map<
      string,
      ComputedScore
    >,
): ComputedScore | null {
  const inputs:
    number[] = [];

  if (rule.items) {
    if (
      Array.isArray(
        rule.items,
      )
    ) {
      rule.items.forEach(
        (
          itemId,
        ) => {
          const response =
            answers[
              itemId
            ];

          if (
            response ===
            undefined
          ) {
            return;
          }

          const coding =
            rule.itemCoding?.[
              itemId
            ] ??
            1;

          if (
            coding ===
            0
          ) {
            return;
          }

          const coded =
            coding <
            0
              ? assessment.scaleMin +
                assessment.scaleMax -
                response
              : response;

          inputs.push(
            coded *
              Math.max(
                1,

                Math.abs(
                  coding,
                ),
              ),
          );
        },
      );
    } else {
      Object.entries(
        rule.items,
      ).forEach(
        ([
          itemId,
          coding,
        ]) => {
          if (
            coding ===
            0
          ) {
            return;
          }

          const response =
            answers[
              itemId
            ];

          if (
            response ===
            undefined
          ) {
            return;
          }

          const coded =
            coding <
            0
              ? assessment.scaleMin +
                assessment.scaleMax -
                response
              : response;

          inputs.push(
            coded *
              Math.max(
                1,

                Math.abs(
                  coding,
                ),
              ),
          );
        },
      );
    }
  }

  if (
    rule.scores?.length
  ) {
    for (
      const scoreKey of
        rule.scores
    ) {
      const score =
        previousScores.get(
          scoreKey,
        );

      if (!score) {
        return null;
      }

      inputs.push(
        score.raw,
      );
    }
  }

  if (
    !inputs.length
  ) {
    return null;
  }

  const method =
    rule.method.toLowerCase();

  let raw = 0;

  if (
    method ===
    "max"
  ) {
    raw =
      Math.max(
        ...inputs,
      );
  } else if (
    method ===
    "min"
  ) {
    raw =
      Math.min(
        ...inputs,
      );
  } else if (
    method.includes(
      "mean",
    )
  ) {
    raw =
      inputs.reduce(
        (
          sum,
          value,
        ) =>
          sum +
          value,

        0,
      ) /
      inputs.length;
  } else {
    raw =
      inputs.reduce(
        (
          sum,
          value,
        ) =>
          sum +
          value,

        0,
      );
  }

  let normalized = 0;

  if (
    method.includes(
      "mean",
    )
  ) {
    normalized =
      normalizeRange(
        raw,

        assessment.scaleMin,

        assessment.scaleMax,
      );
  } else if (
    method.includes(
      "correct",
    )
  ) {
    normalized =
      normalizeRange(
        raw,

        0,

        inputs.length,
      );
  } else if (
    method ===
      "max" ||
    method ===
      "min"
  ) {
    normalized =
      normalizeRange(
        raw,

        assessment.scaleMin,

        assessment.scaleMax,
      );
  } else {
    normalized =
      normalizeRange(
        raw,

        inputs.length *
          assessment.scaleMin,

        inputs.length *
          assessment.scaleMax,
      );
  }

  return {
    key:
      rule.key,

    label:
      rule.label,

    raw,

    normalized,

    method,
  };
}

function normalizeToUnit(
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
      1,

      (value -
        min) /
        (max -
          min),
    ),
  );
}

function normalizeRange(
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

function toMetric(
  score:
    ComputedScore,
): AssessmentMetric {
  return {
    key:
      score.key,

    label:
      score.label,

    value:
      Math.round(
        score.normalized,
      ),

    rawValue:
      Number(
        score.raw.toFixed(
          2,
        ),
      ),
  };
}

function riasecLabel(
  key: string,
) {
  const labels:
    Record<
      string,
      string
    > = {
      R: "Realistic",

      I:
        "Investigative",

      A: "Artistic",

      S: "Social",

      E:
        "Enterprising",

      C:
        "Conventional",
    };

  return (
    labels[
      key
    ] ?? key
  );
}

function emptyResult(
  title: string,
): AssessmentResult {
  return {
    headline:
      "Result ready",

    badge:
      title,

    summary:
      "The assessment was completed successfully.",

    insight:
      "The source did not expose a compatible scoring dimension for this version.",

    metrics: [],
  };
}