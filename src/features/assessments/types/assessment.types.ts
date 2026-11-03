import type { LucideIcon } from "lucide-react";

export type AssessmentTier = "free" | "premium";

export type AssessmentSourceKind =
  | "vendored"
  | "local";

export type AssessmentResultKind =
  | "scale"
  | "profile"
  | "riasec"
  | "type16"
  | "disc"
  | "ability";

export type AssessmentScoreMethod =
  | "mean"
  | "sum";

export interface AssessmentCatalogItem {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  tier: AssessmentTier;
  duration: string;
  itemCountLabel: string;
  icon: LucideIcon;
  tags: string[];
  sourceKind: AssessmentSourceKind;
  sourceLabel: string;
  licenseLabel: string;
  resultKind: AssessmentResultKind;
  instrumentPath?: string;
  note?: string;
  preferredMetricKeys?: string[];
}

export interface AssessmentOption {
  value: number;
  label: string;
  correct?: boolean;
  scores?: Record<string, number>;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: AssessmentOption[];
}

export interface VendoredInstrumentSource {
  provider: string;
  sourceName: string;
  sourceUrl: string;
  license: string;
  citation?: string;
  attribution?: string;
  version?: string;
  syncedAt?: string;
}

export interface VendoredResponseScale {
  min: number;
  max: number;

  options: Array<{
    value: number;
    label: string;
  }>;
}

export interface VendoredScaleDefinition {
  key: string;
  label: string;
  method: AssessmentScoreMethod;
  itemWeights: Record<string, number>;
  rawMin?: number;
  rawMax?: number;
  description?: string;
}

export interface VendoredInstrument {
  schemaVersion: 1;
  id: string;
  title: string;
  instruction?: string;
  source: VendoredInstrumentSource;
  responseScale: VendoredResponseScale;
  questions: AssessmentQuestion[];
  scales: VendoredScaleDefinition[];
}

export interface LoadedAssessment {
  definition: AssessmentCatalogItem;
  instrument: VendoredInstrument;
}

export type AssessmentAnswers =
  Record<string, number>;

export interface AssessmentMetric {
  key: string;
  label: string;
  displayValue: string;
  normalizedValue: number;
  rawValue?: number;
  description?: string;
}

export interface AssessmentResult {
  headline: string;
  badge: string;
  summary: string;
  insight: string;
  metrics: AssessmentMetric[];
  sourceNote?: string;
}