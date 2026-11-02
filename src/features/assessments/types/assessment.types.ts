import type { LucideIcon } from "lucide-react";

export type AssessmentAccess = "free" | "premium";

export type AssessmentSourceKind =
  | "openscales"
  | "riasec"
  | "local";

export type AssessmentResultMode =
  | "profile"
  | "single"
  | "ability"
  | "riasec"
  | "disc"
  | "type16";

export interface AssessmentMetricDefinition {
  keys: string[];
  label: string;
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

export interface AssessmentScoringRule {
  key: string;
  label: string;
  method: string;
  items?: string[] | Record<string, number>;
  itemCoding?: Record<string, number>;
  scores?: string[];
}

export interface AssessmentDefinition {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  access: AssessmentAccess;
  duration: string;
  itemCountLabel: string;
  icon: LucideIcon;
  tags: string[];
  sourceLabel: string;
  sourceKind: AssessmentSourceKind;
  license: string;
  resultMode: AssessmentResultMode;
  sourceUrls?: string[];
  preferredLanguage?: string;
  metricDefinitions?: AssessmentMetricDefinition[];
  note?: string;
  citation?: string;
  localQuestions?: AssessmentQuestion[];
}

export interface LoadedAssessment {
  definition: AssessmentDefinition;
  questions: AssessmentQuestion[];
  scoring: AssessmentScoringRule[];
  scaleMin: number;
  scaleMax: number;
  instruction?: string;
  sourceUrl?: string;
  citation?: string;
}

export type AssessmentAnswers = Record<string, number>;

export interface AssessmentMetric {
  key: string;
  label: string;
  value: number;
  rawValue?: number;
}

export interface AssessmentResult {
  headline: string;
  badge: string;
  summary: string;
  insight: string;
  metrics: AssessmentMetric[];
}