import type {
  AssessmentDefinition,
  AssessmentQuestion,
  AssessmentScoringRule,
  LoadedAssessment,
} from "../types/assessment.types";

interface OpenScaleItem {
  id: string;
  text_key: string;
  type: string;
}

interface OpenScaleScoringEntry {
  description?: string;
  method?: string;
  items?: string[] | Record<string, number>;
  item_coding?: Record<string, number>;
  scores?: string[];
}

interface OpenScaleDocument {
  definition?: {
    scale_info?: {
      citation?: string;
      license?: string;
    };

    implementation?: {
      license?: string;
    };

    likert_options?: {
      min?: number;
      max?: number;
      points?: number;
      labels?: string[];
      question_head?: string;
    };

    items?: OpenScaleItem[];

    dimensions?: Array<{
      id: string;
      name?: string;
    }>;

    scoring?: Record<
      string,
      OpenScaleScoringEntry
    >;
  };

  translations?: Record<
    string,
    Record<string, string>
  >;
}

const assessmentCache =
  new Map<
    string,
    Promise<LoadedAssessment>
  >();

export function loadAssessment(
  definition:
    AssessmentDefinition,
): Promise<LoadedAssessment> {
  const cached =
    assessmentCache.get(
      definition.id,
    );

  if (cached) {
    return cached;
  }

  const request =
    loadBySource(
      definition,
    ).catch(
      (error) => {
        assessmentCache.delete(
          definition.id,
        );

        throw error;
      },
    );

  assessmentCache.set(
    definition.id,
    request,
  );

  return request;
}

export function clearAssessmentCache(
  assessmentId?: string,
) {
  if (assessmentId) {
    assessmentCache.delete(
      assessmentId,
    );

    return;
  }

  assessmentCache.clear();
}

async function loadBySource(
  definition:
    AssessmentDefinition,
): Promise<LoadedAssessment> {
  switch (
    definition.sourceKind
  ) {
    case "openscales":
      return loadOpenScale(
        definition,
      );

    case "riasec":
      return loadRiasec(
        definition,
      );

    case "local":
      return loadLocalAssessment(
        definition,
      );

    default:
      throw new Error(
        "Unsupported assessment source.",
      );
  }
}

function loadLocalAssessment(
  definition:
    AssessmentDefinition,
): LoadedAssessment {
  if (
    !definition
      .localQuestions
      ?.length
  ) {
    throw new Error(
      "This local assessment has no question bank.",
    );
  }

  return {
    definition,

    questions:
      definition.localQuestions,

    scoring: [],

    scaleMin: 0,

    scaleMax: 1,

    citation:
      definition.citation,
  };
}

async function loadOpenScale(
  definition:
    AssessmentDefinition,
): Promise<LoadedAssessment> {
  const {
    payload,
    sourceUrl,
  } =
    await fetchFirstJson(
      definition.sourceUrls ??
        [],
    );

  const document =
    payload as OpenScaleDocument;

  const scaleDefinition =
    document.definition;

  if (!scaleDefinition) {
    throw new Error(
      "OpenScales returned an invalid scale definition.",
    );
  }

  const items =
    scaleDefinition.items ??
    [];

  const likert =
    scaleDefinition
      .likert_options;

  if (!likert) {
    throw new Error(
      "This scale does not expose a supported Likert response format.",
    );
  }

  const language =
    pickLanguage(
      document.translations,

      definition.preferredLanguage ??
        "en",
    );

  const translations =
    document.translations?.[
      language
    ] ?? {};

  const min =
    likert.min ?? 1;

  const max =
    likert.max ??
    (likert.points
      ? min +
        likert.points -
        1
      : 5);

  const labels =
    likert.labels ?? [];

  const options =
    Array.from(
      {
        length:
          max -
          min +
          1,
      },

      (
        _,
        index,
      ) => {
        const value =
          min + index;

        const labelKey =
          labels[
            index
          ];

        return {
          value,

          label:
            resolveTranslation(
              translations,
              labelKey,
            ) ||
            String(
              value,
            ),
        };
      },
    );

  const questions:
    AssessmentQuestion[] =
    items
      .filter(
        (item) =>
          item.type ===
          "likert",
      )
      .map(
        (item) => ({
          id: item.id,

          prompt:
            cleanText(
              resolveTranslation(
                translations,
                item.text_key,
              ),
            ),

          options,
        }),
      )
      .filter(
        (question) =>
          question.prompt
            .length > 0,
      );

  if (
    !questions.length
  ) {
    throw new Error(
      "No supported questions were found in this OpenScales definition.",
    );
  }

  const scoring =
    normalizeOpenScaleScoring(
      scaleDefinition.scoring,

      scaleDefinition
        .dimensions,
    );

  const instruction =
    cleanText(
      resolveTranslation(
        translations,

        likert.question_head,
      ),
    );

  return {
    definition,

    questions,

    scoring,

    scaleMin: min,

    scaleMax: max,

    instruction:
      instruction ||
      undefined,

    sourceUrl,

    citation:
      scaleDefinition
        .scale_info
        ?.citation ??
      definition.citation,
  };
}

