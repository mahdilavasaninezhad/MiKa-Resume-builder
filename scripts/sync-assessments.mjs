import {
  mkdir,
  writeFile,
} from "node:fs/promises";

import path from "node:path";

import {
  fileURLToPath,
} from "node:url";

const __filename =
  fileURLToPath(
    import.meta.url,
  );

const __dirname =
  path.dirname(
    __filename,
  );

const projectRoot =
  path.resolve(
    __dirname,
    "..",
  );

const outputDir =
  path.join(
    projectRoot,
    "public",
    "assessments",
    "instruments",
  );

const OPEN_SCALES = [
  {
    output:
      "big-five.json",

    repo:
      "ipip",

    code:
      "IPIP-Big5-50",
  },

  {
    output:
      "eq-quick.json",

    repo:
      "ipip",

    code:
      "IPIP-VIA-Soc",
  },

  {
    output:
      "eq-deep.json",

    repo:
      "ipip",

    code:
      "IPIP-EI",
  },

  {
    output:
      "leadership.json",

    repo:
      "ipip",

    code:
      "IPIP-VIA-Lea",
  },

  {
    output:
      "perseverance.json",

    repo:
      "ipip",

    code:
      "IPIP-VIA-Ind",
  },

  {
    output:
      "self-efficacy.json",

    repo:
      "openscales",

    code:
      "GSE",
  },
];

await mkdir(
  outputDir,
  {
    recursive: true,
  },
);

const manifest = [];

for (
  const scale of
    OPEN_SCALES
) {
  const instrument =
    await vendorOpenScale(
      scale.repo,
      scale.code,
    );

  await writeInstrument(
    scale.output,
    instrument,
  );

  manifest.push(
    toManifestEntry(
      scale.output,
      instrument,
    ),
  );
}

const riasec =
  await vendorRiasec();

await writeInstrument(
  "riasec.json",
  riasec,
);

manifest.push(
  toManifestEntry(
    "riasec.json",
    riasec,
  ),
);

await writeFile(
  path.join(
    outputDir,
    "manifest.json",
  ),

  `${JSON.stringify(
    {
      schemaVersion: 1,

      generatedAt:
        new Date().toISOString(),

      instruments:
        manifest,
    },

    null,
    2,
  )}\n`,

  "utf8",
);

console.log(
  `\nAssessment assets synced to ${outputDir}`,
);

console.log(
  "Commit the generated JSON files so production never depends on third-party runtime availability.\n",
);

