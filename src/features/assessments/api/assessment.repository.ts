import {
  localAssessmentInstruments,
} from "../data/local-assessments";

import type {
  AssessmentCatalogItem,
  LoadedAssessment,
  VendoredInstrument,
} from "../types/assessment.types";

const assessmentCache =
  new Map<
    string,
    Promise<LoadedAssessment>
  >();

export function loadAssessment(
  definition:
    AssessmentCatalogItem,
): Promise<LoadedAssessment> {
  const cached =
    assessmentCache.get(
      definition.id,
    );

  if (cached) {
    return cached;
  }

  const request =
    loadAssessmentInternal(
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

async function loadAssessmentInternal(
  definition:
    AssessmentCatalogItem,
): Promise<LoadedAssessment> {
  if (
    definition.sourceKind ===
    "local"
  ) {
    const instrument =
      localAssessmentInstruments[
        definition.id
      ];

    if (!instrument) {
      throw new Error(
        `Local assessment "${definition.id}" was not found.`,
      );
    }

    return {
      definition,
      instrument,
    };
  }

  if (
    !definition.instrumentPath
  ) {
    throw new Error(
      `No vendored instrument path is configured for "${definition.id}".`,
    );
  }

  const baseUrl =
    import.meta.env
      .BASE_URL ||
    "/";

  const normalizedBase =
    baseUrl.endsWith("/")
      ? baseUrl
      : `${baseUrl}/`;

  const url =
    `${normalizedBase}assessments/instruments/${definition.instrumentPath}`;

  const response =
    await fetch(
      url,
      {
        headers: {
          Accept:
            "application/json",
        },

        cache:
          "no-cache",
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      `Assessment data is missing (${response.status}). Run "node scripts/sync-assessments.mjs" and commit the generated public/assessments/instruments files.`,
    );
  }

  const payload:
    unknown =
    await response.json();

  if (
    !isVendoredInstrument(
      payload,
    )
  ) {
    throw new Error(
      `Assessment data for "${definition.id}" has an invalid schema.`,
    );
  }

  return {
    definition,
    instrument:
      payload,
  };
}

function isVendoredInstrument(
  value: unknown,
): value is VendoredInstrument {
  if (
    !isRecord(
      value,
    )
  ) {
    return false;
  }

  return (
    value.schemaVersion ===
      1 &&
    typeof value.id ===
      "string" &&
    typeof value.title ===
      "string" &&
    isRecord(
      value.source,
    ) &&
    isRecord(
      value.responseScale,
    ) &&
    Array.isArray(
      value.questions,
    ) &&
    Array.isArray(
      value.scales,
    )
  );
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