async function loadRiasec(
  definition:
    AssessmentDefinition,
): Promise<LoadedAssessment> {
  const {
    payload,
    sourceUrl,
  } =
    await fetchFirstJson(
      definition.sourceUrls ??
        [],
    );

  const rawItems =
    extractArray(
      payload,
    );

  if (
    !rawItems.length
  ) {
    throw new Error(
      "RIASEC item bank could not be read.",
    );
  }

  const dimensionItems:
    Record<
      string,
      Record<
        string,
        number
      >
    > = {
      R: {},
      I: {},
      A: {},
      S: {},
      E: {},
      C: {},
    };

  const questions:
    AssessmentQuestion[] =
    [];

  rawItems.forEach(
    (
      rawItem,
      index,
    ) => {
      if (
        !isRecord(
          rawItem,
        )
      ) {
        return;
      }

      const id =
        readString(
          rawItem,
          [
            "id",
            "item_id",
          ],
        ) ||
        `riasec-${
          index + 1
        }`;

      const prompt =
        readString(
          rawItem,
          [
            "text",
            "statement",
            "activity",
            "prompt",
            "question",
            "item",
            "content",
          ],
        );

      const dimension =
        readRiasecDimension(
          rawItem,
          id,
        );

      if (
        !prompt ||
        !dimension
      ) {
        return;
      }

      const reverse =
        readBoolean(
          rawItem,
          [
            "reverse",
            "reversed",
            "reverse_keyed",
          ],
        );

      dimensionItems[
        dimension
      ][id] =
        reverse
          ? -1
          : 1;

      questions.push({
        id,

        prompt:
          cleanText(
            prompt,
          ),

        options: [
          {
            value: 1,
            label:
              "Strongly dislike",
          },

          {
            value: 2,
            label:
              "Dislike",
          },

          {
            value: 3,
            label:
              "Neutral",
          },

          {
            value: 4,
            label:
              "Like",
          },

          {
            value: 5,
            label:
              "Strongly like",
          },
        ],
      });
    },
  );

  if (
    !questions.length
  ) {
    throw new Error(
      "RIASEC item format changed and could not be parsed safely.",
    );
  }

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

  const scoring:
    AssessmentScoringRule[] =
    Object.entries(
      dimensionItems,
    )
      .filter(
        (
          [
            ,
            items,
          ],
        ) =>
          Object.keys(
            items,
          ).length >
          0,
      )
      .map(
        ([
          key,
          items,
        ]) => ({
          key,

          label:
            labels[
              key
            ] ?? key,

          method:
            "sum_coded",

          items,
        }),
      );

  return {
    definition,

    questions,

    scoring,

    scaleMin: 1,

    scaleMax: 5,

    instruction:
      "Rate how much you would like or dislike doing each kind of activity.",

    sourceUrl,

    citation:
      "Liao, Armstrong, & Rounds (2008), public-domain Basic Interest Markers.",
  };
}

function normalizeOpenScaleScoring(
  scoring?: Record<
    string,
    OpenScaleScoringEntry
  >,

  dimensions?: Array<{
    id: string;
    name?: string;
  }>,
): AssessmentScoringRule[] {
  if (!scoring) {
    return [];
  }

  const dimensionNames =
    new Map(
      (
        dimensions ??
        []
      ).map(
        (
          dimension,
        ) => [
          dimension.id,

          dimension.name ??
            humanizeKey(
              dimension.id,
            ),
        ],
      ),
    );

  return Object.entries(
    scoring,
  )
    .filter(
      ([
        key,
        entry,
      ]) =>
        key !==
          "answer_categories" &&
        isRecord(
          entry,
        ),
    )
    .map(
      ([
        key,
        entry,
      ]) => ({
        key,

        label:
          dimensionNames.get(
            key,
          ) ??
          humanizeKey(
            key,
          ),

        method:
          entry.method ??
          "mean_coded",

        items:
          entry.items,

        itemCoding:
          entry.item_coding,

        scores:
          entry.scores,
      }),
    );
}