async function vendorOpenScale(
  repo,
  code,
) {
  console.log(
    `Syncing OpenScales: ${repo}/${code}`,
  );

  const base =
    `https://raw.githubusercontent.com/stmueller/OpenScales/main/scales/${repo}/${code}`;

  const webRepo =
    repo ===
    "openscales"
      ? "open"
      : repo;

  const main =
    await fetchFirstJson([
      `https://openscales.net/download.php?code=${encodeURIComponent(
        code,
      )}&format=osd&repo=${encodeURIComponent(
        webRepo,
      )}`,

      `${base}/${code}.osd`,

      `${base}/${code}.json`,
    ]);

  const rootDefinition =
    main.payload
      .definition ??
    main.payload;

  if (
    !isRecord(
      rootDefinition,
    )
  ) {
    throw new Error(
      `OpenScales ${code}: invalid definition.`,
    );
  }

  let translations =
    isRecord(
      main.payload
        .translations,
    )
      ? main.payload
          .translations
      : null;

  if (
    !translations ||
    !isRecord(
      translations.en,
    )
  ) {
    const language =
      await fetchFirstJson([
        `${base}/${code}.en.json`,
      ]);

    if (
      isRecord(
        language.payload
          .translations,
      )
    ) {
      translations =
        language.payload
          .translations;
    } else if (
      isRecord(
        language.payload
          .en,
      )
    ) {
      translations =
        language.payload;
    } else if (
      isRecord(
        language.payload,
      )
    ) {
      translations = {
        en:
          language.payload,
      };
    }
  }

  const en =
    isRecord(
      translations?.en,
    )
      ? translations.en
      : {};

  const scaleInfo =
    isRecord(
      rootDefinition
        .scale_info,
    )
      ? rootDefinition
          .scale_info
      : {};

  const implementation =
    isRecord(
      rootDefinition
        .implementation,
    )
      ? rootDefinition
          .implementation
      : {};

  const likert =
    isRecord(
      rootDefinition
        .likert_options,
    )
      ? rootDefinition
          .likert_options
      : {};

  const min =
    numberOr(
      likert.min,
      1,
    );

  const points =
    numberOr(
      likert.points,
      5,
    );

  const max =
    numberOr(
      likert.max,

      min +
        points -
        1,
    );

  const labelKeys =
    Array.isArray(
      likert.labels,
    )
      ? likert.labels
      : [];

  const responseOptions =
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
          min +
          index;

        const key =
          typeof labelKeys[
            index
          ] ===
          "string"
            ? labelKeys[
                index
              ]
            : "";

        return {
          value,

          label:
            translate(
              en,
              key,
            ) ||
            String(
              value,
            ),
        };
      },
    );

  const rawItems =
    Array.isArray(
      rootDefinition
        .items,
    )
      ? rootDefinition
          .items
      : [];

  const questions =
    rawItems
      .filter(
        isRecord,
      )
      .filter(
        (
          item,
        ) =>
          !item.type ||
          item.type ===
            "likert",
      )
      .map(
        (
          item,
        ) => {
          const id =
            stringOr(
              item.id,
              "",
            );

          const textKey =
            stringOr(
              item.text_key,
              id,
            );

          return {
            id,

            prompt:
              cleanText(
                translate(
                  en,
                  textKey,
                ),
              ),

            options:
              responseOptions,
          };
        },
      )
      .filter(
        (
          question,
        ) =>
          question.id &&
          question.prompt,
      );

  if (
    !questions.length
  ) {
    throw new Error(
      `OpenScales ${code}: no supported items found.`,
    );
  }

  const dimensionLabels =
    new Map();

  if (
    Array.isArray(
      rootDefinition
        .dimensions,
    )
  ) {
    rootDefinition
      .dimensions
      .filter(
        isRecord,
      )
      .forEach(
        (
          dimension,
        ) => {
          const id =
            stringOr(
              dimension.id,
              "",
            );

          const name =
            stringOr(
              dimension.name,

              humanize(
                id,
              ),
            );

          if (id) {
            dimensionLabels.set(
              id,
              name,
            );
          }
        },
      );
  }

  const scoring =
    isRecord(
      rootDefinition
        .scoring,
    )
      ? rootDefinition
          .scoring
      : {};

  const scales =
    Object.entries(
      scoring,
    )
      .filter(
        ([
          key,
          value,
        ]) =>
          key !==
            "answer_categories" &&
          isRecord(
            value,
          ),
      )
      .map(
        ([
          key,
          value,
        ]) => {
          const methodRaw =
            stringOr(
              value.method,
              "mean_coded",
            ).toLowerCase();

          const method =
            methodRaw.includes(
              "mean",
            )
              ? "mean"
              : "sum";

          const itemWeights =
            {};

          if (
            Array.isArray(
              value.items,
            )
          ) {
            const coding =
              isRecord(
                value.item_coding,
              )
                ? value.item_coding
                : {};

            value.items.forEach(
              (
                itemId,
              ) => {
                if (
                  typeof itemId !==
                  "string"
                ) {
                  return;
                }

                itemWeights[
                  itemId
                ] =
                  numberOr(
                    coding[
                      itemId
                    ],
                    1,
                  );
              },
            );
          } else if (
            isRecord(
              value.items,
            )
          ) {
            Object.entries(
              value.items,
            ).forEach(
              ([
                itemId,
                weight,
              ]) => {
                itemWeights[
                  itemId
                ] =
                  numberOr(
                    weight,
                    1,
                  );
              },
            );
          }

          const itemCount =
            Object.keys(
              itemWeights,
            ).length;

          return {
            key,

            label:
              dimensionLabels.get(
                key,
              ) ??
              humanize(
                key,
              ),

            method,

            itemWeights,

            rawMin:
              method ===
              "mean"
                ? min
                : itemCount *
                  min,

            rawMax:
              method ===
              "mean"
                ? max
                : itemCount *
                  max,

            description:
              stringOr(
                value.description,
                "",
              ) ||
              undefined,
          };
        },
      )
      .filter(
        (
          scale,
        ) =>
          Object.keys(
            scale.itemWeights,
          ).length >
          0,
      );

  if (
    !scales.length
  ) {
    throw new Error(
      `OpenScales ${code}: no compatible scoring rules found.`,
    );
  }

  const instructionKey =
    stringOr(
      likert.question_head,
      "",
    );

  const sourceUrl =
    stringOr(
      scaleInfo.url,

      `https://openscales.net/scale.php?code=${encodeURIComponent(
        code,
      )}`,
    );

  const license =
    stringOr(
      scaleInfo.license,

      stringOr(
        implementation.license,
        "Check source license",
      ),
    );

  return {
    schemaVersion: 1,

    id: code,

    title:
      stringOr(
        scaleInfo.name,
        code,
      ),

    instruction:
      cleanText(
        translate(
          en,
          instructionKey,
        ),
      ) ||
      undefined,

    source: {
      provider:
        "OpenScales",

      sourceName:
        stringOr(
          scaleInfo.name,
          code,
        ),

      sourceUrl,

      license,

      citation:
        stringOr(
          scaleInfo.citation,
          "",
        ) ||
        undefined,

      attribution:
        "OpenScales encoding; underlying instrument license retained.",

      version:
        stringOr(
          scaleInfo.version,
          "1.0",
        ),

      syncedAt:
        new Date().toISOString(),
    },

    responseScale: {
      min,
      max,
      options:
        responseOptions,
    },

    questions,

    scales,
  };
}

async function vendorRiasec() {
  const apiKey =
    process.env
      .ONET_API_KEY
      ?.trim();

  if (apiKey) {
    try {
      return await vendorOnetMiniIp(
        apiKey,
      );
    } catch (
      error
    ) {
      console.warn(
        "O*NET Mini-IP sync failed; falling back to public-domain IPIP RIASEC markers.",
      );

      console.warn(
        error instanceof
        Error
          ? error.message
          : error,
      );
    }
  } else {
    console.warn(
      "ONET_API_KEY is not set; using the public-domain IPIP RIASEC fallback.",
    );

    console.warn(
      "Create a free O*NET Web Services key later and rerun this script to vendor the official 30-item Mini-IP.\n",
    );
  }

  return vendorPublicDomainRiasecFallback();
}

async function vendorOnetMiniIp(
  apiKey,
) {
  console.log(
    "Syncing O*NET Mini Interest Profiler (30 items)",
  );

  const endpoint =
    "https://api-v2.onetcenter.org/mnm/interestprofiler/questions_30?start=1&end=30";

  const response =
    await fetch(
      endpoint,
      {
        headers: {
          "X-API-Key":
            apiKey,
        },
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `O*NET API returned ${response.status}.`,
    );
  }

  const payload =
    await response.json();

  const questionsRaw =
    Array.isArray(
      payload.question,
    )
      ? payload.question
      : [];

  const answerOptionsRaw =
    Array.isArray(
      payload.answer_option,
    )
      ? payload.answer_option
      : [];

  const options =
    answerOptionsRaw
      .filter(
        isRecord,
      )
      .map(
        (
          option,
        ) => ({
          value:
            numberOr(
              option.value,
              0,
            ),

          label:
            stringOr(
              option.name,
              "",
            ),
        }),
      )
      .filter(
        (
          option,
        ) =>
          option.value >
            0 &&
          option.label,
      );

  const min =
    Math.min(
      ...options.map(
        (
          option,
        ) =>
          option.value,
      ),
    );

  const max =
    Math.max(
      ...options.map(
        (
          option,
        ) =>
          option.value,
      ),
    );

  const dimensionItems = {
    R: {},
    I: {},
    A: {},
    S: {},
    E: {},
    C: {},
  };

  const questions =
    questionsRaw
      .filter(
        isRecord,
      )
      .map(
        (
          question,
        ) => {
          const index =
            numberOr(
              question.index,
              0,
            );

          const id =
            `onet-${index}`;

          const area =
            toRiasecCode(
              stringOr(
                question.area,
                "",
              ),
            );

          if (area) {
            dimensionItems[
              area
            ][
              id
            ] = 1;
          }

          return {
            id,

            prompt:
              stringOr(
                question.text,
                "",
              ),

            options,
          };
        },
      )
      .filter(
        (
          question,
        ) =>
          question.id &&
          question.prompt,
      );

  if (
    questions.length !==
    30
  ) {
    throw new Error(
      `Expected 30 O*NET Mini-IP questions, received ${questions.length}.`,
    );
  }

  return {
    schemaVersion: 1,

    id:
      "onet-mini-ip-30",

    title:
      "O*NET Mini Interest Profiler",

    instruction:
      "Rate how you would feel about doing each type of work activity.",

    source: {
      provider:
        "O*NET Web Services",

      sourceName:
        "O*NET Mini Interest Profiler",

      sourceUrl:
        "https://www.onetcenter.org/IP.html",

      license:
        "O*NET Tools Developer License",

      citation:
        "O*NET Interest Profiler, U.S. Department of Labor / Employment and Training Administration.",

      attribution:
        "This product includes information from the O*NET Career Exploration Tools by USDOL/ETA and uses it under the O*NET Tools Developer License. Pulse has modified the presentation; USDOL/ETA has not approved, endorsed, or tested these modifications.",

      version:
        "Mini-IP 30-item",

      syncedAt:
        new Date().toISOString(),
    },

    responseScale: {
      min,
      max,
      options,
    },

    questions,

    scales:
      Object.entries(
        dimensionItems,
      ).map(
        ([
          key,
          itemWeights,
        ]) => ({
          key,

          label:
            riasecLabel(
              key,
            ),

          method:
            "sum",

          itemWeights,

          rawMin:
            Object.keys(
              itemWeights,
            ).length *
            min,

          rawMax:
            Object.keys(
              itemWeights,
            ).length *
            max,
        }),
      ),
  };
}