async function fetchFirstJson(
  urls: string[],
) {
  if (
    !urls.length
  ) {
    throw new Error(
      "No source URL is configured for this assessment.",
    );
  }

  let lastError:
    unknown = null;

  for (
    const url of urls
  ) {
    try {
      const response =
        await fetch(
          url,
          {
            headers: {
              Accept:
                "application/json, text/plain, */*",
            },
          },
        );

      if (
        !response.ok
      ) {
        throw new Error(
          `Source responded with ${response.status}.`,
        );
      }

      const payload:
        unknown =
        await response.json();

      return {
        payload,

        sourceUrl:
          url,
      };
    } catch (
      error
    ) {
      lastError =
        error;
    }
  }

  const message =
    lastError instanceof
    Error
      ? lastError.message
      : "Unknown network error.";

  throw new Error(
    `Could not load the open assessment source. ${message}`,
  );
}

function pickLanguage(
  translations:
    OpenScaleDocument["translations"],

  preferredLanguage:
    string,
) {
  const languages =
    Object.keys(
      translations ??
        {},
    );

  if (
    languages.includes(
      preferredLanguage,
    )
  ) {
    return preferredLanguage;
  }

  if (
    languages.includes(
      "en",
    )
  ) {
    return "en";
  }

  return (
    languages[0] ??
    "en"
  );
}

function resolveTranslation(
  translations:
    Record<
      string,
      string
    >,

  key?: string,
) {
  if (!key) {
    return "";
  }

  return (
    translations[
      key
    ] ?? key
  );
}

function cleanText(
  value: string,
) {
  if (!value) {
    return "";
  }

  const withoutTags =
    value.replace(
      /<[^>]*>/g,
      " ",
    );

  if (
    typeof document ===
    "undefined"
  ) {
    return withoutTags
      .replace(
        /\s+/g,
        " ",
      )
      .trim();
  }

  const textarea =
    document.createElement(
      "textarea",
    );

  textarea.innerHTML =
    withoutTags;

  return textarea.value
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function humanizeKey(
  key: string,
) {
  return key
    .replace(
      /_mean$/i,
      "",
    )
    .replace(
      /_sum$/i,
      "",
    )
    .replace(
      /[_-]+/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (
        letter,
      ) =>
        letter.toUpperCase(),
    );
}

function extractArray(
  payload: unknown,
): unknown[] {
  if (
    Array.isArray(
      payload,
    )
  ) {
    return payload;
  }

  if (
    !isRecord(
      payload,
    )
  ) {
    return [];
  }

  const candidateKeys =
    [
      "items",
      "questions",
      "data",
    ];

  for (
    const key of candidateKeys
  ) {
    const value =
      payload[
        key
      ];

    if (
      Array.isArray(
        value,
      )
    ) {
      return value;
    }
  }

  return [];
}

function isRecord(
  value: unknown,
): value is Record<
  string,
  unknown
> {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}

function readString(
  record:
    Record<
      string,
      unknown
    >,

  keys: string[],
) {
  for (
    const key of keys
  ) {
    const value =
      record[
        key
      ];

    if (
      typeof value ===
        "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function readBoolean(
  record:
    Record<
      string,
      unknown
    >,

  keys: string[],
) {
  for (
    const key of keys
  ) {
    const value =
      record[
        key
      ];

    if (
      typeof value ===
      "boolean"
    ) {
      return value;
    }
  }

  return false;
}

function readRiasecDimension(
  record:
    Record<
      string,
      unknown
    >,

  id: string,
) {
  const raw =
    readString(
      record,
      [
        "type",
        "riasec",
        "dimension",
        "domain",
        "category",
        "code",
        "letter",
      ],
    ).toUpperCase();

  const aliases:
    Record<
      string,
      string
    > = {
      R: "R",

      REALISTIC:
        "R",

      I: "I",

      INVESTIGATIVE:
        "I",

      A: "A",

      ARTISTIC:
        "A",

      S: "S",

      SOCIAL:
        "S",

      E: "E",

      ENTERPRISING:
        "E",

      C: "C",

      CONVENTIONAL:
        "C",
    };

  if (
    aliases[
      raw
    ]
  ) {
    return aliases[
      raw
    ];
  }

  const first =
    id
      .trim()
      .charAt(
        0,
      )
      .toUpperCase();

  return (
    aliases[
      first
    ] ?? ""
  );
}