async function vendorPublicDomainRiasecFallback() {
  console.log(
    "Syncing public-domain IPIP RIASEC Basic Interest Markers fallback",
  );

  const {
    payload,
  } =
    await fetchFirstJson([
      "https://raw.githubusercontent.com/affromero/riasec-co/main/data/canonical/items_en.json",
    ]);

  const rawItems =
    Array.isArray(
      payload,
    )
      ? payload
      : isRecord(
            payload,
          ) &&
          Array.isArray(
            payload.items,
          )
        ? payload.items
        : [];

  if (
    !rawItems.length
  ) {
    throw new Error(
      "Could not parse the IPIP RIASEC fallback item bank.",
    );
  }

  const options = [
    {
      value: 1,
      label:
        "Very inaccurate",
    },

    {
      value: 2,
      label:
        "Moderately inaccurate",
    },

    {
      value: 3,
      label:
        "Neither accurate nor inaccurate",
    },

    {
      value: 4,
      label:
        "Moderately accurate",
    },

    {
      value: 5,
      label:
        "Very accurate",
    },
  ];

  const dimensionItems = {
    R: {},
    I: {},
    A: {},
    S: {},
    E: {},
    C: {},
  };

  const questions =
    rawItems
      .filter(
        isRecord,
      )
      .map(
        (
          item,
          index,
        ) => {
          const id =
            stringOr(
              item.id,

              `riasec-${
                index +
                1
              }`,
            );

          const prompt =
            firstString(
              item,
              [
                "text",
                "statement",
                "prompt",
                "question",
                "item",
                "content",
              ],
            );

          const type =
            toRiasecCode(
              firstString(
                item,
                [
                  "type",
                  "riasec",
                  "dimension",
                  "domain",
                  "category",
                  "code",
                  "letter",
                ],
              ) ||
                id.charAt(
                  0,
                ),
            );

          if (type) {
            const reverse =
              firstBoolean(
                item,
                [
                  "reverse",
                  "reversed",
                  "reverse_keyed",
                ],
              );

            dimensionItems[
              type
            ][
              id
            ] =
              reverse
                ? -1
                : 1;
          }

          return {
            id,

            prompt,

            options,
          };
        },
      )
      .filter(
        (
          question,
        ) =>
          question.prompt,
      );

  if (
    questions.length <
    30
  ) {
    throw new Error(
      `RIASEC fallback parsed only ${questions.length} questions.`,
    );
  }

  return {
    schemaVersion: 1,

    id:
      "ipip-riasec-bim",

    title:
      "IPIP Basic Interest Markers",

    instruction:
      "Rate how accurately each statement describes your interests.",

    source: {
      provider:
        "IPIP / riasec-co",

      sourceName:
        "Public-domain Basic Interest Markers",

      sourceUrl:
        "https://github.com/affromero/riasec-co",

      license:
        "Public Domain items; MIT implementation source",

      citation:
        "Liao, H.-Y., Armstrong, P. I., & Rounds, J. (2008). Development and initial validation of public domain Basic Interest Markers.",

      attribution:
        "Item bank distributed as public-domain IPIP RIASEC markers.",

      version:
        "48-item BIM",

      syncedAt:
        new Date().toISOString(),
    },

    responseScale: {
      min: 1,
      max: 5,
      options,
    },

    questions,

    scales:
      Object.entries(
        dimensionItems,
      ).map(
        ([
          key,
          itemWeights,
        ]) => ({
          key,

          label:
            riasecLabel(
              key,
            ),

          method:
            "sum",

          itemWeights,

          rawMin:
            Object.keys(
              itemWeights,
            ).length,

          rawMax:
            Object.keys(
              itemWeights,
            ).length *
            5,
        }),
      ),
  };
}

async function writeInstrument(
  filename,
  instrument,
) {
  const destination =
    path.join(
      outputDir,
      filename,
    );

  await writeFile(
    destination,

    `${JSON.stringify(
      instrument,
      null,
      2,
    )}\n`,

    "utf8",
  );

  console.log(
    `  ✓ ${filename} (${instrument.questions.length} items)`,
  );
}

function toManifestEntry(
  filename,
  instrument,
) {
  return {
    file:
      filename,

    id:
      instrument.id,

    title:
      instrument.title,

    provider:
      instrument.source
        .provider,

    sourceName:
      instrument.source
        .sourceName,

    license:
      instrument.source
        .license,

    version:
      instrument.source
        .version,

    itemCount:
      instrument.questions
        .length,
  };
}

async function fetchFirstJson(
  urls,
) {
  let lastError =
    null;

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
          `${url} returned ${response.status}`,
        );
      }

      return {
        payload:
          await response.json(),

        url,
      };
    } catch (
      error
    ) {
      lastError =
        error;
    }
  }

  throw lastError instanceof
  Error
    ? lastError
    : new Error(
        "All source URLs failed.",
      );
}

function translate(
  translations,
  key,
) {
  if (!key) {
    return "";
  }

  const value =
    translations[
      key
    ];

  return typeof value ===
    "string"
    ? value
    : key;
}

function cleanText(
  value,
) {
  return String(
    value ??
      "",
  )
    .replace(
      /<[^>]*>/g,
      " ",
    )
    .replace(
      /&nbsp;/g,
      " ",
    )
    .replace(
      /&amp;/g,
      "&",
    )
    .replace(
      /&quot;/g,
      '"',
    )
    .replace(
      /&#39;/g,
      "'",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function humanize(
  value,
) {
  return String(
    value ??
      "",
  )
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

function riasecLabel(
  key,
) {
  return (
    {
      R: "Realistic",
      I:
        "Investigative",
      A: "Artistic",
      S: "Social",
      E:
        "Enterprising",
      C:
        "Conventional",
    }[
      key
    ] ??
    key
  );
}

function toRiasecCode(
  value,
) {
  const clean =
    String(
      value ??
        "",
    )
      .trim()
      .toUpperCase();

  return (
    {
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
    }[
      clean
    ] ??
    ""
  );
}

function firstString(
  record,
  keys,
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

function firstBoolean(
  record,
  keys,
) {
  for (
    const key of keys
  ) {
    if (
      typeof record[
        key
      ] ===
      "boolean"
    ) {
      return record[
        key
      ];
    }
  }

  return false;
}

function stringOr(
  value,
  fallback,
) {
  return (
    typeof value ===
      "string" &&
    value.trim()
      ? value.trim()
      : fallback
  );
}

function numberOr(
  value,
  fallback,
) {
  return (
    typeof value ===
      "number" &&
    Number.isFinite(
      value,
    )
      ? value
      : fallback
  );
}

function isRecord(
  value,
) {
  return (
    typeof value ===
      "object" &&
    value !== null &&
    !Array.isArray(
      value,
    )
  );
}